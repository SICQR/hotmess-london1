// components/Thread.tsx
// Unified Thread component for Connect + Tickets with Realtime + Optimistic UI

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, HeartHandshake } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useThreadMessages } from "@/lib/realtime/useThreadMessages";
import { useThreadStatus } from "@/lib/realtime/useThreadStatus";
import { ThreadSafetyMenu } from "@/components/ThreadSafetyMenu";
import { TicketTemplateBar } from "@/components/tickets/TicketTemplateBar";
import { TicketThreadHeader } from "@/components/tickets/TicketThreadHeader";
import { ProofUploadQuickflow } from "@/components/tickets/ProofUploadQuickflow";
import { AttachmentViewer } from "@/components/tickets/AttachmentViewer";
import { trackTicketEvent } from "@/lib/tickets/track";
import { buildPath } from "@/lib/routes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Mode = "connect" | "tickets";

type Props = {
  mode: Mode;
  threadId: string;
  sendEndpoint: string; // "/api/connect/thread/send" | "/api/tickets/thread/send"
};

const COPY: Record<Mode, { title: string; sub: string; reportMode: string }> = {
  connect: {
    title: "Connect Thread",
    sub: "Mutual opt-in only. If it's not a yes, it's a no.",
    reportMode: "connect",
  },
  tickets: {
    title: "Ticket messages",
    sub: "Verify details. Report anything off.",
    reportMode: "tickets",
  },
};

/**
 * Map backend error codes to user-friendly messages
 */
function mapSendError(raw: string) {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("rate_limited")) return "Slow down. Try again in a moment.";
  if (msg.includes("not_authenticated") || msg === "auth") return "Sign in to continue.";
  if (msg.includes("age18_required")) return "You must confirm you're 18+ to continue.";
  if (msg.includes("consent_required")) return "Consent is required to continue.";
  if (msg.includes("premium_required")) return "Premium unlocks this action.";
  if (msg.includes("beacon_expired") || msg.includes("beacon_not_live")) return "This beacon has burned out.";
  if (msg.includes("not_thread_member")) return "You no longer have access to this thread.";
  if (msg.includes("cooldown_active")) return "You're temporarily restricted from messaging.";
  if (msg.includes("thread_muted")) return "You've muted this thread. Unmute to continue.";
  if (msg.includes("blocked")) return "This action is unavailable.";
  return raw || "Not sent.";
}

export default function Thread({ mode, threadId, sendEndpoint }: Props) {
  const router = {
    push: (href: string) => window.location.assign(href),
    refresh: () => window.location.reload(),
  };
  const searchParams = new URLSearchParams(window.location.search);
  const copy = COPY[mode];

  const [me, setMe] = React.useState<string | null>(null);
  const [otherUserId, setOtherUserId] = React.useState<string | null>(null);
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  const table = mode === "connect" ? "connect_messages" : "ticket_messages";
  const { messages, subscribed, addOptimistic, markFailed } = useThreadMessages({ table, threadId });
  const { locked } = useThreadStatus(mode, threadId);

  // Ticket-specific: load listing context if listingId is present
  const listingId = searchParams.get("listingId");
  const [ticketListing, setTicketListing] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (!listingId || mode !== "tickets") return;

    (async () => {
      try {
        const r = await fetch(`/api/tickets/listing/${encodeURIComponent(listingId)}`);
        const j = await r.json();
        if (j.ok) setTicketListing(j.listing);
      } catch {
        // Silently fail - listing context is optional
      }
    })();
  }, [listingId, mode]);

  // Get current user
  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMe(data.user?.id ?? null);
    })();
  }, []);

  // Get other user from thread
  React.useEffect(() => {
    (async () => {
      if (!me) return;

      const threadTable = mode === "connect" ? "connect_thread_members" : "ticket_thread_members";
      
      const { data } = await supabase
        .from(threadTable)
        .select("user_id")
        .eq("thread_id", threadId)
        .neq("user_id", me)
        .single();

      if (data) {
        setOtherUserId(data.user_id);
      }
    })();
  }, [me, threadId, mode]);

  // Auto-scroll to bottom when messages change
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  /**
   * POST message to backend endpoint
   */
  async function postSend(threadIdToSend: string, text: string) {
    const r = await fetch(sendEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ threadId: threadIdToSend, body: text }),
    });

    let j: any = null;
    try {
      j = await r.json();
    } catch {
      // ignore parse errors
    }

    if (!r.ok || !j?.ok) {
      const raw = j?.error ? String(j.error) : `HTTP_${r.status}`;
      throw new Error(raw);
    }
  }

  /**
   * Send message with optimistic UI
   */
  async function send(text: string) {
    const clean = text.trim();
    if (!clean || !me || sending || locked) return;

    setError(null);
    setSending(true);

    // Add optimistic message instantly
    const optimisticId = addOptimistic(me, clean);
    setBody("");

    try {
      await postSend(threadId, clean);
      // Realtime insert will reconcile; no need to do anything here.
    } catch (e: any) {
      markFailed(optimisticId);
      setError(mapSendError(String(e?.message ?? e)));
    } finally {
      setSending(false);
    }
  }

  /**
   * Retry sending a failed message
   */
  async function retry(text: string) {
    const clean = text.trim();
    if (!clean || !me || sending || locked) return;

    setError(null);
    setSending(true);

    // Keep failed bubble as history; create a new optimistic bubble for retry.
    const optimisticId = addOptimistic(me, clean);

    try {
      await postSend(threadId, clean);
    } catch (e: any) {
      markFailed(optimisticId);
      setError(mapSendError(String(e?.message ?? e)));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <div className="text-sm opacity-80 mt-1">{copy.sub}</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs opacity-70">{subscribed ? "Live" : "…"}</div>
          
          {/* Safety Menu */}
          <ThreadSafetyMenu
            threadType={mode}
            threadId={threadId}
            otherUserId={otherUserId || undefined}
          />

          <Button variant="secondary" className="rounded-2xl" onClick={() => router.push("/map")}>
            Map
          </Button>
          
          {/* Add My Tickets link for ticket threads */}
          {mode === "tickets" && (
            <Button variant="outline" className="rounded-2xl" onClick={() => router.push(buildPath("myTickets"))}>
              My Tickets
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
          {error}
        </div>
      )}

      {/* Thread closed banner */}
      {locked && (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-3 text-sm">
          <div className="font-semibold">Thread closed.</div>
          <div className="opacity-80 mt-1">You can still read the thread.</div>
        </div>
      )}

      <Separator />

      {/* Ticket Context Header (if listingId present) */}
      {ticketListing && mode === "tickets" && (
        <TicketThreadHeader listing={ticketListing} />
      )}

      {/* Ticket Template Bar (if listingId present) */}
      {ticketListing && mode === "tickets" && (
        <TicketTemplateBar
          listingId={listingId}
          disabled={!me || sending || locked}
          onInsert={(text) => {
            // Insert template into composer (append if existing text)
            setBody((prev) => (prev?.trim() ? `${prev}\n\n${text}` : text));
          }}
          onSendNow={(text) => {
            // Send template immediately
            trackTicketEvent("ticket_template_send_now", {
              listing_id: listingId,
            });
            send(text);
          }}
        />
      )}

      {/* Proof Upload Quickflow (if listingId present) */}
      {ticketListing && mode === "tickets" && (
        <ProofUploadQuickflow
          threadId={threadId}
          threadType={mode}
          listingId={listingId}
          disabled={!me || sending || locked}
          onDone={() => {
            // Realtime will pick up the new message automatically
            // Scroll to bottom to show new proof message
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      )}

      {/* Messages */}
      <div className="space-y-2 rounded-2xl border p-4 min-h-[260px] max-h-[58vh] overflow-auto">
        {messages.length === 0 ? (
          <div className="text-sm opacity-70 text-center py-12">
            Start the conversation.
          </div>
        ) : (
          messages.map((m) => {
            const mine = me && m.sender_user_id === me;
            const failed = m.state === "failed";
            const pending = m.state === "pending";

            return (
              <div key={m.uiId} className={`text-sm ${mine ? "text-right" : "text-left"}`}>
                <div className="opacity-70 text-xs">
                  {new Date(m.created_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {pending ? " • Sending…" : ""}
                </div>

                <div
                  className={[
                    "mt-1 inline-block rounded-2xl border px-3 py-2 max-w-[80%]",
                    failed ? "opacity-70 border-red-500/30" : "",
                    mine ? "bg-black/5" : "",
                  ].join(" ")}
                >
                  {m.body}
                </div>

                {failed && (
                  <div className="mt-1">
                    <button
                      className="text-xs underline underline-offset-4 opacity-80 hover:opacity-100"
                      onClick={() => retry(m.body)}
                      disabled={locked || sending}
                    >
                      Not sent. Tap to retry.
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-2xl border px-3 py-2 text-sm disabled:opacity-50"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={locked ? "Thread closed" : "Write a message…"}
          disabled={!me || sending || locked}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(body);
            }
          }}
        />
        <Button 
          className="rounded-2xl" 
          onClick={() => send(body)} 
          disabled={!me || sending || locked || !body.trim()}
        >
          {sending ? "Sending…" : "Send"}
        </Button>
      </div>

      {/* Footer */}
      <Separator />

      <div className="flex items-center justify-between text-sm">
        <button
          className="flex items-center gap-2 opacity-80 hover:opacity-100 underline underline-offset-4"
          onClick={() => router.push("/care")}
        >
          <HeartHandshake className="h-4 w-4" /> Care
        </button>
        <button
          className="flex items-center gap-2 opacity-80 hover:opacity-100 underline underline-offset-4"
          onClick={() => router.push(`/report?thread=${threadId}&mode=${copy.reportMode}`)}
        >
          <ShieldAlert className="h-4 w-4" /> Report
        </button>
      </div>
    </main>
  );
}