// HOTMESS LONDON - Bot-Powered Product Drops Types
// Types for the complete drops system (instant, timed, location, dual)

export type DropType = 'instant' | 'timed' | 'location' | 'dual';
export type DropStatus = 'scheduled' | 'live' | 'ended' | 'sold_out' | 'cancelled';

export interface Drop {
  id: string;
  seller_id: string;
  seller_username: string;
  seller_avatar?: string;
  
  // Core drop info
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  quantity_sold: number;
  
  // Images
  images: string[];
  
  // Drop type and timing
  type: DropType;
  status: DropStatus;
  scheduled_at?: string; // For timed drops
  ends_at?: string;
  live_at?: string;
  
  // Location drops
  beacon_id?: string;
  beacon_code?: string;
  beacon_name?: string;
  location?: {
    lat: number;
    lng: number;
    city: string;
    venue?: string;
  };
  
  // Dual drops (music + product)
  release_id?: string; // Link to RAW CONVICT release
  release_title?: string;
  
  // Marketplace
  category: string;
  tags: string[];
  
  // Analytics
  views: number;
  saves: number;
  xp_reward: number;
  
  // Room announcements
  announced_in_rooms: string[]; // Array of room IDs where drop was announced
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // QR code for sharing
  qr_code_url?: string;
}

export interface DropSchedule {
  id: string;
  drop_id: string;
  scheduled_for: string;
  announcement_sent: boolean;
  radio_bot_notified: boolean;
  rooms_notified: string[];
}

export interface DropAnalytics {
  drop_id: string;
  period: 'day' | 'week' | 'month' | 'all_time';
  
  // Engagement
  views: number;
  unique_viewers: number;
  saves: number;
  shares: number;
  
  // Sales
  revenue: number;
  units_sold: number;
  conversion_rate: number;
  
  // Traffic sources
  sources: {
    rooms: number;
    qr_scans: number;
    beacons: number;
    direct: number;
    referrals: number;
  };
  
  // XP generated
  xp_earned: number;
  xp_distributed_to_buyers: number;
  
  // Timeline
  hourly_sales: { hour: string; sales: number }[];
}

export interface DropCreateInput {
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  images: File[] | string[];
  
  type: DropType;
  scheduled_at?: string;
  ends_at?: string;
  
  // For location drops
  beacon_id?: string;
  
  // For dual drops
  release_id?: string;
  
  category: string;
  tags: string[];
  city: string;
  
  // XP reward for purchase
  xp_reward: number;
}

export interface SellerDropStats {
  seller_id: string;
  total_drops: number;
  active_drops: number;
  total_revenue: number;
  total_units_sold: number;
  total_xp_earned: number;
  average_rating: number;
  conversion_rate: number;
}
