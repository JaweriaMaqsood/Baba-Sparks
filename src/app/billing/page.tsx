import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PaymentForm } from "@/components/billing/PaymentForm";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Billing" };
export const dynamic = "force-dynamic";
const money = (cents: number, cur: string) => `${cur} ${(cents / 100).toLocaleString("en-PK")}`;
const badge: Record<string, string> = { pending: "Waiting for review", approved: "Approved", rejected: "Rejected" };

export default async function Page() {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: plans }, { data: sub }, { data: reqs }] = await Promise.all([
    supabase.from("plans").select("id, name, price_cents, currency, monthly_credits").eq("is_active", true).order("sort_order"),
    supabase.from("subscriptions").select("status, current_period_end, plans(name)").eq("user_id", user.id).maybeSingle(),
    supabase.from("payment_requests").select("id, amount_cents, currency, txn_ref, status, reject_reason, created_at, plans(name)").order("created_at", { ascending: false }).limit(20),
  ]);
  const paid = (plans ?? []).filter((p) => p.price_cents > 0);
  const current = (sub?.plans as unknown as { name: string } | null)?.name ?? "Free";
  const jcName = process.env.JAZZCASH_NAME;
  const jcNumber = process.env.JAZZCASH_NUMBER;

  return (
    <PageShell title="Billing" intro={`Current plan: ${current}${sub?.current_period_end ? ` (until ${new Date(sub.current_period_end).toLocaleDateString("en-GB")})` : ""}`}>
      {!paid.length ? (
        <p className="panel p-5 text-muted">Paid plans are not available yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paid.map((p) => (
                <div key={p.id} className="panel p-4"><h3 className="font-medium">{p.name}</h3>
                  <p className="mt-1 text-lg">{money(p.price_cents, p.currency)}</p>
                  <p className="text-sm text-muted">{p.monthly_credits} credits, 30 days</p></div>
              ))}
            </div>
            <div className="panel mt-4 p-4 text-sm">
              <h3 className="font-medium">How to pay</h3>
              {jcNumber ? (
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
                  <li>Send the plan price by JazzCash to <span className="text-ink">{jcName ?? "our account"}</span>, <span className="text-ink">{jcNumber}</span>.</li>
                  <li>Copy the transaction ID from the JazzCash message.</li>
                  <li>Fill the form and submit. We check every payment by hand, so activation is not instant.</li>
                </ol>
              ) : <p className="mt-2 text-muted">Payment details are not set up yet.</p>}
              <p className="mt-3 text-muted">Read the <Link href="/refund" className="underline">refund policy</Link> before paying.</p>
            </div>
          </div>
          {jcNumber && <PaymentForm plans={paid.map((p) => ({ id: p.id, label: `${p.name} (${money(p.price_cents, p.currency)})` }))} />}
        </div>
      )}
      <h2 className="mt-10 text-lg font-medium">Your payments</h2>
      <div className="mt-4 space-y-2">
        {!reqs?.length && <p className="text-sm text-muted">No payments yet.</p>}
        {reqs?.map((r) => (
          <div key={r.id} className="panel flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span>{(r.plans as unknown as { name: string } | null)?.name} · {money(r.amount_cents, r.currency)} · {r.txn_ref}</span>
            <span className="text-muted">{badge[r.status]}{r.reject_reason ? `: ${r.reject_reason}` : ""} · {new Date(r.created_at).toLocaleDateString("en-GB")}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
