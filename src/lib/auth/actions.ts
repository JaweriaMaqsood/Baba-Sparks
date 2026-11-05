"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type FormState = { error?: string; message?: string };
const NOT_READY: FormState = { error: "Accounts are not configured yet." };
const email = z.string().trim().toLowerCase().email("Enter a valid email.");
const password = z.string().min(8, "Password must be at least 8 characters.").max(72);

async function origin() {
  const h = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL || h.get("origin") || "";
}

export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured) return NOT_READY;
  const p = z.object({ name: z.string().trim().min(1, "Enter your name.").max(80), email, password }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: p.data.email, password: p.data.password,
    options: { data: { full_name: p.data.name }, emailRedirectTo: `${await origin()}/auth/callback` },
  });
  if (error) return { error: "Could not create the account. Try a different email or password." };
  return { message: "Check your email and click the link to verify your account." };
}

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured) return NOT_READY;
  const p = z.object({ email, password: z.string().min(1, "Enter your password.") }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(p.data);
  if (error) return { error: "Wrong email or password, or the email is not verified yet." };
  redirect("/dashboard");
}

export async function forgotPassword(_: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured) return NOT_READY;
  const p = z.object({ email }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(p.data.email, { redirectTo: `${await origin()}/auth/callback?next=/reset-password` });
  return { message: "If that email has an account, a reset link is on its way." }; // same reply either way
}

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured) return NOT_READY;
  const p = z.object({ password }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: p.data.password });
  if (error) return { error: "The reset link expired. Request a new one." };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
