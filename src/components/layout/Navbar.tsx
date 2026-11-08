import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { NavbarView } from "./NavbarView";

export async function Navbar() {
  let loggedIn = false;
  let isAdmin = false;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
    if (user) {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      isAdmin = data?.role === "admin";
    }
  }
  return <NavbarView loggedIn={loggedIn} isAdmin={isAdmin} />;
}
