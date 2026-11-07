import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey, supabaseConfigured } from "@/lib/supabase/env";

const PROTECTED = ["/dashboard", "/tools/", "/chat", "/history", "/usage"];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  if (!supabaseConfigured) return res;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser(); // verifies the session with Supabase

  if (!user && PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
