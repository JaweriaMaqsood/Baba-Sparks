import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { replyTicket } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata = { title: "Tickets" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; status?: string }> }) {
  const sp = await searchParams;
  const { admin } = await requireAdmin();
  const status = sp.status === "answered" ? "answered" : "open";
  const [{ data: rows }, { data: users }] = await Promise.all([
    admin.from("support_tickets").select("id, user_id, subject, message, status, admin_reply, created_at").eq("status", status).order("created_at", { ascending: status === "open" }).limit(50),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);
  const email = new Map(users?.users.map((u) => [u.id, u.email]) ?? []);
  return (
    <AdminShell title="Tickets" error={sp.error}>
      <div className="mb-4 flex gap-2">{["open", "answered"].map((s) => <a key={s} href={`/admin/tickets?status=${s}`} className={`btn-ghost px-3 py-1.5 text-xs ${s === status ? "bg-card" : ""}`}>{s}</a>)}</div>
      {!rows?.length && <p className="text-muted">Nothing here.</p>}
      <div className="space-y-3">
        {rows?.map((t) => (
          <div key={t.id} className="panel space-y-2 p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{t.subject}</span><span className="text-muted">{email.get(t.user_id) ?? t.user_id} · {new Date(t.created_at).toLocaleString("en-GB")}</span></div>
            <p className="whitespace-pre-wrap text-muted">{t.message}</p>
            {t.admin_reply && <p className="whitespace-pre-wrap rounded-xl border border-line bg-surface p-3">{t.admin_reply}</p>}
            {t.status === "open" && (
              <form action={replyTicket.bind(null, t.id)} className="space-y-2">
                <textarea name="reply" required rows={3} maxLength={2000} placeholder="Your reply" aria-label="Your reply" className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
                <SubmitButton className="btn-primary px-3 py-1.5 text-xs" pendingText="Sending…">Send reply</SubmitButton>
              </form>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
