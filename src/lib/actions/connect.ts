// lib/actions/connect.ts
// Server Actions for Connect module (mutual opt-in matching)

"use server";

import { callRpc, ActionResult } from "./_helpers";

// ============================================================================
// Types
// ============================================================================

export type ConnectIntentCreate = {
  intentId: string;
  publicId: string;
  expiresAt: string;
};

export type ConnectIntentItem = {
  publicId: string;
  tags: any[];
  expiresAt: string;
  createdAt: string;
};

export type ConnectIntentList = {
  items: ConnectIntentItem[];
};

export type ConnectOptIn = {
  status: "pending" | "matched";
  threadId?: string;
};

export type ConnectSendMessage = {
  messageId: string;
};

// ============================================================================
// Actions
// ============================================================================

/**
 * Create a new connect intent at a beacon
 * Requires: Premium + 18+ + consent
 */
export async function connectCreateIntent(
  beaconId: string,
  tags: string[] = []
): Promise<ActionResult<ConnectIntentCreate>> {
  return callRpc("connect_create_intent", {
    p_beacon_id: beaconId,
    p_tags: tags.slice(0, 3), // Enforce max 3 tags
  });
}

/**
 * List available connect intents for a beacon (excludes your own)
 */
export async function connectListIntents(
  beaconId: string,
  limit = 50
): Promise<ActionResult<ConnectIntentList>> {
  return callRpc("connect_list_intents", {
    p_beacon_id: beaconId,
    p_limit: limit,
  });
}

/**
 * Opt-in to another user's intent
 * Returns "pending" or "matched" (if mutual)
 * If matched, returns threadId
 */
export async function connectOptIn(
  intentPublicId: string
): Promise<ActionResult<ConnectOptIn>> {
  return callRpc("connect_opt_in", {
    p_intent_public_id: intentPublicId,
  });
}

/**
 * Send a message in a connect thread
 * Requires: Thread membership
 */
export async function connectSendMessage(
  threadId: string,
  body: string
): Promise<ActionResult<ConnectSendMessage>> {
  // Trim and validate
  const trimmed = body.trim();
  
  if (trimmed.length === 0) {
    return {
      ok: false,
      error: { code: "validation", message: "Message cannot be empty." }
    };
  }
  
  if (trimmed.length > 2000) {
    return {
      ok: false,
      error: { code: "validation", message: "Message too long (max 2000 characters)." }
    };
  }

  return callRpc("connect_send_message", {
    p_thread_id: threadId,
    p_body: trimmed,
  });
}

/**
 * Close a connect thread
 * Requires: Thread membership
 */
export async function connectCloseThread(
  threadId: string,
  reason?: string
): Promise<ActionResult<null>> {
  return callRpc("connect_close_thread", {
    p_thread_id: threadId,
    p_reason: reason ?? null,
  });
}
