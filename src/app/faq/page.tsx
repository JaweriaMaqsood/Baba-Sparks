import { PageShell } from "@/components/layout/PageShell";
import { faqs } from "@/config/content";
export const metadata = { title: "Frequently asked questions" };
export default function Page() {
  return (
    <PageShell title="Frequently asked questions" narrow>
      <div className="divide-y divide-line rounded-2xl border border-line">
        {faqs.map(([q, a]) => <details key={q} className="p-5"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}
      </div>
    </PageShell>
  );
}
