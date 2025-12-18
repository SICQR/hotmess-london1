/**
 * CANONICAL UX LANGUAGE & MICROCOPY
 * Frozen copy from specification - DO NOT MODIFY without approval
 * 
 * This is the voice of HOTMESS. No "friendlier" rewrites.
 */

export const GLOBAL_MICROCOPY = {
  // Platform notices
  platformNotice: 'Men-only. 18+.',
  platformFull: 'Men-only. 18+. Moderated and auditable.',
  
  // Boundaries
  boundaries: 'Presence ≠ permission.',
  boundariesFull: 'Presence doesn\'t mean availability. Activity doesn\'t mean consent.',
  
  // Care
  aftercare: 'Aftercare = information only.',
  aftercareFull: 'Aftercare on HOTMESS means information and signposting only.',
  noMedical: 'No medical advice, therapy, counselling, or crisis support.',
  
  // Moderation
  moderation: 'Moderated and auditable.',
  
  // Privacy
  aggregate: 'Aggregate activity only.',
  noTracking: 'This shows energy, not people.',
  privacyCore: 'HOTMESS doesn\'t track people.',
  
  // System
  systemCore: 'This is a system.',
  systemExplain: 'HOTMESS doesn\'t match you, manage you, or tell you what to do.',
  
  // Consent
  consentCore: 'Consent is ongoing.',
  consentRule: 'If it\'s not a clear yes, it\'s a no.',
  
  // Beacons
  beaconNotProfile: 'This is not a dating profile.',
  scanNotConsent: 'Scanning does not equal consent.',
  noGuarantee: 'Listings do not guarantee outcomes.',
  
  // Proof
  proofRequired: 'Proof may be required.',
  noOvershare: 'Oversharing personal data is not.',
  keepMinimal: 'Keep it relevant. Keep it minimal.',
};

export const ARRIVAL_COPY = {
  // Home page
  homeTagline: 'A nightlife operating system for men.',
  homeSubline: 'Live nights. Live radio. Real context.',
  homeLiveIndicators: 'Cities live now · Beacons active · Radio playing',
  homeFooter: 'Men-only. 18+. Moderated and auditable.',
  
  // Eligibility Gate
  gateHeading: 'Before you step in',
  gateBody1: 'HOTMESS is built for men aged 18 and over.',
  gateBody2: 'It operates in real nightlife contexts.',
  gateBody3: 'If that\'s not you, this isn\'t the place.',
  gateConfirm: 'I confirm I am a man aged 18 or over',
  gateContinue: 'Continue',
  gateLeave: 'Leave',
  gateEnforced: 'This check is enforced.',
  
  // System Definition
  systemHeading: 'This is a system.',
  systemBody1: 'HOTMESS doesn\'t match you, manage you, or tell you what to do.',
  systemBody2: 'It coordinates:',
  systemCoordinates: ['nights', 'tickets', 'music', 'drops', 'participation', 'somewhere to land after'],
  systemBody3: 'Everything is time-bound.',
  systemBody4: 'Everything is contextual.',
  systemBody5: 'Everything is moderated.',
  
  // Boundaries
  boundariesHeading: 'Read this once.',
  boundariesBody1: 'Presence doesn\'t mean availability.',
  boundariesBody2: 'Activity doesn\'t mean consent.',
  boundariesBody3: 'Seeing something doesn\'t mean it\'s for you.',
  boundariesBody4: 'Consent is ongoing.',
  boundariesBody5: 'If it\'s not a clear yes, it\'s a no.',
  boundariesBody6: 'You can leave any interaction at any time.',
  
  // Care Position
  careHeading: 'About care here',
  careBody1: 'Aftercare on HOTMESS means information and signposting only.',
  careBody2: 'We do not provide:',
  careDoNotProvide: ['medical advice', 'therapy', 'counselling', 'crisis support'],
  careEmergency: 'If you\'re in the UK and need urgent help, call 999.',
  
  // Privacy
  privacyHeading: 'Visibility & privacy',
  privacyBody1: 'HOTMESS doesn\'t track people.',
  privacyBody2: 'Features like Night Pulse show aggregate activity only, by city or region.',
  privacyBody3: 'QR scans add context to nights, not identities.',
  privacyBody4: 'Moderation actions are logged and auditable.',
  privacyLinks: {
    policy: 'Privacy Policy',
    hub: 'Data & Privacy Hub',
  },
  
  // First Session
  firstSessionHeading: 'You\'re in.',
  firstSessionBody1: 'Nothing here expects anything from you.',
  firstSessionBody2: 'Look around.',
  firstSessionBody3: 'Participate if you want.',
  firstSessionBody4: 'Leave when you need.',
  firstSessionActions: {
    beacons: 'Explore Beacons',
    radio: 'Listen Live',
    rules: 'Read the rules',
  },
};

export const BEACON_COPY = {
  indexHeading: 'Beacons',
  indexSub: 'Temporary containers for real-world nights.',
  indexSupport: 'Time-bound. Contextual. Moderated.',
  
  detailRulesNotice1: 'This is not a dating profile.',
  detailRulesNotice2: 'Scanning does not equal consent.',
  detailRulesNotice3: 'Listings do not guarantee outcomes.',
  
  listingsHeading: 'Listings in this Beacon',
  listingsNotice: 'Proof may be required. Oversharing personal data is not.',
  
  proofHeading: 'Proof & context',
  proofNotice: 'Keep it relevant. Keep it minimal.',
  
  actions: {
    sell: 'Sell a Ticket',
    report: 'Report this Beacon',
    care: 'Read aftercare information',
  },
};

/**
 * Get canonical copy by key path
 * Example: getCopy('ARRIVAL_COPY.homeTagline') => 'A nightlife operating system for men.'
 */
export function getCopy(path: string): string {
  const parts = path.split('.');
  let current: any = { GLOBAL_MICROCOPY, ARRIVAL_COPY, BEACON_COPY };
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`⚠️ Copy not found: ${path}`);
      return path;
    }
    current = current[part];
  }
  
  return typeof current === 'string' ? current : JSON.stringify(current);
}
