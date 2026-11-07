import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { PageShell } from "@/components/layout/PageShell";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { getTool, publicTool } from "@/lib/ai/tools";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }
  return (
    <PageShell title={tool.name} intro={tool.description}>
      <ToolRunner tool={publicTool(tool)} />
    </PageShell>
  );
}
