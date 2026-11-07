import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CopyButton } from "@/components/tools/CopyButton";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getTool } from "@/lib/ai/tools";

export const metadata = { title: "History" };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await supabase.from("generated_content").select("id, tool_slug, output, created_at").order("created_at", { ascending: false }).limit(50);
  return (
    <PageShell title="History" intro="Your last 50 results. Only you can see these.">
      {!data?.length ? <p className="text-muted">Nothing here yet. Run a tool and the result is saved automatically.</p> : (
        <div className="space-y-3">
          {data.map((r) => (
            <details key={r.id} className="panel p-4">
              <summary className="cursor-pointer">
                <span className="font-medium">{getTool(r.tool_slug)?.name ?? r.tool_slug}</span>
                <span className="ml-3 text-xs text-muted">{new Date(r.created_at).toLocaleString("en-GB")}</span>
              </summary>
              <p dir="auto" className="mt-3 whitespace-pre-wrap text-sm">{r.output}</p>
              <div className="mt-3"><CopyButton text={r.output} /></div>
            </details>
          ))}
        </div>
      )}
    </PageShell>
  );
}
