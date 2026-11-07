import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { updatePlan } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata = { title: "Plans" };
export const dynamic = "force-dynamic";
const inp = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const { admin } = await requireAdmin();
  const { data: plans } = await admin.from("plans").select("id, slug, name, price_cents, monthly_credits, is_active, currency").order("sort_order");
  return (
    <AdminShell title="Plans" error={sp.error}>
      <p className="mb-4 text-sm text-muted">A plan shows on the billing page only when it is active and its price is above 0. For the Free plan, credits apply to new sign-ups only.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {plans?.map((p) => (
          <form key={p.id} action={updatePlan.bind(null, p.id)} className="panel space-y-3 p-5">
            <h2 className="font-medium">{p.slug}</h2>
            <label className="block text-sm">Name<input name="name" defaultValue={p.name} required className={inp} /></label>
            <label className="block text-sm">Price ({p.currency})<input name="price" type="number" step="1" min="0" defaultValue={p.price_cents / 100} required className={inp} /></label>
            <label className="block text-sm">Credits per purchase<input name="credits" type="number" min="0" defaultValue={p.monthly_credits} required className={inp} /></label>
            <label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked={p.is_active} /> Active</label>
            <SubmitButton className="btn-primary" pendingText="Saving…">Save</SubmitButton>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
