import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runTool } from "@/lib/ai/service";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  if (Number(req.headers.get("content-length") ?? 0) > 50_000) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  let body: { tool?: unknown; input?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.tool !== "string") return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const r = await runTool(user.id, body.tool, body.input);
  return r.ok ? NextResponse.json({ output: r.output, creditsLeft: r.creditsLeft }) : NextResponse.json({ error: r.error }, { status: r.status });
}
