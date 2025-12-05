/**
 * HOTMESS ACCESSIBILITY SYSTEM
 * ARIA labels, alt text patterns, screen reader copy
 * Clear, unsexualised, respectful, accurate
 */

// ==========================================
// ARIA LABELS
// ==========================================

export const ARIA_LABELS = {
  navigation: {
    main: "Main navigation",
    mobile: "Mobile menu",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  actions: {
    listenRadio: "Listen to HOTMESS Radio live",
    scanBeacon: "Scan a beacon for XP",
    openRewards: "Open Rewards panel",
    viewProfile: "View your profile",
    openCart: "Open shopping cart",
    closeModal: "Close dialog",
    playRadio: "Play radio stream",
    pauseRadio: "Pause radio stream",
    adjustVolume: "Adjust volume",
  },
  status: {
    liveRadio: "Radio is currently live",
    beaconActive: "Beacon is active in this zone",
    dropLive: "Drop is currently live",
    xpEarned: "XP successfully earned",
    streakActive: "Login streak is active",
  },
  forms: {
    emailInput: "Enter your email address",
    passwordInput: "Enter your password",
    nameInput: "Enter your display name",
    searchBeacons: "Search for beacons",
    filterProducts: "Filter products by category",
  },
} as const;

// ==========================================
// ALT TEXT PATTERNS
// ==========================================

export const ALT_TEXT = {
  products: {
    vest: "Black mesh vest with {brand} logo",
    tee: "{color} t-shirt with {design} print",
    shorts: "{style} shorts in {color}",
    tank: "{style} tank top",
    cropped: "Cropped {item} in {color}",
  },
  ui: {
    qrCode: "QR code for beacon scanning",
    qrOnWall: "QR code on brick wall with red neon glow",
    logo: "HOTMESS logo in red neon",
    userAvatar: "User profile avatar",
    mapPin: "Location marker on map",
    radioWave: "Radio signal waveform",
  },
  scenes: {
    nightScene: "Night scene with neon lighting",
    crowdScene: "Group of people in nightlife setting",
    venueExterior: "Exterior of venue with neon signage",
    urbanNight: "Urban street scene at night",
  },
  people: {
    portrait: "Portrait of man in {clothing}",
    action: "Man {action} in {setting}",
    group: "Group of men in {setting}",
  },
  generic: {
    decorative: "", // Empty string for decorative images
    loading: "Loading content",
    placeholder: "Image placeholder",
  },
} as const;

// ==========================================
// SCREEN READER ANNOUNCEMENTS
// ==========================================

export const ANNOUNCEMENTS = {
  navigation: {
    pageChanged: "Navigated to {pageName}",
    modalOpened: "{modalName} dialog opened",
    modalClosed: "Dialog closed",
  },
  actions: {
    beaconScanned: "Beacon scanned successfully. Earned {xp} XP",
    rewardUnlocked: "Reward unlocked: {rewardName}",
    itemAdded: "{itemName} added to cart",
    itemRemoved: "{itemName} removed from cart",
    levelUp: "Level up! Now level {level}",
  },
  errors: {
    formError: "Form has errors. Please review and correct.",
    networkError: "Network connection lost. Please reconnect.",
    genericError: "An error occurred. Please try again.",
  },
  success: {
    saved: "Changes saved successfully",
    updated: "Profile updated",
    submitted: "Form submitted successfully",
  },
} as const;

// ==========================================
// FOCUS MANAGEMENT
// ==========================================

export const FOCUS = {
  skipToContent: "Skip to main content",
  skipToNav: "Skip to navigation",
  returnToTop: "Return to top of page",
  firstInteractive: "First interactive element",
} as const;

// ==========================================
// HELPER TEXT (CONTEXT FOR SCREEN READERS)
// ==========================================

export const HELPERS = {
  newWindow: "Opens in new window",
  externalLink: "Opens external site",
  requiredField: "Required field",
  optionalField: "Optional field",
  characterLimit: "{current} of {max} characters",
  fileUpload: "Maximum file size {size}MB",
  multiSelect: "Select one or more options",
  singleSelect: "Select one option",
} as const;

// ==========================================
// KEYBOARD SHORTCUTS (DOCUMENTATION)
// ==========================================

export const KEYBOARD_SHORTCUTS = {
  global: [
    { keys: "Tab", action: "Navigate to next interactive element" },
    { keys: "Shift + Tab", action: "Navigate to previous interactive element" },
    { keys: "Enter / Space", action: "Activate button or link" },
    { keys: "Escape", action: "Close modal or dropdown" },
  ],
  radio: [
    { keys: "Space", action: "Play or pause radio" },
    { keys: "Arrow Up", action: "Increase volume" },
    { keys: "Arrow Down", action: "Decrease volume" },
    { keys: "M", action: "Mute or unmute" },
  ],
  map: [
    { keys: "Arrow Keys", action: "Pan map" },
    { keys: "+", action: "Zoom in" },
    { keys: "-", action: "Zoom out" },
    { keys: "Enter", action: "Select beacon" },
  ],
} as const;

// ==========================================
// REDUCED MOTION ALTERNATIVES
// ==========================================

export const REDUCED_MOTION = {
  messages: {
    animationsDisabled: "Animations disabled per your preferences",
    staticMode: "Viewing in static mode",
  },
  alternatives: {
    pulsingGlow: "Steady glow instead of pulsing animation",
    slideTransition: "Instant transition instead of slide",
    fadeTransition: "Instant transition instead of fade",
  },
} as const;

// ==========================================
// COLOR CONTRAST NOTES (FOR DEVS)
// ==========================================

export const CONTRAST_REQUIREMENTS = {
  bodyText: "Minimum 4.5:1 contrast ratio",
  largeText: "Minimum 3:1 contrast ratio for text 18pt+ or 14pt+ bold",
  uiComponents: "Minimum 3:1 contrast ratio for interactive elements",
  focus: "Focus indicators must be clearly visible with 3:1 minimum",
} as const;

// ==========================================
// ERROR MESSAGE PATTERNS
// ==========================================

export const ERROR_PATTERNS = {
  withField: "{fieldName}: {errorMessage}",
  withSuggestion: "{errorMessage} Try: {suggestion}",
  withAction: "{errorMessage} {actionText}",
} as const;

// ==========================================
// UTILITY FUNCTIONS FOR GENERATING ACCESSIBLE TEXT
// ==========================================

/**
 * Generate product alt text
 */
export function generateProductAlt(params: {
  type: string;
  color?: string;
  brand?: string;
  style?: string;
}): string {
  const { type, color, brand, style } = params;
  const parts = [];
  if (color) parts.push(color);
  if (style) parts.push(style);
  parts.push(type);
  if (brand) parts.push(`with ${brand} logo`);
  return parts.join(" ");
}

/**
 * Generate scene alt text
 */
export function generateSceneAlt(params: {
  subject: string;
  action?: string;
  setting: string;
  lighting?: string;
}): string {
  const { subject, action, setting, lighting } = params;
  const parts = [subject];
  if (action) parts.push(action);
  parts.push(`in ${setting}`);
  if (lighting) parts.push(`with ${lighting} lighting`);
  return parts.join(" ");
}

/**
 * Generate announcement for dynamic content
 */
export function generateAnnouncement(
  template: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template
  );
}
