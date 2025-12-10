// lib/realtime/useThreadStatus.ts
// Hook for monitoring thread open/closed status via Realtime

"use client";

import * as React from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Mode = "connect" | "tickets";

/**
 * Hook for monitoring thread status (open/closed) via Realtime
 * 
 * Usage:
 * const { locked } = useThreadStatus("connect", threadId);
 * 
 * When locked = true, composer should be disabled.
 */
export function useThreadStatus(mode: Mode, threadId: string) {
  const [locked, setLocked] = React.useState(false);

  const table = mode === "connect" ? "connect_threads" : "ticket_threads";

  // Load initial status
  React.useEffect(() => {
    let active = true;
    
    (async () => {
      const { data, error } = await supabase
        .from(table)
        .select("status")
        .eq("id", threadId)
        .single();

      if (!active) return;
      
      if (!error && data) {
        setLocked(data.status === "closed");
      }
    })();
    
    return () => {
      active = false;
    };
  }, [table, threadId]);

  // Subscribe to status changes via Realtime
  React.useEffect(() => {
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel(`${table}:status:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table,
          filter: `id=eq.${threadId}`,
        },
        (payload) => {
          const row: any = payload.new;
          setLocked(row.status === "closed");
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [table, threadId]);

  return {
    locked,
  };
}
