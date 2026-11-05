import { PageShell } from "@/components/layout/PageShell";
import { brand } from "@/config/brand";
export const metadata = { title: "Contact" };
export default function Page() {
  return (
    <PageShell title="Contact" narrow>
      <p className="text-muted">Email us and we will reply as soon as we can.</p>
      <a href={`mailto:${brand.supportEmail}`} className="btn-primary mt-6">Email {brand.supportEmail}</a>
    </PageShell>
  );
}
