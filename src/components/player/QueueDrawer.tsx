// components/player/QueueDrawer.tsx
// Queue drawer with remove/reorder/clear/jump

"use client";

import * as React from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

export function QueueDrawer() {
  const p = usePlayer();
  const { state, current } = p;

  if (!state.drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 p-3"
      onClick={p.closeDrawer}
    >
      <div
        className="mx-auto max-w-3xl rounded-3xl border bg-white p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Queue</div>
          <div className="flex gap-2">
            <button
              className="rounded-2xl border px-3 py-1 text-sm"
              onClick={p.clear}
            >
              Clear
            </button>
            <button
              className="rounded-2xl border px-3 py-1 text-sm"
              onClick={p.closeDrawer}
            >
              Close
            </button>
          </div>
        </div>

        <div className="text-sm opacity-80">
          {current ? (
            <>
              Now: <span className="font-semibold">{current.title}</span>
            </>
          ) : (
            "Nothing queued yet."
          )}
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
          {state.queue.map((q, idx) => {
            const active = idx === state.currentIndex;
            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-3 ${
                  active ? "bg-black/[0.03]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="text-left flex-1 min-w-0"
                    onClick={() => p.setQueue(state.queue, idx)}
                    title="Play this"
                  >
                    <div className="text-xs opacity-70">
                      {q.kind === "soundcloud" ? "Preview" : "HQ"}
                    </div>
                    <div className="font-semibold truncate">{q.title}</div>
                    <div className="text-xs opacity-70 truncate">
                      {q.artist || "RAW CONVICT RECORDS"}
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <button
                      className="rounded-2xl border px-2 py-1 text-sm"
                      onClick={() => p.move(idx, Math.max(0, idx - 1))}
                    >
                      ↑
                    </button>
                    <button
                      className="rounded-2xl border px-2 py-1 text-sm"
                      onClick={() =>
                        p.move(idx, Math.min(state.queue.length - 1, idx + 1))
                      }
                    >
                      ↓
                    </button>
                    <button
                      className="rounded-2xl border px-2 py-1 text-sm"
                      onClick={() => p.removeAt(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs opacity-70">
          Tip: Add tracks to queue from releases, then keep browsing. Player
          persists.
        </div>
      </div>
    </div>
  );
}
