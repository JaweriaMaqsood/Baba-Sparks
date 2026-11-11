import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { plans as fallback } from "@/config/content";

type Plan = { slug: string; name: string; price_cents: number; currency: string; monthly_credits: number };

async function load(): Promise<Plan[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("plans").select("slug, name, price_cents, currency, monthly_credits").eq("is_active", true).order("sort_order");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function PlanCards({ loggedIn }: { loggedIn: boolean }) {
  const list = await load();
  const grid = "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4";
  if (!list.length) {
    return (
      <div className={grid}>
        {fallback.map(([n, d]) => (
          <div key={n} className="panel flex flex-col p-5"><h3 className="font-medium">{n}</h3><p className="mt-2 flex-1 text-sm text-muted">{d}</p></div>
        ))}
      </div>
    );
  }
  return (
    <div className={grid}>
      {list.map((p) => {
        const free = p.price_cents === 0;
        return (
          <div key={p.slug} className="panel flex flex-col p-5">
            <h3 className="font-medium">{p.name}</h3>
            <p className="mt-2 text-2xl">{free ? "Free" : `${p.currency} ${(p.price_cents / 100).toLocaleString("en-PK")}`}</p>
            <p className="mt-1 flex-1 text-sm text-muted">{free ? `${p.monthly_credits} credits when you sign up` : `${p.monthly_credits} credits for 30 days`}</p>
            <Link href={loggedIn ? (free ? "/dashboard" : "/billing") : "/register"} className={`${free ? "btn-ghost" : "btn-primary"} mt-5`}>
              {free ? (loggedIn ? "Open dashboard" : "Start free") : `Choose ${p.name}`}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
