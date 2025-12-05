// components/records/StickyCtaBar.tsx
// Sticky CTA bar that appears on scroll (mobile-first)

"use client";

import * as React from "react";

export function StickyCtaBar({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  status,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  status?: string;
}) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-white/90 backdrop-blur p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs opacity-70">
            {status ?? "HQ hits different."}
          </div>
          <div className="text-sm font-semibold truncate">
            Preview here. Own it here.
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {secondaryLabel && onSecondary && (
            <button
              className="rounded-2xl border px-3 py-2 text-sm"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          )}
          <button
            className="rounded-2xl border px-4 py-2 text-sm font-semibold"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
