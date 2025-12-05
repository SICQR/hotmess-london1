/**
 * BEACON SYSTEM — Core Interaction Engine
 * 14 beacon types powering scans, routing, XP, and automation
 */

import { XPSource } from './xp-system';

export type BeaconType =
  | 'checkin'         // Venue check-ins
  | 'event'           // RSVP, guestlist, club flow
  | 'ticket'          // P2P ticket resale or venue sales
  | 'product'         // Shop drop, marketplace
  | 'drop'            // Limited releases (RAW/HUNG/HIGH)
  | 'vendor'          // 3rd party seller / sponsored
  | 'chat'            // Connect beacon (premium)
  | 'reward'          // XP unlocks
  | 'sponsor'         // Paid placements
  | 'music'           // Track unlock / pre-save
  | 'promo'           // Bot-trigger blast
  | 'quest'           // Multi-step XP journey
  | 'scan-to-join'    // Telegram room linker
  | 'scan-to-buy';    // Instant checkout

export type BeaconStatus = 'active' | 'paused' | 'expired' | 'archived';

export interface Beacon {
  id: string;
  code: string; // Short code (e.g., "GLO-001" or "CONVICT-HOTMESS")
  type: BeaconType;
  status: BeaconStatus;
  
  // Metadata
  name: string;
  description?: string;
  imageUrl?: string;
  
  // Ownership
  ownerId: string; // User/venue/club/vendor ID
  ownerType: 'user' | 'venue' | 'club' | 'vendor' | 'admin';
  
  // Routing
  targetId?: string; // Product ID, event ID, ticket ID, etc.
  targetType?: 'product' | 'event' | 'ticket' | 'track' | 'telegram' | 'url';
  targetUrl?: string; // External URL or deep link
  
  // XP & Rewards
  xpReward: number;
  xpBonusMultiplier?: number; // Bonus multiplier (e.g., 2x for special events)
  scanLimit?: number; // Max scans (null = unlimited)
  scanCount: number; // Current scan count
  
  // Geo
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
  };
  
  // Timing
  activeFrom?: Date;
  activeUntil?: Date;
  
  // Access Control
  requiresMembership?: boolean;
  requiredTier?: 'member' | 'plus' | 'pro';
  ageRestriction?: number; // Default 18
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastScannedAt?: Date;
}

export interface BeaconScan {
  id: string;
  beaconId: string;
  beaconCode: string;
  userId: string;
  
  // Context
  scannedAt: Date;
  location?: {
    lat: number;
    lng: number;
  };
  userAgent?: string;
  
  // Results
  xpAwarded: number;
  xpMultiplier: number;
  routedTo?: string; // Route ID or URL
  actionTaken?: 'viewed' | 'purchased' | 'joined' | 'unlocked';
}

export interface BeaconStats {
  beaconId: string;
  totalScans: number;
  uniqueScans: number;
  xpAwarded: number;
  conversionRate: number; // % of scans that led to action
  topCities: Array<{ city: string; count: number }>;
  scansByDay: Array<{ date: string; count: number }>;
  peakHours: number[]; // 0-23
}

/**
 * Beacon Type Metadata
 */
export const BEACON_TYPE_META: Record<BeaconType, {
  label: string;
  description: string;
  icon: string;
  defaultXP: number;
  requiresTarget: boolean;
  premiumOnly: boolean;
}> = {
  'checkin': {
    label: 'Check-in',
    description: 'Venue check-in beacon for earning XP and tracking attendance',
    icon: '📍',
    defaultXP: 10,
    requiresTarget: false,
    premiumOnly: false,
  },
  'event': {
    label: 'Event',
    description: 'Event RSVP and guestlist management',
    icon: '🎉',
    defaultXP: 20,
    requiresTarget: true,
    premiumOnly: false,
  },
  'ticket': {
    label: 'Ticket',
    description: 'P2P ticket resale or official venue ticket sales',
    icon: '🎫',
    defaultXP: 15,
    requiresTarget: true,
    premiumOnly: false,
  },
  'product': {
    label: 'Product',
    description: 'Shop product or marketplace listing',
    icon: '🛍️',
    defaultXP: 10,
    requiresTarget: true,
    premiumOnly: false,
  },
  'drop': {
    label: 'Drop',
    description: 'Limited edition release (RAW/HUNG/HIGH/SUPER)',
    icon: '💎',
    defaultXP: 25,
    requiresTarget: true,
    premiumOnly: false,
  },
  'vendor': {
    label: 'Vendor',
    description: '3rd party seller or sponsored content',
    icon: '🏪',
    defaultXP: 10,
    requiresTarget: true,
    premiumOnly: false,
  },
  'chat': {
    label: 'Chat',
    description: 'Premium connect beacon for starting conversations',
    icon: '💬',
    defaultXP: 5,
    requiresTarget: false,
    premiumOnly: true,
  },
  'reward': {
    label: 'Reward',
    description: 'XP reward unlock or mystery prize',
    icon: '🎁',
    defaultXP: 50,
    requiresTarget: false,
    premiumOnly: false,
  },
  'sponsor': {
    label: 'Sponsor',
    description: 'Sponsored content or paid placement',
    icon: '💰',
    defaultXP: 8,
    requiresTarget: true,
    premiumOnly: false,
  },
  'music': {
    label: 'Music',
    description: 'Track unlock, pre-save, or RAW CONVICT release',
    icon: '🎵',
    defaultXP: 15,
    requiresTarget: true,
    premiumOnly: false,
  },
  'promo': {
    label: 'Promo',
    description: 'Promotional campaign with bot broadcast',
    icon: '📢',
    defaultXP: 5,
    requiresTarget: false,
    premiumOnly: false,
  },
  'quest': {
    label: 'Quest',
    description: 'Multi-step XP journey',
    icon: '🗺️',
    defaultXP: 30,
    requiresTarget: true,
    premiumOnly: false,
  },
  'scan-to-join': {
    label: 'Scan to Join',
    description: 'Telegram room or community invite',
    icon: '👥',
    defaultXP: 20,
    requiresTarget: true,
    premiumOnly: false,
  },
  'scan-to-buy': {
    label: 'Scan to Buy',
    description: 'Instant checkout for quick purchases',
    icon: '⚡',
    defaultXP: 10,
    requiresTarget: true,
    premiumOnly: false,
  },
};

/**
 * Map beacon type to XP source
 */
export function getXPSourceForBeacon(type: BeaconType): XPSource {
  switch (type) {
    case 'product':
    case 'drop':
    case 'scan-to-buy':
      return 'purchase-shop';
    case 'ticket':
      return 'ticket-purchase';
    case 'event':
      return 'event-attend';
    case 'music':
      return 'track-stream';
    case 'quest':
      return 'quest-complete';
    default:
      return 'beacon-scan';
  }
}

/**
 * Beacon Routing Engine (BRE)
 * Determines where to route the user after scanning
 */
export interface BeaconRoute {
  type: 'page' | 'modal' | 'external' | 'action';
  destination: string; // Route ID, URL, or action name
  params?: Record<string, string>;
  showXPNotification: boolean;
  analyticsEvent?: string;
}

export function routeBeacon(beacon: Beacon): BeaconRoute {
  const meta = BEACON_TYPE_META[beacon.type];
  
  // Type-specific routing
  switch (beacon.type) {
    case 'checkin':
      return {
        type: 'modal',
        destination: 'checkin-success',
        showXPNotification: true,
        analyticsEvent: 'beacon_checkin',
      };
      
    case 'event':
      return {
        type: 'page',
        destination: 'tickets',
        params: { eventId: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_event',
      };
      
    case 'ticket':
      return {
        type: 'page',
        destination: 'ticketsBeacon',
        params: { beaconId: beacon.id },
        showXPNotification: true,
        analyticsEvent: 'beacon_ticket',
      };
      
    case 'product':
      return {
        type: 'page',
        destination: beacon.targetType === 'product' ? 'shopProduct' : 'messmessMarketProduct',
        params: { slug: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_product',
      };
      
    case 'drop':
      return {
        type: 'page',
        destination: 'drops',
        params: { dropId: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_drop',
      };
      
    case 'music':
      return {
        type: 'page',
        destination: 'recordsRelease',
        params: { slug: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_music',
      };
      
    case 'chat':
      return {
        type: 'modal',
        destination: 'connect-chat',
        params: { userId: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_chat',
      };
      
    case 'reward':
      return {
        type: 'modal',
        destination: 'reward-unlock',
        showXPNotification: true,
        analyticsEvent: 'beacon_reward',
      };
      
    case 'quest':
      return {
        type: 'page',
        destination: 'xpProfile',
        params: { tab: 'quests', questId: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_quest',
      };
      
    case 'scan-to-join':
      return {
        type: 'external',
        destination: beacon.targetUrl || '',
        showXPNotification: true,
        analyticsEvent: 'beacon_telegram',
      };
      
    case 'scan-to-buy':
      return {
        type: 'modal',
        destination: 'quick-checkout',
        params: { productId: beacon.targetId || '' },
        showXPNotification: true,
        analyticsEvent: 'beacon_quick_buy',
      };
      
    case 'vendor':
    case 'sponsor':
    case 'promo':
      return {
        type: beacon.targetUrl ? 'external' : 'page',
        destination: beacon.targetUrl || 'messmarket',
        showXPNotification: true,
        analyticsEvent: `beacon_${beacon.type}`,
      };
      
    default:
      return {
        type: 'modal',
        destination: 'beacon-success',
        showXPNotification: true,
        analyticsEvent: 'beacon_scan',
      };
  }
}

/**
 * Validate beacon code format
 */
export function isValidBeaconCode(code: string): boolean {
  // Allow alphanumeric + hyphens, 3-20 chars
  return /^[A-Z0-9-]{3,20}$/i.test(code);
}

/**
 * Generate beacon QR code data
 */
export function generateBeaconQRData(code: string): string {
  // URL format: https://hotmess.london/scan?code=XXX
  return `https://hotmess.london/scan?code=${code}`;
}

/**
 * Generate random beacon code
 */
export function generateBeaconCode(type: BeaconType): string {
  const prefix = type.toUpperCase().substring(0, 3);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Check if beacon is currently active
 */
export function isBeaconActive(beacon: Beacon): boolean {
  if (beacon.status !== 'active') return false;
  
  const now = new Date();
  
  if (beacon.activeFrom && now < beacon.activeFrom) return false;
  if (beacon.activeUntil && now > beacon.activeUntil) return false;
  if (beacon.scanLimit && beacon.scanCount >= beacon.scanLimit) return false;
  
  return true;
}

/**
 * Calculate XP for beacon scan
 */
export function calculateBeaconXP(
  beacon: Beacon,
  userMembershipMultiplier: number
): number {
  const baseXP = beacon.xpReward || BEACON_TYPE_META[beacon.type].defaultXP;
  const bonusMultiplier = beacon.xpBonusMultiplier || 1;
  return Math.round(baseXP * bonusMultiplier * userMembershipMultiplier);
}

/**
 * Mock beacon data for testing
 */
export const MOCK_BEACONS: Beacon[] = [
  {
    id: 'beacon-1',
    code: 'GLO-001',
    type: 'checkin',
    status: 'active',
    name: 'The Glory',
    description: 'Check in at The Glory, Haggerston',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    ownerId: 'venue-glory',
    ownerType: 'venue',
    xpReward: 10,
    scanCount: 847,
    location: {
      lat: 51.5382,
      lng: -0.0755,
      address: '281 Kingsland Rd, London E2 8AS',
      city: 'London',
    },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30T22:15:00'),
  },
  {
    id: 'beacon-2',
    code: 'CONVICT-HOTMESS',
    type: 'music',
    status: 'active',
    name: 'HOTMESS - Paul King x Stuart Whoo',
    description: 'Pre-save the debut RAW CONVICT track',
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    ownerId: 'admin',
    ownerType: 'admin',
    targetId: 'hotmess-track',
    targetType: 'track',
    xpReward: 25,
    xpBonusMultiplier: 2,
    scanCount: 1243,
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30T23:45:00'),
  },
  {
    id: 'beacon-3',
    code: 'RAW-DROP-001',
    type: 'drop',
    status: 'active',
    name: 'RAW Essentials Drop',
    description: 'Limited edition RAW collection items',
    imageUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800',
    ownerId: 'admin',
    ownerType: 'admin',
    targetId: 'raw-drop-nov',
    targetType: 'product',
    xpReward: 25,
    scanLimit: 500,
    scanCount: 342,
    activeUntil: new Date('2025-12-31'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30T20:30:00'),
  },
  {
    id: 'beacon-4',
    code: 'QUEST-FIRST',
    type: 'quest',
    status: 'active',
    name: 'First Night Out Quest',
    description: 'Complete your first quest and earn 300 XP',
    ownerId: 'admin',
    ownerType: 'admin',
    targetId: 'first-night-out',
    targetType: 'url',
    xpReward: 30,
    scanCount: 589,
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-11-30'),
  },
  {
    id: 'beacon-5',
    code: 'TG-LONDON',
    type: 'scan-to-join',
    status: 'active',
    name: 'HOTMESS London Telegram',
    description: 'Join the London community room',
    ownerId: 'admin',
    ownerType: 'admin',
    targetUrl: 'https://t.me/hotmess_london',
    xpReward: 20,
    scanCount: 2341,
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30T23:50:00'),
  },
];
