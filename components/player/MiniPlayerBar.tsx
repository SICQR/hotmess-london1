// components/player/MiniPlayerBar.tsx
// Sticky bottom mini player bar

"use client";

import * as React from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

function fmt(t: number) {
  if (!Number.isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MiniPlayerBar() {
  const p = usePlayer();
  const { state, current } = p;

  if (!current) return null;

  const isAudio = current.kind === "audio";
  const progress =
    isAudio && state.duration > 0 ? state.currentTime / state.duration : 0;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white/90 backdrop-blur p-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border overflow-hidden bg-black/5 shrink-0">
            {current.coverUrl ? (
              <img
                src={current.coverUrl}
                alt="Cover art"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs opacity-70">Now playing</div>
            <div className="font-semibold truncate">{current.title}</div>
            <div className="text-xs opacity-70 truncate">
              {current.artist || "RAW CONVICT RECORDS"} •{" "}
              {current.kind === "soundcloud" ? "Preview via SoundCloud" : "HQ"}
            </div>

            {isAudio ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="text-[11px] opacity-70 w-10">
                  {fmt(state.currentTime)}
                </div>
                <input
                  className="w-full"
                  type="range"
                  min={0}
                  max={state.duration || 0}
                  value={state.currentTime}
                  onChange={(e) => p.seek(Number(e.target.value))}
                />
                <div className="text-[11px] opacity-70 w-10 text-right">
                  {fmt(state.duration)}
                </div>
              </div>
            ) : (
              <div className="mt-2 h-2 rounded-full border overflow-hidden">
                <div
                  className="h-full bg-black/10"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {current.href ? (
              <a
                href={current.href}
                className="rounded-2xl border px-3 py-2 text-sm"
              >
                Open
              </a>
            ) : null}

            <button
              className="rounded-2xl border px-3 py-2 text-sm"
              onClick={p.prev}
              title="Previous"
            >
              ◀
            </button>

            {current.kind === "soundcloud" ? (
              <button
                className="rounded-2xl border px-3 py-2 text-sm font-semibold"
                onClick={() => p.openScPanel()}
                title="Open preview"
              >
                Preview
              </button>
            ) : (
              <button
                className="rounded-2xl border px-3 py-2 text-sm font-semibold"
                onClick={p.toggle}
                title="Play/Pause"
              >
                {state.isPlaying ? "Pause" : "Play"}
              </button>
            )}

            <button
              className="rounded-2xl border px-3 py-2 text-sm"
              onClick={p.next}
              title="Next"
            >
              ▶
            </button>

            <button
              className="rounded-2xl border px-3 py-2 text-sm"
              onClick={p.toggleDrawer}
            >
              Queue ({state.queue.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
