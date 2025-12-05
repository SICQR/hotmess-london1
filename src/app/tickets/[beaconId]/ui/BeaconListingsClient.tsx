// app/tickets/[beaconId]/ui/BeaconListingsClient.tsx
// Client component for beacon's listings grid
// Handles tracking + rendering listing cards with safety footer

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketCard } from "@/components/tickets/TicketCard";
import { StatusChip } from "@/components/tickets/StatusChip";
import { trackTicketEvent } from "@/lib/tickets/track";
import { buildPath } from "@/lib/routes";

export default function BeaconListingsClient({
  beaconId,
  listings,
}: {
  beaconId: string;
  listings: any[];
}) {
  React.useEffect(() => {
    trackTicketEvent("ticket_beacon_view", {
      beacon_id: beaconId,
      meta: { listings: listings.length },
    });
  }, [beaconId, listings.length]);

  return (
    <>
      {/* Listings section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Listings</h2>
          <Badge variant="outline" className="rounded-full">
            {listings.length} live
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {listings.map((x: any) => (
            <Link
              key={x.id}
              href={`/tickets/listing/${x.id}`}
              onClick={() =>
                trackTicketEvent("ticket_listing_click", {
                  beacon_id: beaconId,
                  listing_id: x.id,
                })
              }
            >
              <TicketCard
                title={x.title || "Ticket"}
                subtitle={`£${(Number(x.price_cents || 0) / 100).toFixed(2)} • Qty ${
                  x.quantity ?? 1
                }`}
                right={x.status ? <StatusChip status={x.status} /> : null}
                footer="Never pay off-platform. If proof is refused: walk."
              >
                {x.notes && (
                  <div className="text-xs opacity-70 line-clamp-2">{x.notes}</div>
                )}
              </TicketCard>
            </Link>
          ))}

          {/* Empty state */}
          {listings.length === 0 && (
            <div className="md:col-span-2 rounded-3xl border p-6 space-y-2">
              <div className="font-semibold">No listings yet</div>
              <div className="text-sm opacity-80">
                If you&apos;re selling, create the first one above.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Safety footer */}
      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-4 text-sm">
        <div className="font-semibold mb-2">Keep it clean</div>
        <div className="opacity-90">
          Proof happens in-thread. Don&apos;t deal off-platform. If anything feels off:
          report and disengage.
        </div>
      </div>

      {/* Cross-links */}
      <section className="rounded-3xl border p-4 flex flex-wrap gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("myTickets")}>My Tickets</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("care")}>Care</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("beacons")}>About Beacons</Link>
        </Button>
      </section>
    </>
  );
}