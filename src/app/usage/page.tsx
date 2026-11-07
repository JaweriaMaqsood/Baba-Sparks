import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Usage & credits" };
export const dynamic = "force-dynamic";
const label: Record<string, string> = { grant: "Credits added", spend: "Used", refund: "Returned", admin_adjust: "Adjusted" };

export default async function Page() {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: bal }, { data: tx }] = await Promise.all([
    supabase.from("credit_balances").select("balance, lifetime_used").eq("user_id", user.id).single(),
    supabase.from("credit_transactions").select("id, amount, type, balance_after, created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  return (
    <PageShell title="Usage & credits">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5"><p className="text-sm text-muted">Available</p><p className="mt-1 text-2xl font-medium">{bal?.balance ?? 0}</p></div>
        <div className="panel p-5"><p className="text-sm text-muted">Used so far</p><p className="mt-1 text-2xl font-medium">{bal?.lifetime_used ?? 0}</p></div>
      </div>
      <h2 className="mt-10 text-lg font-medium">Recent activity</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted"><tr><th className="p-3">When</th><th className="p-3">Type</th><th className="p-3">Credits</th><th className="p-3">Balance</th></tr></thead>
          <tbody>
            {tx?.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <td className="p-3">{new Date(t.created_at).toLocaleString("en-GB")}</td>
                <td className="p-3">{label[t.type] ?? t.type}</td>
                <td className="p-3">{t.amount > 0 ? `+${t.amount}` : t.amount}</td>
                <td className="p-3">{t.balance_after}</td>
              </tr>
            ))}
            {!tx?.length && <tr><td className="p-3 text-muted" colSpan={4}>No activity yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
