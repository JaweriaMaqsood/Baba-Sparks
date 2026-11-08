"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/auth/actions";

export async function createTicket(_: FormState, fd: FormData): Promise<FormState> {
  const p = z.object({
    subject: z.string().trim().min(3, "Write a short subject (3+ characters).").max(100),
    message: z.string().trim().min(10, "Describe the problem in a few words (10+ characters).").max(2000),
  }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in." };
  const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject: p.data.subject, message: p.data.message });
  if (error) return { error: error.message.includes("too many open") ? "You already have 5 open tickets. Please wait for replies." : "Could not send. Try again." };
  revalidatePath("/support");
  return { message: "Sent. We will reply here." };
}
