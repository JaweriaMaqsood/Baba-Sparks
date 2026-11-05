import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { plans } from "@/config/content";
export const metadata = { title: "Pricing" };
export default function Page() {
  return (
    <PageShell title="Pricing" intro="Prices and credit amounts are not final. They will be managed from the admin panel and loaded from the database.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map(([n, d]) => (
          <div key={n} className="panel flex flex-col p-5"><h2 className="font-medium">{n}</h2><p className="mt-2 flex-1 text-sm text-muted">{d}</p>
            <Link href="/register" className="btn-ghost mt-5">Start with {n}</Link></div>
        ))}
      </div>
    </PageShell>
  );
}
