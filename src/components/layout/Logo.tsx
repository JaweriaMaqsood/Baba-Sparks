import { brand } from "@/config/brand";
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
        <path d="M16 2l12 7v14l-12 7L4 23V9z" fill="none" stroke="url(#lg)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 9v11" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round"/>
        <circle cx="19.5" cy="12.5" r="2.2" fill="#22D3EE"/>
      </svg>
      <span>{brand.name}</span>
    </span>
  );
}
