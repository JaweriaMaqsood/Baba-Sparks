import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProvider } from "@/lib/ai/provider";
import { CHAT_COST, streamChat, type ChatMsg } from "@/lib/ai/chat";

export const maxDuration = 60;
const body = z.object({ conversationId: z.string().uuid().optional(), message: z.string().trim().min(1, "Type a message.").max(4000, "Message is too long.") });
const err = (status: number, error: string) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err(401, "Please log in.");
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return err(413, "Request too large.");

  let parsed;
  try { parsed = body.safeParse(await req.json()); } catch { return err(400, "Invalid request."); }
  if (!parsed.success) return err(400, parsed.error.issues[0].message);
  const { message, conversationId } = parsed.data;

  const provider = getProvider();
  if (!provider || !process.env.SUPABASE_SERVICE_ROLE_KEY) return err(503, "The AI service is not configured yet.");
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("status").eq("id", user.id).single();
  if (profile?.status !== "active") return err(403, "This account is not active.");
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await admin.from("ai_usage_logs").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((count ?? 0) >= 15) return err(429, "Too many requests. Wait a minute and try again.");

  // conversation: must belong to this user
  let convId = conversationId;
  let history: ChatMsg[] = [];
  if (convId) {
    const { data: conv } = await admin.from("conversations").select("id").eq("id", convId).eq("user_id", user.id).maybeSingle();
    if (!conv) return err(404, "Conversation not found.");
    const { data: prev } = await admin.from("messages").select("role, content").eq("conversation_id", convId).order("created_at", { ascending: false }).limit(20);
    history = (prev ?? []).reverse().filter((m) => m.role === "user" || m.role === "assistant") as ChatMsg[];
  }

  const requestId = crypto.randomUUID();
  const { error: spendErr } = await admin.rpc("spend_credits", { p_user: user.id, p_amount: CHAT_COST, p_key: `spend:${requestId}` });
  if (spendErr) return spendErr.message.includes("insufficient") ? err(402, "Not enough credits.") : err(500, "Could not check your credits. Try again.");

  const refund = async (reason: string) => {
    await admin.rpc("refund_credits", { p_user: user.id, p_amount: CHAT_COST, p_key: `refund:${requestId}` });
    await admin.from("ai_usage_logs").insert({ user_id: user.id, tool_slug: "chat", provider: provider.name, credits: CHAT_COST, status: "refunded", error: reason });
  };

  const started = Date.now();
  const it = streamChat([...history, { role: "user", content: message }])[Symbol.asyncIterator]();
  let first: IteratorResult<string> | null = null;
  try { first = await it.next(); } catch { first = null; }
  if (!first || first.done || !first.value) {
    await refund("no_response");
    return err(502, "The AI provider did not respond. Your credit was returned.");
  }

  if (!convId) {
    const { data: created, error } = await admin.from("conversations").insert({ user_id: user.id, title: message.slice(0, 60), provider: provider.name }).select("id").single();
    if (error || !created) { await refund("db_error"); return err(500, "Could not save the conversation."); }
    convId = created.id;
  }
  await admin.from("messages").insert({ conversation_id: convId, role: "user", content: message });

  const enc = new TextEncoder();
  const finalConvId = convId as string;
  const stream = new ReadableStream({
    async start(controller) {
      let full = first.value as string;
      controller.enqueue(enc.encode(full));
      try {
        for (;;) {
          const n = await it.next();
          if (n.done) break;
          full += n.value;
          controller.enqueue(enc.encode(n.value));
        }
      } catch { /* keep what we have */ }
      await admin.from("messages").insert({ conversation_id: finalConvId, role: "assistant", content: full });
      await admin.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", finalConvId);
      await admin.from("ai_usage_logs").insert({ user_id: user.id, tool_slug: "chat", provider: provider.name, credits: CHAT_COST, status: "success", latency_ms: Date.now() - started });
      controller.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "x-conversation-id": finalConvId, "cache-control": "no-store" } });
}
