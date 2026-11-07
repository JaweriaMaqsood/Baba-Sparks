"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";

const uuid = z.string().uuid();
const back = (path: string, error?: string) => redirect(error ? `${path}?error=${encodeURIComponent(error.slice(0, 120))}` : path);

export async function approvePayment(id: string) {
  const { user, admin } = await requireAdmin();
  if (!uuid.safeParse(id).success) return back("/admin/payments", "Invalid request.");
  const { error } = await admin.rpc("approve_payment", { p_request: id, p_admin: user.id });
  revalidatePath("/admin", "layout");
  return back("/admin/payments", error?.message);
}

export async function rejectPayment(id: string, fd: FormData) {
  const { user, admin } = await requireAdmin();
  const reason = z.string().trim().min(3, "Write a short reason.").max(200).safeParse(fd.get("reason"));
  if (!uuid.safeParse(id).success) return back("/admin/payments", "Invalid request.");
  if (!reason.success) return back("/admin/payments", reason.error.issues[0].message);
  const { error } = await admin.rpc("reject_payment", { p_request: id, p_admin: user.id, p_reason: reason.data });
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
