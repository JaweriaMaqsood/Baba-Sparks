"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const guard = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (tick.current) clearInterval(tick.current);
    if (guard.current) clearTimeout(guard.current);
    tick.current = guard.current = null;
  };
  const finish = () => {
    clearTimers();
    if (!active.current) return;
    active.current = false;
    setWidth(100);
    setTimeout(() => { setVisible(false); setWidth(0); }, 250);
  };

  // a new page has arrived
  useEffect(() => { finish(); }, [pathname, search]); // eslint-disable-line react-hooks/exhaustive-deps

  // a link was clicked
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      clearTimers();
      active.current = true;
      setVisible(true);
      setWidth(12);
      tick.current = setInterval(() => setWidth((w) => (w < 90 ? w + (90 - w) * 0.15 : w)), 200);
      guard.current = setTimeout(finish, 10_000); // never get stuck
    }
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); clearTimers(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 h-[3px] bg-gradient-to-r from-primary to-accent transition-[width,opacity] duration-200"
      style={{ width: `${width}%`, opacity: visible ? 1 : 0 }} />
  );
}

export function NavProgress() { return <Suspense fallback={null}><Bar /></Suspense>; }
