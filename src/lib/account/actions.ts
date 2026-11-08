"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/auth/actions";

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const p = z.object({ name: z.string().trim().min(1, "Enter your name.").max(80) }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in." };
  const { error } = await supabase.from("profiles").update({ full_name: p.data.name }).eq("id", user.id); // RLS: own row only
  if (error) return { error: "Could not save. Try again." };
  revalidatePath("/", "layout");
  return { message: "Saved." };
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const p = z.object({ password: z.string().min(8, "Password must be at least 8 characters.").max(72), confirm: z.string() }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data.password !== p.data.confirm) return { error: "The two passwords do not match." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: p.data.password });
  if (error) return { error: "Could not change the password. Log in again and retry." };
  return { message: "Password changed." };
}
