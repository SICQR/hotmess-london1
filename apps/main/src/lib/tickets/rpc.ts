// lib/tickets/rpc.ts
// Shared RPC helpers for Tickets module
// Handles both beacon-listing queries and thread operations

import { SupabaseClient } from "@supabase/supabase-js";
import type { ApiError } from '@/types/api';
import type { 
  TicketListing, 
  TicketListingCard, 
  CreateListingResponse, 
  OpenThreadResponse 
} from '@/types/tickets';

type RpcResult<T> = { data: T | null; error: ApiError | null };

/**
 * Call RPC with fallback for arg naming styles (beacon_id vs p_beacon_id)
 */
async function callRpc<T>(
  sb: SupabaseClient,
  fn: string,
  args: Record<string, string | number | boolean | null>
): Promise<T> {
  // Try common arg naming styles without breaking prod
  const attempts = [
    args,
    Object.fromEntries(Object.entries(args).map(([k, v]) => [`p_${k}`, v])),
  ];

  let lastErr: ApiError | null = null;

  for (const a of attempts) {
    // Type assertion is safe here - we're calling Supabase RPC which accepts Record<string, unknown>
    const res = (await sb.rpc(fn, a as Record<string, unknown>)) as RpcResult<T>;
    if (!res.error) return res.data as T;
    lastErr = res.error;
  }

  throw new Error(lastErr?.message || `${fn}_failed`);
}

/**
 * List ticket listings for a beacon
 */
export async function ticketListListings(sb: SupabaseClient, beaconId: string) {
  return callRpc<TicketListingCard[]>(sb, "ticket_list_listings", { beacon_id: beaconId });
}

/**
 * Get single ticket listing by ID
 */
export async function ticketGetListing(sb: SupabaseClient, listingId: string) {
  return callRpc<TicketListing>(sb, "ticket_get_listing", { listing_id: listingId });
}

/**
 * Create a new ticket listing
 */
export async function ticketCreateListing(
  sb: SupabaseClient,
  input: {
    beacon_id: string;
    title?: string;
    price_cents: number;
    currency: string;
    quantity: number;
    notes?: string;
  }
) {
  return callRpc<CreateListingResponse>(sb, "ticket_create_listing", input);
}

/**
 * Open a thread with a seller (buyer → seller)
 */
export async function ticketOpenThread(sb: SupabaseClient, listingId: string) {
  return callRpc<OpenThreadResponse>(sb, "ticket_open_thread", { listing_id: listingId });
}

/**
 * Report a ticket listing
 */
export async function ticketReportListing(
  sb: SupabaseClient,
  input: { listing_id: string; reason: string; details?: string }
) {
  return callRpc<{ success: boolean }>(sb, "ticket_report_listing", input);
}
