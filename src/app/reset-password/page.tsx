import { PageShell } from "@/components/layout/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { resetPassword } from "@/lib/auth/actions";
export const metadata = { title: "Choose a new password" };
export default function Page() {
  return (
    <PageShell title="Choose a new password" narrow>
      <AuthForm action={resetPassword} button="Update password" fields={[{ name: "password", label: "New password (8+ characters)", type: "password", autoComplete: "new-password" }]} />
      <p className="mt-4 text-sm text-muted"></p>
    </PageShell>
  );
}
