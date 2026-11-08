import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { updateSettings } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";
const inp = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const { admin } = await requireAdmin();
  const { data } = await admin.from("app_settings").select("key, value").in("key", ["jazzcash_name", "jazzcash_number"]);
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <AdminShell title="Settings" error={sp.error}>
      <form action={updateSettings} className="panel max-w-lg space-y-4 p-6">
        <h2 className="font-medium">JazzCash account for payments</h2>
        <p className="text-sm text-muted">Users see these on the Billing page. Use the account where you will check incoming payments.</p>
        <label className="block text-sm">Account name<input name="name" defaultValue={v.jazzcash_name ?? ""} maxLength={60} className={inp} /></label>
        <label className="block text-sm">JazzCash number<input name="number" defaultValue={v.jazzcash_number ?? ""} required inputMode="tel" className={inp} placeholder="03XX XXXXXXX" /></label>
        <SubmitButton className="btn-primary" pendingText="Saving…">Save</SubmitButton>
      </form>
    </AdminShell>
  );
}
