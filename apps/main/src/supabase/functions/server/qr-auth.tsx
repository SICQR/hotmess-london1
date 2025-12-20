/**
 * QR Authentication Endpoints for HOTMESS LONDON
 * Implements secure desktop ↔ phone QR login flow using KV store
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS for frontend
app.use("*", cors());

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Crypto utilities
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// KV Keys
const QR_TOKEN_KEY = (tokenHash: string) => `qr_token:${tokenHash}`;
const QR_EXCHANGE_KEY = (tokenHash: string) => `qr_exchange:${tokenHash}`;

/**
 * POST /qr/create
 * Create a new QR login token (desktop initiates)
 */
app.post("/qr/create", async (c) => {
  try {
    const token = randomToken(32);
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 90_000); // 90 seconds

    const req = c.req.raw;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const ipHash = ip ? await sha256(ip) : null;
    const userAgent = req.headers.get("user-agent") || null;

    // Store in KV
    const tokenData = {
      token_hash: tokenHash,
      status: "pending",
      requested_ip_hash: ipHash,
      user_agent: userAgent,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    };

    await kv.set(QR_TOKEN_KEY(tokenHash), JSON.stringify(tokenData));

    // Generate QR URL - use current deployment URL
    const siteUrl = Deno.env.get("SITE_URL") || req.headers.get("origin") || "http://localhost:5173";
    const qrUrl = `${siteUrl}?qr=${encodeURIComponent(token)}`;

    console.log(`[QR Create] Created token, expires at ${expiresAt.toISOString()}`);

    return c.json({
      ok: true,
      token,
      qrUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("QR create exception:", err);
    return c.json({ ok: false, error: "server_error", message: String(err) }, 500);
  }
});

/**
 * GET /qr/status?token=...
 * Poll QR token status (desktop polls this)
 */
app.get("/qr/status", async (c) => {
  try {
    const token = c.req.query("token");
    if (!token) {
      return c.json({ ok: false, error: "missing_token" }, 400);
    }

    const tokenHash = await sha256(token);
    const tokenDataStr = await kv.get(QR_TOKEN_KEY(tokenHash));

    if (!tokenDataStr) {
      return c.json({ ok: false, error: "not_found" }, 404);
    }

    const tokenData = JSON.parse(tokenDataStr);

    // Check expiry
    const expired = new Date(tokenData.expires_at).getTime() < Date.now();
    const status = expired && tokenData.status === "pending" ? "expired" : tokenData.status;

    console.log(`[QR Status] Token status: ${status}`);

    return c.json({ ok: true, status });
  } catch (err) {
    console.error("QR status exception:", err);
    return c.json({ ok: false, error: "server_error" }, 500);
  }
});

/**
 * POST /qr/approve
 * Approve QR login (mobile, requires auth)
 * Body: { token: string }
 */
app.post("/qr/approve", async (c) => {
  try {
    const req = c.req.raw;

    // Extract user from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ ok: false, error: "unauthorized" }, 401);
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("QR approve auth error:", userError);
      return c.json({ ok: false, error: "unauthorized" }, 401);
    }

    // Get token from body
    const body = await c.req.json().catch(() => ({}));
    const token = body.token;

    if (!token) {
      return c.json({ ok: false, error: "missing_token" }, 400);
    }

    const tokenHash = await sha256(token);

    // Fetch token data from KV
    const tokenDataStr = await kv.get(QR_TOKEN_KEY(tokenHash));
    if (!tokenDataStr) {
      return c.json({ ok: false, error: "not_found" }, 404);
    }

    const tokenData = JSON.parse(tokenDataStr);

    // Check expiry
    if (new Date(tokenData.expires_at).getTime() < Date.now()) {
      return c.json({ ok: false, error: "expired" }, 410);
    }

    // Check status
    if (tokenData.status !== "pending") {
      return c.json({ ok: false, error: "not_pending" }, 409);
    }

    // Generate exchange code
    const exchange = randomToken(32);
    const exchangeHash = await sha256(exchange);

    // Update token to approved
    tokenData.status = "approved";
    tokenData.approved_user_id = user.id;
    tokenData.exchange_code_hash = exchangeHash;
    tokenData.approved_at = new Date().toISOString();

    await kv.set(QR_TOKEN_KEY(tokenHash), JSON.stringify(tokenData));

    // Store exchange code in KV for desktop to consume
    await kv.set(QR_EXCHANGE_KEY(tokenHash), exchange);

    console.log(`[QR Approve] Token approved by user ${user.id}`);

    return c.json({ ok: true });
  } catch (err) {
    console.error("QR approve exception:", err);
    return c.json({ ok: false, error: "server_error" }, 500);
  }
});

/**
 * POST /qr/consume
 * Consume approved QR token (desktop, no auth required yet)
 * Body: { token: string }
 * Returns: { ok: true, userId: string, accessToken: string, refreshToken: string, redirectTo: string }
 */
app.post("/qr/consume", async (c) => {
  try {
    const req = c.req.raw;
    const body = await c.req.json().catch(() => ({}));
    const token = body.token;

    if (!token) {
      return c.json({ ok: false, error: "missing_token" }, 400);
    }

    const tokenHash = await sha256(token);

    // Fetch token data from KV
    const tokenDataStr = await kv.get(QR_TOKEN_KEY(tokenHash));
    if (!tokenDataStr) {
      return c.json({ ok: false, error: "not_found" }, 404);
    }

    const tokenData = JSON.parse(tokenDataStr);

    // Check expiry
    if (new Date(tokenData.expires_at).getTime() < Date.now()) {
      return c.json({ ok: false, error: "expired" }, 410);
    }

    // Check status and user
    if (tokenData.status !== "approved" || !tokenData.approved_user_id) {
      return c.json({ ok: false, error: "not_approved" }, 409);
    }

    // Verify exchange code exists
    const exchangeCode = await kv.get(QR_EXCHANGE_KEY(tokenHash));
    if (!exchangeCode) {
      return c.json({ ok: false, error: "exchange_missing" }, 500);
    }

    // Mark as used
    tokenData.status = "used";
    tokenData.used_at = new Date().toISOString();
    await kv.set(QR_TOKEN_KEY(tokenHash), JSON.stringify(tokenData));

    // Delete exchange code
    await kv.del(QR_EXCHANGE_KEY(tokenHash));

    // Create a Supabase session for the user (admin createSession)
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: tokenData.approved_user_id,
    });

    if (sessionError || !sessionData.session) {
      console.error("Session creation error:", sessionError);
      return c.json({ ok: false, error: "session_failed" }, 500);
    }

    console.log(`[QR Consume] Session created for user ${tokenData.approved_user_id}`);

    return c.json({
      ok: true,
      userId: tokenData.approved_user_id,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      redirectTo: "/account",
    });
  } catch (err) {
    console.error("QR consume exception:", err);
    return c.json({ ok: false, error: "server_error" }, 500);
  }
});

/**
 * POST /qr/cancel
 * Cancel a pending QR token (mobile or desktop)
 * Body: { token: string }
 */
app.post("/qr/cancel", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const token = body.token;

    if (!token) {
      return c.json({ ok: false, error: "missing_token" }, 400);
    }

    const tokenHash = await sha256(token);
    const tokenDataStr = await kv.get(QR_TOKEN_KEY(tokenHash));

    if (tokenDataStr) {
      const tokenData = JSON.parse(tokenDataStr);
      if (tokenData.status === "pending") {
        tokenData.status = "cancelled";
        tokenData.cancelled_at = new Date().toISOString();
        await kv.set(QR_TOKEN_KEY(tokenHash), JSON.stringify(tokenData));
        console.log(`[QR Cancel] Token cancelled`);
      }
    }

    return c.json({ ok: true });
  } catch (err) {
    console.error("QR cancel exception:", err);
    return c.json({ ok: false, error: "server_error" }, 500);
  }
});

export default app;
