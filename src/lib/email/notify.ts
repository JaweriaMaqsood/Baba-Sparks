import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "./send";

const site = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
export const link = (path: string) => `${site()}${path}`;

// Runs after the response has been sent, so the user never waits for email.
export function notifyUser(userId: string, subject: string, text: string) {
  after(async () => {
    try {
      const { data } = await createAdminClient().auth.admin.getUserById(userId);
      if (data.user?.email) await sendEmail({ to: data.user.email, subject, text });
    } catch { /* ignore */ }
  });
}

export function notifyAdmin(subject: string, text: string) {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return;
  after(async () => { await sendEmail({ to, subject, text }); });
}
