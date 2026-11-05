// Single source of truth for branding. Change the name here and it updates everywhere.
export const brand = {
  name: "Baba Spark",
  tagline: "One workspace for every AI task",
  description:
    "Write, chat, translate, summarize and create images from one dashboard. Pay with credits, only for what you use.",
  supportEmail: "support@example.com",
} as const;

export const nav = [
  { label: "Features", href: "/#features" },
  { label: "AI tools", href: "/#tools" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
] as const;
