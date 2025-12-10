// components/tickets/StatusChip.tsx
// Ticket listing status chip
// Used in listing cards across browse/beacon/detail pages

export function StatusChip({ status }: { status: string }) {
  const s = String(status || "").toUpperCase();
  const label = ["LIVE", "PENDING", "REMOVED", "EXPIRED"].includes(s) ? s : "LIVE";
  
  return (
    <span className="text-[11px] rounded-full border px-2 py-1 tracking-wide uppercase">
      {label}
    </span>
  );
}
