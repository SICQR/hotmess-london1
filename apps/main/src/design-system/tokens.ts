/**
 * HOTMESS UX WRITING SYSTEM
 * Component-level microcopy tokens
 * Figma-ready, production-grade
 */

// ==========================================
// GLOBAL TONE TOKENS
// ==========================================

export const TONE_TOKENS = {
  sweat: "earned in sweat",
  held: "stay held",
  loud: "stay loud",
  care: "care dressed as kink",
  freq: "wrong frequency",
  zone: "zone heat rising",
  drop: "blink and you'll miss it",
  brotherhood: "we look after our own",
  nightFaith: "the night reacts",
  scanSweat: "scan. sweat. repeat.",
  tooMuch: "always too much, never enough",
  notAlone: "you're not alone, mate",
} as const;

// ==========================================
// BUTTONS
// ==========================================

export const BUTTONS = {
  primary: {
    enterMess: "Enter the Mess",
    scanBeacon: "Scan Beacon",
    listenLive: "Listen Live",
    shopHeat: "Shop the Heat",
    redeemReward: "Redeem Reward",
    startDrop: "Start Drop",
    joinZone: "Join Zone",
  },
  secondary: {
    viewMap: "View Map",
    seeDetails: "See Details",
    openProfile: "Open Profile",
    exploreRewards: "Explore Rewards",
    checkXP: "Check XP",
    addToCart: "Add to Cart",
  },
  tertiary: {
    back: "Back",
    close: "Close",
    done: "Done",
    save: "Save",
    update: "Update",
  },
} as const;

// ==========================================
// FORMS & INPUTS
// ==========================================

export const FORMS = {
  email: {
    label: "Email",
    helper: "We don't spam. We barely even text.",
    error: "Something's off — check the address.",
  },
  name: {
    label: "Name (real or not)",
    helper: "Just keep it respectful.",
    error: "Too short — give us something to call you.",
  },
  password: {
    label: "Password",
    helper: "Strong is good. Strange is better.",
    error: "That won't hold. Try again.",
  },
  verification: {
    label: "6-digit code",
    error: "Incorrect code — breathe and retry.",
  },
} as const;

// ==========================================
// NOTIFICATIONS
// ==========================================

export const NOTIFICATIONS = {
  success: {
    default: "Done. Smooth as sweat.",
    rewardUnlocked: "Reward unlocked — flex it.",
    saved: "Saved. Back to the heat.",
  },
  warning: {
    default: "Easy — something's shaky.",
    streakRisk: "Streak at risk. Tap in.",
  },
  error: {
    default: "Wrong move. Try again.",
    connectionLost: "Connection slipped — reconnect.",
    actionFailed: "That didn't land. Fix and retry.",
  },
} as const;

// ==========================================
// CONSENT & SAFETY
// ==========================================

export const CONSENT = {
  checkboxes: [
    "I understand this is adult content.",
    "I know I can leave anytime.",
    "I agree to be respectful.",
    "I understand aftercare = information, not medical advice.",
  ],
  safetyNotice: "Take your time, mate. If you're spinning, step out and breathe. Hand N Hand is here if you need grounding.",
  emergencyCTA: "Get help now",
} as const;

// ==========================================
// CARE (HAND N HAND)
// ==========================================

export const CARE = {
  hero: "Hand N Hand — the only place to land.",
  sections: {
    wobbly: {
      title: "Feeling wobbly?",
      description: "We've been there. Let's steady you.",
    },
    mate: {
      title: "Checking on a mate?",
      description: "Good man. Here's what to look for.",
    },
    grounding: {
      title: "Need grounding?",
      description: "Try this — slow breath, heavy feet, unclench your jaw.",
    },
  },
  cta: "Talk to someone now",
  disclaimer: "Aftercare means information & community — not medical advice. We're here to support and connect, but we're not clinicians. Seek emergency help when needed. Always look after yourself and your mates.",
} as const;

// ==========================================
// MAP (MESSMAP)
// ==========================================

export const MAP = {
  header: "The night is alive. Watch it breathe.",
  zoneStates: {
    boiling: "Boiling",
    active: "Active",
    quiet: "Quiet",
    cooling: "Cooling",
  },
  zoneDescriptions: {
    boiling: "Zone boiling — bodies are out tonight",
    active: "Active — men moving",
    quiet: "Quiet patch. Or building tension. Hard to tell.",
    cooling: "Cooling — drop-off",
  },
  beaconPopup: "Beacon active for 10 minutes. Move if you want the XP.",
  scanning: "The night sees you. XP incoming...",
} as const;

// ==========================================
// XP SYSTEM
// ==========================================

export const XP = {
  earned: "+{amount} XP — earned in sweat.",
  earnedVariant: "+{amount} XP — you filthy explorer.",
  streak: {
    indicator: "Day {count} streak",
    helper: "Consistency is its own kink.",
    risk: "Streak at risk — tap in.",
  },
  levelUp: {
    header: "Level up",
    body: "You're getting dangerous.",
    subtitle: "You just levelled. Everyone can feel it.",
  },
  empty: "Earn XP. Unlock chaos. Repeat.",
  getOutThere: "Get out there. The Mess won't explore itself.",
} as const;

// ==========================================
// RADIO
// ==========================================

export const RADIO = {
  tagline: "Broadcasting sweat, bass, and brotherhood. Always on. Always too much.",
  nowPlaying: "Now Playing",
  liveBadge: "LIVE NOW",
  offline: "Radio's catching its breath. Back in a sec.",
  promoBanner: "Tonight's heat: {showName} — {time}",
  stingers: [
    "HOTMESS RADIO — built for men who don't scare easy.",
    "Too hot to behave. Too human to hide.",
    "Where kink gets a conscience.",
    "Scan. Sweat. Repeat.",
    "The night reacts.",
    "Stay loud. Stay held.",
    "Care dressed as kink, mate.",
    "Hand N Hand — the only place to land.",
    "We look after our own.",
  ],
} as const;

// ==========================================
// SHOP
// ==========================================

export const SHOP = {
  hero: "Clothes that look like they've been sweating before you even put them on.",
  categories: {
    raw: {
      name: "RAW",
      tagline: "Wear it like a warning.",
      description: "Vests that don't ask permission. Tees that cling like they've missed you. Cuts sharp enough to draw attention.",
    },
    hung: {
      name: "HUNG",
      tagline: "Size isn't the point. Attitude is.",
      description: "Shapes that say everything without saying anything. Stretched, cropped, teased. If you know, you know.",
    },
    high: {
      name: "HIGH",
      tagline: "Own the room before you even enter it.",
      description: "Higher contrast. Higher heat. The silhouette of a man who stopped pretending long ago.",
    },
  },
  sizeSelector: "Pick your fit",
  lowStock: "Last few sweating.",
  soldOut: "Vanished. Gone. History.",
  cartEmpty: "Nothing in your bag. Go grab something filthy.",
  sizeError: "That size's gone — too slow.",
} as const;

// ==========================================
// DROPS
// ==========================================

export const DROPS = {
  intro: "Blinding. Limited. Gone in minutes. Drops are for the men who move fast.",
  countdown: "Drop hits in {time}",
  countdownUrgent: "{seconds} until unleash. Breathe. Brace. Buy.",
  live: "It's happening. Move.",
  soldOut: "You hesitated. The city didn't.",
  tooSlow: "Too slow. The city doesn't wait.",
} as const;

// ==========================================
// PROFILE
// ==========================================

export const PROFILE = {
  hero: "Your Mess identity. Wear it proudly or hide it — your choice.",
  stats: {
    xp: "earned in sweat",
    streak: "consistency kink",
    beacons: "footwork flex",
    rewards: "you greedy thing",
  },
  logoutConfirm: "Heading out? We'll keep the heat on.",
} as const;

// ==========================================
// REWARDS
// ==========================================

export const REWARDS = {
  intro: "Your chaos → our gifts. Trade XP for heat, gear, access, trouble.",
  emptyTitle: "No rewards yet",
  emptyMessage: "Keep earning XP to unlock rewards.",
  redeemButton: "Redeem",
  categories: {
    merch: {
      name: "Merch Unlocks",
      description: "Exclusive discounts and access to limited pieces.",
    },
    radio: {
      name: "Radio Requests",
      description: "Get your track played. Make the frequency yours.",
    },
    vip: {
      name: "VIP Access",
      description: "Secret beacons, early drops, exclusive zones.",
    },
  },
  redeemSuccess: "Reward claimed. Go on then — flex it.",
  notEnoughXP: "Not enough XP. Get out there.",
  heatTraded: "Heat traded. Reward unlocked. You earned this, mate.",
} as const;

// ==========================================
// COMMUNITY
// ==========================================

export const COMMUNITY = {
  hero: "Respect is the only real kink. Break that, and you're out.",
  rules: [
    {
      title: "Consent first.",
      description: "Always. No exceptions. It's not a mood — it's a muscle. Work it out before anything else.",
    },
    {
      title: "No racism, misogyny, or phobia of any flavour.",
      description: "We're building something better. Leave that shit at the door.",
    },
    {
      title: "No doxxing.",
      description: "Privacy is sacred. What happens in the Mess stays in the Mess.",
    },
    {
      title: "No glamorising harmful use.",
      description: "We're honest about what happens. But we don't celebrate harm. Care comes first.",
    },
    {
      title: "No shame-based behaviour.",
      description: "We lift each other up. Judgement stays outside.",
    },
    {
      title: "Gear is fine. Disrespect isn't.",
      description: "Express yourself. But never at someone else's expense.",
    },
  ],
  reportModal: {
    header: "Something off?",
    body: "Good on you for speaking up.",
    cta: "Report",
  },
  reportIntro: "If someone crosses a line, tell us. We don't tolerate cruelty.",
} as const;

// ==========================================
// AUTH
// ==========================================

export const AUTH = {
  login: {
    hero: "Back again, trouble? Good.",
  },
  signup: {
    hero: "Join the Mess. Men only. 18+. Consent first.",
  },
  ageGate: {
    header: "Men only. 18+.",
    subtitle: "No judgement. No shame. No exceptions.",
    enter: "Enter",
    leave: "Leave",
  },
  consentGate: {
    header: "Before you go any further: Consent isn't a mood. It's a muscle.",
    cta: "I consent. Enter.",
  },
} as const;

// ==========================================
// EMPTY STATES
// ==========================================

export const EMPTY_STATES = {
  noBeacons: "Quiet patch. Or building tension.",
  noXP: "Move through the night. It rewards the brave.",
  noProducts: "Too popular. Everything's gone.",
  noMessages: "Silence is suspicious.",
  cartEmpty: "Nothing in your bag yet.",
  quietMap: "Quiet tonight. Or everyone's behaving. Weird.",
} as const;

// ==========================================
// ERROR STATES
// ==========================================

export const ERRORS = {
  network: "You slipped offline. Reconnect.",
  server: "Something broke backstage. We're fixing it.",
  form: "That's not landing. Try again.",
  permission: "You're not cleared to be here — yet.",
  generic: "Something snapped. Give us a sec to stitch it back together.",
} as const;

// ==========================================
// LEGAL
// ==========================================

export const LEGAL = {
  privacy: {
    header: "Privacy Policy",
    intro: "We don't sell your data. We barely want it. You can delete everything anytime.",
  },
  terms: {
    header: "Terms of Service",
    intro: "Be an adult. Be respectful. We'll do the same.",
  },
  dmca: {
    header: "DMCA & Takedown",
    intro: "If your rights are violated, we move fast.",
  },
  careDisclaimer: {
    header: "Care Disclaimer",
    intro: "Not medical advice. Not emergency support. We're community, not clinicians.",
  },
  ageRequirement: "Men only. ID checks enforced.",
} as const;

// ==========================================
// VENDOR & AFFILIATE
// ==========================================

export const VENDOR = {
  intro: "Sell through HOTMESS. You create. We amplify. You fulfil.",
  dashboard: "Your heat, your numbers.",
} as const;

export const AFFILIATE = {
  intro: "Earn by being loud. Drop your link. Collect your cut. Simple, sexy, direct.",
} as const;

// ==========================================
// ADMIN
// ==========================================

export const ADMIN = {
  beaconLogged: "Inbound Beacon event logged.",
  xpMultiplier: "XP multiplier applied cleanly.",
  vendorSync: "Vendor sync complete — no drama.",
  hotZone: "Someone's running hot in Zone {number}.",
  radioLive: "RadioKing feed alive.",
  stripeVerified: "Stripe webhook verified.",
  dropPrimed: "Drop primed. Countdown armed.",
} as const;

// ==========================================
// FINALE LINE (GLOBAL OVERRIDE)
// ==========================================

export const FINALE = "HOTMESS — care dressed as kink, built for the men who survived enough to want more." as const;

// ==========================================
// WORD BANK (APPROVED VOCABULARY)
// ==========================================

export const WORD_BANK = [
  "heat", "pulse", "held", "loud", "scan", "sweat", "rite", "roam", 
  "drop", "unlock", "streak", "surge", "zone", "flare", "hum", 
  "tether", "night body"
] as const;
