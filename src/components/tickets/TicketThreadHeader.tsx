// components/tickets/TicketThreadHeader.tsx
// Ticket context header shown at top of ticket threads
// Shows listing details + links back to beacon/listing pages

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, ExternalLink } from "lucide-react";

export function TicketThreadHeader({ listing }: { listing: any }) {
  if (!listing) return null;

  const price = `£${(Number(listing.price_cents || 0) / 100).toFixed(2)}`;

  return (
    <div className="rounded-3xl border p-4 bg-black/[0.02] space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs opacity-70 flex items-center gap-1">
            <Ticket className="h-3 w-3" />
            Ticket thread
          </div>
          <div className="font-semibold truncate mt-1">
            {listing.title || "Ticket"} • {price} • Qty {listing.quantity ?? 1}
          </div>
          <div className="text-xs opacity-70 mt-2">
            Proof happens in-thread. Never pay off-platform.
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-2xl">
            <Link href={`/tickets/${listing.beacon_id}`}>
              Beacon
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-2xl">
            <Link href={`/tickets/listing/${listing.id}`}>
              Listing
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
