// app/tickets/[beaconId]/page.tsx
// Listings for a specific ticket beacon
// Shows all live listings + create listing form

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ticketListListings } from "@/lib/tickets/rpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, ArrowLeft, Ticket } from "lucide-react";
import CreateListingCard from "./ui/CreateListingCard";
import BeaconListingsClient from "./ui/BeaconListingsClient";

export const dynamic = "force-dynamic";

export default async function BeaconTicketsPage({ 
  params 
}: { 
  params: { beaconId: string } 
}) {
  // Fetch beacon details
  const { data: beacon } = await supabase
    .from("beacons")
    .select("id,title,city,starts_at,ends_at,expires_at,is_active")
    .eq("id", params.beaconId)
    .maybeSingle();

  if (!beacon) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-3xl border p-6 space-y-3">
          <div className="font-semibold">Beacon not found</div>
          <div className="text-sm opacity-80">
            This beacon may have expired or been removed.
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/tickets">Back to Tickets</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Fetch listings for this beacon
  const listings = await ticketListListings(supabase as any, params.beaconId).catch(() => []);
  
  const isExpired = beacon.expires_at && new Date(beacon.expires_at) < new Date();
  const liveListings = listings?.filter((l: any) => l.status === "live") || [];

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-sm opacity-80 flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Ticket Beacon
            {isExpired && (
              <Badge variant="destructive" className="rounded-full">
                Expired
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold">{beacon.title}</h1>
          <div className="text-sm opacity-80 mt-1">
            {beacon.city || "—"} • {beacon.starts_at ? new Date(beacon.starts_at).toLocaleString("en-GB", {
              dateStyle: "short",
              timeStyle: "short"
            }) : "Date TBA"}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/tickets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link href={`/map?focus=${params.beaconId}`}>
              <Map className="h-4 w-4 mr-2" />
              Map
            </Link>
          </Button>
        </div>
      </header>

      {/* Microcopy */}
      <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-3 text-sm">
        <div className="opacity-90">
          Listings linked to this beacon. Proof happens in-thread.
        </div>
      </div>

      {/* Create Listing Form */}
      {!isExpired && <CreateListingCard beaconId={params.beaconId} />}

      {/* Listings Grid (client component with tracking) */}
      <BeaconListingsClient beaconId={params.beaconId} listings={liveListings} />
    </main>
  );
}