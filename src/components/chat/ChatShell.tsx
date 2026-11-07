import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChatClient } from "./ChatClient";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export async function ChatShell({ id }: { id?: string }) {
  if (!supabaseConfigured) redirect("/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: list } = await supabase.from("conversations").select("id, title").order("updated_at", { ascending: false }).limit(50);
  let title: string | undefined;
  let initial: { role: "user" | "assistant"; content: string }[] = [];
  if (id) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
    const { data: conv } = await supabase.from("conversations").select("id, title").eq("id", id).maybeSingle(); // RLS hides other people's chats
    if (!conv) notFound();
    title = conv.title;
    const { data: msgs } = await supabase.from("messages").select("role, content").eq("conversation_id", id).order("created_at");
    initial = (msgs ?? []).filter((m) => m.role === "user" || m.role === "assistant") as typeof initial;
  }
  return (
    <PageShell title="AI chat">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <Link href="/chat" className="btn-primary w-full">New chat</Link>
          <nav aria-label="Conversations" className="mt-3 max-h-[60vh] space-y-1 overflow-y-auto">
            {list?.map((c) => (
              <Link key={c.id} href={`/chat/${c.id}`} className={`block truncate rounded-xl px-3 py-2 text-sm ${c.id === id ? "bg-card text-ink" : "text-muted hover:bg-card"}`}>{c.title}</Link>
            ))}
            {!list?.length && <p className="px-3 text-sm text-muted">No conversations yet.</p>}
          </nav>
        </aside>
        <ChatClient key={id ?? "new"} conversationId={id} title={title} initial={initial} />
      </div>
    </PageShell>
  );
}
