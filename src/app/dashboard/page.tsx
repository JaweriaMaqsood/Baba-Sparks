import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { supabaseConfigured } from "@/lib/supabase/env";
import Link from "next/link";
import { toolCategories } from "@/config/tools";
import { tools } from "@/lib/ai/tools";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!supabaseConfigured) return <PageShell title="Dashboard" narrow><p className="note text-muted">Supabase is not configured on this deployment.</p></PageShell>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: bal }, { data: sub }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.from("credit_balances").select("balance, lifetime_used").eq("user_id", user.id).single(),
    supabase.from("subscriptions").select("plans(name)").eq("user_id", user.id).maybeSingle(),
  ]);
  const plan = (sub?.plans as unknown as { name: string } | null)?.name ?? "Free";
  return (
    <PageShell title={`Welcome, ${profile?.full_name ?? "there"}`}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5"><p className="text-sm text-muted">Plan</p><p className="mt-1 text-xl font-medium">{plan}</p></div>
        <div className="panel p-5"><p className="text-sm text-muted">Credits available</p><p className="mt-1 text-xl font-medium">{bal?.balance ?? 0}</p></div>
        <div className="panel p-5"><p className="text-sm text-muted">Credits used</p><p className="mt-1 text-xl font-medium">{bal?.lifetime_used ?? 0}</p></div>
      </div>
      <h2 className="mt-10 text-lg font-medium">Available now</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="panel p-4 transition-colors hover:border-primary/50">
            <h3 className="font-medium">{t.name}</h3>
            <p className="mt-1 text-sm text-muted">{t.description}</p>
            <span className="mt-2 inline-block text-xs text-accent">{t.cost} {t.cost === 1 ? "credit" : "credits"}</span>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 text-lg font-medium">More tools</h2>
      <p className="mt-1 text-sm text-muted">These categories are being built and cannot be opened yet.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {toolCategories.map((c) => (
          <div key={c.name} className="panel p-4 opacity-80">
            <h3 className="font-medium">{c.name}</h3>
            <span className="mt-2 inline-block rounded-full border border-line px-2 py-0.5 text-xs text-muted">Coming soon</span>
          </div>
        ))}
      </div>
      <form action={signOut} className="mt-6"><button className="btn-ghost">Log out</button></form>
    </PageShell>
  );
}
