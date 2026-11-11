"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/auth/actions";
import { notifyAdmin, link } from "@/lib/email/notify";

const schema = z.object({
  plan: z.string().uuid("Choose a plan."),
  sender_number: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Enter the number you paid from."),
  txn_ref: z.string().trim().regex(/^[A-Za-z0-9\-_]{5,40}$/, "Enter the transaction ID exactly as shown in JazzCash (letters and numbers)."),
  note: z.string().trim().max(200).optional(),
});

export async function submitPayment(_: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in." };
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };

  const { data: plan } = await supabase.from("plans").select("id, price_cents, currency, is_active").eq("id", p.data.plan).maybeSingle();
  if (!plan || !plan.is_active || plan.price_cents <= 0) return { error: "This plan is not available." };

  const { error } = await supabase.from("payment_requests").insert({
    user_id: user.id, plan_id: plan.id, amount_cents: plan.price_cents, currency: plan.currency,
    sender_number: p.data.sender_number, txn_ref: p.data.txn_ref, note: p.data.note || null,
  });
  if (error) {
    if (error.code === "23505") return { error: "This transaction ID was already submitted." };
    if (error.message.includes("too many pending")) return { error: "You already have 3 payments waiting for review. Please wait for them to be checked." };
    return { error: "Could not submit. Please try again." };
  }
  notifyAdmin("New payment to check", `${user.email} submitted a payment.\nTransaction ID: ${p.data.txn_ref}\nSender: ${p.data.sender_number}\n\nReview: ${link("/admin/payments")}`);
  revalidatePath("/billing");
  return { message: "Submitted. We will check the payment and activate your plan. You will see it here once approved." };
}
