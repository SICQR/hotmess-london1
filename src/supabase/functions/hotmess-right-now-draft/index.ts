/**
 * HOTMESS RIGHT NOW DRAFT — AI-powered post suggestions
 * 
 * Takes user vibe + intent + context and returns:
 * - title: short headline (max 40 chars)
 * - text: post body (respects membership char limits)
 * - safety_note: contextual boundary guidance (optional)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface DraftRequest {
  city?: string;
  intent: "hookup" | "crowd" | "drop" | "ticket" | "radio" | "care";
  vibe: string;
  boundaries?: string;
  xpTier: "fresh" | "regular" | "sinner" | "icon";
  membership: "free" | "hnh" | "vendor" | "sponsor" | "icon";
}

interface DraftResponse {
  title: string;
  text: string;
  safety_note?: string;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: DraftRequest = await req.json();
    const { city, intent, vibe, boundaries, xpTier, membership } = payload;

    if (!vibe?.trim()) {
      return new Response(
        JSON.stringify({ error: "Vibe is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // TODO: Call OpenAI or another LLM with system prompt
    // System prompt should:
    // - Keep it masculine, direct, no fluff
    // - Match HOTMESS tone (care-first, kink-aware, explicit but not crass)
    // - Respect character limits based on membership
    // - Include safety notes for "care" or "hookup" intents
    // - Use city context if provided

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      // Fallback: return a simple template-based draft
      const draft = generateSimpleDraft(intent, vibe, city, membership);
      return new Response(
        JSON.stringify(draft),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI API
    const systemPrompt = buildSystemPrompt(intent, membership, xpTier, city);
    const userPrompt = `Vibe: "${vibe}"\n\nWrite a tight, masculine RIGHT NOW post. ${getIntentGuidance(intent)}`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("OpenAI API error:", errorText);
      throw new Error("AI draft failed");
    }

    const openaiData = await openaiRes.json();
    const aiText = openaiData.choices[0]?.message?.content?.trim() || "";

    // Parse AI response (expects JSON with title, text, safety_note)
    const draft = parseAiDraft(aiText, membership);

    return new Response(
      JSON.stringify(draft),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in hotmess-right-now-draft:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildSystemPrompt(
  intent: string,
  membership: string,
  xpTier: string,
  city?: string
): string {
  const maxChars = getMaxChars(membership);
  return `You are a masculine, direct, care-first copywriter for HOTMESS LONDON, a queer men's nightlife OS.

User wants to post a "${intent}" RIGHT NOW signal. They're a ${membership.toUpperCase()} member (${xpTier} XP tier) ${city ? `in ${city}` : ""}.

Your response MUST be valid JSON with this structure:
{
  "title": "short headline (max 40 chars)",
  "text": "post body (max ${maxChars} chars)",
  "safety_note": "optional boundary guidance"
}

TONE:
- Masculine, direct, no fluff
- Explicit but not crass (we say "fucking" not "love-making")
- Care-first: boundaries matter, consent is non-negotiable
- Kink-aware but not clinical

INTENT GUIDANCE:
${getIntentGuidance(intent)}

Keep it tight. No essays. This expires in 60 minutes.`;
}

function getIntentGuidance(intent: string): string {
  switch (intent) {
    case "hookup":
      return "Direct about what you want. Include energy, location vibe, and what's on the table. Add a safety note about meeting in public first or checking in with a friend.";
    case "crowd":
      return "Party or gathering. How many men, what's the vibe, what's happening. Include rough location and time.";
    case "drop":
      return "Selling or trading gear. What you have, condition, price/trade, meetup info.";
    case "ticket":
      return "Event or club night. What event, when, where, how many tickets, price.";
    case "radio":
      return "Listening to HOTMESS Radio at home. Vibe check, what you're into, open to chat or company.";
    case "care":
      return "Not looking for sex. Need aftercare, someone to talk to, or support. Be gentle but direct. Safety note should include local support resources.";
    default:
      return "Keep it direct and masculine.";
  }
}

function getMaxChars(membership: string): number {
  switch (membership) {
    case "icon": return 600;
    case "vendor":
    case "sponsor": return 500;
    case "hnh": return 400;
    default: return 200;
  }
}

function parseAiDraft(aiText: string, membership: string): DraftResponse {
  try {
    // Try to extract JSON from AI response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: (parsed.title || "RIGHT NOW").slice(0, 40),
        text: (parsed.text || "").slice(0, getMaxChars(membership)),
        safety_note: parsed.safety_note,
      };
    }
  } catch (e) {
    console.error("Failed to parse AI JSON:", e);
  }

  // Fallback: treat entire response as text
  const lines = aiText.split("\n").filter(l => l.trim());
  return {
    title: lines[0]?.slice(0, 40) || "RIGHT NOW",
    text: lines.slice(1).join(" ").slice(0, getMaxChars(membership)) || aiText.slice(0, getMaxChars(membership)),
  };
}

function generateSimpleDraft(
  intent: string,
  vibe: string,
  city?: string,
  membership?: string
): DraftResponse {
  // Simple template-based fallback when OpenAI is not available
  const maxChars = getMaxChars(membership || "free");
  const location = city ? `${city} • ` : "";
  
  const templates: Record<string, { title: string; text: string; safety?: string }> = {
    hookup: {
      title: `${location}Now • ${vibe.slice(0, 20)}`,
      text: `${vibe}. Direct, no pressure. Let's see if we vibe.`,
      safety: "Meet in public first if you want. Check in with a friend. Always okay to say no.",
    },
    crowd: {
      title: `${location}Party • Tonight`,
      text: `${vibe}. Good energy, good men. Come through if you're nearby.`,
    },
    drop: {
      title: `${location}Gear • ${vibe.slice(0, 15)}`,
      text: `${vibe}. DM for details. Local meetup preferred.`,
    },
    ticket: {
      title: `${location}Tickets • Event`,
      text: `${vibe}. Hit me up if you're interested.`,
    },
    radio: {
      title: `${location}Radio • Vibing`,
      text: `${vibe}. Listening to HOTMESS Radio. Down to chat or have company.`,
    },
    care: {
      title: `${location}Support needed`,
      text: `${vibe}. Not looking for sex. Just need someone to talk to or hang with.`,
      safety: "You're not alone. If you're in crisis, contact local emergency services or a support line. This is a community space, not clinical support.",
    },
  };

  const template = templates[intent] || templates.hookup;
  
  return {
    title: template.title.slice(0, 40),
    text: template.text.slice(0, maxChars),
    safety_note: template.safety,
  };
}
