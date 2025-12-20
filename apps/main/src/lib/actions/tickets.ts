// lib/actions/tickets.ts
// Server Actions for Tickets module (P2P ticket marketplace)

"use server";

import { callRpc, ActionResult } from "./_helpers";

// ============================================================================
// Types
// ============================================================================

export type TicketListingItem = {
  listingId: string;
  status: string;
  eventName: string;
  eventStartsAt: string | null;
  venue: string | null;
  city: string | null;
  quantity: number;
  priceCents: number;
  currency: string;
  transferMethod: string;
  notes: string | null;
  proofRequired: boolean;
};

export type TicketListListings = {
  items: TicketListingItem[];
};

export type TicketCreateListing = {
  listingId: string;
  status: string; // "live" or "pending_review"
};

export type TicketOpenThread = {
  threadId: string;
};

export type TicketSendMessage = {
  messageId: string;
};

// ============================================================================
// Actions
// ============================================================================

/**
 * List available ticket listings for a beacon
 * Requires: 18+ + consent
 */
export async function ticketListListings(
  beaconId: string,
  limit = 50
): Promise<ActionResult<TicketListListings>> {
  return callRpc("ticket_list_listings", {
    p_beacon_id: beaconId,
    p_limit: limit,
  });
}

/**
 * Create a new ticket listing
 * Requires: 18+ + consent
 * First listing → pending_review
 */
export async function ticketCreateListing(input: {
  beaconId: string;
  eventName: string;
  eventStartsAt?: string | null; // ISO timestamp
  venue?: string | null;
  city?: string | null;
  quantity: number;
  priceCents: number;
  currency?: string;
  transferMethod?: string;
  notes?: string | null;
  proofPath?: string | null; // Storage path for uploaded proof
}): Promise<ActionResult<TicketCreateListing>> {
  // Validation
  if (!input.eventName || input.eventName.trim().length === 0) {
    return {
      ok: false,
      error: { code: "validation", message: "Event name is required." }
    };
  }

  if (input.quantity < 1 || input.quantity > 10) {
    return {
      ok: false,
      error: { code: "validation", message: "Quantity must be between 1 and 10." }
    };
  }

  if (input.priceCents < 0 || input.priceCents > 5000000) {
    return {
      ok: false,
      error: { code: "validation", message: "Price must be between £0 and £50,000." }
    };
  }

  return callRpc("ticket_create_listing", {
    p_beacon_id: input.beaconId,
    p_event_name: input.eventName.trim(),
    p_event_starts_at: input.eventStartsAt ?? null,
    p_venue: input.venue ?? null,
    p_city: input.city ?? null,
    p_quantity: input.quantity,
    p_price_cents: input.priceCents,
    p_currency: input.currency ?? "GBP",
    p_transfer_method: input.transferMethod ?? "digital_transfer",
    p_notes: input.notes ?? null,
    p_proof_url: input.proofPath ?? null,
  });
}

/**
 * Open a thread with a seller (buyer → seller)
 * Requires: 18+ + consent
 */
export async function ticketOpenThread(
  listingId: string
): Promise<ActionResult<TicketOpenThread>> {
  return callRpc("ticket_open_thread", {
    p_listing_id: listingId,
  });
}

/**
 * Send a message in a ticket thread
 * Requires: Thread membership
 */
export async function ticketSendMessage(
  threadId: string,
  body: string
): Promise<ActionResult<TicketSendMessage>> {
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

  return callRpc("ticket_send_message", {
    p_thread_id: threadId,
    p_body: trimmed,
  });
}

/**
 * Admin: Set listing status (approve/reject/remove/sold)
 * Requires: Admin role
 */
export async function ticketAdminSetStatus(
  listingId: string,
  status: "live" | "pending_review" | "sold" | "removed",
  reason?: string
): Promise<ActionResult<null>> {
  return callRpc("ticket_admin_set_listing_status", {
    p_listing_id: listingId,
    p_status: status,
    p_reason: reason ?? null,
  });
}
