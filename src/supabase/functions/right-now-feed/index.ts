// supabase/functions/right-now-feed/index.ts
// Public-ish RIGHT NOW FEED (read-only)
// Used by: homepage, map, globe overlays, Telegram "what's hot" summaries

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type TimeWindow = "live" | "10m" | "1h" | "24h";
type Intent = "hookup" | "crowd" | "drop" | "ticket" | "radio" | "care";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return cors(new Response("ok", { status: 200 }));
  }

  if (req.method !== "GET") {
    return cors(new Response("Method not allowed", { status: 405 }));
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city")?.trim() || null;
    const intent = url.searchParams.get("intent")?.trim() as Intent | null;
    const windowParam = (url.searchParams.get("window") ||
      "live") as TimeWindow;
    const limit = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("limit") || 40)),
    );

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );

    // Base query: only non-expired posts that opted into showing on globe/feed
    let q = supabase
      .from("right_now_posts")
      .select(
        `
        id,
        user_id,
        intent,
        text,
        city,
        country,
        room_mode,
        crowd_count,
        host_beacon_id,
        created_at,
        expires_at,
        show_on_globe,
        allow_anon_signals
      `,
      )
      .eq("show_on_globe", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(limit);

    // Filter by city (optional)
    if (city) {
      q = q.ilike("city", city); // case-insensitive match
    }

    // Filter by intent (optional) – e.g., only "hookup"
    if (intent) {
      q = q.eq("intent", intent);
    }

    // Time window filter (optional)
    const now = Date.now();
    let cutoffMs: number | null = null;

    switch (windowParam) {
      case "10m":
        cutoffMs = now - 10 * 60 * 1000;
        break;
      case "1h":
        cutoffMs = now - 60 * 60 * 1000;
        break;
      case "24h":
        cutoffMs = now - 24 * 60 * 60 * 1000;
        break;
      case "live":
      default:
        // "live" means "not expired" which we already filter,
        // but we can optionally tighten to last 90 minutes:
        cutoffMs = now - 90 * 60 * 1000;
        break;
    }

    if (cutoffMs !== null) {
      q = q.gte("created_at", new Date(cutoffMs).toISOString());
    }

    const { data, error } = await q;

    if (error) {
      console.error("right-now-feed query error:", error);
      return cors(json({ error: "Failed to load feed" }, 500));
    }

    // Never leak user_id directly to UI – we return anonymised handle stub
    const safe = (data || []).map((row) => ({
      id: row.id,
      intent: row.intent as Intent,
      text: row.text,
      city: row.city,
      country: row.country,
      roomMode: row.room_mode as "solo" | "host",
      crowdCount: row.crowd_count,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      hostBeaconId: row.host_beacon_id,
      allowAnonSignals: row.allow_anon_signals,
    }));

    return cors(json({ items: safe, window: windowParam }, 200));
  } catch (err) {
    console.error("right-now-feed fatal error:", err);
    return cors(json({ error: "Unexpected error" }, 500));
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return new Response(res.body, { status: res.status, headers });
}
