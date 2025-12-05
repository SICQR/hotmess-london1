// components/records/TrackRowControls.tsx
// Track row Play + Add to queue controls

"use client";

import * as React from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { makePreviewItem, makeHqItem } from "@/lib/player/mapReleaseToQueue";
import type { QueueItem } from "@/lib/player/types";
import { Play, ListPlus } from "lucide-react";

async function getSignedHqUrl(trackVersionId: string) {
  const r = await fetch(
    `/api/records/stream/${encodeURIComponent(trackVersionId)}`,
    { cache: "no-store" }
  );
  const j = await r.json();
  if (!j?.ok || !j.url) throw new Error("no_hq_url");
  return String(j.url);
}

export function TrackRowControls({
  mode, // "preview" | "hq"
  title,
  artist,
  coverUrl,
  href,
  previewWidgetUrl,
  hqTrackVersionId,
}: {
  mode: "preview" | "hq";
  title: string;
  artist: string;
  coverUrl?: string;
  href?: string;
  previewWidgetUrl?: string | null;
  hqTrackVersionId?: string | null;
}) {
  const player = usePlayer();
  const [busy, setBusy] = React.useState(false);

  function enqueueItem(item: QueueItem, playNow: boolean) {
    player.enqueue(item, { playNow });
  }

  async function playNow() {
    setBusy(true);
    try {
      if (mode === "hq" && hqTrackVersionId) {
        const src = await getSignedHqUrl(hqTrackVersionId);
        enqueueItem(
          makeHqItem({
            trackVersionId: hqTrackVersionId,
            src,
            title,
            artist,
            coverUrl,
            href,
          }),
          true
        );
      } else if (previewWidgetUrl) {
        enqueueItem(
          makePreviewItem({
            widgetUrl: previewWidgetUrl,
            title,
            artist,
            coverUrl,
            href,
          }),
          true
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function addToQueue() {
    setBusy(true);
    try {
      if (mode === "hq" && hqTrackVersionId) {
        const src = await getSignedHqUrl(hqTrackVersionId);
        enqueueItem(
          makeHqItem({
            trackVersionId: hqTrackVersionId,
            src,
            title,
            artist,
            coverUrl,
            href,
          }),
          false
        );
      } else if (previewWidgetUrl) {
        enqueueItem(
          makePreviewItem({
            widgetUrl: previewWidgetUrl,
            title,
            artist,
            coverUrl,
            href,
          }),
          false
        );
      }
    } finally {
      setBusy(false);
    }
  }

  const canPlay =
    mode === "hq" ? !!hqTrackVersionId : !!previewWidgetUrl;

  return (
    <div className="flex gap-2 shrink-0">
      <button
        className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-hot/20 hover:border-hot/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={playNow}
        disabled={busy || !canPlay}
        title="Play now"
      >
        {busy ? (
          "…"
        ) : (
          <span className="flex items-center gap-2">
            <Play className="h-3.5 w-3.5 fill-current" />
            Play
          </span>
        )}
      </button>
      <button
        className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-white/5 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={addToQueue}
        disabled={busy || !canPlay}
        title="Add to queue"
      >
        {busy ? (
          "…"
        ) : (
          <span className="flex items-center gap-2">
            <ListPlus className="h-3.5 w-3.5" />
            Add
          </span>
        )}
      </button>
    </div>
  );
}