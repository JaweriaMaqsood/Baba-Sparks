import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/lib/auth/actions";
export const metadata = { title: "Create your account" };
export default function Page() {
  return (
    <PageShell title="Create your account" narrow>
      <AuthForm action={signUp} button="Create account" fields={[{ name: "name", label: "Name", type: "text", autoComplete: "name" }, { name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password (8+ characters)", type: "password", autoComplete: "new-password" }]} />
      <p className="mt-4 text-sm text-muted">Already registered? <Link href="/login" className="underline">Log in</Link></p>
    </PageShell>
  );
}
