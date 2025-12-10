// app/admin/moderation/ModerationDeskClient.tsx
// Client-side Moderation Desk UI with filters + search + action drawer

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Search, ExternalLink, CheckCircle2, XCircle, Hammer, Clock } from "lucide-react";

type QueueRow = {
  id: string;
  item_type: "report";
  item_id: string;
  priority: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type ReportRow = {
  id: string;
  reporter_user_id: string;
  target_type: "beacon" | "ticket_listing" | "connect_thread" | "ticket_thread" | "message";
  target_id: string;
  reason_code: string;
  details: string | null;
  status: "open" | "triaged" | "actioned" | "dismissed";
  created_at: string;
  updated_at: string;
  triaged_by: string | null;
  resolution_note: string | null;
};

type Item = { queue: QueueRow; report: ReportRow };

function reasonLabel(code: string) {
  const m: Record<string, string> = {
    harassment: "Harassment",
    spam_scams: "Spam / scams",
    impersonation: "Impersonation",
    unsafe: "Unsafe behaviour",
    other: "Other",
  };
  return m[code] ?? code;
}

function typeBadge(t: ReportRow["target_type"]) {
  const map: Record<string, string> = {
    beacon: "Beacon",
    ticket_listing: "Ticket listing",
    connect_thread: "Connect thread",
    ticket_thread: "Ticket thread",
    message: "Message",
  };
  return map[t] ?? t;
}

function jumpUrl(targetType: ReportRow["target_type"], targetId: string) {
  switch (targetType) {
    case "connect_thread":
      return `/connect/thread/${targetId}`;
    case "ticket_thread":
      return `/tickets/thread/${targetId}`;
    case "beacon":
      return `/beacons/${targetId}`;
    case "ticket_listing":
      return `/tickets/listing/${targetId}`;
    case "message":
      return ""; // message alone needs context; keep empty
    default:
      return "";
  }
}

export default function ModerationDeskClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [statusFilter, setStatusFilter] = React.useState<string>("open");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<Item | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [note, setNote] = React.useState("");
  const [actionBusy, setActionBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    const url = `/api/admin/moderation/queue?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(q)}&limit=100`;
    const r = await fetch(url);
    const j = await r.json();
    setItems(j.ok ? j.items : []);
    setLoading(false);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  React.useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function setReportStatus(reportId: string, status: "triaged" | "dismissed" | "actioned") {
    setActionBusy(true);
    try {
      const r = await fetch("/api/admin/moderation/report/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId, status, note: note.trim() || null }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(String(j.error || "Failed"));
      setToast("Updated.");
      setNote("");
      await load();
      setDrawerOpen(false);
      setSelected(null);
    } catch (e: any) {
      setToast(e?.message ?? "Failed.");
    } finally {
      setActionBusy(false);
      setTimeout(() => setToast(null), 1500);
    }
  }

  async function removeMessageFromReport(it: Item) {
    const guessMode = it.report.details?.toLowerCase().includes("ticket") ? "tickets" : "connect";

    setActionBusy(true);
    try {
      const r = await fetch("/api/admin/moderation/message/remove", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: guessMode,
          messageId: it.report.target_id,
          reason: note.trim() || `report:${it.report.id}`,
        }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(String(j.error || "Failed"));
      setToast("Message removed.");
      await setReportStatus(it.report.id, "actioned");
    } catch (e: any) {
      setToast(e?.message ?? "Failed.");
    } finally {
      setActionBusy(false);
      setTimeout(() => setToast(null), 1500);
    }
  }

  async function preset(endpoint: string, reportId: string) {
    setActionBusy(true);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId, note: note.trim() || null }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(String(j.error || "Failed"));

      setToast(
        j.affected
          ? `Action applied. Cooldown set for ${j.affected} user(s).`
          : "Action applied. Logged."
      );
      setNote("");
      await load();
      setDrawerOpen(false);
      setSelected(null);
    } catch (e: any) {
      setToast(e?.message ?? "Failed.");
    } finally {
      setActionBusy(false);
      setTimeout(() => setToast(null), 1500);
    }
  }

  function openDrawer(it: Item) {
    setSelected(it);
    setDrawerOpen(true);
    setNote(it.report.resolution_note ?? "");
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Moderation Desk</h1>
          <div className="text-sm opacity-80 mt-1">Triage fast. Action clean. Log everything.</div>
        </div>

        {toast ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 px-4 py-2 text-sm">
            {toast}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <Input
            className="pl-9 rounded-2xl"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search report ID / target ID / reporter ID…"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[220px] rounded-2xl">
            <SelectValue placeholder="Queue status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Queue: Open</SelectItem>
            <SelectItem value="in_review">Queue: In review</SelectItem>
            <SelectItem value="actioned">Queue: Actioned</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="secondary" className="rounded-2xl" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs opacity-70 bg-black/5">
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Target</div>
          <div className="col-span-3">Reason</div>
          <div className="col-span-3">Created</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm opacity-70">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm">
            <div className="font-semibold">No items in this queue.</div>
            <div className="opacity-80 mt-1">Suspiciously calm.</div>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((it) => (
              <button
                key={it.queue.id}
                onClick={() => openDrawer(it)}
                className="w-full text-left px-4 py-4 hover:bg-black/5 transition-colors"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-2">
                    <Badge
                      variant={
                        it.queue.priority >= 90
                          ? "destructive"
                          : it.queue.priority >= 70
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full"
                    >
                      {it.queue.priority}
                    </Badge>
                  </div>

                  <div className="col-span-2">
                    <Badge variant="outline" className="rounded-full">
                      {typeBadge(it.report.target_type)}
                    </Badge>
                  </div>

                  <div className="col-span-3 text-sm font-medium">
                    {reasonLabel(it.report.reason_code)}
                  </div>

                  <div className="col-span-3 text-sm opacity-80">
                    {new Date(it.report.created_at).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100">
                      Review
                    </span>
                  </div>
                </div>

                {it.report.details ? (
                  <div className="mt-2 text-sm opacity-80 line-clamp-2">
                    {it.report.details}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl rounded-l-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Report details</SheetTitle>
          </SheetHeader>

          {selected ? (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {reasonLabel(selected.report.reason_code)}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {typeBadge(selected.report.target_type)}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Report: {selected.report.status}
                </Badge>
              </div>

              <div className="rounded-2xl border p-4 space-y-2">
                <div className="text-xs opacity-70">Target ID</div>
                <div className="text-sm font-mono break-all">{selected.report.target_id}</div>

                <div className="text-xs opacity-70 mt-3">Reporter</div>
                <div className="text-sm font-mono break-all">
                  {selected.report.reporter_user_id}
                </div>

                <div className="text-xs opacity-70 mt-3">Created</div>
                <div className="text-sm">
                  {new Date(selected.report.created_at).toLocaleString("en-GB")}
                </div>
              </div>

              {selected.report.details ? (
                <div className="rounded-2xl border p-4">
                  <div className="text-xs opacity-70">Details</div>
                  <div className="text-sm mt-2 whitespace-pre-wrap">
                    {selected.report.details}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border p-4 space-y-2">
                <div className="text-xs opacity-70">Admin note</div>
                <Textarea
                  className="rounded-2xl"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What did you do and why?"
                  maxLength={1000}
                />
                <div className="text-xs opacity-70 text-right">{note.length}/1000</div>
              </div>

              <Separator />

              {/* Jump to target button */}
              {jumpUrl(selected.report.target_type, selected.report.target_id) ? (
                <Button
                  variant="secondary"
                  className="rounded-2xl flex items-center gap-2 w-full"
                  onClick={() =>
                    window.open(
                      jumpUrl(selected.report.target_type, selected.report.target_id),
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  Open target
                </Button>
              ) : null}

              {/* Basic Actions */}
              <div className="space-y-2">
                <div className="text-xs opacity-70">Manual actions</div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl flex items-center gap-2"
                    onClick={() => setReportStatus(selected.report.id, "triaged")}
                    disabled={actionBusy}
                  >
                    <Clock className="h-4 w-4" />
                    Mark in review
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl flex items-center gap-2"
                    onClick={() => setReportStatus(selected.report.id, "dismissed")}
                    disabled={actionBusy}
                  >
                    <XCircle className="h-4 w-4" />
                    Dismiss
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="rounded-2xl flex items-center gap-2 w-full"
                  onClick={() => setReportStatus(selected.report.id, "actioned")}
                  disabled={actionBusy}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark actioned
                </Button>

                {selected.report.target_type === "message" ? (
                  <Button
                    className="rounded-2xl flex items-center gap-2 w-full"
                    onClick={() => removeMessageFromReport(selected)}
                    disabled={actionBusy}
                  >
                    <Hammer className="h-4 w-4" />
                    Remove message
                  </Button>
                ) : null}
              </div>

              <Separator />

              {/* One-click Presets */}
              <div className="space-y-2">
                <div className="text-xs opacity-70">One-click presets</div>

                {(selected.report.target_type === "connect_thread" ||
                  selected.report.target_type === "ticket_thread") && (
                  <Button
                    className="rounded-2xl w-full flex items-center gap-2"
                    onClick={() =>
                      preset(
                        "/api/admin/moderation/preset/close-thread",
                        selected.report.id
                      )
                    }
                    disabled={actionBusy}
                  >
                    <Hammer className="h-4 w-4" />
                    Close thread (now)
                  </Button>
                )}

                {selected.report.target_type === "ticket_listing" && (
                  <Button
                    className="rounded-2xl w-full flex items-center gap-2"
                    onClick={() =>
                      preset(
                        "/api/admin/moderation/preset/remove-listing",
                        selected.report.id
                      )
                    }
                    disabled={actionBusy}
                  >
                    <Hammer className="h-4 w-4" />
                    Remove listing
                  </Button>
                )}

                <Button
                  variant="secondary"
                  className="rounded-2xl w-full flex items-center gap-2"
                  onClick={() =>
                    preset("/api/admin/moderation/preset/cooldown-24h", selected.report.id)
                  }
                  disabled={actionBusy}
                >
                  <Clock className="h-4 w-4" />
                  Cooldown user 24h
                </Button>
              </div>

              <div className="text-xs opacity-70 pt-2">
                Every action is logged in the audit trail.
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm opacity-70">Select an item from the queue.</div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
