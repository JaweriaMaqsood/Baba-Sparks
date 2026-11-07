export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}
