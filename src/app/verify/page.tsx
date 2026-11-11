import { PageShell } from "@/components/layout/PageShell";
import { VerifyForm } from "@/components/auth/VerifyForm";

export const metadata = { title: "Verify your email" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const email = ((await searchParams).email ?? "").slice(0, 200);
  return (
    <PageShell title="Verify your email" intro={email ? `We sent a 6-digit code to ${email}. Enter it below. The email may take a minute, and check spam too.` : "Enter your email and the 6-digit code we sent you."} narrow>
      <VerifyForm email={email} />
    </PageShell>
  );
}
