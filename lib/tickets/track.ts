// lib/tickets/track.ts
// Client-side tracking helper for ticket events
// Fire and forget - never blocks user interactions

export function trackTicketEvent(event: string, payload: Record<string, any> = {}) {
  try {
    fetch("/api/tickets/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, ...payload }),
      keepalive: true,
    });
  } catch {
    // Silently fail - tracking should never break UX
  }
}

/**
 * Standard ticket funnel events:
 * 
 * - tickets_browse_view
 * - ticket_beacon_click
 * - ticket_beacon_view
 * - ticket_listing_click
 * - ticket_listing_view
 * - ticket_message_seller_click
 * - ticket_thread_open
 * - ticket_create_listing_start
 * - ticket_create_listing_success
 * - ticket_report_submit
 * - ticket_template_insert
 * - ticket_template_send
 * - ticket_template_send_now
 * - ticket_proof_upload_start
 * - ticket_proof_upload_done
 * - ticket_proof_upload_fail
 */