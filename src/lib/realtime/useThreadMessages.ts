// lib/realtime/useThreadMessages.ts
// Realtime hook for Connect/Ticket thread messages with optimistic UI

"use client";

import * as React from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase instance (needs to be created)
// This should match your existing client setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type PendingState = "pending" | "sent" | "failed";

export type UILocalMessage = {
  // For optimistic messages, we use a client id; for server rows, use row id.
  uiId: string;
  id?: string; // db id when confirmed
  sender_user_id: string;
  body: string;
  created_at: string;
  state?: PendingState;
};

function nowIso() {
  return new Date().toISOString();
}

/**
 * Hook for managing thread messages with Realtime subscriptions + optimistic UI
 * 
 * Features:
 * - Loads initial messages from DB
 * - Subscribes to new messages via Realtime
 * - Optimistic UI for instant message sending
 * - Auto-reconciliation when server confirms
 * - Failed state with retry support
 * 
 * Usage:
 * const { messages, addOptimistic, markFailed } = useThreadMessages({
 *   table: "connect_messages",
 *   threadId: "thread-id",
 * });
 */
export function useThreadMessages(opts: {
  table: "connect_messages" | "ticket_messages";
  threadId: string;
  initial?: UILocalMessage[];
}) {
  const { table, threadId } = opts;
  const [messages, setMessages] = React.useState<UILocalMessage[]>(opts.initial ?? []);
  const [subscribed, setSubscribed] = React.useState(false);

  // Load initial messages if not provided
  React.useEffect(() => {
    let active = true;
    
    (async () => {
      const { data, error } = await supabase
        .from(table)
        .select("id,sender_user_id,body,created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (!active) return;
      
      if (!error && data) {
        setMessages((prev) => {
          // Keep optimistic messages already in prev, and merge server history
          const optimistic = prev.filter((m) => m.state && m.state !== "sent"); // pending/failed
          const server = data.map((d: any) => ({
            uiId: d.id,
            id: d.id,
            sender_user_id: d.sender_user_id,
            body: d.body,
            created_at: d.created_at,
            state: "sent" as const,
          }));
          return [...server, ...optimistic];
        });
      }
    })();
    
    return () => {
      active = false;
    };
  }, [table, threadId]);

  // Realtime subscribe
  React.useEffect(() => {
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel(`${table}:thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table,
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const row: any = payload.new;

          setMessages((prev) => {
            // If we already have message id, ignore duplicate
            if (prev.some((m) => m.id === row.id || m.uiId === row.id)) return prev;

            // If we have a pending optimistic message with same body + sender and within 15s, reconcile it
            const idx = prev.findIndex(
              (m) =>
                m.state === "pending" &&
                m.sender_user_id === row.sender_user_id &&
                m.body === row.body &&
                Math.abs(new Date(m.created_at).getTime() - new Date(row.created_at).getTime()) < 15000
            );

            if (idx >= 0) {
              // Reconcile optimistic message with server confirmation
              const next = [...prev];
              next[idx] = {
                ...next[idx],
                id: row.id,
                uiId: row.id,
                created_at: row.created_at,
                state: "sent" as any,
              };
              return next;
            }

            // New message from another user or no matching optimistic message
            return [
              ...prev,
              {
                uiId: row.id,
                id: row.id,
                sender_user_id: row.sender_user_id,
                body: row.body,
                created_at: row.created_at,
                state: "sent" as any,
              },
            ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          });
        }
      )
      .subscribe((status) => {
        setSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [table, threadId]);

  /**
   * Add an optimistic message (instant UI update before server confirms)
   */
  function addOptimistic(sender_user_id: string, body: string) {
    const uiId = crypto.randomUUID();
    const msg: UILocalMessage = {
      uiId,
      sender_user_id,
      body,
      created_at: nowIso(),
      state: "pending",
    };
    setMessages((prev) => [...prev, msg]);
    return uiId;
  }

  /**
   * Mark an optimistic message as failed (show retry UI)
   */
  function markFailed(uiId: string) {
    setMessages((prev) => prev.map((m) => (m.uiId === uiId ? { ...m, state: "failed" } : m)));
  }

  /**
   * Remove an optimistic message (e.g., on successful reconciliation or manual delete)
   */
  function removeOptimistic(uiId: string) {
    setMessages((prev) => prev.filter((m) => m.uiId !== uiId));
  }

  return {
    messages,
    setMessages,
    subscribed,
    addOptimistic,
    markFailed,
    removeOptimistic,
  };
}

/**
 * Hook for monitoring thread status (open/closed) via Realtime
 * 
 * Usage:
 * const { threadStatus } = useThreadStatus({
 *   table: "connect_threads",
 *   threadId: "thread-id",
 * });
 * 
 * const composerDisabled = threadStatus === "closed";
 */
export function useThreadStatus(opts: {
  table: "connect_threads" | "ticket_threads";
  threadId: string;
}) {
  const { table, threadId } = opts;
  const [threadStatus, setThreadStatus] = React.useState<"open" | "closed" | null>(null);

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
        setThreadStatus(data.status);
      }
    })();
    
    return () => {
      active = false;
    };
  }, [table, threadId]);

  // Subscribe to status changes
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
          setThreadStatus(row.status);
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [table, threadId]);

  return {
    threadStatus,
  };
}