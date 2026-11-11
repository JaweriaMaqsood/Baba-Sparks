"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/config/brand";
import { signOut } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

const appLinks = [
  { label: "Dashboard", href: "/dashboard", also: ["/tools/"] },
  { label: "AI chat", href: "/chat", also: [] as string[] },
  { label: "History", href: "/history", also: [] as string[] },
  { label: "Usage", href: "/usage", also: [] as string[] },
  { label: "Billing", href: "/billing", also: [] as string[] },
  { label: "Support", href: "/support", also: [] as string[] },
  { label: "Settings", href: "/settings", also: [] as string[] },
];

export function NavbarView({ loggedIn, isAdmin }: { loggedIn: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = loggedIn ? [...appLinks, ...(isAdmin ? [{ label: "Admin", href: "/admin", also: [] as string[] }] : [])] : [];
  const isActive = (l: { href: string; also: string[] }) => pathname === l.href || pathname.startsWith(l.href + "/") || l.also.some((a) => pathname.startsWith(a));
  const cls = (active: boolean) => `rounded-lg px-3 py-1.5 text-sm transition-colors ${active ? "bg-card text-ink shadow-[inset_0_-2px_0_#22D3EE]" : "text-muted hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href={loggedIn ? "/dashboard" : "/"} aria-label="Home"><Logo /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {loggedIn
            ? links.map((l) => <Link key={l.href} href={l.href} aria-current={isActive(l) ? "page" : undefined} className={cls(isActive(l))}>{l.label}</Link>)
            : nav.map((n) => <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined} className={cls(pathname === n.href)}>{n.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {loggedIn ? (
            <form action={signOut}><SubmitButton className="btn-ghost" pendingText="Logging out…">Log out</SubmitButton></form>
          ) : (
            <>
              <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={pathname === "/login" ? "btn-ghost bg-card" : "btn-ghost"}>Log in</Link>
              <Link href="/register" aria-current={pathname === "/register" ? "page" : undefined} className="btn-primary">Get started free</Link>
            </>
          )}
        </div>
        <button className="lg:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-line bg-surface px-5 py-4 lg:hidden">
          {loggedIn
            ? links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={isActive(l) ? "page" : undefined} className={`block ${cls(isActive(l))}`}>{l.label}</Link>)
            : nav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={pathname === n.href ? "page" : undefined} className={`block ${cls(pathname === n.href)}`}>{n.label}</Link>)}
          <div className="flex gap-3 pt-3">
            {loggedIn ? (
              <form action={signOut} className="flex-1"><SubmitButton className="btn-ghost w-full" pendingText="Logging out…">Log out</SubmitButton></form>
            ) : (
              <>
                <Link href="/login" className="btn-ghost flex-1">Log in</Link>
                <Link href="/register" className="btn-primary flex-1">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
