// app/tickets/listing/[listingId]/page.tsx
// Single ticket listing detail page
// Shows full listing details + message seller + report actions

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ticketGetListing } from "@/lib/tickets/rpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket, MapPin, Calendar, AlertTriangle } from "lucide-react";
import ListingActions from "./ui/ListingActions";
import { buildPath } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ 
  params 
}: { 
  params: { listingId: string } 
}) {
  const listing = await ticketGetListing(supabase as any, params.listingId).catch(() => null);

  if (!listing) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-3xl border p-6 space-y-3">
          <div className="font-semibold">Listing not found</div>
          <div className="text-sm opacity-80">
            It may have been removed by moderation or the seller.
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/tickets">Back to Tickets</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Fetch beacon details to show event context
  const { data: beacon } = await supabase
    .from("beacons")
    .select("id,title,city,starts_at")
    .eq("id", listing.beacon_id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="space-y-2">
          <div className="text-sm opacity-80 flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Listing
            {listing.status && listing.status !== "live" && (
              <Badge variant="outline" className="rounded-full">
                {listing.status}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold">
            {listing.title || "Ticket"}
          </h1>
          <div className="text-2xl font-bold text-hot">
            £{(Number(listing.price_cents || 0) / 100).toFixed(2)}
          </div>
          <div className="text-sm opacity-80">
            Quantity: {listing.quantity ?? 1}
          </div>
        </div>

        <Button asChild variant="outline" className="rounded-2xl">
          <Link href={`/tickets/${listing.beacon_id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </header>

      {/* Event Context */}
      {beacon && (
        <section className="rounded-3xl border p-4 space-y-2">
          <div className="text-xs opacity-70">Event</div>
          <div className="font-semibold">{beacon.title}</div>
          <div className="flex flex-wrap gap-3 text-sm opacity-80">
            {beacon.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {beacon.city}
              </div>
            )}
            {beacon.starts_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(beacon.starts_at).toLocaleString("en-GB", {
                  dateStyle: "short",
                  timeStyle: "short"
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Listing Details */}
      <section className="rounded-3xl border p-4 space-y-3">
        <div className="font-semibold">Details</div>
        {listing.notes ? (
          <div className="text-sm opacity-90 whitespace-pre-wrap">
            {listing.notes}
          </div>
        ) : (
          <div className="text-sm opacity-80">
            No extra notes provided.
          </div>
        )}
      </section>

      {/* Actions (Message Seller + Report) - pass beaconId for tracking */}
      <ListingActions listingId={params.listingId} beaconId={listing.beacon_id} />

      {/* Footer cross-links */}
      <section className="rounded-3xl border p-4 flex flex-wrap gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("care")}>Care</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("map")}>Map</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("myTickets")}>My Tickets</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link href={buildPath("legal")}>Legal</Link>
        </Button>
      </section>
    </main>
  );
}