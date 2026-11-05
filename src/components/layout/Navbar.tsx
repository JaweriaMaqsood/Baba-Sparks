import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { NavbarView } from "./NavbarView";

export async function Navbar() {
  let loggedIn = false;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
  }
  return <NavbarView loggedIn={loggedIn} />;
}
