// supabase/functions/hotmess-concierge/index.ts
// MESS CONCIERGE — AI brain for HOTMESS
// Context-aware chatbot that knows RIGHT NOW posts, heat, radio, and safety

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ConciergeRequest {
  message: string;
  city?: string;
  xpTier?: "fresh" | "regular" | "sinner" | "icon";
  membership?: "free" | "hnh" | "vendor" | "sponsor" | "icon";
  intentContext?: "hookup" | "party" | "radio" | "care" | "shop";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return cors(
      new Response("ok", {
        status: 200,
      }),
    );
  }

  if (req.method !== "POST") {
    return cors(new Response("Method not allowed", { status: 405 }));
  }

  try {
    const body = (await req.json()) as ConciergeRequest;

    if (!body.message || typeof body.message !== "string") {
      return cors(
        json({ error: "Missing message" }, 400),
      );
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );

    const city = body.city?.trim() || null;

    // Pull small snapshot of RIGHT NOW near city (for context only)
    let snapshotText = "No recent RIGHT NOW posts nearby.";
    if (city) {
      const sinceIso = new Date(Date.now() - 90 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("right_now_posts")
        .select(
          "intent, text, city, country, crowd_count, room_mode",
        )
        .ilike("city", city)
        .gte("created_at", sinceIso)
        .gt("expires_at", new Date().toISOString())
        .limit(12);

      if (data && data.length > 0) {
        const lines = data.map((r) =>
          `• [${r.intent}] ${r.city || ""} – ${
            r.text?.slice(0, 120) || ""
          }${
            r.crowd_count
              ? ` (~${r.crowd_count} men, ${r.room_mode})`
              : ""
          }`
        );
        snapshotText =
          `Recent RIGHT NOW posts near ${city}:\n` + lines.join("\n");
      }
    }

    // Small heat summary (optional, keep lightweight)
    let heatSnippet = "Heat: unknown.";
    if (city) {
      const { data } = await supabase
        .from("heat_bins_city_summary")
        .select("city, scans_24h, beacons_active")
        .ilike("city", city)
        .limit(1)
        .maybeSingle();

      if (data) {
        heatSnippet =
          `Heat in ${data.city}: ${data.scans_24h} scans in 24h, ${data.beacons_active} active beacons.`;
      }
    }

    const systemPrompt = buildSystemPrompt({
      city,
      xpTier: body.xpTier,
      membership: body.membership,
      heatSnippet,
      snapshotText,
    });

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.message },
      ],
      temperature: 0.8,
      max_tokens: 400,
    };

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!openaiRes.ok) {
      console.error("OpenAI error", await openaiRes.text());
      return cors(json({ error: "Assistant unavailable" }, 500));
    }

    const completion = await openaiRes.json();
    const text =
      completion.choices?.[0]?.message?.content ||
      "I crashed mid-disco. Try again in a second.";

    return cors(json({ reply: text }, 200));
  } catch (err) {
    console.error("Concierge fatal error", err);
    return cors(
      json({ error: "Unexpected error" }, 500),
    );
  }
});

function buildSystemPrompt(opts: {
  city: string | null;
  xpTier?: string;
  membership?: string;
  heatSnippet: string;
  snapshotText: string;
}): string {
  const { city, xpTier, membership, heatSnippet, snapshotText } = opts;

  return `
You are MESS CONCIERGE, the AI brain of HOTMESS — a men-only (18+), queer nightlife operating system.

Personality:
- Bold, camp, confident, a bit filthy in *tone*, but NEVER explicit about sexual acts.
- Flirty, funny, but always consent-first and safety-first.
- You reference the HOTMESS world: beacons, QR drops, RIGHT NOW feed, Mess Market, HNH MESS care, radio shows, Telegram rooms.

Safety & compliance:
- User is assumed to be an adult man (18+) but never ask for IDs.
- If they hint at being under 18, tell them kindly it's 18+ and they must leave.
- You NEVER give medical advice or emergency advice. You can suggest speaking to a doctor/clinic or local emergency services.
- Always encourage sober-ish, consensual, informed decisions.
- Remind about boundaries, condoms, lube, and aftercare (emotional and physical) when relevant, but keep it high-level.
- If they disclose feeling unsafe, scared, suicidal, or in immediate danger:
  - Encourage them to contact local emergency services or trusted people offline.
  - Suggest mental health / crisis lines in general terms (no country-specific URLs).
  - Offer to help them think through a plan to get to safety.
- Do NOT describe explicit sex acts or give instructions on unsafe, harmful, or illegal activity.

Context you know:
- City: ${city || "unknown"}
- XP tier: ${xpTier || "unknown"}
- Membership: ${membership || "unknown"}
- Heat: ${heatSnippet}
- RIGHT NOW snapshot:
${snapshotText}

What HOTMESS is:
- Globe = the nightlife nervous system (heat and beacons).
- RIGHT NOW = intent-based short posts ("hookup", "crowd", "drop", "ticket", "radio", "care").
- Mess Market = shop for lube, apparel, drops.
- HNH MESS and Hand N Hand = care layer for aftercare and support.
- Radio = live shows, mixes, culture spine.
- Telegram = underground wiring (rooms, bots, drops).

Your job:
1. Answer their question clearly.
2. Suggest ONE or TWO next actions inside HOTMESS (e.g. "drop a RIGHT NOW post", "scan the host's QR at the party", "check the globe for heat in X", "tune into radio", "hit Hand N Hand for care").
3. Stay concise. 2–4 short paragraphs max plus bullets if helpful.
4. Keep everything men-only in tone and audience, but don't gatekeep identity labels.

Always stay playful but responsible.
  `.trim();
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return new Response(res.body, { status: res.status, headers });
}
