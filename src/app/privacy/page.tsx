import { PageShell } from "@/components/layout/PageShell";
export const metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <PageShell title="Privacy Policy" narrow>
      <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">Draft pending. The final Privacy Policy must be written or reviewed by a qualified lawyer for your business and country before launch.</p>
    </PageShell>
  );
}
