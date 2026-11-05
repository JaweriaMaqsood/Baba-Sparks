import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { getTool, publicTool } from "@/lib/ai/tools";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  return (
    <PageShell title={tool.name} intro={tool.description}>
      <ToolRunner tool={publicTool(tool)} />
    </PageShell>
  );
}
