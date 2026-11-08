import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { TicketForm } from "@/components/support/TicketForm";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Support" };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: tickets } = await supabase.from("support_tickets").select("id, subject, message, status, admin_reply, replied_at, created_at").order("created_at", { ascending: false }).limit(30);
  return (
    <PageShell title="Support" intro="Tell us what went wrong. Replies appear below.">
      <div className="grid gap-6 lg:grid-cols-2">
        <TicketForm />
        <div className="space-y-3">
          <h2 className="font-medium">Your tickets</h2>
          {!tickets?.length && <p className="text-sm text-muted">No tickets yet.</p>}
          {tickets?.map((t) => (
            <div key={t.id} className="panel p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{t.subject}</span><span className="text-xs text-muted">{t.status === "answered" ? "Answered" : "Waiting for reply"} · {new Date(t.created_at).toLocaleDateString("en-GB")}</span></div>
              <p className="mt-2 whitespace-pre-wrap text-muted">{t.message}</p>
              {t.admin_reply && <div className="mt-3 rounded-xl border border-line bg-surface p-3"><p className="text-xs text-accent">Reply</p><p dir="auto" className="mt-1 whitespace-pre-wrap">{t.admin_reply}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
