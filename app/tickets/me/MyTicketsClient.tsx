// app/tickets/me/MyTicketsClient.tsx
// My Tickets: Seller dashboard client component

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldAlert, 
  HeartHandshake, 
  Ticket, 
  MessagesSquare, 
  Sparkles,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

type Listing = {
  listingId: string;
  beaconId: string;
  status: "live" | "pending" | "removed" | string;
  eventName: string;
  eventStartsAt?: string | null;
  venue?: string | null;
  city?: string | null;
  quantity: number;
  priceCents: number;
  currency: string;
  createdAt: string;
  isRemoved?: boolean;
  removedReason?: string | null;
  removedAt?: string | null;
};

type ThreadItem = {
  threadId: string;
  status: "open" | "closed" | string;
  createdAt: string;
  closedAt?: string | null;
  listingId?: string | null;
  eventName?: string | null;
  city?: string | null;
  priceCents?: number | null;
  currency?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
};

function money(cents?: number | null, currency?: string | null) {
  if (cents == null || !currency) return "";
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "live") return <Badge className="rounded-full">Live</Badge>;
  if (s === "pending") return <Badge variant="secondary" className="rounded-full">Pending review</Badge>;
  if (s === "removed") return <Badge variant="destructive" className="rounded-full">Removed</Badge>;
  if (s === "closed") return <Badge variant="secondary" className="rounded-full">Closed</Badge>;
  return <Badge variant="outline" className="rounded-full">{status}</Badge>;
}

export default function MyTicketsClient() {
  const router = useRouter();
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [threads, setThreads] = React.useState<ThreadItem[]>([]);
  const [loadingL, setLoadingL] = React.useState(true);
  const [loadingT, setLoadingT] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function loadListings() {
    setLoadingL(true);
    setError(null);

    try {
      const r = await fetch("/api/tickets/me/listings");
      const j = await r.json();

      if (!j.ok) {
        throw new Error(j.error || "Failed to load listings");
      }

      setListings(j.items || []);
    } catch (e: any) {
      console.error("Load listings error:", e);
      setError(e.message || "Failed to load listings");
    } finally {
      setLoadingL(false);
    }
  }

  async function loadThreads() {
    setLoadingT(true);
    setError(null);

    try {
      const r = await fetch("/api/tickets/me/threads");
      const j = await r.json();

      if (!j.ok) {
        throw new Error(j.error || "Failed to load threads");
      }

      setThreads(j.items || []);
    } catch (e: any) {
      console.error("Load threads error:", e);
      setError(e.message || "Failed to load threads");
    } finally {
      setLoadingT(false);
    }
  }

  React.useEffect(() => {
    loadListings();
    loadThreads();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">My Tickets</h1>
          <div className="text-sm opacity-80 mt-1">
            Your listings, your threads, your receipts. Keep it clean.
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-2xl" onClick={() => router.push("/map")}>
            Map
          </Button>
          <Button variant="secondary" className="rounded-2xl" onClick={() => router.push("/tickets")}>
            Tickets
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="rounded-2xl grid w-full grid-cols-3">
          <TabsTrigger value="listings" className="rounded-2xl flex gap-2">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">My Listings</span>
            <span className="sm:hidden">Listings</span>
          </TabsTrigger>
          <TabsTrigger value="threads" className="rounded-2xl flex gap-2">
            <MessagesSquare className="h-4 w-4" />
            <span className="hidden sm:inline">My Threads</span>
            <span className="sm:hidden">Threads</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="rounded-2xl flex gap-2">
            <Sparkles className="h-4 w-4" />
            Safety
          </TabsTrigger>
        </TabsList>

        {/* My Listings Tab */}
        <TabsContent value="listings" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm opacity-80">
              Live, pending, and removed listings (seller-only view).
            </div>
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={loadListings}
              disabled={loadingL}
            >
              {loadingL ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {loadingL ? (
            <div className="rounded-2xl border p-6 text-center text-sm opacity-70">
              Loading listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-2xl border p-5 space-y-3">
              <div className="font-semibold">No listings yet</div>
              <div className="text-sm opacity-80">
                When you sell, they'll live here.
              </div>
              <div className="flex gap-2">
                <Button className="rounded-2xl" onClick={() => router.push("/tickets")}>
                  Browse beacons
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => router.push("/map")}
                >
                  Open map
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {listings.map((l) => (
                <div key={l.listingId} className="rounded-2xl border p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{l.eventName}</div>
                      {l.venue && (
                        <div className="text-sm opacity-70">{l.venue}</div>
                      )}
                    </div>
                    {statusBadge(l.status)}
                  </div>

                  {/* Details */}
                  <div className="text-sm opacity-80">
                    {money(l.priceCents, l.currency)} • {l.quantity}x
                    {l.city ? ` • ${l.city}` : ""}
                  </div>

                  {l.eventStartsAt && (
                    <div className="text-sm opacity-70">
                      {new Date(l.eventStartsAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}

                  {/* Removed Banner */}
                  {l.status === "removed" && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm space-y-2">
                      <div className="font-semibold">Removed by moderation.</div>
                      <div className="opacity-80">
                        {l.removedReason
                          ? l.removedReason
                          : "If you think this was a mistake, contact support with the listing ID."}
                      </div>
                      <div className="text-xs font-mono opacity-70 break-all">
                        Listing ID: {l.listingId}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {l.beaconId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl"
                        onClick={() => router.push(`/tickets/${l.beaconId}`)}
                      >
                        View beacon
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-2xl"
                      onClick={() => router.push(`/tickets/listing/${l.listingId}`)}
                    >
                      View listing
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Threads Tab */}
        <TabsContent value="threads" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm opacity-80">
              Buyer messages land here. Replies are realtime.
            </div>
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={loadThreads}
              disabled={loadingT}
            >
              {loadingT ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {loadingT ? (
            <div className="rounded-2xl border p-6 text-center text-sm opacity-70">
              Loading threads...
            </div>
          ) : threads.length === 0 ? (
            <div className="rounded-2xl border p-5 space-y-3">
              <div className="font-semibold">No messages yet</div>
              <div className="text-sm opacity-80">
                When a buyer pings you, you'll see it here.
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {threads.map((t) => (
                <button
                  key={t.threadId}
                  className="rounded-2xl border p-4 text-left hover:bg-black/5 transition-colors space-y-2"
                  onClick={() => router.push(`/tickets/thread/${t.threadId}`)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">
                      {t.eventName ? t.eventName : "Ticket thread"}
                    </div>
                    {statusBadge(t.status)}
                  </div>

                  {/* Details */}
                  <div className="text-sm opacity-80">
                    {t.city ? `${t.city} • ` : ""}
                    {money(t.priceCents, t.currency)}
                  </div>

                  {/* Last Message */}
                  {t.lastMessage ? (
                    <div className="text-sm opacity-80 line-clamp-2">
                      {t.lastMessage}
                    </div>
                  ) : (
                    <div className="text-sm opacity-60 italic">No messages yet.</div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs opacity-60">
                    {t.lastMessageAt
                      ? `Last: ${new Date(t.lastMessageAt).toLocaleString("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}`
                      : `Created: ${new Date(t.createdAt).toLocaleString("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="mt-4 space-y-3">
          <div className="rounded-2xl border p-5 space-y-3">
            <div>
              <div className="font-semibold">Sales safety</div>
              <div className="text-sm opacity-80 mt-1">
                Quick rules that save you headaches.
              </div>
            </div>

            <Separator />

            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <span className="opacity-70">•</span>
                <span>Never share a ticket code without verification.</span>
              </li>
              <li className="flex gap-2">
                <span className="opacity-70">•</span>
                <span>
                  Keep payments on your chosen platform. Don't get pressured off-flow.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="opacity-70">•</span>
                <span>
                  If anything feels off, report it. Moderation moves faster with receipts.
                </span>
              </li>
            </ul>
          </div>

          {/* Cross-links */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-sm">
            <button
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border hover:bg-black/5 transition-colors"
              onClick={() => router.push("/care/hand-n-hand")}
            >
              <HeartHandshake className="h-4 w-4" />
              Care
              <ExternalLink className="h-3 w-3 opacity-50" />
            </button>

            <button
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border hover:bg-black/5 transition-colors"
              onClick={() => router.push("/legal/data-privacy-hub")}
            >
              <ShieldAlert className="h-4 w-4" />
              Data & Privacy Hub
              <ExternalLink className="h-3 w-3 opacity-50" />
            </button>
          </div>

          {/* Additional Resources */}
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold">Scam alert</div>
                <div className="opacity-80 mt-1">
                  Never send tickets before receiving payment. Scams love urgency and
                  off-platform payments.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
