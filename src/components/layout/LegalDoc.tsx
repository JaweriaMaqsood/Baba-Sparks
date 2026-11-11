import { PageShell } from "./PageShell";
import { brand } from "@/config/brand";
import type { Doc } from "@/config/legal";

const fill = (t: string) => t.replaceAll("{name}", brand.name).replaceAll("{email}", brand.supportEmail);

export function LegalDoc({ doc }: { doc: Doc }) {
  return (
    <PageShell title={doc.title} narrow>
      <p className="-mt-6 mb-6 text-sm text-muted">Last updated: {doc.updated}</p>
      <p className="text-muted">{fill(doc.intro)}</p>
      <div className="mt-8 space-y-8">
        {doc.sections.map((s, i) => (
          <section key={s.title}>
            <h2 className="text-lg font-medium">{i + 1}. {s.title}</h2>
            <div className="mt-2 space-y-3 text-muted">
              {s.body.map((b, j) => Array.isArray(b)
                ? <ul key={j} className="list-disc space-y-1 pl-5">{b.map((li) => <li key={li}>{fill(li)}</li>)}</ul>
                : <p key={j}>{fill(b)}</p>)}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
