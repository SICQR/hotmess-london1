// beaconTypes.ts
// Single source of truth for HOTMESS Beacons UI + logic.
// Drives: pin ring colour (accent), badge, tooltip, card copy, CTA labels, permission chips, notifications,
// and urgency behaviour (purely time-driven).

export type BeaconType =
  | "checkin"
  | "connect"
  | "hookup"
  | "ticket"
  | "drop"
  | "content"
  | "radio"
  | "care"
  | "pulse"
  | "sponsor";

export type AccentToken =
  | "ACCENT_NEUTRAL"
  | "ACCENT_CARE"
  | "ACCENT_CONNECT"
  | "ACCENT_HOOKUP"
  | "ACCENT_TICKET"
  | "ACCENT_DROP"
  | "ACCENT_CONTENT"
  | "ACCENT_RADIO";

export type RequirementChip = "PREMIUM" | "GPS" | "AGE_18" | "CONSENT";

export type NotifyCategory =
  | "NEARBY"
  | "HOOKUPS"
  | "DROPS"
  | "RADIO"
  | "CONTENT"
  | "TICKETS"
  | "CARE"
  | "PULSE";

export type TimerPresetHours = 3 | 6 | 9;

export type UrgencyTier = "CALM" | "NUDGE" | "FINAL" | "CRITICAL" | "EXPIRED";

export type IconName =
  // lucide-react names (recommended) or your own icon keyset:
  | "QrCode"
  | "MapPin"
  | "Users"
  | "MessageCircle"
  | "Zap"
  | "Ticket"
  | "ShoppingBag"
  | "Play"
  | "HeartHandshake"
  | "Activity"
  | "BadgeInfo"
  | "Lock"
  | "LocateFixed"
  | "ShieldAlert"
  | "Share2"
  | "Bookmark";

export type BeaconTypeConfig = {
  type: BeaconType;
  label: string;              // Short badge label (1–2 words)
  icon: IconName;             // Icon to pair w label (never colour-only)
  accent: AccentToken;        // Used ONLY as accent (pin ring + badge header)
  tooltip: string;            // Map tooltip line (tight)
  defaultCTA: {
    label: string;
    route: string;            // app route to open on "Do the thing"
  };
  requirements: RequirementChip[];    // UI chips + enforcement
  notifyCategory: NotifyCategory;      // notification scoping
  defaultTimerPresetHours: TimerPresetHours; // your 3/6/9 default
  sponsorable: boolean;       // whether this type can be sponsored
};

export const BEACON_TYPE_CONFIG: Record<BeaconType, BeaconTypeConfig> = {
  checkin: {
    type: "checkin",
    label: "CHECK-IN",
    icon: "MapPin",
    accent: "ACCENT_NEUTRAL",
    tooltip: "Mark presence for this window.",
    defaultCTA: { label: "Check In", route: "/community/check-in" },
    requirements: ["AGE_18"],
    notifyCategory: "NEARBY",
    defaultTimerPresetHours: 6,
    sponsorable: false,
  },

  connect: {
    type: "connect",
    label: "CONNECT",
    icon: "Users",
    accent: "ACCENT_CONNECT",
    tooltip: "Mutual opt-in connection flow.",
    defaultCTA: { label: "Start Connect", route: "/community/connect" },
    requirements: ["AGE_18", "CONSENT", "PREMIUM"],
    notifyCategory: "NEARBY",
    defaultTimerPresetHours: 3,
    sponsorable: false,
  },

  hookup: {
    type: "hookup",
    label: "HOOK-UP",
    icon: "Zap",
    accent: "ACCENT_HOOKUP",
    tooltip: "Men in this zone. Consent-first.",
    defaultCTA: { label: "Connect", route: "/hookup" },
    requirements: ["AGE_18", "CONSENT"],
    notifyCategory: "HOOKUPS",
    defaultTimerPresetHours: 3,
    sponsorable: false,
  },

  ticket: {
    type: "ticket",
    label: "TICKETS",
    icon: "Ticket",
    accent: "ACCENT_TICKET",
    tooltip: "Buy/sell with safety rules.",
    defaultCTA: { label: "View Tickets", route: "/tickets" },
    requirements: ["AGE_18", "CONSENT"],
    notifyCategory: "TICKETS",
    defaultTimerPresetHours: 3,
    sponsorable: false,
  },

  drop: {
    type: "drop",
    label: "DROP",
    icon: "ShoppingBag",
    accent: "ACCENT_DROP",
    tooltip: "Timed product drop.",
    defaultCTA: { label: "Shop Drop", route: "/shop/drops" },
    requirements: ["AGE_18"],
    notifyCategory: "DROPS",
    defaultTimerPresetHours: 3,
    sponsorable: true,
  },

  content: {
    type: "content",
    label: "RELEASE",
    icon: "BadgeInfo",
    accent: "ACCENT_CONTENT",
    tooltip: "Unlock a timed release.",
    defaultCTA: { label: "Unlock", route: "/radio/releases" },
    requirements: ["AGE_18", "PREMIUM"],
    notifyCategory: "CONTENT",
    defaultTimerPresetHours: 6,
    sponsorable: true,
  },

  radio: {
    type: "radio",
    label: "LIVE",
    icon: "Play",
    accent: "ACCENT_RADIO",
    tooltip: "Listen live + optional room.",
    defaultCTA: { label: "Listen Live", route: "/radio/live" },
    requirements: ["AGE_18"],
    notifyCategory: "RADIO",
    defaultTimerPresetHours: 6,
    sponsorable: true,
  },

  care: {
    type: "care",
    label: "CARE",
    icon: "HeartHandshake",
    accent: "ACCENT_CARE",
    tooltip: "Support + safe landing links.",
    defaultCTA: { label: "Open Care", route: "/care" },
    requirements: ["AGE_18"],
    notifyCategory: "CARE",
    defaultTimerPresetHours: 9,
    sponsorable: false,
  },

  pulse: {
    type: "pulse",
    label: "PULSE",
    icon: "Activity",
    accent: "ACCENT_NEUTRAL",
    tooltip: "What's active right now.",
    defaultCTA: { label: "Open Live Now", route: "/map?view=live" },
    requirements: ["AGE_18"],
    notifyCategory: "PULSE",
    defaultTimerPresetHours: 3,
    sponsorable: true,
  },

  sponsor: {
    type: "sponsor",
    label: "SPONSORED",
    icon: "BadgeInfo",
    // IMPORTANT: sponsors should inherit the underlying beacon type accent in UI.
    // This is a fallback token only; your renderer should use `underlyingType` when present.
    accent: "ACCENT_NEUTRAL",
    tooltip: "Sponsored activation. Disclosure inside.",
    defaultCTA: { label: "Open", route: "/map" },
    requirements: ["AGE_18"],
    notifyCategory: "PULSE",
    defaultTimerPresetHours: 6,
    sponsorable: false,
  },
};

// -------------------------------
// Urgency: time-driven, type-agnostic
// -------------------------------
export function getUrgencyTier(opts: {
  nowMs: number;
  expiresAtMs: number;
}): UrgencyTier {
  const remainingMs = opts.expiresAtMs - opts.nowMs;
  if (remainingMs <= 0) return "EXPIRED";

  const minutes = remainingMs / (60 * 1000);
  if (minutes < 3) return "CRITICAL";
  if (minutes < 15) return "FINAL";
  if (minutes < 60) return "NUDGE";
  return "CALM";
}

export function urgencyUI(tier: UrgencyTier) {
  // Keep this minimal: styling decisions happen in your components.
  // This returns intent flags, NOT colours (colour is type identity).
  return {
    pulse: tier === "FINAL" || tier === "CRITICAL",
    pulseRateMs: tier === "CRITICAL" ? 1200 : tier === "FINAL" ? 2200 : 0,
    emphasizeTimer: tier === "NUDGE" || tier === "FINAL" || tier === "CRITICAL",
    ghost: tier === "EXPIRED",
  };
}

// -------------------------------
// Helper: pin / card badges
// -------------------------------
export function getBeaconPresentation(args: {
  type: BeaconType;
  isSponsored?: boolean;
  underlyingType?: BeaconType; // for sponsor beacons: preserve the real type colour
}) {
  const baseType = args.isSponsored && args.underlyingType ? args.underlyingType : args.type;
  const cfg = BEACON_TYPE_CONFIG[baseType];
  return {
    ...cfg,
    sponsoredBadge: Boolean(args.isSponsored),
    sponsoredLabel: args.isSponsored ? "SPONSORED" : null,
  };
}

// -------------------------------
// Requirement checks (enforcement gates)
// -------------------------------
export type GateContext = {
  isAuthed: boolean;
  isPremium: boolean;
  hasAgeConfirmed: boolean;
  hasConsentConfirmed: boolean;
  locationAllowed: boolean;
  gpsVerified: boolean; // result of proximity check if required
};

export function getMissingRequirements(
  required: RequirementChip[],
  ctx: GateContext
): RequirementChip[] {
  const missing: RequirementChip[] = [];
  for (const r of required) {
    if (r === "PREMIUM" && !ctx.isPremium) missing.push(r);
    if (r === "AGE_18" && !ctx.hasAgeConfirmed) missing.push(r);
    if (r === "CONSENT" && !ctx.hasConsentConfirmed) missing.push(r);
    if (r === "GPS" && !(ctx.locationAllowed && ctx.gpsVerified)) missing.push(r);
  }
  return missing;
}

export function requirementChipLabel(chip: RequirementChip) {
  switch (chip) {
    case "PREMIUM":
      return "Premium";
    case "GPS":
      return "GPS Verify";
    case "AGE_18":
      return "18+";
    case "CONSENT":
      return "Consent";
  }
}