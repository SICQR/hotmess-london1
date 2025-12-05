// app/tickets/ui/TicketsBrowseClient.tsx
// Client component for tickets browse page
// Handles tracking + rendering beacon cards

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { TicketCard } from "@/components/tickets/TicketCard";
import { trackTicketEvent } from "@/lib/tickets/track";
import { buildPath } from "@/lib/routes";

function fmt(dt?: string | null) {
  if (!dt) return "Date TBA";
  try {
    return new Date(dt).toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short"
    });
  } catch {
    return "Date TBA";
  }
}

export default function TicketsBrowseClient({ initial }: { initial: any[] }) {
  React.useEffect(() => {
    trackTicketEvent("tickets_browse_view", { meta: { count: initial.length } });
  }, [initial.length]);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-sm opacity-80">Tickets</div>
          <h1 className="text-3xl font-semibold">Beacons with live listings.</h1>
          <div className="text-sm opacity-80 mt-1">Keep it clean. Keep it moving.</div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link href={buildPath("map")}>
              <Map className="h-4 w-4 mr-2" />
              Open Map
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href={buildPath("myTickets")}>My Tickets</Link>
          </Button>
        </div>
      </header>

      {/* Sticky filter bar */}
      <form className="sticky top-3 z-40 rounded-2xl border bg-white/90 backdrop-blur p-3 grid md:grid-cols-4 gap-2 shadow-sm">
        <input
          name="q"
          className="rounded-2xl border px-3 py-2 text-sm"
          placeholder="Search event / promoter…"
        />
        <input
          name="city"
          className="rounded-2xl border px-3 py-2 text-sm"
          placeholder="City…"
        />
        <select name="sort" className="rounded-2xl border px-3 py-2 text-sm">
          <option value="recent">Most recent</option>
          <option value="soon">Soonest</option>
        </select>
        <Button type="submit" className="rounded-2xl">
          Filter
        </Button>
      </form>

      {/* Beacon grid */}
      <section className="grid md:grid-cols-3 gap-3">
        {initial.map((b: any) => (
          <Link
            key={b.id}
            href={`/tickets/${b.id}`}
            onClick={() => trackTicketEvent("ticket_beacon_click", { beacon_id: b.id })}
          >
            <TicketCard
              title={b.title}
              subtitle={`${b.city || "—"} • ${fmt(b.starts_at)}`}
              right={
                <span className="text-[11px] rounded-full border px-2 py-1 tracking-wide uppercase">
                  TICKET BEACON
                </span>
              }
              footer="Listings are moderated. Proof happens in-thread."
            />
          </Link>
        ))}

        {/* Empty state */}
        {initial.length === 0 && (
          <div className="md:col-span-3 rounded-3xl border p-6 space-y-3">
            <div className="font-semibold">Nothing live right now</div>
            <div className="text-sm opacity-80">
              Hit the map, or check back later.
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/map">
                  <Map className="h-4 w-4 mr-2" />
                  Open Map
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/care">Care</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}