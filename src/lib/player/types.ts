// lib/player/types.ts
// Player types for mini player + queue system

export type MediaKind = "audio" | "soundcloud";

export type QueueItem = {
  id: string; // stable id (trackVersionId / soundcloud URL hash)
  kind: MediaKind;
  title: string;
  artist?: string;
  coverUrl?: string; // public URL (cover art)
  href?: string; // deep link back to release page
  // audio
  src?: string; // signed URL for HQ stream
  // soundcloud preview
  widgetUrl?: string; // https://w.soundcloud.com/player/?url=...
};
