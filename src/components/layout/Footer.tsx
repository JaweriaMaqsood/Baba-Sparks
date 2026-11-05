import Link from "next/link";
import { Logo } from "./Logo";
import { brand } from "@/config/brand";
const links = [["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Refund Policy","/refund"],["Contact","/contact"]];
export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div><Logo /><p className="mt-2 max-w-xs text-sm text-muted">{brand.tagline}</p></div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Footer">
          {links.map(([l, h]) => <Link key={h} href={h} className="hover:text-ink">{l}</Link>)}
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
    </footer>
  );
}
