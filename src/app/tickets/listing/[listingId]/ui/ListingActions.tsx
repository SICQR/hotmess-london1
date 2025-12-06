// app/tickets/listing/[listingId]/ui/ListingActions.tsx
// Client component for listing actions
// Message seller + Report listing with confirm step + tracking

"use client";

import * as React from "react";
import { openTicketThreadAction, reportTicketListingAction } from "@/app/tickets/actions";
import { trackTicketEvent } from "@/lib/tickets/track";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessagesSquare, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ListingActions({
  listingId,
  beaconId,
}: {
  listingId: string;
  beaconId?: string;
}) {
  const [busy, setBusy] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showReport, setShowReport] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);

  // Track listing view
  React.useEffect(() => {
    trackTicketEvent("ticket_listing_view", {
      listing_id: listingId,
      beacon_id: beaconId,
    });
  }, [listingId, beaconId]);

  async function messageSeller() {
    trackTicketEvent("ticket_message_seller_click", {
      listing_id: listingId,
      beacon_id: beaconId,
    });

    setBusy("Opening thread…");
    setMsg(null);

    try {
      // Server action will redirect to thread page
      await openTicketThreadAction(listingId);
    } catch (e: any) {
      setMsg({
        type: "error",
        text: e?.message || "Couldn't open thread.",
      });
      setBusy(null);
    }
  }

  async function report() {
    if (!reason.trim()) {
      return setMsg({ type: "error", text: "Pick a reason." });
    }

    setBusy("Reporting…");
    setMsg(null);

    trackTicketEvent("ticket_report_submit", {
      listing_id: listingId,
      beacon_id: beaconId,
      meta: { reason },
    });

    const res = await reportTicketListingAction({
      listingId,
      reason,
      details,
    });

    setBusy(null);

    if (!res.ok) {
      return setMsg({
        type: "error",
        text: res.error || "Report failed.",
      });
    }

    setMsg({
      type: "success",
      text: "Reported. Moderation will review it.",
    });

    // Reset form
    setReason("");
    setDetails("");
    setConfirm(false);
    setShowReport(false);
  }

  return (
    <section className="space-y-3">
      {/* Message Seller */}
      <div className="rounded-3xl border p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-semibold">Message Seller</div>
            <div className="text-sm opacity-80">
              Keep the deal inside the thread.
            </div>
          </div>

          <Button
            className="rounded-2xl"
            onClick={messageSeller}
            disabled={!!busy}
            size="lg"
          >
            {busy === "Opening thread…" ? (
              busy
            ) : (
              <>
                <MessagesSquare className="h-4 w-4 mr-2" />
                Message Seller
              </>
            )}
          </Button>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-3 text-xs">
          <div className="font-semibold mb-1">Ask for proof first</div>
          <div className="opacity-90">
            If it&apos;s not clean, it&apos;s not happening.
          </div>
        </div>
      </div>

      {/* Report Listing */}
      <div className="rounded-3xl border p-4 space-y-3">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowReport(!showReport)}
        >
          <div className="flex items-center gap-2 text-left">
            <ShieldAlert className="h-4 w-4" />
            <div>
              <div className="font-semibold text-sm">Report listing</div>
              <div className="text-xs opacity-80">
                See something off? Let us know.
              </div>
            </div>
          </div>
          {showReport ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showReport && (
          <div className="space-y-2 pt-2">
            <div className="text-xs opacity-70">
              If proof is refused, if payment is pushed off-platform, or if you&apos;re
              harassed — report it.
            </div>

            <select
              className="w-full rounded-2xl border px-3 py-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Pick a reason…</option>
              <option value="scam_suspected">Scam suspected</option>
              <option value="fake_proof">Fake / refusing proof</option>
              <option value="price_gouging">Severe price gouging</option>
              <option value="harassment">Harassment</option>
              <option value="off_platform">Pushing off-platform payment</option>
              <option value="spam">Spam / duplicate listing</option>
              <option value="other">Other</option>
            </select>

            <textarea
              className="w-full rounded-2xl border px-3 py-2 min-h-[80px] text-sm"
              placeholder="Optional details (keep it factual)."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            {!confirm ? (
              <Button
                variant="outline"
                className="rounded-2xl w-full"
                onClick={() => setConfirm(true)}
                disabled={!reason || !!busy}
              >
                Continue
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-2xl flex-1"
                  onClick={report}
                  disabled={!!busy}
                >
                  {busy === "Reporting…" ? busy : "Confirm report"}
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-2xl"
                  onClick={() => setConfirm(false)}
                  disabled={!!busy}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="text-xs opacity-70 text-center">
              Reports are reviewed by moderation. Abuse of reporting can trigger cooldowns.
            </div>
          </div>
        )}
      </div>

      {/* Feedback Message */}
      {msg && (
        <Alert
          className={
            msg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""
          }
        >
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
