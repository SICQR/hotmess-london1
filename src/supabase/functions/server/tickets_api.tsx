// tickets_api.tsx
// Production-ready Tickets module API routes
// Routes: /api/tickets/listings, /api/tickets/threads, /api/tickets/messages

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// CORS for browser clients
app.use("*", cors({ origin: "*", credentials: true }));

// Supabase client helper
function getSupabaseClient(authHeader: string | null = null) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = authHeader?.replace("Bearer ", "") || Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(supabaseUrl, supabaseKey);
}

// ============================================================================
// POST /api/tickets/listings/create
// ============================================================================
// Create a new ticket listing (18+ + consent required)
app.post("/listings/create", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const {
      beaconId,
      eventName,
      eventStartsAt,
      venue,
      city,
      quantity,
      priceCents,
      currency = "GBP",
      transferMethod = "digital_transfer",
      notes,
      proofUrl,
    } = body;

    // Validate required fields
    if (!beaconId || !eventName || !quantity || typeof priceCents !== "number") {
      return c.json({
        error: "invalid_request",
        message: "Missing required fields: beaconId, eventName, quantity, priceCents"
      }, 400);
    }

    if (quantity < 1 || quantity > 10) {
      return c.json({ error: "invalid_request", message: "Quantity must be between 1 and 10" }, 400);
    }

    if (priceCents < 0 || priceCents > 5000000) {
      return c.json({ error: "invalid_request", message: "Price must be between 0 and 50,000" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("ticket_create_listing", {
      p_beacon_id: beaconId,
      p_event_name: eventName,
      p_event_starts_at: eventStartsAt || null,
      p_venue: venue || null,
      p_city: city || null,
      p_quantity: quantity,
      p_price_cents: priceCents,
      p_currency: currency,
      p_transfer_method: transferMethod,
      p_notes: notes || null,
      p_proof_url: proofUrl || null,
    });

    if (error) {
      console.error("Create listing error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to list tickets",
        consent_required: "You must accept consent terms",
        beacon_not_found: "Beacon not found",
        beacon_type_mismatch: "This beacon is not a Ticket beacon",
        beacon_not_live: "This beacon is not currently active",
        beacon_not_started: "This beacon hasn't started yet",
        beacon_expired: "This beacon has expired",
      };

      const message = errorMessages[error.message] || error.message || "Failed to create listing";

      return c.json({ error: error.message || "create_failed", message }, 400);
    }

    return c.json(data, 201);

  } catch (err: any) {
    console.error("Create listing route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/tickets/listings/:beaconId
// ============================================================================
// List available ticket listings for a beacon
app.get("/listings/:beaconId", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const beaconId = c.req.param("beaconId");
    const limit = parseInt(c.req.query("limit") || "50");

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("ticket_list_listings", {
      p_beacon_id: beaconId,
      p_limit: limit,
    });

    if (error) {
      console.error("List listings error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to view listings",
        consent_required: "You must accept consent terms",
        beacon_not_found: "Beacon not found",
        beacon_type_mismatch: "This beacon is not a Ticket beacon",
        beacon_not_live: "This beacon is not currently active",
      };

      const message = errorMessages[error.message] || error.message || "Failed to list tickets";

      return c.json({ error: error.message || "list_failed", message }, 400);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("List listings route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// POST /api/tickets/threads/open
// ============================================================================
// Open a thread with a seller (buyer → seller)
app.post("/threads/open", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { listingId } = body;

    if (!listingId) {
      return c.json({ error: "invalid_request", message: "Missing listingId" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("ticket_open_thread", {
      p_listing_id: listingId,
    });

    if (error) {
      console.error("Open thread error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to message sellers",
        consent_required: "You must accept consent terms",
        listing_not_found: "Listing not found or has been removed",
        listing_not_available: "This listing is no longer available",
        cannot_message_self: "You cannot message your own listing",
      };

      const message = errorMessages[error.message] || error.message || "Failed to open thread";

      return c.json({ error: error.message || "open_failed", message }, error.message === "cannot_message_self" ? 403 : 400);
    }

    return c.json(data, 201);

  } catch (err: any) {
    console.error("Open thread route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// POST /api/tickets/messages
// ============================================================================
// Send a message in a thread (members only)
app.post("/messages", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { threadId, body: messageBody } = body;

    if (!threadId || !messageBody) {
      return c.json({ error: "invalid_request", message: "Missing threadId or body" }, 400);
    }

    if (typeof messageBody !== "string" || messageBody.length === 0 || messageBody.length > 2000) {
      return c.json({ error: "invalid_request", message: "Message must be 1-2000 characters" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("ticket_send_message", {
      p_thread_id: threadId,
      p_body: messageBody,
    });

    if (error) {
      console.error("Send message error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to send messages",
        consent_required: "You must accept consent terms",
        not_thread_member: "You are not a member of this thread",
      };

      const message = errorMessages[error.message] || error.message || "Failed to send message";

      return c.json({ error: error.message || "send_failed", message }, error.message === "not_thread_member" ? 403 : 400);
    }

    return c.json(data, 201);

  } catch (err: any) {
    console.error("Send message route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/tickets/threads
// ============================================================================
// Get user's active threads (via direct query with RLS)
app.get("/threads", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const supabase = getSupabaseClient(authHeader);

    // Get threads where user is a member
    const { data: threadMembers, error: membersError } = await supabase
      .from("ticket_thread_members")
      .select("thread_id, role")
      .limit(100);

    if (membersError) {
      console.error("Get thread members error:", membersError);
      return c.json({ error: "fetch_failed", message: "Failed to fetch threads" }, 500);
    }

    if (!threadMembers || threadMembers.length === 0) {
      return c.json({ threads: [] });
    }

    const threadIds = threadMembers.map(m => m.thread_id);

    // Get thread details
    const { data: threads, error: threadsError } = await supabase
      .from("ticket_threads")
      .select("id, listing_id, status, created_at, closed_at")
      .in("id", threadIds)
      .order("created_at", { ascending: false });

    if (threadsError) {
      console.error("Get threads error:", threadsError);
      return c.json({ error: "fetch_failed", message: "Failed to fetch thread details" }, 500);
    }

    return c.json({ threads: threads || [] });

  } catch (err: any) {
    console.error("Get threads route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/tickets/messages/:threadId
// ============================================================================
// Get messages for a thread (members only via RLS)
app.get("/messages/:threadId", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const threadId = c.req.param("threadId");
    const limit = parseInt(c.req.query("limit") || "100");
    const before = c.req.query("before"); // timestamp for pagination

    const supabase = getSupabaseClient(authHeader);

    let query = supabase
      .from("ticket_messages")
      .select("id, thread_id, sender_user_id, body, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt("created_at", before);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Get messages error:", error);
      return c.json({ error: "fetch_failed", message: "Failed to fetch messages" }, 500);
    }

    return c.json({ messages: messages || [] });

  } catch (err: any) {
    console.error("Get messages route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/tickets/my-listings
// ============================================================================
// Get user's own listings (via RLS)
app.get("/my-listings", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data: listings, error } = await supabase
      .from("ticket_listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Get my listings error:", error);
      return c.json({ error: "fetch_failed", message: "Failed to fetch your listings" }, 500);
    }

    return c.json({ listings: listings || [] });

  } catch (err: any) {
    console.error("Get my listings route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// POST /api/tickets/admin/listing-status (Admin only)
// ============================================================================
// Admin: approve/reject/remove/mark sold
app.post("/admin/listing-status", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { listingId, status, reason } = body;

    if (!listingId || !status) {
      return c.json({ error: "invalid_request", message: "Missing listingId or status" }, 400);
    }

    const validStatuses = ["live", "pending_review", "sold", "removed"];
    if (!validStatuses.includes(status)) {
      return c.json({ error: "invalid_request", message: "Invalid status" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { error } = await supabase.rpc("ticket_admin_set_listing_status", {
      p_listing_id: listingId,
      p_status: status,
      p_reason: reason || null,
    });

    if (error) {
      console.error("Admin set listing status error:", error);

      const errorMessages: Record<string, string> = {
        not_authorized: "Admin access required",
        listing_not_found: "Listing not found",
      };

      const message = errorMessages[error.message] || error.message || "Failed to update listing status";

      return c.json({ error: error.message || "update_failed", message }, error.message === "not_authorized" ? 403 : 400);
    }

    return c.json({ success: true });

  } catch (err: any) {
    console.error("Admin listing status route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

export default app;
