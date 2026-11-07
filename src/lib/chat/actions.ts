"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const id = z.string().uuid();

export async function renameConversation(convId: string, fd: FormData) {
  const title = z.string().trim().min(1).max(80).safeParse(fd.get("title"));
  if (!id.safeParse(convId).success || !title.success) return;
  const supabase = await createClient(); // RLS: only your own conversations can be changed
  await supabase.from("conversations").update({ title: title.data }).eq("id", convId);
  revalidatePath("/chat", "layout");
}

export async function deleteConversation(convId: string) {
  if (!id.safeParse(convId).success) return;
  const supabase = await createClient();
  await supabase.from("conversations").delete().eq("id", convId);
  redirect("/chat");
}
