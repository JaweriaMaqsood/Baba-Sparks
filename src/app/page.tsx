import Link from "next/link";
import { PenLine, MessageSquare, Languages, FileText, Image as Img, Share2, Search, BriefcaseBusiness, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { brand } from "@/config/brand";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { plans, faqs } from "@/config/content";

const tools = [
  { icon: MessageSquare, name: "AI chat", text: "Saved conversations with streaming replies and model choice." },
  { icon: PenLine, name: "Writing studio", text: "Blog posts, emails, essays, rewrites and grammar fixes." },
  { icon: Share2, name: "Social media", text: "Captions, scripts, hashtags and content calendars." },
  { icon: BriefcaseBusiness, name: "Business", text: "Names, slogans, ad copy, SWOT and plans." },
  { icon: Search, name: "SEO", text: "Titles, outlines, FAQs and schema markup." },
  { icon: Languages, name: "Translation", text: "Urdu, Arabic, Hindi, Punjabi and more, including right-to-left text." },
  { icon: FileText, name: "Documents", text: "Summarize PDFs, make quizzes, flashcards and study notes." },
  { icon: Img, name: "Images", text: "Generate images from a prompt once a provider is connected." },
];
const steps = [
  ["Pick a tool", "Choose from the directory or search by task."],
  ["Describe what you need", "Fill a short form. Each tool asks only what it needs."],
  ["Review and save", "Copy, download or save the result to a project."],
];

export default async function Home() {
  let loggedIn = false;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
  }
  const ctaHref = loggedIn ? "/dashboard" : "/register";
  const ctaText = loggedIn ? "Go to dashboard" : "Get started free";
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full bg-primary/20 blur-[120px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{brand.tagline}.</h1>
              <p className="mt-5 max-w-md text-lg text-muted">{brand.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={ctaHref} className="btn-primary">{ctaText}</Link>
                <a href="#tools" className="btn-ghost">Try AI tools</a>
              </div>
            </div>
            <div className="panel p-5 shadow-[0_30px_80px_-30px_rgba(139,92,246,.45)]" aria-label="Product preview">
              <div className="mb-4 flex items-center justify-between text-xs text-muted">
                <span>SEO meta description</span><span className="rounded-full border border-line px-2 py-0.5">Static preview</span>
              </div>
              <div className="rounded-xl bg-surface p-4 text-sm text-muted">Topic: handmade leather wallets for travelers</div>
              <div className="mt-3 rounded-xl border border-line p-4 text-sm">
                <p className="mb-2 text-xs text-accent">Example output</p>
                Slim handmade leather wallets built for travel. Hold cards, cash and a passport slip without the bulk.
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted"><span>Costs 1 credit</span><span className="btn-primary px-3 py-1.5 text-xs">Generate</span></div>
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="text-2xl font-semibold">Tools for everyday work</h2>
          <p className="mt-2 max-w-xl text-muted">Eight categories, each with focused tools that share the same credits. Image generation is coming soon.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map(({ icon: I, name, text }) => (
              <div key={name} className="panel p-5 transition-colors hover:border-primary/50">
                <I className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-3 font-medium">{name}</h3>
                {name === "Images" && <span className="mt-1 inline-block rounded-full border border-line px-2 py-0.5 text-xs text-muted">Coming soon</span>}
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
            {steps.map(([t, d], i) => (
              <div key={t}><span className="text-sm text-accent">Step {i + 1}</span><h3 className="mt-1 text-lg font-medium">{t}</h3><p className="mt-1 text-muted">{d}</p></div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="text-2xl font-semibold">Plans</h2>
          <p className="mt-2 text-muted">Prices are not set yet. They will be managed from the admin panel.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map(([n, d]) => (
              <div key={n} className="panel flex flex-col p-5">
                <h3 className="font-medium">{n}</h3><p className="mt-2 flex-1 text-sm text-muted">{d}</p>
                <Link href={ctaHref} className="btn-ghost mt-5"><Check className="h-4 w-4" aria-hidden />Choose {n}</Link>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-16">
          <h2 className="text-2xl font-semibold">Questions</h2>
          <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
            {faqs.map(([q, a]) => (
              <details key={q} className="group p-5"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-muted">{a}</p></details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="panel bg-gradient-to-br from-primary/25 to-card p-10 text-center">
            <h2 className="text-2xl font-semibold">Start with the free plan</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">Create an account and try a tool in a minute.</p>
            <Link href={ctaHref} className="btn-primary mt-6">{ctaText}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
