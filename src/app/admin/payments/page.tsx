import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { approvePayment, rejectPayment } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";
const money = (c: number, cur: string) => `${cur} ${(c / 100).toLocaleString("en-PK")}`;

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; status?: string }> }) {
  const sp = await searchParams;
  const { admin } = await requireAdmin();
  const status = ["pending", "approved", "rejected"].includes(sp.status ?? "") ? sp.status! : "pending";
  const [{ data: rows }, { data: users }] = await Promise.all([
    admin.from("payment_requests").select("id, user_id, amount_cents, currency, sender_number, txn_ref, note, status, reject_reason, created_at, plans(name, price_cents)").eq("status", status).order("created_at", { ascending: false }).limit(50),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);
  const email = new Map(users?.users.map((u) => [u.id, u.email]) ?? []);
  return (
    <AdminShell title="Payments" error={sp.error}>
      <div className="mb-4 flex gap-2 text-sm">{["pending", "approved", "rejected"].map((s) => <a key={s} href={`/admin/payments?status=${s}`} className={`btn-ghost px-3 py-1.5 text-xs ${s === status ? "bg-card" : ""}`}>{s}</a>)}</div>
      {!rows?.length && <p className="text-muted">Nothing here.</p>}
      <div className="space-y-3">
        {rows?.map((r) => {
          const plan = r.plans as unknown as { name: string; price_cents: number } | null;
          const mismatch = plan && plan.price_cents !== r.amount_cents;
          return (
            <div key={r.id} className="panel space-y-2 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{email.get(r.user_id) ?? r.user_id}</span><span className="text-muted">{new Date(r.created_at).toLocaleString("en-GB")}</span></div>
              <p>Plan: {plan?.name} · Price now: {plan ? money(plan.price_cents, r.currency) : "?"} · Sender: {r.sender_number} · Transaction ID: <span className="font-mono">{r.txn_ref}</span></p>
              {mismatch && <p className="text-amber-300">The plan price changed after this request. Check the amount in JazzCash before approving.</p>}
              {r.note && <p className="text-muted">Note: {r.note}</p>}
              {r.status === "rejected" && <p className="text-muted">Rejected: {r.reject_reason}</p>}
              {r.status === "pending" && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <form action={approvePayment.bind(null, r.id)}><SubmitButton className="btn-primary px-3 py-1.5 text-xs" pendingText="Approving…">Approve</SubmitButton></form>
                  <form action={rejectPayment.bind(null, r.id)} className="flex gap-2">
                    <input name="reason" required minLength={3} maxLength={200} placeholder="Reason" aria-label="Reason" className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs" />
                    <SubmitButton className="btn-ghost px-3 py-1.5 text-xs" pendingText="Rejecting…">Reject</SubmitButton>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted">Approve only after you see the money in your JazzCash account with the same transaction ID.</p>
    </AdminShell>
  );
}
