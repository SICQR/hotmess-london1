// connect_api.tsx
// Production-ready Connect module API routes
// Routes: /api/connect/intents, /api/connect/opt-in, /api/connect/messages

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
// POST /api/connect/intents/create
// ============================================================================
// Create a new connect intent (Premium + 18+ + consent required)
app.post("/intents/create", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { beaconId, tags = [] } = body;

    if (!beaconId) {
      return c.json({ error: "invalid_request", message: "Missing beaconId" }, 400);
    }

    if (!Array.isArray(tags) || tags.length > 3) {
      return c.json({ error: "invalid_request", message: "Tags must be array with max 3 items" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("connect_create_intent", {
      p_beacon_id: beaconId,
      p_tags: tags,
    });

    if (error) {
      console.error("Create intent error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to use Connect",
        consent_required: "You must accept consent terms",
        premium_required: "Connect requires Premium membership",
        beacon_not_found: "Beacon not found",
        beacon_type_mismatch: "This beacon is not a Connect beacon",
        beacon_not_live: "This beacon is not currently active",
        beacon_not_started: "This beacon hasn't started yet",
        beacon_expired: "This beacon has expired",
        too_many_tags: "Maximum 3 tags allowed",
      };

      const message = errorMessages[error.message] || error.message || "Failed to create intent";

      return c.json({ error: error.message || "create_failed", message }, error.message === "premium_required" ? 403 : 400);
    }

    return c.json(data, 201);

  } catch (err: any) {
    console.error("Create intent route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/connect/intents/:beaconId
// ============================================================================
// List available connect intents for a beacon (excludes your own)
app.get("/intents/:beaconId", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const beaconId = c.req.param("beaconId");
    const limit = parseInt(c.req.query("limit") || "50");

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("connect_list_intents", {
      p_beacon_id: beaconId,
      p_limit: limit,
    });

    if (error) {
      console.error("List intents error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to use Connect",
        consent_required: "You must accept consent terms",
        premium_required: "Connect requires Premium membership",
        beacon_not_found: "Beacon not found",
        beacon_type_mismatch: "This beacon is not a Connect beacon",
        beacon_not_live: "This beacon is not currently active",
      };

      const message = errorMessages[error.message] || error.message || "Failed to list intents";

      return c.json({ error: error.message || "list_failed", message }, error.message === "premium_required" ? 403 : 400);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("List intents route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// POST /api/connect/opt-in
// ============================================================================
// Opt-in to an intent (mutual opt-in creates thread)
app.post("/opt-in", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { intentPublicId } = body;

    if (!intentPublicId) {
      return c.json({ error: "invalid_request", message: "Missing intentPublicId" }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("connect_opt_in", {
      p_intent_public_id: intentPublicId,
    });

    if (error) {
      console.error("Opt-in error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        age18_required: "You must be 18+ to use Connect",
        consent_required: "You must accept consent terms",
        premium_required: "Connect requires Premium membership",
        intent_not_found: "Intent not found or has been removed",
        intent_expired: "This intent has expired",
        cannot_opt_in_to_self: "You cannot opt-in to your own intent",
      };

      const message = errorMessages[error.message] || error.message || "Failed to opt-in";

      return c.json({ error: error.message || "optin_failed", message }, error.message === "premium_required" ? 403 : 400);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("Opt-in route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// POST /api/connect/messages
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

    const { data, error } = await supabase.rpc("connect_send_message", {
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
// POST /api/connect/threads/:threadId/close
// ============================================================================
// Close a thread (member can close)
app.post("/threads/:threadId/close", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const threadId = c.req.param("threadId");
    const body = await c.req.json();
    const { reason = null } = body;

    const supabase = getSupabaseClient(authHeader);

    const { error } = await supabase.rpc("connect_close_thread", {
      p_thread_id: threadId,
      p_reason: reason,
    });

    if (error) {
      console.error("Close thread error:", error);

      const errorMessages: Record<string, string> = {
        not_authenticated: "Authentication required",
        not_thread_member: "You are not a member of this thread",
      };

      const message = errorMessages[error.message] || error.message || "Failed to close thread";

      return c.json({ error: error.message || "close_failed", message }, error.message === "not_thread_member" ? 403 : 400);
    }

    return c.json({ success: true });

  } catch (err: any) {
    console.error("Close thread route error:", err);
    return c.json({ error: "server_error", message: err.message || "Internal server error" }, 500);
  }
});

// ============================================================================
// GET /api/connect/threads
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
      .from("connect_thread_members")
      .select("thread_id")
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
      .from("connect_threads")
      .select("id, beacon_id, status, created_at, closed_at")
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
// GET /api/connect/messages/:threadId
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
      .from("connect_messages")
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

export default app;
