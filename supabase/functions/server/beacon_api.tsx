// beacon_api.tsx
// Production-ready beacon API routes with security hardening
// Routes: /api/beacons/redeem, /api/beacons/session/:token, /api/beacons/verify-proximity

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

// Get guest ID from cookie or create new one
function getOrCreateGuestId(req: Request): string {
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(/hm_guest_id=([^;]+)/);
  if (match) return match[1];
  
  // Generate new guest ID
  return crypto.randomUUID();
}

// Hash helper (privacy-safe identifiers)
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// POST /api/beacons/redeem
// ============================================================================
// Redeem QR scan → log scan → award XP → return session token
app.post("/redeem", async (c) => {
  try {
    const body = await c.req.json();
    const { qrKey, source = "qr" } = body;

    if (!qrKey || typeof qrKey !== "string") {
      return c.json({ error: "invalid_request", message: "Missing qrKey" }, 400);
    }

    const supabase = getSupabaseClient(c.req.header("Authorization"));
    const guestId = getOrCreateGuestId(c.req.raw);
    
    // Get client info for rate limiting
    const userAgent = c.req.header("user-agent") || "";
    const forwardedFor = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "";
    
    const deviceHash = userAgent ? (await sha256(userAgent)).slice(0, 48) : null;
    const ipHash = forwardedFor ? (await sha256(forwardedFor)).slice(0, 48) : null;

    // Call redeem_scan RPC
    const { data, error } = await supabase.rpc("redeem_scan", {
      p_qr_key: qrKey,
      p_source: source,
      p_guest_id: guestId,
      p_device_hash: deviceHash,
      p_ip_hash: ipHash,
    });

    if (error) {
      console.error("Redeem scan error:", error);
      
      // Map DB errors to user-friendly messages
      if (error.message.includes("invalid_qr")) {
        return c.json({ 
          error: "invalid_qr", 
          message: "Invalid or expired QR code" 
        }, 404);
      }
      
      if (error.message.includes("rate_limit_exceeded")) {
        return c.json({ 
          error: "rate_limit", 
          message: "Too many scan attempts. Try again in 10 minutes." 
        }, 429);
      }
      
      if (error.message.includes("beacon_not_active")) {
        return c.json({ 
          error: "beacon_inactive", 
          message: "This beacon is no longer active" 
        }, 400);
      }
      
      if (error.message.includes("beacon_not_started")) {
        return c.json({ 
          error: "beacon_scheduled", 
          message: "This beacon hasn't started yet" 
        }, 400);
      }

      return c.json({ 
        error: "scan_failed", 
        message: error.message || "Failed to redeem scan" 
      }, 500);
    }

    // Set guest ID cookie if new
    const headers = new Headers();
    if (!c.req.header("cookie")?.includes("hm_guest_id=")) {
      headers.set("Set-Cookie", `hm_guest_id=${guestId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`);
    }

    return c.json(data, 200, Object.fromEntries(headers));

  } catch (err: any) {
    console.error("Redeem route error:", err);
    return c.json({ 
      error: "server_error", 
      message: err.message || "Internal server error" 
    }, 500);
  }
});

// ============================================================================
// GET /api/beacons/session/:token
// ============================================================================
// Fetch beacon reveal payload from session token
app.get("/session/:token", async (c) => {
  try {
    const token = c.req.param("token");

    if (!token) {
      return c.json({ error: "invalid_request", message: "Missing token" }, 400);
    }

    const supabase = getSupabaseClient(c.req.header("Authorization"));

    const { data, error } = await supabase.rpc("get_scan_session", {
      p_token: token,
    });

    if (error) {
      console.error("Get scan session error:", error);
      
      if (error.message.includes("session_expired")) {
        return c.json({ 
          error: "session_expired", 
          message: "This session has expired. Scan again to unlock." 
        }, 410);
      }

      return c.json({ 
        error: "session_failed", 
        message: error.message || "Failed to retrieve session" 
      }, 500);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("Session route error:", err);
    return c.json({ 
      error: "server_error", 
      message: err.message || "Internal server error" 
    }, 500);
  }
});

// ============================================================================
// POST /api/beacons/verify-proximity
// ============================================================================
// Verify user is within GPS radius (hard requirement beacons)
app.post("/verify-proximity", async (c) => {
  try {
    const body = await c.req.json();
    const { beaconId, lat, lng } = body;

    if (!beaconId || typeof lat !== "number" || typeof lng !== "number") {
      return c.json({ 
        error: "invalid_request", 
        message: "Missing beaconId, lat, or lng" 
      }, 400);
    }

    const supabase = getSupabaseClient(c.req.header("Authorization"));

    const { data, error } = await supabase.rpc("verify_proximity", {
      p_beacon_id: beaconId,
      p_user_lat: lat,
      p_user_lng: lng,
    });

    if (error) {
      console.error("Verify proximity error:", error);
      
      if (error.message.includes("beacon_not_found")) {
        return c.json({ 
          error: "beacon_not_found", 
          message: "Beacon not found" 
        }, 404);
      }

      return c.json({ 
        error: "verification_failed", 
        message: error.message || "Failed to verify proximity" 
      }, 500);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("Proximity route error:", err);
    return c.json({ 
      error: "server_error", 
      message: err.message || "Internal server error" 
    }, 500);
  }
});

// ============================================================================
// POST /api/beacons/create (Creator only)
// ============================================================================
// Create new beacon with secure QR key
app.post("/create", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const {
      type,
      title,
      description,
      durationHours,
      startsAt,
      city,
      lat,
      lng,
      mapVisibility = true,
      previewMode = true,
      consentRequired = false,
      premiumRequired = false,
      gpsMode = "off",
      gpsRadiusM = 200,
      isSponsored = false,
      sponsorName,
      sponsorDisclosure,
      actionRoute = "/beacons",
      actionConfig = {},
      xpScan = 10,
      xpAction = 25,
      publishNow = false,
    } = body;

    if (!type || !title || !durationHours || !startsAt) {
      return c.json({ 
        error: "invalid_request", 
        message: "Missing required fields: type, title, durationHours, startsAt" 
      }, 400);
    }

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("create_beacon", {
      p_type: type,
      p_title: title,
      p_description: description || null,
      p_duration_hours: durationHours,
      p_starts_at: startsAt,
      p_city: city || null,
      p_lat: lat || null,
      p_lng: lng || null,
      p_map_visibility: mapVisibility,
      p_preview_mode: previewMode,
      p_consent_required: consentRequired,
      p_premium_required: premiumRequired,
      p_gps_mode: gpsMode,
      p_gps_radius_m: gpsRadiusM,
      p_is_sponsored: isSponsored,
      p_sponsor_name: sponsorName || null,
      p_sponsor_disclosure: sponsorDisclosure || null,
      p_action_route: actionRoute,
      p_action_config: actionConfig,
      p_xp_scan: xpScan,
      p_xp_action: xpAction,
      p_publish_now: publishNow,
    });

    if (error) {
      console.error("Create beacon error:", error);
      
      if (error.message.includes("not_authorized")) {
        return c.json({ 
          error: "unauthorized", 
          message: "Creator role required" 
        }, 403);
      }
      
      if (error.message.includes("invalid_duration")) {
        return c.json({ 
          error: "invalid_duration", 
          message: "Duration must be 3, 6, or 9 hours" 
        }, 400);
      }

      return c.json({ 
        error: "creation_failed", 
        message: error.message || "Failed to create beacon" 
      }, 500);
    }

    return c.json(data, 201);

  } catch (err: any) {
    console.error("Create beacon route error:", err);
    return c.json({ 
      error: "server_error", 
      message: err.message || "Internal server error" 
    }, 500);
  }
});

// ============================================================================
// POST /api/beacons/:beaconId/rotate-qr (Creator only)
// ============================================================================
// Rotate QR key (revoke leaked key)
app.post("/:beaconId/rotate-qr", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "unauthorized", message: "Authentication required" }, 401);
    }

    const beaconId = c.req.param("beaconId");

    const supabase = getSupabaseClient(authHeader);

    const { data, error } = await supabase.rpc("rotate_beacon_qr", {
      p_beacon_id: beaconId,
    });

    if (error) {
      console.error("Rotate QR error:", error);
      
      if (error.message.includes("not_authorized")) {
        return c.json({ 
          error: "unauthorized", 
          message: "You don't own this beacon" 
        }, 403);
      }

      return c.json({ 
        error: "rotation_failed", 
        message: error.message || "Failed to rotate QR key" 
      }, 500);
    }

    return c.json(data);

  } catch (err: any) {
    console.error("Rotate QR route error:", err);
    return c.json({ 
      error: "server_error", 
      message: err.message || "Internal server error" 
    }, 500);
  }
});

export default app;
