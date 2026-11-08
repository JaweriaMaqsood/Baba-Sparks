import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SettingsForms } from "@/components/account/SettingsForms";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  return (
    <PageShell title="Settings" intro={`Member since ${new Date(user.created_at).toLocaleDateString("en-GB")}`}>
      <SettingsForms name={profile?.full_name ?? ""} email={user.email ?? ""} />
    </PageShell>
  );
}
