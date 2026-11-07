import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Every admin page and every admin action calls this first. The role is read from the database on the server.
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data } = await admin.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role !== "admin") notFound();
  return { user, admin };
}
