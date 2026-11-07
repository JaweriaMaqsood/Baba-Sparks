import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { supabaseConfigured } from "@/lib/supabase/env";
import Link from "next/link";
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
      <div className="mt-6 flex gap-3">
        <Link href="/history" className="btn-ghost">History</Link>
        <Link href="/usage" className="btn-ghost">Usage &amp; credits</Link>
      </div>
      {Object.entries(tools.reduce<Record<string, typeof tools>>((acc, t) => { (acc[t.category] ??= []).push(t); return acc; }, {})).map(([cat, list]) => (
        <section key={cat} className="mt-10">
          <h2 className="text-lg font-medium">{cat}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="panel p-4 transition-colors hover:border-primary/50">
                <h3 className="font-medium">{t.name}</h3>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
                <span className="mt-2 inline-block text-xs text-accent">{t.cost} {t.cost === 1 ? "credit" : "credits"}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm text-muted">Coming soon: AI chat and image generation.</p>
      <form action={signOut} className="mt-6"><button className="btn-ghost">Log out</button></form>
    </PageShell>
  );
}
