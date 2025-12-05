// components/tickets/TicketCard.tsx
// Ticket-style card with perforation edge
// Gives tickets module a distinct visual identity

import * as React from "react";

export function TicketCard({
  title,
  subtitle,
  right,
  footer,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border overflow-hidden bg-white hover:bg-black/[0.02] transition-colors">
      {/* Perforation edge - ticket aesthetic */}
      <div className="h-3 border-b bg-black/[0.02] relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-40">
          <span className="w-2 h-2 rounded-full border bg-white" />
          <span className="w-2 h-2 rounded-full border bg-white" />
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{title}</div>
            {subtitle ? (
              <div className="text-sm opacity-80 mt-1">{subtitle}</div>
            ) : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>

        {children ? <div className="pt-1">{children}</div> : null}
      </div>

      {/* Footer (safety/helper text) */}
      {footer ? (
        <div className="px-4 py-3 border-t bg-black/[0.02] text-xs opacity-80">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
