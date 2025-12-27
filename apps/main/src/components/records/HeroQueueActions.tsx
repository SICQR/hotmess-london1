// components/records/HeroQueueActions.tsx
// Hero section: Play all / Queue all / Open queue

"use client";

import * as React from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { makePreviewItem, makeHqItem } from "@/lib/player/mapReleaseToQueue";
import { Play, ListPlus, List } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getSignedHqUrl(trackVersionId: string) {
  const r = await fetch(
    `/api/records/stream/${encodeURIComponent(trackVersionId)}`,
    { cache: "no-store" }
  );
  const j = await r.json();
  if (!j?.ok || !j.url) throw new Error("no_hq_url");
  return String(j.url);
}

export function HeroQueueActions({
  release,
  coverUrl,
  trackRows,
  mode = "preview",
}: {
  release: any;
  coverUrl?: string;
  trackRows: Array<{
    id: string;
    title: string;
    preview_widget_url?: string | null;
    hq_track_version_id?: string | null;
  }>;
  mode?: "preview" | "hq";
}) {
  const player = usePlayer();
  const [busy, setBusy] = React.useState(false);

  function previewItems() {
    return trackRows
      .filter((t: any) => t.preview_widget_url)
      .map((t: any) =>
        makePreviewItem({
          widgetUrl: t.preview_widget_url,
          title: t.title,
          artist: release.artist_name,
          coverUrl,
          href: `/records/releases/${release.slug}`,
        })
      );
  }

  async function hqItems() {
    const items: any[] = [];
    for (const t of trackRows) {
      if (!t.hq_track_version_id) continue;
      try {
        const src = await getSignedHqUrl(t.hq_track_version_id);
        items.push(
          (makeHqItem as any)({
            trackVersionId: t.hq_track_version_id,
            src,
            title: t.title,
            artist: release.artist_name,
            coverUrl,
            href: `/records/releases/${release.slug}`,
          })
        );
      } catch {
        // Skip tracks that fail to unlock
      }
    }
    return items;
  }

  async function handlePlayAll() {
    setBusy(true);
    try {
      const items =
        mode === "hq" ? await hqItems() : previewItems();
      if (items.length === 0) return;
      player.setQueue(items, 0);
    } finally {
      setBusy(false);
    }
  }

  async function handleQueueAll() {
    setBusy(true);
    try {
      const items =
        mode === "hq" ? await hqItems() : previewItems();
      if (items.length === 0) return;
      player.enqueueMany(items, { playNow: false });
      player.openDrawer();
    } finally {
      setBusy(false);
    }
  }

  const itemCount =
    mode === "hq"
      ? trackRows.filter((t) => t.hq_track_version_id).length
      : trackRows.filter((t) => t.preview_widget_url).length;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-5 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        onClick={handlePlayAll}
        disabled={busy || itemCount === 0}
      >
        <Play className="h-4 w-4 mr-2 inline fill-current" />
        Play all
      </button>

      <button
        className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-5 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        onClick={handleQueueAll}
        disabled={busy || itemCount === 0}
      >
        <ListPlus className="h-4 w-4 mr-2 inline" />
        Queue all
      </button>

      <button
        className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm px-5 py-3 font-bold uppercase tracking-wide hover:bg-white/5 hover:border-white/20 transition-all text-sm"
        onClick={player.openDrawer}
      >
        <List className="h-4 w-4 mr-2 inline" />
        Open queue
      </button>

      <div className="text-xs opacity-60 w-full pt-1 tracking-wide uppercase font-bold">
        Queue it up. Keep browsing.
      </div>
    </div>
  );
}