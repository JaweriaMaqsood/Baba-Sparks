import { PageShell } from "@/components/layout/PageShell";
import { AdminNav } from "./AdminNav";

export function AdminShell({ title, error, children }: { title: string; error?: string; children: React.ReactNode }) {
  return (
    <PageShell title={title}>
      <AdminNav />
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {children}
    </PageShell>
  );
}
