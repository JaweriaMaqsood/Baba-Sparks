import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/lib/auth/actions";
export const metadata = { title: "Log in" };
export default function Page() {
  return (
    <PageShell title="Log in" narrow>
      <AuthForm action={signIn} button="Log in" fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]} />
      <p className="mt-4 text-sm text-muted"><Link href="/forgot-password" className="underline">Forgot password?</Link> · <Link href="/register" className="underline">Create account</Link></p>
    </PageShell>
  );
}
