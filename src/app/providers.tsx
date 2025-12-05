// app/providers.tsx
// Client-side providers wrapper (App Router friendly)

"use client";

import * as React from "react";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { MiniPlayerBar } from "@/components/player/MiniPlayerBar";
import { QueueDrawer } from "@/components/player/QueueDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      {children}
      <QueueDrawer />
      <MiniPlayerBar />
    </PlayerProvider>
  );
}
