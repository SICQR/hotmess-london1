import { useState } from "react";
import { Sparkles, Send, Shield } from "lucide-react";

const INTENTS: {
  id: "hookup" | "crowd" | "drop" | "ticket" | "radio" | "care";
  label: string;
}[] = [
  { id: "hookup", label: "Hookup" },
  { id: "crowd", label: "Crowd / Party" },
  { id: "drop", label: "Drop / QR" },
  { id: "ticket", label: "Tickets" },
  { id: "radio", label: "Radio" },
  { id: "care", label: "Care / Support" },
];

export type MembershipTier = "free" | "hnh" | "vendor" | "sponsor" | "icon";
export type XpTier = "fresh" | "regular" | "sinner" | "icon";

export interface RightNowEntitlements {
  membership: MembershipTier;
  xpTier: XpTier;
  maxPostLength: number;
  maxRadiusKm: number;
  dailyPostLimit: number;
  canAttachMedia: boolean;
  canBoost: boolean;
}

export interface RightNowDraftPayload {
  intent: string;
  title: string;
  text: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  room_mode?: "solo" | "duo" | "small" | "big";
  crowd_count?: number | null;
  visibility_radius_m?: number | null;
}

interface RightNowComposerProps {
  apiBase: string; // supabase functions base (for AI draft)
  defaultCity?: string;
  defaultCountry?: string;
  lat?: number;
  lng?: number;
  entitlements: RightNowEntitlements;
  onSubmit: (payload: RightNowDraftPayload) => Promise<void> | void;
}

export function RightNowComposer({
  apiBase,
  defaultCity,
  defaultCountry,
  lat,
  lng,
  entitlements,
  onSubmit,
}: RightNowComposerProps) {
  const [intent, setIntent] =
    useState<RightNowDraftPayload["intent"]>("hookup");
  const [vibe, setVibe] = useState("");
  const [boundaries, setBoundaries] = useState(
    "Respect boundaries, no pressure, safe fun only.",
  );
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [roomMode, setRoomMode] =
    useState<RightNowDraftPayload["room_mode"]>("solo");
  const [crowdCount, setCrowdCount] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(
    entitlements.maxRadiusKm * 1000,
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxChars = entitlements.maxPostLength;
  const draftUrl = `${apiBase}/hotmess-right-now-draft`;

  async function handleAiSuggest() {
    if (!vibe.trim()) {
      setError("Give me a vibe first.");
      return;
    }
    setError(null);
    setAiLoading(true);

    try {
      const res = await fetch(draftUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: defaultCity,
          intent,
          vibe,
          boundaries,
          xpTier: entitlements.xpTier,
          membership: entitlements.membership,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      setTitle(json.title || "");
      setText(json.text?.slice(0, maxChars) || "");
      if (json.safety_note) {
        setBoundaries(json.safety_note);
      }
    } catch (err) {
      console.error("AI draft error", err);
      setError("Couldn't get a draft. Try again in a sec.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError("Your post needs at least one line.");
      return;
    }

    if (text.length > maxChars) {
      setError(`Keep it under ${maxChars} characters.`);
      return;
    }

    setPosting(true);
    try {
      await onSubmit({
        intent,
        title: title.trim() || text.slice(0, 40),
        text: text.trim(),
        city: defaultCity,
        country: defaultCountry,
        lat,
        lng,
        room_mode: roomMode,
        crowd_count: crowdCount,
        visibility_radius_m: radius,
      });
      setVibe("");
      setTitle("");
      setText("");
      setCrowdCount(null);
    } catch (err) {
      console.error("Post error", err);
      setError("Couldn't post RIGHT NOW. Try again.");
    } finally {
      setPosting(false);
    }
  }

  const charsUsed = text.length;
  const radiusKm = radius ? radius / 1000 : 0;

  const tierLabel =
    entitlements.membership === "free"
      ? "FREE"
      : entitlements.membership.toUpperCase();

  return (
    <form
      onSubmit={handleSubmit}
      className="hm-panel p-4 flex flex-col gap-3 text-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="hm-label">RIGHT NOW</div>
          <div className="font-semibold">
            Say what you want, right now.
          </div>
          <div className="text-[11px] text-white/50 mt-1">
            {tierLabel} • XP: {entitlements.xpTier.toUpperCase()} • Max{" "}
            {maxChars} chars • Up to {entitlements.maxRadiusKm}km radius
          </div>
        </div>
        <Shield className="w-4 h-4 text-white/60" />
      </div>

      {/* Intent chips */}
      <div className="flex flex-wrap gap-2">
        {INTENTS.map((i) => {
          const active = intent === i.id;
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => setIntent(i.id)}
              className={`hm-chip ${
                active ? "hm-chip-on" : "hm-chip-off"
              }`}
            >
              {i.label}
            </button>
          );
        })}
      </div>

      {/* Vibe + AI button */}
      <div className="flex flex-col gap-2">
        <label className="hm-label">Your vibe in one line</label>
        <div className="flex gap-2">
          <input
            className="hm-input flex-1"
            placeholder="At home in SE1, a bit wired, want something easy…"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={aiLoading || !vibe.trim()}
            className="hm-btn-secondary flex items-center gap-1 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            {aiLoading ? "DRAFTING…" : "AI SUGGEST"}
          </button>
        </div>
      </div>

      {/* Title + Text */}
      <div className="flex flex-col gap-2">
        <label className="hm-label">Headline</label>
        <input
          className="hm-input"
          placeholder="Keep it short and sharp"
          value={title}
          maxLength={40}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <label className="hm-label">Post</label>
          <span className="text-[11px] text-white/50">
            {charsUsed}/{maxChars}
          </span>
        </div>
        <textarea
          className="hm-input min-h-[80px] resize-none"
          placeholder="What you want, where you are, and the energy. No pressure, no essays."
          value={text}
          maxLength={maxChars}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Boundaries */}
      <div className="flex flex-col gap-2">
        <label className="hm-label">Boundaries / ground rules</label>
        <textarea
          className="hm-input min-h-[60px] resize-none"
          value={boundaries}
          onChange={(e) => setBoundaries(e.target.value)}
        />
        <p className="text-[11px] text-white/50">
          Say what&apos;s on and what&apos;s off. You can always say no or change your
          mind.
        </p>
      </div>

      {/* Room mode + crowd + radius */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="hm-label">Mode</label>
          <select
            className="hm-input"
            value={roomMode}
            onChange={(e) =>
              setRoomMode(
                e.target.value as RightNowDraftPayload["room_mode"],
              )}
          >
            <option value="solo">Solo</option>
            <option value="duo">Duo</option>
            <option value="small">3–6</option>
            <option value="big">7+</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="hm-label">Men there</label>
          <input
            type="number"
            min={0}
            className="hm-input"
            placeholder="0"
            value={crowdCount ?? ""}
            onChange={(e) =>
              setCrowdCount(
                e.target.value ? Number(e.target.value) : null,
              )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="hm-label">Radius km</label>
          <input
            type="number"
            min={1}
            max={entitlements.maxRadiusKm}
            className="hm-input"
            value={radiusKm || ""}
            onChange={(e) => {
              const km = e.target.value ? Number(e.target.value) : NaN;
              if (Number.isNaN(km)) {
                setRadius(null);
              } else {
                const clamped = Math.min(
                  Math.max(km, 1),
                  entitlements.maxRadiusKm,
                );
                setRadius(clamped * 1000);
              }
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-xs text-hotmess-pink font-medium">{error}</div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={posting || !text.trim()}
        className="hm-btn-primary flex items-center justify-center gap-2 mt-2"
      >
        <Send className="w-4 h-4" />
        {posting ? "POSTING…" : "POST RIGHT NOW"}
      </button>

      {/* Safety / care line */}
      <div className="flex items-start gap-2 mt-1 text-[11px] text-white/45">
        <Shield className="w-3 h-3 mt-0.5" />
        <p>
          Men-only, 18+. Care, not clinic. We show heat and options, not medical
          or emergency advice. If you feel unsafe, step back and reach out to
          someone you trust or local services.
        </p>
      </div>
    </form>
  );
}
