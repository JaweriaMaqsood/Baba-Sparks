import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export function PageShell({ title, intro, children, narrow }: { title: string; intro?: string; children?: React.ReactNode; narrow?: boolean }) {
  return (
    <>
      <Navbar />
      <main className={`mx-auto px-5 py-16 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}
