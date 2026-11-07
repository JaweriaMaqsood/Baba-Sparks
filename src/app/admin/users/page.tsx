import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { adjustCredits } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";
const inp = "rounded-xl border border-line bg-surface px-2 py-1 text-xs";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; q?: string }> }) {
  const sp = await searchParams;
  const { admin } = await requireAdmin();
  const q = (sp.q ?? "").trim().toLowerCase();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const users = (data?.users ?? []).filter((u) => !q || (u.email ?? "").toLowerCase().includes(q));
  const ids = users.map((u) => u.id);
  const [{ data: bals }, { data: subs }, { data: profs }] = await Promise.all([
    admin.from("credit_balances").select("user_id, balance, lifetime_used").in("user_id", ids),
    admin.from("subscriptions").select("user_id, plans(name)").in("user_id", ids),
    admin.from("profiles").select("id, full_name, status").in("id", ids),
  ]);
  const bal = new Map(bals?.map((b) => [b.user_id, b]));
  const plan = new Map(subs?.map((s) => [s.user_id, (s.plans as unknown as { name: string } | null)?.name]));
  const prof = new Map(profs?.map((p) => [p.id, p]));
  return (
    <AdminShell title="Users" error={sp.error}>
      <form className="mb-4 flex gap-2"><input name="q" defaultValue={sp.q} placeholder="Search email" aria-label="Search email" className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm" /><button className="btn-ghost">Search</button></form>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="panel p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">{u.email}</span>
              <span className="text-muted">{prof.get(u.id)?.full_name} · {plan.get(u.id) ?? "Free"} · {bal.get(u.id)?.balance ?? 0} credits · used {bal.get(u.id)?.lifetime_used ?? 0}</span>
            </div>
            <form action={adjustCredits} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="user_id" value={u.id} />
              <input name="amount" type="number" required placeholder="+50 or -10" aria-label="Credits to add or remove" className={`${inp} w-28`} />
              <input name="reason" required minLength={3} maxLength={200} placeholder="Reason" aria-label="Reason" className={`${inp} min-w-0 flex-1`} />
              <SubmitButton className="btn-ghost px-3 py-1 text-xs" pendingText="Saving…">Adjust credits</SubmitButton>
            </form>
          </div>
        ))}
        {!users.length && <p className="text-muted">No users found.</p>}
      </div>
      <p className="mt-6 text-xs text-muted">Every credit change is written to the audit log with your account and the reason.</p>
    </AdminShell>
  );
}
