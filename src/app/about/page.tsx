import { PageShell } from "@/components/layout/PageShell";
import { brand } from "@/config/brand";
export const metadata = { title: "About" };
export default function Page() {
  return (
    <PageShell title="About" narrow>
      <p className="text-muted">{brand.name} puts writing, chat, translation, document and image tools in one place for students, freelancers, creators and small businesses. Everything runs on credits, so you pay for what you use. Company details will be added before launch.</p>
    </PageShell>
  );
}
