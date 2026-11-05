"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/config/brand";
import { signOut } from "@/lib/auth/actions";

export function NavbarView({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Home"><Logo /></Link>
        <nav className="hidden gap-8 text-sm text-muted md:flex" aria-label="Main">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-ink">{n.label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="btn-primary">Dashboard</Link>
              <form action={signOut}><button className="btn-ghost">Log out</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary">Get started free</Link>
            </>
          )}
        </div>
        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-line bg-surface px-5 py-4 md:hidden">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2 text-muted">{n.label}</a>)}
          <div className="flex gap-3 pt-3">
            {loggedIn ? (
              <>
                <Link href="/dashboard" className="btn-primary flex-1">Dashboard</Link>
                <form action={signOut} className="flex-1"><button className="btn-ghost w-full">Log out</button></form>
              </>
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
