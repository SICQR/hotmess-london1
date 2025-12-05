/**
 * HOTMESS HOOKUP TYPES
 * Type definitions for hookup/chat beacon system
 */

export type HookupMode = 'room' | '1to1';

export type HookupBeaconStatus = 'active' | 'inactive' | 'expired';

export type MembershipTier = 'free' | 'pro' | 'elite';

export interface HookupBeacon {
  id: string;
  type: 'hookup';
  mode: HookupMode;
  creator_id: string;
  name: string;
  description: string;
  city: string;
  venue?: string;
  zone?: string;
  
  // Room mode
  telegram_room_id?: string;
  
  // 1:1 mode
  target_user_id?: string;
  
  // Time bounds
  active_from?: string;
  active_until?: string;
  
  // Rate limiting
  max_connections_per_hour: number;
  
  // Access control
  membership_required: MembershipTier;
  
  // Analytics
  total_scans: number;
  total_connections: number;
  
  // Status
  status: HookupBeaconStatus;
  is_hookup: true; // moderation flag
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface HookupConnection {
  id: string;
  beacon_id: string;
  type: 'room' | '1to1';
  
  // For 1:1 connections
  scanner_id?: string;
  target_id?: string;
  
  // For room connections
  user_id?: string;
  
  status: 'initiated' | 'accepted' | 'declined' | 'expired';
  timestamp: string;
}

export interface HookupBeaconCreateRequest {
  mode: HookupMode;
  name: string;
  description: string;
  city: string;
  venue?: string;
  zone?: string;
  telegram_room_id?: string; // required for room mode
  target_user_id?: string; // required for 1to1 mode (auto-set to current user)
  active_from?: string;
  active_until?: string;
  max_connections_per_hour?: number;
  membership_required?: MembershipTier;
}

export interface HookupBeaconCreateResponse {
  success: true;
  beacon: HookupBeacon;
  xp_earned: number;
  qr_url: string;
}

export interface HookupScanRequest {
  beacon_id: string;
  consent_confirmed: boolean;
}

export interface HookupConsentResponse {
  requires_consent: true;
  consent_message: string;
  beacon_info: {
    mode: HookupMode;
    name: string;
    description: string;
    city: string;
    venue?: string;
    zone?: string;
  };
}

export interface HookupRoomConnectionResponse {
  success: true;
  mode: 'room';
  room_link: string;
  room_id: string;
  xp_earned: number;
  message: string;
}

export interface Hookup1to1ConnectionResponse {
  success: true;
  mode: '1to1';
  connection_id: string;
  bot_message: string;
  xp_earned: number;
  next_steps: string[];
}

export type HookupScanResponse = 
  | HookupConsentResponse
  | HookupRoomConnectionResponse
  | Hookup1to1ConnectionResponse;

export interface HookupBeaconStats {
  total_scans: number;
  total_connections: number;
  conversion_rate: string; // percentage as string
  recent_connections: HookupConnection[];
}

export interface HookupNearbyRequest {
  city?: string;
  lat?: number;
  lng?: number;
  radius?: number; // in meters
}

export interface HookupNearbyResponse {
  beacons: Array<{
    id: string;
    name: string;
    description: string;
    city: string;
    venue?: string;
    zone?: string;
    total_scans: number;
    total_connections: number;
    membership_required: MembershipTier;
  }>;
}

export interface HookupMembershipLimits {
  free: {
    room_scans_per_night: number;
    one_to_one_connections_per_week: number;
    can_create_one_to_one: boolean;
  };
  pro: {
    room_scans_per_night: number | 'unlimited';
    one_to_one_connections_per_week: number;
    can_create_one_to_one: boolean;
    analytics: boolean;
  };
  elite: {
    room_scans_per_night: 'unlimited';
    one_to_one_connections_per_week: 'unlimited';
    can_create_one_to_one: boolean;
    analytics: boolean;
    advanced_controls: {
      time_bound: boolean;
      geo_bound: boolean;
      priority_listing: boolean;
    };
  };
}

export const HOOKUP_MEMBERSHIP_LIMITS: HookupMembershipLimits = {
  free: {
    room_scans_per_night: 2,
    one_to_one_connections_per_week: 5,
    can_create_one_to_one: false,
  },
  pro: {
    room_scans_per_night: 'unlimited',
    one_to_one_connections_per_week: 20,
    can_create_one_to_one: true,
    analytics: true,
  },
  elite: {
    room_scans_per_night: 'unlimited',
    one_to_one_connections_per_week: 'unlimited',
    can_create_one_to_one: true,
    analytics: true,
    advanced_controls: {
      time_bound: true,
      geo_bound: true,
      priority_listing: true,
    },
  },
};

export const HOOKUP_XP_REWARDS = {
  create_room_beacon: 100,
  create_1to1_beacon: 50,
  scan_room_beacon: 15,
  connect_1to1: 10,
} as const;

export const HOOKUP_CONSENT_MESSAGES = {
  room: `You're entering a hook-up zone. Remember:

✓ Respect boundaries and consent
✓ No screenshots without permission
✓ What happens here stays here
✓ You can leave anytime`,
  
  '1to1': `You're connecting with a member on HOTMESS. Before you continue:

✓ I'm clear-minded and sober
✓ I've thought about what I want
✓ I'm okay to stop if it doesn't feel right
✓ I won't screenshot or share without consent`,
} as const;
