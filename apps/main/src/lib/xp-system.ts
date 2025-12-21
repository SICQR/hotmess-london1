/**
 * XP SYSTEM — Universal Gamification Layer
 * Blockchain-inspired ledger tracking all user actions across the platform
 */

import type { AnalyticsMetadata } from '@/types/analytics';

export type XPSource =
  | 'beacon-scan'
  | 'purchase-shop'
  | 'purchase-market'
  | 'ticket-sale'
  | 'ticket-purchase'
  | 'track-stream'
  | 'profile-complete'
  | 'referral'
  | 'post-create'
  | 'event-attend'
  | 'quest-complete'
  | 'daily-login'
  | 'bot-interaction';

export type MembershipTier = 'free' | 'member' | 'plus' | 'pro';

export type XPRewardType =
  | 'merch'
  | 'early-access'
  | 'vip-event'
  | 'queue-jump'
  | 'artist-exclusive'
  | 'mystery-box'
  | 'beacon-unlock'
  | 'chat-beacon';

export interface XPEntry {
  id: string;
  userId: string;
  amount: number;
  source: XPSource;
  sourceId?: string; // ID of the related entity (beacon, product, etc)
  multiplier: number;
  membershipTier: MembershipTier;
  timestamp: Date;
  metadata?: AnalyticsMetadata;
}

export interface XPReward {
  id: string;
  type: XPRewardType;
  name: string;
  description: string;
  xpCost: number;
  imageUrl?: string;
  available: boolean;
  stock?: number;
  expiresAt?: Date;
}

export interface UserXPStats {
  userId: string;
  totalXP: number;
  availableXP: number; // Total minus spent
  membershipTier: MembershipTier;
  currentMultiplier: number;
  rank: number; // Global rank
  cityRank?: number;
  level: number;
  nextLevelXP: number;
  rewardsRedeemed: number;
  streakDays: number;
  lastActivityAt: Date;
}

/**
 * XP amounts for different actions
 */
export const XP_VALUES: Record<XPSource, number> = {
  'beacon-scan': 10,
  'purchase-shop': 50,
  'purchase-market': 30,
  'ticket-sale': 40,
  'ticket-purchase': 20,
  'track-stream': 5,
  'profile-complete': 100,
  'referral': 200,
  'post-create': 15,
  'event-attend': 50,
  'quest-complete': 500,
  'daily-login': 5,
  'bot-interaction': 3,
};

/**
 * Membership tier multipliers
 */
export const MEMBERSHIP_MULTIPLIERS: Record<MembershipTier, number> = {
  free: 1,
  member: 2,
  plus: 3,
  pro: 5,
};

/**
 * Membership tier scan limits per month
 */
export const SCAN_LIMITS: Record<MembershipTier, number | null> = {
  free: 10,
  member: 100,
  plus: null, // Unlimited
  pro: null, // Unlimited
};

/**
 * Calculate XP for an action
 */
export function calculateXP(
  source: XPSource,
  membershipTier: MembershipTier,
  bonusMultiplier: number = 1
): number {
  const baseXP = XP_VALUES[source];
  const tierMultiplier = MEMBERSHIP_MULTIPLIERS[membershipTier];
  return Math.round(baseXP * tierMultiplier * bonusMultiplier);
}

/**
 * Calculate user level from total XP
 * Exponential curve: Level = floor(sqrt(totalXP / 100))
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100));
}

/**
 * Calculate XP needed for next level
 */
export function getNextLevelXP(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return nextLevel * nextLevel * 100;
}

/**
 * Check if user has reached scan limit
 */
export function hasReachedScanLimit(
  scansThisMonth: number,
  membershipTier: MembershipTier
): boolean {
  const limit = SCAN_LIMITS[membershipTier];
  if (limit === null) return false; // Unlimited
  return scansThisMonth >= limit;
}

/**
 * Available XP rewards catalog
 */
export const XP_REWARDS: XPReward[] = [
  {
    id: 'merch-raw-tee',
    type: 'merch',
    name: 'RAW Collection T-Shirt',
    description: 'Free t-shirt from the RAW essentials collection',
    xpCost: 1000,
    available: true,
    stock: 50,
  },
  {
    id: 'early-drop-access',
    type: 'early-access',
    name: '24h Early Drop Access',
    description: 'Get exclusive 24-hour early access to all drops for 1 month',
    xpCost: 2000,
    available: true,
  },
  {
    id: 'vip-event-ticket',
    type: 'vip-event',
    name: 'VIP Event Ticket',
    description: 'Free VIP ticket to any HOTMESS event',
    xpCost: 3000,
    available: true,
    stock: 20,
  },
  {
    id: 'queue-jump-pass',
    type: 'queue-jump',
    name: 'Queue Jump Pass (5x)',
    description: 'Skip the line at 5 partner venues',
    xpCost: 1500,
    available: true,
  },
  {
    id: 'artist-meet-greet',
    type: 'artist-exclusive',
    name: 'RAW CONVICT Artist Meet & Greet',
    description: 'Private meet & greet with a RAW CONVICT artist',
    xpCost: 5000,
    available: true,
    stock: 5,
  },
  {
    id: 'mystery-box-medium',
    type: 'mystery-box',
    name: 'Mystery Box - Medium',
    description: 'Random selection of HOTMESS merch and exclusive items',
    xpCost: 2500,
    available: true,
    stock: 30,
  },
  {
    id: 'premium-beacon-unlock',
    type: 'beacon-unlock',
    name: 'Premium Beacon Unlock',
    description: 'Unlock premium beacon types (chat, reward, quest) for 3 months',
    xpCost: 3500,
    available: true,
  },
  {
    id: 'chat-beacon-monthly',
    type: 'chat-beacon',
    name: 'Chat Beacon Access (1 Month)',
    description: 'Access to exclusive chat beacons for connections',
    xpCost: 800,
    available: true,
  },
];

/**
 * Quest system - multi-step XP journeys
 */
export interface Quest {
  id: string;
  name: string;
  description: string;
  steps: QuestStep[];
  totalXP: number;
  expiresAt?: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

export interface QuestStep {
  id: string;
  description: string;
  requirement: {
    type: XPSource;
    count: number;
  };
  xpReward: number;
  completed: boolean;
}

export const QUESTS: Quest[] = [
  {
    id: 'first-night-out',
    name: 'First Night Out',
    description: 'Complete your first night in the HOTMESS ecosystem',
    difficulty: 'easy',
    totalXP: 300,
    steps: [
      {
        id: 'scan-venue',
        description: 'Scan a venue beacon',
        requirement: { type: 'beacon-scan', count: 1 },
        xpReward: 100,
        completed: false,
      },
      {
        id: 'buy-ticket',
        description: 'Purchase an event ticket',
        requirement: { type: 'ticket-purchase', count: 1 },
        xpReward: 100,
        completed: false,
      },
      {
        id: 'stream-track',
        description: 'Stream 5 tracks on HOTMESS Radio',
        requirement: { type: 'track-stream', count: 5 },
        xpReward: 100,
        completed: false,
      },
    ],
  },
  {
    id: 'beacon-hunter',
    name: 'Beacon Hunter',
    description: 'Scan 50 unique beacons across the city',
    difficulty: 'medium',
    totalXP: 1000,
    steps: [
      {
        id: 'scan-10',
        description: 'Scan 10 unique beacons',
        requirement: { type: 'beacon-scan', count: 10 },
        xpReward: 200,
        completed: false,
      },
      {
        id: 'scan-25',
        description: 'Scan 25 unique beacons',
        requirement: { type: 'beacon-scan', count: 25 },
        xpReward: 300,
        completed: false,
      },
      {
        id: 'scan-50',
        description: 'Scan 50 unique beacons',
        requirement: { type: 'beacon-scan', count: 50 },
        xpReward: 500,
        completed: false,
      },
    ],
  },
  {
    id: 'marketplace-merchant',
    name: 'Marketplace Merchant',
    description: 'Become a top seller on MessMarket',
    difficulty: 'hard',
    totalXP: 2000,
    steps: [
      {
        id: 'first-listing',
        description: 'Create your first listing',
        requirement: { type: 'post-create', count: 1 },
        xpReward: 200,
        completed: false,
      },
      {
        id: 'five-sales',
        description: 'Make 5 successful sales',
        requirement: { type: 'purchase-market', count: 5 },
        xpReward: 500,
        completed: false,
      },
      {
        id: 'top-seller',
        description: 'Reach 20 sales',
        requirement: { type: 'purchase-market', count: 20 },
        xpReward: 1300,
        completed: false,
      },
    ],
  },
  {
    id: 'legendary-convict',
    name: 'Legendary Convict',
    description: 'Master every aspect of the HOTMESS OS',
    difficulty: 'legendary',
    totalXP: 10000,
    steps: [
      {
        id: 'scan-100',
        description: 'Scan 100 beacons',
        requirement: { type: 'beacon-scan', count: 100 },
        xpReward: 2000,
        completed: false,
      },
      {
        id: 'shop-purchases',
        description: 'Make 10 shop purchases',
        requirement: { type: 'purchase-shop', count: 10 },
        xpReward: 2000,
        completed: false,
      },
      {
        id: 'events-attended',
        description: 'Attend 20 events',
        requirement: { type: 'event-attend', count: 20 },
        xpReward: 2000,
        completed: false,
      },
      {
        id: 'referrals',
        description: 'Refer 10 friends',
        requirement: { type: 'referral', count: 10 },
        xpReward: 2000,
        completed: false,
      },
      {
        id: 'stream-legend',
        description: 'Stream 500 tracks',
        requirement: { type: 'track-stream', count: 500 },
        xpReward: 2000,
        completed: false,
      },
    ],
  },
];
