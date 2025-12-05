// app/tickets/[beaconId]/ui/CreateListingCard.tsx
// Client component for creating a new ticket listing
// Used on beacon page by sellers

"use client";

import * as React from "react";
import { createTicketListingAction } from "@/app/tickets/actions";
import { trackTicketEvent } from "@/lib/tickets/track";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateListingCard({ beaconId }: { beaconId: string }) {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [qty, setQty] = React.useState("1");
  const [notes, setNotes] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Track when user starts filling the form
  const hasTrackedStart = React.useRef(false);
  React.useEffect(() => {
    if (!hasTrackedStart.current && (title || price || notes)) {
      trackTicketEvent("ticket_create_listing_start", { beacon_id: beaconId });
      hasTrackedStart.current = true;
    }
  }, [title, price, notes, beaconId]);

  async function submit() {
    setBusy(true);
    setMsg(null);
    
    const res = await createTicketListingAction({
      beaconId,
      title,
      pricePounds: price,
      quantity: qty,
      notes,
    });
    
    setBusy(false);

    if (!res.ok) {
      return setMsg({ 
        type: "error", 
        text: res.error || "Couldn't create listing." 
      });
    }
    
    // Track successful creation
    trackTicketEvent("ticket_create_listing_success", { beacon_id: beaconId });
    
    setMsg({ 
      type: "success", 
      text: "Listing created. If moderation is enabled, it may appear after approval." 
    });
    
    // Reset form
    setTitle("");
    setPrice("");
    setQty("1");
    setNotes("");
    hasTrackedStart.current = false;
  }

  return (
    <section className="rounded-3xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create listing
          </div>
          <div className="text-sm opacity-80">
            Sell clean. Proof happens in-thread.
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
        <input
          className="md:col-span-2 rounded-2xl border px-3 py-2 text-sm"
          placeholder="Title (optional, e.g. 1x entry before midnight)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={busy}
        />
        <input
          className="rounded-2xl border px-3 py-2 text-sm"
          placeholder="Price £ (e.g. 25)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={busy}
        />
        <input
          className="rounded-2xl border px-3 py-2 text-sm"
          placeholder="Qty (1–10)"
          type="number"
          min="1"
          max="10"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          disabled={busy}
        />
      </div>

      <textarea
        className="w-full rounded-2xl border px-3 py-2 min-h-[90px] text-sm"
        placeholder="Notes (optional) — include what proof you can provide."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={busy}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Button 
          className="rounded-2xl" 
          onClick={submit} 
          disabled={busy || !price.trim()}
        >
          {busy ? "Creating…" : "Create Listing"}
        </Button>
        <div className="text-xs opacity-70">
          18+ only. Don&apos;t deal off-platform.
        </div>
      </div>

      {msg && (
        <Alert className={msg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}>
          <AlertDescription className="flex items-center gap-2">
            {msg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {msg.text}
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}