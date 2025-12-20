/**
 * NIGHT PULSE TYPES
 * Real-time globe visualization types
 */

export interface NightPulseCity {
  city_id: string;
  city_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  active_beacons: number | null; // null if <5 (privacy)
  scans_last_hour: number;
  heat_intensity: number; // 0-100
  last_activity_at: string;
  refreshed_at: string;
}

export interface NightPulseEvent {
  id: string;
  event_type: 'beacon_live' | 'beacon_expired' | 'scan_recorded' | 'listing_created' | 'listing_sold';
  city_id: string;
  delta_beacons: number;
  delta_scans: number;
  created_at: string;
}

export interface NightPulseRealtimeResponse {
  cities: NightPulseCity[];
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  country_code: string;
  region: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number | null;
  created_at: string;
}
