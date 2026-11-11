import { PageShell } from "@/components/layout/PageShell";
import { PlanCards } from "@/components/marketing/PlanCards";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Pricing" };
export const dynamic = "force-dynamic";

export default async function Page() {
  let loggedIn = false;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
  }
  return (
    <PageShell title="Pricing" intro="Prices are in Pakistani rupees. Paid plans are activated after we check your JazzCash payment by hand, so it is not instant.">
      <PlanCards loggedIn={loggedIn} />
    </PageShell>
  );
}
