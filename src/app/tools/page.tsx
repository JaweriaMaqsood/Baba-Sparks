import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { toolCategories } from "@/config/tools";
export const metadata = { title: "AI tools" };
export default function Page() {
  return (
    <PageShell title="AI tools" intro="Tools open after you sign in. Each has its own form, options and credit cost.">
      <div className="grid gap-4 sm:grid-cols-2">
        {toolCategories.map((c) => (
          <div key={c.name} className="panel p-5">
            <div className="flex items-center justify-between"><h2 className="font-medium">{c.name}</h2><span className="text-xs text-muted">{c.count} {c.count === 1 ? "tool" : "tools"}</span></div>
            <p className="mt-2 text-sm text-muted">{c.text}</p>
          </div>
        ))}
      </div>
      <Link href="/register" className="btn-primary mt-8">Create a free account</Link>
    </PageShell>
  );
}
