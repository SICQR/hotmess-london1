// lib/player/mapReleaseToQueue.ts
// Helper functions to map release data to QueueItem

import type { QueueItem } from "@/lib/player/types";

export function makePreviewItem(input: {
  widgetUrl: string;
  title: string;
  artist: string;
  coverUrl?: string;
  href?: string;
}): QueueItem {
  return {
    id: `sc:${input.widgetUrl}`,
    kind: "soundcloud",
    title: input.title,
    artist: input.artist,
    coverUrl: input.coverUrl,
    widgetUrl: input.widgetUrl,
    href: input.href,
  };
}

export function makeHqItem(input: {
  trackVersionId: string;
  src: string;
  title: string;
  artist: string;
  coverUrl?: string;
  href?: string;
}): QueueItem {
  return {
    id: `hq:${input.trackVersionId}`,
    kind: "audio",
    title: input.title,
    artist: input.artist,
    coverUrl: input.coverUrl,
    src: input.src,
    href: input.href,
  };
}
