import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/brand";
import { NavProgress } from "@/components/layout/NavProgress";

export const metadata: Metadata = {
  title: { default: `${brand.name} · ${brand.tagline}`, template: `%s · ${brand.name}` },
  description: brand.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><NavProgress />{children}</body></html>);
}
