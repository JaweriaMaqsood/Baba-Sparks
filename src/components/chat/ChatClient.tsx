"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "@/components/tools/CopyButton";
import { renameConversation, deleteConversation } from "@/lib/chat/actions";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatClient({ conversationId, title, initial }: { conversationId?: string; title?: string; initial: Msg[] }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true); setError(""); setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId, message: text }) });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Something went wrong.");
        setMsgs((m) => m.slice(0, -2)); setInput(text);
      } else {
        const cid = res.headers.get("x-conversation-id");
        const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
        }
        if (!conversationId && cid) router.replace(`/chat/${cid}`); else router.refresh();
      }
    } catch {
      setError("Network problem. Check your connection and try again.");
      setMsgs((m) => m.slice(0, -2)); setInput(text);
    }
    setBusy(false);
  }

  return (
    <div className="flex h-[70vh] flex-col">
      {conversationId && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <form action={renameConversation.bind(null, conversationId)} className="flex flex-1 gap-2">
            <input name="title" defaultValue={title} maxLength={80} aria-label="Conversation title" className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm" />
            <button className="btn-ghost px-3 py-1.5 text-xs">Rename</button>
          </form>
          <form action={deleteConversation.bind(null, conversationId)} onSubmit={(e) => { if (!confirm("Delete this conversation?")) e.preventDefault(); }}>
            <button className="btn-ghost px-3 py-1.5 text-xs">Delete</button>
          </form>
        </div>
      )}
      <div className="panel flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {!msgs.length && <p className="text-sm text-muted">Ask anything. Each message costs 1 credit. AI can make mistakes, so check important facts.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "bg-primary/25" : "bg-surface"}`}>
              {m.role === "user" ? <p dir="auto" className="whitespace-pre-wrap">{m.content}</p>
                : m.content ? <div dir="auto" className="md"><ReactMarkdown>{m.content}</ReactMarkdown></div> : <p className="text-muted">Thinking…</p>}
              {m.role === "assistant" && m.content && !busy && <div className="mt-2"><CopyButton text={m.content} /></div>}
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
      <form onSubmit={send} className="mt-3 flex gap-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} maxLength={4000} rows={2} aria-label="Message" placeholder="Type your message…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
          className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
        <button disabled={busy || !input.trim()} className="btn-primary disabled:opacity-60">{busy ? "…" : "Send"}</button>
      </form>
    </div>
  );
}
