/**
 * RIGHT NOW — Type Definitions
 * Live hookup + crowd + care feed system
 * HOTMESS LONDON
 */

export type RightNowIntent = 
  | 'hookup'
  | 'crowd'
  | 'drop'
  | 'ticket'
  | 'radio'
  | 'care';

export type RightNowVisibility =
  | 'local'      // 1km
  | 'near'       // 3km
  | 'city'       // 10km
  | 'global';    // unlimited

export type RightNowStatus =
  | 'live'       // Active, visible
  | 'warming'    // Building heat
  | 'cooling'    // Expiring soon
  | 'expired'    // TTL reached
  | 'removed';   // User/admin deleted

export interface RightNowPost {
  id: string;
  user_id: string;
  intent: RightNowIntent;
  text: string;
  
  // Location
  city: string;
  lat_bin: number;      // Rounded for privacy
  lng_bin: number;      // Rounded for privacy
  beacon_id?: string | null;
  
  // Time
  created_at: string;
  expires_at: string;
  ttl_minutes: number;  // 15, 30, 45, 60, 90
  
  // Visibility & Heat
  visibility: RightNowVisibility;
  status: RightNowStatus;
  heat_score: number;           // 0-100
  crowd_verified: boolean;      // ≥6 scans in venue
  show_in_globe: boolean;
  
  // XP & Membership
  xp_reward: number;
  membership_required: 'free' | 'hnh' | 'sinner' | 'icon';
  membership_boost_active: boolean;
  
  // Safety
  safe_tags: string[];          // ['aftercare', 'sober', 'chill']
  panic_nearby: boolean;        // Panic in last 60min within 500m
  
  // Engagement
  view_count: number;
  reply_count: number;
  report_count: number;
  
  // Telegram
  telegram_mirrored: boolean;
  telegram_room_id?: string | null;
}

export interface RightNowCreateInput {
  intent: RightNowIntent;
  text: string;
  ttl_minutes: number;
  visibility: RightNowVisibility;
  beacon_id?: string | null;
  show_in_globe?: boolean;
  telegram_mirror?: boolean;
  safe_tags?: string[];
}

export interface RightNowFilterOptions {
  intent?: RightNowIntent[];
  radius_km?: number;
  city?: string;
  time_range?: 'now' | 'tonight' | 'weekend';
  crowd_verified_only?: boolean;
  aftercare_only?: boolean;
  exclude_panic_zones?: boolean;
}

export interface RightNowFeedResponse {
  posts: RightNowPost[];
  total: number;
  cursor?: string;
  heat_map: {
    lat: number;
    lng: number;
    heat: number;
    intent: RightNowIntent;
  }[];
}

/**
 * Panic System Types
 */
export type PanicSeverity = 'low' | 'medium' | 'high' | 'critical';
export type PanicTrigger = 'app' | 'bottle_qr' | 'venue_qr' | 'telegram';

export interface PanicIncident {
  id: string;
  user_id: string;
  severity: PanicSeverity;
  trigger: PanicTrigger;
  
  // Location
  city: string;
  lat: number;
  lng: number;
  beacon_id?: string | null;
  venue_name?: string | null;
  
  // Context
  message?: string;
  feeling?: 'unsafe' | 'overwhelmed' | 'unsure';
  
  // Resolution
  status: 'active' | 'resolved' | 'escalated';
  care_room_id?: string;
  admin_notified: boolean;
  trusted_contact_notified: boolean;
  
  // Timestamps
  created_at: string;
  resolved_at?: string;
  
  // Geo safety
  share_location_until?: string; // 30min consent
}

/**
 * Mess Brain AI Types
 */
export interface MessBrainQuery {
  query: string;
  user_location?: { lat: number; lng: number; city: string };
  context?: 'rightnow' | 'globe' | 'safety';
}

export interface MessBrainResponse {
  answer: string;
  safety_alerts?: {
    type: 'panic' | 'crowd_crush' | 'venue_flagged';
    message: string;
    distance_km?: number;
  }[];
  suggestions?: {
    text: string;
    intent: RightNowIntent;
    location?: { lat: number; lng: number; name: string };
  }[];
  heat_zones?: {
    name: string;
    heat: number;
    intent: RightNowIntent;
    safe_solo: boolean;
  }[];
}

/**
 * Heat Intelligence Types
 */
export interface HeatSource {
  type: 'rightnow' | 'scan' | 'telegram' | 'radio' | 'panic' | 'drop';
  lat: number;
  lng: number;
  intensity: number;      // 0-100
  intent?: RightNowIntent;
  timestamp: string;
}

export interface CrowdVerification {
  venue_id: string;
  beacon_id: string;
  scan_count: number;
  unique_users: number;
  verified: boolean;      // ≥6 unique scans in 30min
  verified_at?: string;
  window_start: string;
  window_end: string;
}
