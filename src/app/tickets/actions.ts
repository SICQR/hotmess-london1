// app/tickets/actions.ts
// Server actions for Tickets module
// Used by browse, beacon, and listing pages

"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/requireUser";
import {
  ticketCreateListing,
  ticketOpenThread,
  ticketReportListing,
} from "@/lib/tickets/rpc";

/**
 * Create a new ticket listing (seller action)
 */
export async function createTicketListingAction(input: {
  beaconId: string;
  title?: string;
  pricePounds: string; // "25.00"
  quantity: string;    // "1"
  notes?: string;
}) {
  const user = await requireUser();

  // Basic hardening
  const price = Number(String(input.pricePounds).replace(/[^0-9.]/g, ""));
  const qty = Math.max(1, Math.min(10, Number(input.quantity || "1")));

  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false as const, error: "Enter a real price." };
  }

  const price_cents = Math.round(price * 100);

  try {
    await ticketCreateListing(supabase as any, {
      beacon_id: input.beaconId,
      title: input.title?.trim() || undefined,
      price_cents,
      currency: "GBP",
      quantity: qty,
      notes: input.notes?.trim() || undefined,
    });
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Create failed." };
  }
}

/**
 * Open a thread with a seller (buyer action)
 */
export async function openTicketThreadAction(listingId: string) {
  await requireUser();

  const res = await ticketOpenThread(supabase as any, listingId);

  // RPC may return string or object
  const threadId = typeof res === "string" ? res : (res as any).thread_id;
  if (!threadId) throw new Error("thread_missing");

  // Redirect to thread page with listingId so Thread UI can load ticket context + templates
  redirect(`/tickets/thread/${threadId}?listingId=${encodeURIComponent(listingId)}`);
}

/**
 * Report a ticket listing
 */
export async function reportTicketListingAction(input: {
  listingId: string;
  reason: string;
  details?: string;
}) {
  // Get current user (allow authed-only reports)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Login required." };

  const reason = input.reason?.trim();
  if (!reason) return { ok: false as const, error: "Pick a reason." };

  try {
    await ticketReportListing(supabase as any, {
      listing_id: input.listingId,
      reason,
      details: input.details?.trim() || undefined,
    });
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Report failed." };
  }
}