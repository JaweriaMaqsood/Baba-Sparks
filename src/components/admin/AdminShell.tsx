import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

const links = [["Overview", "/admin"], ["Payments", "/admin/payments"], ["Users", "/admin/users"], ["Plans", "/admin/plans"]];
export function AdminShell({ title, error, children }: { title: string; error?: string; children: React.ReactNode }) {
  return (
    <PageShell title={title}>
      <nav aria-label="Admin" className="-mt-4 mb-6 flex flex-wrap gap-2">
        {links.map(([l, h]) => <Link key={h} href={h} className="btn-ghost px-3 py-1.5 text-xs">{l}</Link>)}
      </nav>
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {children}
    </PageShell>
  );
}
