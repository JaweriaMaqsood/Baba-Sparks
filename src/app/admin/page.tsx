import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { admin } = await requireAdmin();
  const day = new Date(Date.now() - 86_400_000).toISOString();
  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);
  const [users, pending, uses, tickets, approved] = await Promise.all([
    count(admin.from("profiles").select("id", { count: "exact", head: true })),
    count(admin.from("payment_requests").select("id", { count: "exact", head: true }).eq("status", "pending")),
    count(admin.from("ai_usage_logs").select("id", { count: "exact", head: true }).gte("created_at", day)),
    count(admin.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open")),
    admin.from("payment_requests").select("plans(price_cents)").eq("status", "approved").limit(2000),
  ]);
  const revenue = (approved.data ?? []).reduce((s, r) => s + ((r.plans as unknown as { price_cents: number } | null)?.price_cents ?? 0), 0) / 100;
  const cards: [string, string][] = [["Users", String(users)], ["Payments waiting", String(pending)], ["AI requests (24h)", String(uses)], ["Open tickets", String(tickets)], ["Approved payments (PKR)", revenue.toLocaleString("en-PK")]];
  return (
    <AdminShell title="Admin">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([l, v]) => <div key={l} className="panel p-5"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-2xl font-medium">{v}</p></div>)}
      </div>
      <p className="mt-6 text-sm text-muted">Revenue counts only payments you approved, at the plan price. Nothing here is estimated.</p>
    </AdminShell>
  );
}
