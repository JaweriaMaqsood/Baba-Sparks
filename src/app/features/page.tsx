import { PageShell } from "@/components/layout/PageShell";
export const metadata = { title: "Features" };
export default function Page() {
  return (
    <PageShell title="Features" intro="What the workspace does and how it handles your data.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[["Credits you can see","Every action shows its cost first. Balances change only on our servers."],["Private by default","Conversations and saved content are visible only to your account."],["More than one AI provider","Pick between supported models. New providers can be added without changing the tools."],["Save and export","Copy results, download text, and group saved content into projects."],["Right-to-left languages","Urdu and Arabic text displays in the correct direction."],["Team workspace","The Business plan adds a shared workspace and seats."]].map(([t, d]) => (
          <div key={t} className="panel p-5"><h2 className="font-medium">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></div>
        ))}
      </div>
    </PageShell>
  );
}
