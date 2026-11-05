import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { forgotPassword } from "@/lib/auth/actions";
export const metadata = { title: "Reset your password" };
export default function Page() {
  return (
    <PageShell title="Reset your password" narrow>
      <AuthForm action={forgotPassword} button="Send reset link" fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]} />
      <p className="mt-4 text-sm text-muted"><Link href="/login" className="underline">Back to log in</Link></p>
    </PageShell>
  );
}
