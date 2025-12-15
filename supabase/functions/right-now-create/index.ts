// supabase/functions/right-now-create/index.ts
// RIGHT NOW /create — creates a live pulse, awards XP, pushes into heat + Telegram outbox

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type RightNowIntent = "hookup" | "crowd" | "drop" | "ticket" | "radio" | "care";

interface CreateBody {
  intent: RightNowIntent;
  text: string;
  city: string;
  country?: string | null;
  roomMode?: "solo" | "host";
  crowdCount?: number | null;
  hostQrCode?: string | null;
  shareToTelegram?: boolean;
  showOnGlobe?: boolean;
  allowAnonSignals?: boolean;
}

serve(async (req) => {
  // Only POST
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Supabase client (service role for DB work, but we'll still respect user auth)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    // ─────────────────────────────────────────
    // 1. AUTH – men-only 18+ enforced upstream
    // ─────────────────────────────────────────
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "").trim();

    if (!jwt) {
      return json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;

    // ─────────────────────────────────────────
    // 2. BODY + VALIDATION
    // ─────────────────────────────────────────
    const body = (await req.json()) as CreateBody;

    const intent = body.intent;
    const text = (body.text || "").trim();
    const city = (body.city || "").trim();
    const country = (body.country || "")?.trim() || null;
    const roomMode: "solo" | "host" = body.roomMode === "host" ? "host" : "solo";
    const crowdCount =
      roomMode === "host" && typeof body.crowdCount === "number"
        ? Math.max(2, Math.min(200, body.crowdCount))
        : null;
    const hostQrCode =
      roomMode === "host" && body.hostQrCode && body.hostQrCode.trim().length > 0
        ? body.hostQrCode.trim()
        : null;

    const shareToTelegram = Boolean(body.shareToTelegram);
    const showOnGlobe = body.showOnGlobe !== false; // default true
    const allowAnonSignals = body.allowAnonSignals !== false; // default true

    // Basic guardrails
    const allowedIntents: RightNowIntent[] = [
      "hookup",
      "crowd",
      "drop",
      "ticket",
      "radio",
      "care",
    ];
    if (!allowedIntents.includes(intent)) {
      return json({ error: "Invalid intent" }, 400);
    }

    if (text.length < 10 || text.length > 240) {
      return json({ error: "Text must be between 10 and 240 characters" }, 400);
    }

    if (!city) {
      return json({ error: "City is required" }, 400);
    }

    // ─────────────────────────────────────────
    // 3. TTL / EXPIRY – default 60 mins
    // (membership tiers can later extend this)
    // ─────────────────────────────────────────
    const now = new Date();
    const ttlMinutes = 60;
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString();

    // ─────────────────────────────────────────
    // 4. LOOKUP HOST BEACON (IF ANY)
    // ─────────────────────────────────────────
    let hostBeaconId: string | null = null;

    if (hostQrCode) {
      // [Assumption] You have a beacons table with a column "code"
      const { data: beacon, error: beaconError } = await supabase
        .from("beacons")
        .select("id")
        .eq("code", hostQrCode)
        .eq("active", true)
        .maybeSingle();

      if (!beaconError && beacon) {
        hostBeaconId = beacon.id;
      }
    }

    // ─────────────────────────────────────────
    // 5. INSERT RIGHT NOW POST
    // ─────────────────────────────────────────
    // [Assumption] Table: right_now_posts
    const { data: post, error: insertError } = await supabase
      .from("right_now_posts")
      .insert({
        user_id: userId,
        intent,
        text,
        city,
        country,
        room_mode: roomMode,
        crowd_count: crowdCount,
        host_beacon_id: hostBeaconId,
        source: "app", // vs "telegram"
        show_on_globe: showOnGlobe,
        share_to_telegram: shareToTelegram,
        allow_anon_signals: allowAnonSignals,
        expires_at: expiresAt,
      })
      .select("*")
      .single();

    if (insertError || !post) {
      console.error("RIGHT NOW insert error:", insertError);
      return json({ error: "Failed to create RIGHT NOW post" }, 500);
    }

    // ─────────────────────────────────────────
    // 6. AWARD XP (Addiction loop)
    // ─────────────────────────────────────────
    // [Assumption] Postgres function: award_xp(user_id, amount, reason)
    // You can make amount/tier dynamic later.
    const XP_AMOUNT = 10;

    const { error: xpError } = await supabase.rpc("award_xp", {
      p_user_id: userId,
      p_amount: XP_AMOUNT,
      p_reason: "right_now_post",
    });

    if (xpError) {
      console.error("award_xp error:", xpError);
      // Not fatal – we still return success for the post.
    }

    // ─────────────────────────────────────────
    // 7. HEAT EVENT – for globe/heat maps
    // ─────────────────────────────────────────
    if (showOnGlobe) {
      // [Assumption] Table: heat_events
      // (You can also aggregate into heat_bins via a job.)
      const { error: heatError } = await supabase.from("heat_events").insert({
        user_id: userId,
        city,
        country,
        source: "right_now",
        intent,
        crowd_count: crowdCount,
        beacon_id: hostBeaconId,
        created_at: now.toISOString(),
      });

      if (heatError) {
        console.error("heat_events insert error:", heatError);
      }
    }

    // ─────────────────────────────────────────
    // 8. TELEGRAM OUTBOX – mirror to rooms
    // ─────────────────────────────────────────
    if (shareToTelegram) {
      // [Assumption] Table: telegram_outbox
      // Worker / separate function will actually send the message.
      const summary = buildTelegramSummary({ intent, text, city, country, expiresAt });

      const { error: tgError } = await supabase.from("telegram_outbox").insert({
        // let your worker figure out which chats to send to, based on user_id & city
        user_id: userId,
        post_id: post.id,
        payload: summary,
        status: "pending",
      });

      if (tgError) {
        console.error("telegram_outbox insert error:", tgError);
      }
    }

    // ─────────────────────────────────────────
    // 9. RESPONSE
    // ─────────────────────────────────────────
    return json(
      {
        post,
        xp_awarded: XP_AMOUNT,
        ttl_minutes: ttlMinutes,
      },
      200,
    );
  } catch (err) {
    console.error("RIGHT NOW create fatal error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // tighten later if needed
    },
  });
}

function buildTelegramSummary(args: {
  intent: RightNowIntent;
  text: string;
  city: string;
  country: string | null;
  expiresAt: string;
}): string {
  const label =
    args.intent === "hookup"
      ? "HOOKUP"
      : args.intent === "crowd"
      ? "CROWD"
      : args.intent === "drop"
      ? "DROP"
      : args.intent === "ticket"
      ? "TICKET"
      : args.intent === "radio"
      ? "RADIO"
      : "CARE";

  const where = args.country ? `${args.city}, ${args.country}` : args.city;
  return [
    `🔴 RIGHT NOW · ${label}`,
    `"${args.text}"`,
    ``,
    `📍 ${where}`,
    `⏱ Expires soon`,
  ].join("\n");
}
