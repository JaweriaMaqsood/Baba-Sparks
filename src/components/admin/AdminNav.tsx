"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["Overview", "/admin"], ["Payments", "/admin/payments"], ["Tickets", "/admin/tickets"], ["Users", "/admin/users"], ["Plans", "/admin/plans"], ["Settings", "/admin/settings"]];
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="-mt-4 mb-6 flex flex-wrap gap-2">
      {links.map(([l, h]) => {
        const active = h === "/admin" ? pathname === "/admin" : pathname.startsWith(h);
        return <Link key={h} href={h} aria-current={active ? "page" : undefined} className={`btn-ghost px-3 py-1.5 text-xs ${active ? "border-accent bg-card text-accent" : ""}`}>{l}</Link>;
      })}
    </nav>
  );
}
