/**
 * HOTMESS AUTO-INTEL ENGINE TYPES
 * Global event intelligence, drops, trends, and cultural intel
 */

export interface EventRaw {
  id: string;
  source: 'resident_advisor' | 'qx' | 'gaytimes' | 'ticketmaster' | 'designmynight' | 'eventbrite';
  raw_data: Record<string, any>;
  scraped_at: string;
  processed: boolean;
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  ticket_url?: string;
  price?: string;
  category: 'club' | 'rave' | 'queer' | 'drag' | 'fetish' | 'party' | 'community' | 'market' | 'festival';
  image?: string;
  description?: string;
  beacon_id?: string;
  qr_url?: string;
  poster_url?: string;
  created_at: string;
}

export interface SetTime {
  id: string;
  event_id?: string;
  venue: string;
  city: string;
  date: string;
  lineup: Array<{
    time: string;
    artist: string;
    stage?: string;
  }>;
  source: 'instagram' | 'manual' | 'club_website';
  posted_at: string;
}

export interface Festival {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  lineup: string[];
  ticket_url?: string;
  website?: string;
  image?: string;
  beacon_id?: string;
}

export interface PrideEvent {
  id: string;
  name: string;
  city: string;
  country: string;
  date: string;
  type: 'parade' | 'party' | 'festival' | 'march' | 'community';
  description?: string;
  website?: string;
  beacon_id?: string;
}

export interface SexPositiveEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  type: 'sauna' | 'fetish' | 'kink' | 'leather' | 'cruise' | 'party';
  ticket_url?: string;
  age_restriction: string;
  consent_policy?: string;
  beacon_id?: string;
}

export interface QueerMarket {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  time: string;
  type: 'market' | 'popup' | 'fair' | 'craft';
  vendors?: number;
  description?: string;
  instagram?: string;
  beacon_id?: string;
}

export interface RawConvictRelease {
  id: string;
  title: string;
  artist: string;
  release_type: 'single' | 'ep' | 'album' | 'remix';
  release_date: string;
  artwork_url: string;
  spotify_url?: string;
  soundcloud_url?: string;
  apple_music_url?: string;
  purchase_url?: string;
  beacon_id?: string;
  qr_url?: string;
  drop_announced_at?: string;
}

export interface TikTokTrend {
  id: string;
  summary: string;
  hashtags: string[];
  trending_creators: string[];
  category: 'nightlife' | 'fashion' | 'music' | 'culture' | 'drag' | 'activism';
  week_of: string;
  analyzed_at: string;
}

export interface SentimentLog {
  id: string;
  room_id: string;
  room_name: string;
  label: 'positive' | 'neutral' | 'messy' | 'unsafe';
  confidence: number;
  sample_messages: string[];
  analyzed_at: string;
  action_taken?: string;
}

export interface CrossPostLog {
  id: string;
  source_type: 'event' | 'drop' | 'release' | 'trend';
  source_id: string;
  platforms: ('instagram' | 'whatsapp' | 'threads')[];
  posted_at: string;
  success: boolean;
  error?: string;
}

export interface EventPoster {
  id: string;
  event_id: string;
  template: 'neon' | 'blackout' | 'violet' | 'elite' | 'minimal';
  image_url: string;
  qr_included: boolean;
  generated_at: string;
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number;
    y: number;
    z: number; // For 3D globe positioning
  };
  timezone: string;
  active: boolean;
  event_count: number;
  last_updated: string;
}

export interface CityIntel {
  city: string;
  events: Event[];
  set_times: SetTime[];
  queer_markets: QueerMarket[];
  sex_positive_events: SexPositiveEvent[];
  pride_events: PrideEvent[];
  festivals: Festival[];
  releases: RawConvictRelease[];
  trends: TikTokTrend | null;
  vibe: SentimentLog | null;
}

export interface TonightDigest {
  city: string;
  date: string;
  events: Event[];
  set_times: SetTime[];
  summary: string;
  total_events: number;
}

/**
 * Event scraping configuration
 */
export interface ScraperConfig {
  source: string;
  url: string;
  enabled: boolean;
  schedule: string; // cron expression
  selector?: string;
  parser: 'html' | 'json' | 'xml' | 'rss';
}

/**
 * Automation scenario configuration
 */
export interface AutomationScenario {
  id: string;
  name: string;
  description: string;
  trigger: 'schedule' | 'webhook' | 'db_trigger';
  schedule?: string;
  enabled: boolean;
  last_run?: string;
  next_run?: string;
}
