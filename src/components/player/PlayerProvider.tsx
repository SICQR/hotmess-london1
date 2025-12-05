// components/player/PlayerProvider.tsx
// Global player state + playback engine

"use client";

import * as React from "react";
import type { QueueItem } from "@/lib/player/types";

type PlayerState = {
  queue: QueueItem[];
  currentIndex: number; // -1 = none
  isPlaying: boolean;
  muted: boolean;
  volume: number; // 0..1
  currentTime: number; // seconds (audio only)
  duration: number; // seconds (audio only)
  drawerOpen: boolean;
  scPanelOpen: boolean;
};

type PlayerApi = {
  state: PlayerState;
  current: QueueItem | null;

  // playback
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;

  // queue ops
  setQueue: (items: QueueItem[], startIndex?: number) => void;
  enqueue: (item: QueueItem, opts?: { playNow?: boolean }) => void;
  enqueueMany: (items: QueueItem[], opts?: { playNow?: boolean }) => void;
  removeAt: (idx: number) => void;
  move: (from: number, to: number) => void;
  clear: () => void;

  // UI
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  openScPanel: () => void;
  closeScPanel: () => void;
};

const STORAGE_KEY = "hotmess_player_v1";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function safeParse<T>(s: string | null): T | null {
  try {
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function normalizeWidgetUrl(widgetUrl: string) {
  // ensure auto_play true for the preview panel, but do NOT mutate stored value.
  try {
    const u = new URL(widgetUrl);
    if (!u.searchParams.has("auto_play"))
      u.searchParams.set("auto_play", "true");
    if (!u.searchParams.has("hide_related"))
      u.searchParams.set("hide_related", "true");
    if (!u.searchParams.has("show_comments"))
      u.searchParams.set("show_comments", "false");
    if (!u.searchParams.has("show_user"))
      u.searchParams.set("show_user", "false");
    if (!u.searchParams.has("show_reposts"))
      u.searchParams.set("show_reposts", "false");
    if (!u.searchParams.has("visual")) u.searchParams.set("visual", "false");
    return u.toString();
  } catch {
    return widgetUrl;
  }
}

const PlayerContext = React.createContext<PlayerApi | null>(null);

export function usePlayer() {
  const ctx = React.useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const [state, setState] = React.useState<PlayerState>(() => {
    const saved =
      typeof window !== "undefined"
        ? safeParse<any>(localStorage.getItem(STORAGE_KEY))
        : null;
    const queue: QueueItem[] = Array.isArray(saved?.queue) ? saved.queue : [];
    const currentIndex =
      typeof saved?.currentIndex === "number" ? saved.currentIndex : -1;
    const volume = typeof saved?.volume === "number" ? saved.volume : 0.9;
    const muted = !!saved?.muted;
    return {
      queue,
      currentIndex: queue.length
        ? clamp(currentIndex, -1, queue.length - 1)
        : -1,
      isPlaying: false,
      muted,
      volume: clamp(volume, 0, 1),
      currentTime: 0,
      duration: 0,
      drawerOpen: false,
      scPanelOpen: false,
    };
  });

  const current =
    state.currentIndex >= 0 ? state.queue[state.currentIndex] : null;

  // persist (without volatile fields)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      queue: state.queue,
      currentIndex: state.currentIndex,
      volume: state.volume,
      muted: state.muted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state.queue, state.currentIndex, state.volume, state.muted]);

  // playback tick (audio only)
  const startTick = React.useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    const tick = () => {
      setState((s) => ({
        ...s,
        currentTime: a.currentTime || 0,
        duration: Number.isFinite(a.duration) ? a.duration : s.duration,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTick = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const next = React.useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      const ni = s.currentIndex + 1;
      if (ni >= s.queue.length)
        return { ...s, isPlaying: false, currentIndex: s.currentIndex };
      return {
        ...s,
        currentIndex: ni,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    });
  }, []);

  // ensure audio element exists
  React.useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;

    a.volume = state.volume;
    a.muted = state.muted;

    const onEnded = () => next();
    const onLoaded = () => {
      setState((s) => ({
        ...s,
        duration: Number.isFinite(a.duration) ? a.duration : 0,
      }));
    };

    a.addEventListener("ended", onEnded);
    a.addEventListener("loadedmetadata", onLoaded);

    return () => {
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("loadedmetadata", onLoaded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load current item into audio if needed
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (!current) {
      stopTick();
      setState((s) => ({
        ...s,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        scPanelOpen: false,
      }));
      return;
    }

    if (current.kind === "soundcloud") {
      // we cannot control iframe audio; treat as "open SC panel"
      stopTick();
      setState((s) => ({
        ...s,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        scPanelOpen: true,
      }));
      // pause any HTML audio that might still be playing
      a.pause().catch?.(() => {});
      return;
    }

    // audio
    const src = current.src || "";
    if (!src) {
      setState((s) => ({ ...s, isPlaying: false }));
      return;
    }

    // load & optionally autoplay if state was playing
    a.src = src;
    a.load();

    // auto play immediately
    a.play()
      .then(() => {
        startTick();
        setState((s) => ({ ...s, isPlaying: true, scPanelOpen: false }));
      })
      .catch(() => {
        stopTick();
        setState((s) => ({ ...s, isPlaying: false }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]); // deliberate: change on id swap

  const play = React.useCallback(() => {
    if (!current) return;
    if (current.kind === "soundcloud") {
      setState((s) => ({ ...s, isPlaying: true, scPanelOpen: true }));
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    a.play()
      .then(() => {
        startTick();
        setState((s) => ({ ...s, isPlaying: true }));
      })
      .catch(() => setState((s) => ({ ...s, isPlaying: false })));
  }, [current, startTick]);

  const pause = React.useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    stopTick();
    setState((s) => ({ ...s, isPlaying: false }));
  }, [stopTick]);

  const toggle = React.useCallback(() => {
    setState((s) => {
      const now = !s.isPlaying;
      return { ...s, isPlaying: now };
    });
    // sync with audio
    if (!current) return;
    if (current.kind === "soundcloud") {
      setState((s) => ({ ...s, scPanelOpen: true }));
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else pause();
  }, [current, play, pause]);

  const seek = React.useCallback((t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = clamp(
      t,
      0,
      Number.isFinite(a.duration) ? a.duration : t
    );
    setState((s) => ({ ...s, currentTime: a.currentTime }));
  }, []);

  const setVolume = React.useCallback((v: number) => {
    const vv = clamp(v, 0, 1);
    const a = audioRef.current;
    if (a) a.volume = vv;
    setState((s) => ({ ...s, volume: vv }));
  }, []);

  const toggleMute = React.useCallback(() => {
    const a = audioRef.current;
    setState((s) => {
      const muted = !s.muted;
      if (a) a.muted = muted;
      return { ...s, muted };
    });
  }, []);

  const setQueue = React.useCallback((items: QueueItem[], startIndex = 0) => {
    const idx = items.length ? clamp(startIndex, 0, items.length - 1) : -1;
    setState((s) => ({
      ...s,
      queue: items,
      currentIndex: idx,
      isPlaying: items.length > 0,
      currentTime: 0,
      duration: 0,
      scPanelOpen: items[idx]?.kind === "soundcloud",
    }));
  }, []);

  const enqueue = React.useCallback(
    (item: QueueItem, opts?: { playNow?: boolean }) => {
      setState((s) => {
        const existsIdx = s.queue.findIndex((q) => q.id === item.id);
        const nextQueue = existsIdx >= 0 ? s.queue : [...s.queue, item];

        if (opts?.playNow) {
          const nextIndex = existsIdx >= 0 ? existsIdx : nextQueue.length - 1;
          return {
            ...s,
            queue: nextQueue,
            currentIndex: nextIndex,
            isPlaying: true,
            scPanelOpen: item.kind === "soundcloud",
          };
        }

        // if nothing playing, start
        if (s.currentIndex < 0 && nextQueue.length) {
          return {
            ...s,
            queue: nextQueue,
            currentIndex: 0,
            isPlaying: true,
            scPanelOpen: nextQueue[0].kind === "soundcloud",
          };
        }

        return { ...s, queue: nextQueue };
      });
    },
    []
  );

  const enqueueMany = React.useCallback(
    (items: QueueItem[], opts?: { playNow?: boolean }) => {
      setState((s) => {
        const map = new Map(s.queue.map((q) => [q.id, q]));
        for (const it of items) map.set(it.id, it);
        const nextQueue = Array.from(map.values());

        if (opts?.playNow && items[0]) {
          const firstId = items[0].id;
          const nextIndex = nextQueue.findIndex((q) => q.id === firstId);
          return {
            ...s,
            queue: nextQueue,
            currentIndex: Math.max(0, nextIndex),
            isPlaying: true,
            scPanelOpen: items[0].kind === "soundcloud",
          };
        }

        if (s.currentIndex < 0 && nextQueue.length) {
          return {
            ...s,
            queue: nextQueue,
            currentIndex: 0,
            isPlaying: true,
            scPanelOpen: nextQueue[0].kind === "soundcloud",
          };
        }

        return { ...s, queue: nextQueue };
      });
    },
    []
  );

  const removeAt = React.useCallback((idx: number) => {
    setState((s) => {
      if (idx < 0 || idx >= s.queue.length) return s;
      const nextQueue = s.queue.filter((_, i) => i !== idx);
      let nextIndex = s.currentIndex;

      if (idx === s.currentIndex) {
        // if removing current: play next if possible else stop
        nextIndex = nextQueue.length
          ? Math.min(idx, nextQueue.length - 1)
          : -1;
      } else if (idx < s.currentIndex) {
        nextIndex = s.currentIndex - 1;
      }

      return {
        ...s,
        queue: nextQueue,
        currentIndex: nextIndex,
        isPlaying: nextIndex >= 0,
        currentTime: 0,
        duration: 0,
      };
    });
  }, []);

  const move = React.useCallback((from: number, to: number) => {
    setState((s) => {
      if (from === to) return s;
      if (from < 0 || from >= s.queue.length) return s;
      if (to < 0 || to >= s.queue.length) return s;

      const nextQueue = [...s.queue];
      const [item] = nextQueue.splice(from, 1);
      nextQueue.splice(to, 0, item);

      let currentIndex = s.currentIndex;
      if (from === s.currentIndex) currentIndex = to;
      else {
        // adjust current index if item moved around it
        if (from < s.currentIndex && to >= s.currentIndex)
          currentIndex = s.currentIndex - 1;
        if (from > s.currentIndex && to <= s.currentIndex)
          currentIndex = s.currentIndex + 1;
      }

      return { ...s, queue: nextQueue, currentIndex };
    });
  }, []);

  const clear = React.useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    stopTick();
    setState((s) => ({
      ...s,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      drawerOpen: false,
      scPanelOpen: false,
    }));
  }, [stopTick]);

  const prev = React.useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      const pi = s.currentIndex - 1;
      if (pi < 0) return { ...s, currentIndex: 0, currentTime: 0 };
      return {
        ...s,
        currentIndex: pi,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    });
  }, []);

  // UI helpers
  const openDrawer = React.useCallback(
    () => setState((s) => ({ ...s, drawerOpen: true })),
    []
  );
  const closeDrawer = React.useCallback(
    () => setState((s) => ({ ...s, drawerOpen: false })),
    []
  );
  const toggleDrawer = React.useCallback(
    () => setState((s) => ({ ...s, drawerOpen: !s.drawerOpen })),
    []
  );
  const openScPanel = React.useCallback(
    () => setState((s) => ({ ...s, scPanelOpen: true })),
    []
  );
  const closeScPanel = React.useCallback(
    () => setState((s) => ({ ...s, scPanelOpen: false })),
    []
  );

  const api: PlayerApi = {
    state,
    current,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    setQueue,
    enqueue,
    enqueueMany,
    removeAt,
    move,
    clear,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    openScPanel,
    closeScPanel,
  };

  return (
    <PlayerContext.Provider value={api}>
      {children}

      {/* SoundCloud preview panel (inline, controlled by player state) */}
      {current?.kind === "soundcloud" && state.scPanelOpen ? (
        <div className="fixed inset-x-3 bottom-20 z-50">
          <div className="rounded-2xl border bg-white/95 backdrop-blur p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-sm font-semibold">
                Preview via SoundCloud
              </div>
              <button
                className="rounded-2xl border px-3 py-1 text-sm"
                onClick={closeScPanel}
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                title="SoundCloud preview"
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={normalizeWidgetUrl(current.widgetUrl || "")}
              />
            </div>
          </div>
        </div>
      ) : null}
    </PlayerContext.Provider>
  );
}
