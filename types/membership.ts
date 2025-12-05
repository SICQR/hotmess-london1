// HOTMESS LONDON - Tiered Membership System Types
// Complete membership tiers that touch every module

export type MembershipTier = 'free' | 'pro' | 'elite';
export type MembershipStatus = 'active' | 'cancelled' | 'past_due' | 'expired';

export interface MembershipBenefit {
  id: string;
  tier: MembershipTier;
  category: 'rooms' | 'drops' | 'market' | 'events' | 'radio' | 'xp' | 'care' | 'beacons' | 'records' | 'hosting' | 'selling';
  title: string;
  description: string;
  value?: string; // e.g., "10%", "£5 off", "Unlimited"
}

export interface MembershipTierConfig {
  tier: MembershipTier;
  name: string;
  price_monthly: number; // In pounds
  price_yearly: number;
  currency: string;
  level_required: number; // Minimum XP level
  
  // Stripe
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  
  // Benefits by module
  benefits: {
    rooms: {
      access: 'limited' | 'city' | 'global';
      max_rooms: number | 'unlimited';
      can_post_citywide: boolean;
      priority_messages: boolean;
    };
    drops: {
      access_level: 'basic' | 'early' | 'first';
      can_schedule: boolean;
      can_boost_listings: boolean;
      analytics_access: boolean;
    };
    market: {
      can_buy: boolean;
      can_boost: boolean;
      seller_fee: number; // Percentage
      discount: number; // Percentage off purchases
    };
    events: {
      access: 'standard' | 'early' | 'vip';
      free_events_per_month: number;
      vip_line_access: boolean;
      early_tickets: boolean;
    };
    radio: {
      access: 'listen' | 'metadata' | 'full';
      offline_downloads: boolean;
      ad_free: boolean;
    };
    xp: {
      boost_multiplier: number; // 1.0, 1.1, 1.2
      bonus_daily_xp: number;
    };
    care: {
      priority: boolean;
      dedicated_support: boolean;
    };
    beacons: {
      can_scan: boolean;
      can_view_analytics: boolean;
      heatmap_access: 'none' | 'limited' | 'full';
    };
    records: {
      access: 'stream' | 'early_demos' | 'unreleased';
      priority_saves: boolean;
    };
    hosting: {
      can_host_micro_events: boolean;
      advanced_tools: boolean;
    };
    selling: {
      reduced_fees: boolean;
      priority_placement: boolean;
      advanced_analytics: boolean;
    };
  };
  
  // Visual
  badge_color: string;
  badge_icon: string;
}

export interface UserMembership {
  user_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  
  // Subscription
  stripe_subscription_id?: string;
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  
  // Payment
  last_payment_date?: string;
  next_payment_date?: string;
  payment_failed: boolean;
  
  // History
  joined_tier_at: string;
  previous_tier?: MembershipTier;
  upgraded_at?: string;
  downgraded_at?: string;
  
  // Stats
  lifetime_value: number;
  months_subscribed: number;
}

export interface MembershipUpgradeIntent {
  user_id: string;
  from_tier: MembershipTier;
  to_tier: MembershipTier;
  billing_cycle: 'monthly' | 'yearly';
  estimated_price: number;
  proration_credit?: number;
}

export interface MembershipAccessCheck {
  user_id: string;
  tier: MembershipTier;
  feature: string;
  module: string;
  has_access: boolean;
  required_tier?: MembershipTier;
  upgrade_cta?: string;
}

// Predefined tier configurations
export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierConfig> = {
  free: {
    tier: 'free',
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'GBP',
    level_required: 0,
    benefits: {
      rooms: {
        access: 'limited',
        max_rooms: 3,
        can_post_citywide: false,
        priority_messages: false,
      },
      drops: {
        access_level: 'basic',
        can_schedule: false,
        can_boost_listings: false,
        analytics_access: false,
      },
      market: {
        can_buy: true,
        can_boost: false,
        seller_fee: 15,
        discount: 0,
      },
      events: {
        access: 'standard',
        free_events_per_month: 0,
        vip_line_access: false,
        early_tickets: false,
      },
      radio: {
        access: 'listen',
        offline_downloads: false,
        ad_free: false,
      },
      xp: {
        boost_multiplier: 1.0,
        bonus_daily_xp: 0,
      },
      care: {
        priority: false,
        dedicated_support: false,
      },
      beacons: {
        can_scan: true,
        can_view_analytics: false,
        heatmap_access: 'none',
      },
      records: {
        access: 'stream',
        priority_saves: false,
      },
      hosting: {
        can_host_micro_events: false,
        advanced_tools: false,
      },
      selling: {
        reduced_fees: false,
        priority_placement: false,
        advanced_analytics: false,
      },
    },
    badge_color: '#71717a',
    badge_icon: '🆓',
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price_monthly: 15,
    price_yearly: 150, // 2 months free
    currency: 'GBP',
    level_required: 3,
    benefits: {
      rooms: {
        access: 'city',
        max_rooms: 'unlimited' as any,
        can_post_citywide: true,
        priority_messages: false,
      },
      drops: {
        access_level: 'early',
        can_schedule: true,
        can_boost_listings: true,
        analytics_access: true,
      },
      market: {
        can_buy: true,
        can_boost: true,
        seller_fee: 12,
        discount: 10,
      },
      events: {
        access: 'early',
        free_events_per_month: 0,
        vip_line_access: false,
        early_tickets: true,
      },
      radio: {
        access: 'metadata',
        offline_downloads: false,
        ad_free: true,
      },
      xp: {
        boost_multiplier: 1.1,
        bonus_daily_xp: 50,
      },
      care: {
        priority: true,
        dedicated_support: false,
      },
      beacons: {
        can_scan: true,
        can_view_analytics: true,
        heatmap_access: 'limited',
      },
      records: {
        access: 'early_demos',
        priority_saves: true,
      },
      hosting: {
        can_host_micro_events: true,
        advanced_tools: false,
      },
      selling: {
        reduced_fees: true,
        priority_placement: true,
        advanced_analytics: true,
      },
    },
    badge_color: '#3b82f6',
    badge_icon: '⭐',
  },
  elite: {
    tier: 'elite',
    name: 'Elite',
    price_monthly: 35,
    price_yearly: 350, // 2 months free
    currency: 'GBP',
    level_required: 6,
    benefits: {
      rooms: {
        access: 'global',
        max_rooms: 'unlimited' as any,
        can_post_citywide: true,
        priority_messages: true,
      },
      drops: {
        access_level: 'first',
        can_schedule: true,
        can_boost_listings: true,
        analytics_access: true,
      },
      market: {
        can_buy: true,
        can_boost: true,
        seller_fee: 10,
        discount: 15,
      },
      events: {
        access: 'vip',
        free_events_per_month: 1,
        vip_line_access: true,
        early_tickets: true,
      },
      radio: {
        access: 'full',
        offline_downloads: true,
        ad_free: true,
      },
      xp: {
        boost_multiplier: 1.2,
        bonus_daily_xp: 100,
      },
      care: {
        priority: true,
        dedicated_support: true,
      },
      beacons: {
        can_scan: true,
        can_view_analytics: true,
        heatmap_access: 'full',
      },
      records: {
        access: 'unreleased',
        priority_saves: true,
      },
      hosting: {
        can_host_micro_events: true,
        advanced_tools: true,
      },
      selling: {
        reduced_fees: true,
        priority_placement: true,
        advanced_analytics: true,
      },
    },
    badge_color: '#eab308',
    badge_icon: '👑',
  },
};
