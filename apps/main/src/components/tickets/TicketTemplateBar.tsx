// components/tickets/TicketTemplateBar.tsx
// Template message bar for ticket threads
// One-tap chips that insert (or send) standardized proof prompts

"use client";

import * as React from "react";
import { TICKET_TEMPLATES, TicketTemplate } from "@/components/tickets/ticketTemplates";
import { trackTicketEvent } from "@/lib/tickets/track";

function toneChip(tone?: TicketTemplate["tone"]) {
  switch (tone) {
    case "proof":
      return "PROOF";
    case "safety":
      return "SAFETY";
    case "details":
      return "DETAILS";
    case "close":
      return "CLOSE";
    default:
      return "TICKET";
  }
}

export function TicketTemplateBar({
  listingId,
  onInsert,
  onSendNow,
  disabled,
}: {
  listingId?: string | null;
  onInsert: (text: string) => void;
  onSendNow?: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border p-3 space-y-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="text-sm font-semibold">Ticket prompts</div>
        <div className="text-xs opacity-70">
          Proof first. Payment later. Keep it in-thread.
        </div>
      </div>

      {/* Template chips */}
      <div className="flex flex-wrap gap-2">
        {TICKET_TEMPLATES.map((t) => (
          <div key={t.id} className="flex items-center gap-1">
            {/* Insert button */}
            <button
              type="button"
              disabled={!!disabled}
              className="rounded-full border px-3 py-1 text-sm hover:bg-black/5 transition-colors disabled:opacity-50"
              onClick={() => {
                trackTicketEvent("ticket_template_insert", {
                  listing_id: listingId ?? null,
                  meta: { template_id: t.id, tone: t.tone } as any,
                });
                onInsert(t.message);
              }}
              title={t.message}
            >
              <span className="text-[10px] opacity-70 mr-2 uppercase">
                {toneChip(t.tone)}
              </span>
              {t.label}
            </button>

            {/* Optional send-now button */}
            {onSendNow ? (
              <button
                type="button"
                disabled={!!disabled}
                className="rounded-full border px-2 py-1 text-xs opacity-80 hover:bg-black/5 transition-colors disabled:opacity-50"
                onClick={() => {
                  trackTicketEvent("ticket_template_send", {
                    listing_id: listingId ?? null,
                    meta: { template_id: t.id, tone: t.tone } as any,
                  });
                  onSendNow(t.message);
                }}
                title="Send instantly"
              >
                Send
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
