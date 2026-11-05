import { PageShell } from "@/components/layout/PageShell";
export const metadata = { title: "Terms of Service" };
export default function Page() {
  return (
    <PageShell title="Terms of Service" narrow>
      <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">Draft pending. The final Terms of Service must be written or reviewed by a qualified lawyer for your business and country before launch.</p>
    </PageShell>
  );
}
