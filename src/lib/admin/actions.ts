"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { notifyUser, link } from "@/lib/email/notify";

const uuid = z.string().uuid();
const back = (path: string, error?: string) => redirect(error ? `${path}?error=${encodeURIComponent(error.slice(0, 120))}` : path);

export async function approvePayment(id: string) {
  const { user, admin } = await requireAdmin();
  if (!uuid.safeParse(id).success) return back("/admin/payments", "Invalid request.");
  const { error } = await admin.rpc("approve_payment", { p_request: id, p_admin: user.id });
  if (!error) {
    const { data: r } = await admin.from("payment_requests").select("user_id, plans(name, monthly_credits)").eq("id", id).single();
    const plan = r?.plans as unknown as { name: string; monthly_credits: number } | null;
    if (r) notifyUser(r.user_id, "Your payment was approved", `Your payment was approved. The ${plan?.name ?? ""} plan is active for 30 days and ${plan?.monthly_credits ?? 0} credits were added.\n\nOpen your dashboard: ${link("/dashboard")}`);
  }
  revalidatePath("/admin", "layout");
  return back("/admin/payments", error?.message);
}

export async function rejectPayment(id: string, fd: FormData) {
  const { user, admin } = await requireAdmin();
  const reason = z.string().trim().min(3, "Write a short reason.").max(200).safeParse(fd.get("reason"));
  if (!uuid.safeParse(id).success) return back("/admin/payments", "Invalid request.");
  if (!reason.success) return back("/admin/payments", reason.error.issues[0].message);
  const { error } = await admin.rpc("reject_payment", { p_request: id, p_admin: user.id, p_reason: reason.data });
  if (!error) {
    const { data: r } = await admin.from("payment_requests").select("user_id").eq("id", id).single();
    if (r) notifyUser(r.user_id, "Your payment was not approved", `We could not approve your payment.\nReason: ${reason.data}\n\nIf you think this is a mistake, contact support: ${link("/support")}`);
  }
  revalidatePath("/admin", "layout");
  return back("/admin/payments", error?.message);
}

export async function adjustCredits(fd: FormData) {
  const { user, admin } = await requireAdmin();
  const p = z.object({
    user_id: uuid,
    amount: z.coerce.number().int().refine((n) => n !== 0 && Math.abs(n) <= 100000, "Amount must be a non-zero whole number up to 100000."),
    reason: z.string().trim().min(3, "Write a short reason.").max(200),
  }).safeParse(Object.fromEntries(fd));
  if (!p.success) return back("/admin/users", p.error.issues[0].message);
  const { error } = await admin.rpc("admin_adjust_credits", { p_user: p.data.user_id, p_amount: p.data.amount, p_admin: user.id, p_reason: p.data.reason });
  revalidatePath("/admin", "layout");
  return back("/admin/users", error?.message);
}

export async function updatePlan(planId: string, fd: FormData) {
  const { user, admin } = await requireAdmin();
  const p = z.object({
    name: z.string().trim().min(2).max(40),
    price: z.coerce.number().min(0).max(10_000_000),
    credits: z.coerce.number().int().min(0).max(1_000_000),
  }).safeParse(Object.fromEntries(fd));
  if (!uuid.safeParse(planId).success || !p.success) return back("/admin/plans", "Check the values: name, price and credits.");
  const active = fd.get("active") === "on";
  const { error } = await admin.from("plans").update({ name: p.data.name, price_cents: Math.round(p.data.price * 100), monthly_credits: p.data.credits, is_active: active }).eq("id", planId);
  if (!error) await admin.from("audit_logs").insert({ actor_id: user.id, action: "plan_updated", target_type: "plan", target_id: planId, details: { ...p.data, active } });
  revalidatePath("/admin", "layout");
  revalidatePath("/billing");
  return back("/admin/plans", error?.message);
}

export async function updateSettings(fd: FormData) {
  const { user, admin } = await requireAdmin();
  const p = z.object({
    name: z.string().trim().max(60),
    number: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Enter a valid JazzCash number."),
  }).safeParse(Object.fromEntries(fd));
  if (!p.success) return back("/admin/settings", p.error.issues[0].message);
  const { error } = await admin.from("app_settings").upsert([
    { key: "jazzcash_name", value: p.data.name, updated_at: new Date().toISOString() },
    { key: "jazzcash_number", value: p.data.number, updated_at: new Date().toISOString() },
  ]);
  if (!error) await admin.from("audit_logs").insert({ actor_id: user.id, action: "settings_updated", target_type: "settings", target_id: "jazzcash", details: { name: p.data.name, number: p.data.number } });
  revalidatePath("/billing");
  revalidatePath("/admin", "layout");
  return back("/admin/settings", error?.message);
}

export async function replyTicket(id: string, fd: FormData) {
  const { user, admin } = await requireAdmin();
  const reply = z.string().trim().min(2, "Write a reply.").max(2000).safeParse(fd.get("reply"));
  if (!uuid.safeParse(id).success) return back("/admin/tickets", "Invalid ticket.");
  if (!reply.success) return back("/admin/tickets", reply.error.issues[0].message);
  const { error } = await admin.from("support_tickets").update({ admin_reply: reply.data, status: "answered", replied_by: user.id, replied_at: new Date().toISOString() }).eq("id", id);
  if (!error) {
    await admin.from("audit_logs").insert({ actor_id: user.id, action: "ticket_answered", target_type: "support_ticket", target_id: id, details: {} });
    const { data: t } = await admin.from("support_tickets").select("user_id, subject").eq("id", id).single();
    if (t) notifyUser(t.user_id, `Reply to your ticket: ${t.subject}`, `We replied to your support ticket "${t.subject}".\n\n${reply.data}\n\nYou can see it here: ${link("/support")}`);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/support");
  return back("/admin/tickets", error?.message);
}
