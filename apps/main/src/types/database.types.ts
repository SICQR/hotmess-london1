// ============================================================================
// HOTMESS OS - Database Types (Canonical Architecture 2025-12-17)
// ============================================================================
// TypeScript types for Supabase database schema
// 
// These types should be auto-generated using:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
//
// This file provides manual types as a reference until auto-generation is run
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type BeaconType = 'event' | 'ticket' | 'venue' | 'experience' | 'community'
export type BeaconStatus = 'draft' | 'pending_review' | 'live' | 'expired' | 'archived' | 'disabled'
export type HostType = 'admin' | 'venue' | 'approved_host'

export type QRTokenScope = 'check_in' | 'listing_proof' | 'experience' | 'staff'
export type QRTokenStatus = 'active' | 'revoked' | 'expired'

export type ScanStatus = 'valid' | 'invalid' | 'duplicate' | 'revoked' | 'expired'

export type EvidenceEventType = 'qr_scan' | 'proof_post' | 'admin_verification' | 'seller_verification'
export type EvidenceVisibility = 'admin_only' | 'thread_visible'

export type PostType = 'comment' | 'proof' | 'system'
export type PostStatus = 'visible' | 'hidden' | 'removed' | 'locked'

export type ListingStatus = 'draft' | 'pending_review' | 'live' | 'sold' | 'removed'
export type EvidenceRequired = 'none' | 'proof_post' | 'qr_scan' | 'both'

export type ReportTargetType = 'beacon' | 'listing' | 'post' | 'seller' | 'user'
export type ReportCategory = 'scam' | 'harassment' | 'coercion' | 'hate' | 'doxxing' | 'unsafe' | 'other'
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'

export type ModerationAction = 'remove_post' | 'disable_beacon' | 'remove_listing' | 'suspend_seller' | 'ban_user' | 'reinstate' | 'warn'

export type DSARType = 'export' | 'delete'
export type DSARStatus = 'received' | 'verifying' | 'processing' | 'completed' | 'rejected'

export type ProductCollection = 'hnhmess' | 'raw' | 'hung' | 'high' | 'super' | 'superhung'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductStatus = 'draft' | 'live' | 'archived'

export type DropStatus = 'scheduled' | 'live' | 'ended'

export type OrderType = 'official' | 'marketplace'
export type FulfilmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type SellerVerificationStatus = 'pending' | 'approved' | 'suspended'

export type MarketListingStatus = 'draft' | 'pending_review' | 'live' | 'removed' | 'sold_out'

export type XPEventType = 'beacon_scan' | 'purchase' | 'listing_approved' | 'radio_listen' | 'daily_login' | 'streak_bonus' | 'admin_adjustment'

export type RadioShowStatus = 'draft' | 'live' | 'archived'

export type ScheduleBlockStatus = 'draft' | 'live' | 'overridden'

export type RecordReleaseStatus = 'draft' | 'scheduled' | 'live' | 'archived'

export type UserRole = 'admin' | 'moderator' | 'seller' | 'user'

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          city_id: string | null
          role: UserRole
          telegram_id: string | null
          telegram_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          city_id?: string | null
          role?: UserRole
          telegram_id?: string | null
          telegram_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          city_id?: string | null
          role?: UserRole
          telegram_id?: string | null
          telegram_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      beacons: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          type: BeaconType
          city_id: string
          region_id: string | null
          venue_id: string | null
          geo_hash: string | null
          timezone: string
          start_at: string | null
          end_at: string | null
          host_type: HostType
          creator_id: string
          status: BeaconStatus
          ruleset_id: string | null
          content_flags: Json
          report_count: number
          last_moderation_at: string | null
          scan_count: number
          view_count: number
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          type: BeaconType
          city_id: string
          region_id?: string | null
          venue_id?: string | null
          geo_hash?: string | null
          timezone?: string
          start_at?: string | null
          end_at?: string | null
          host_type: HostType
          creator_id: string
          status?: BeaconStatus
          ruleset_id?: string | null
          content_flags?: Json
          report_count?: number
          last_moderation_at?: string | null
          scan_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          type?: BeaconType
          city_id?: string
          region_id?: string | null
          venue_id?: string | null
          geo_hash?: string | null
          timezone?: string
          start_at?: string | null
          end_at?: string | null
          host_type?: HostType
          creator_id?: string
          status?: BeaconStatus
          ruleset_id?: string | null
          content_flags?: Json
          report_count?: number
          last_moderation_at?: string | null
          scan_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      qr_tokens: {
        Row: {
          id: string
          beacon_id: string
          token_hash: string
          scope: QRTokenScope
          issued_by: string
          issued_at: string
          expires_at: string
          max_uses: number
          current_uses: number
          status: QRTokenStatus
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          beacon_id: string
          token_hash: string
          scope: QRTokenScope
          issued_by: string
          issued_at?: string
          expires_at: string
          max_uses?: number
          current_uses?: number
          status?: QRTokenStatus
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          beacon_id?: string
          token_hash?: string
          scope?: QRTokenScope
          issued_by?: string
          issued_at?: string
          expires_at?: string
          max_uses?: number
          current_uses?: number
          status?: QRTokenStatus
          metadata?: Json
          created_at?: string
        }
      }
      beacon_scans: {
        Row: {
          id: string
          beacon_id: string
          token_hash: string
          scanned_at: string
          scanner_profile_id: string | null
          city_id: string
          client_meta: Json
          ip_hash: string | null
          status: ScanStatus
          created_at: string
        }
        Insert: {
          id?: string
          beacon_id: string
          token_hash: string
          scanned_at?: string
          scanner_profile_id?: string | null
          city_id: string
          client_meta?: Json
          ip_hash?: string | null
          status: ScanStatus
          created_at?: string
        }
        Update: {
          id?: string
          beacon_id?: string
          token_hash?: string
          scanned_at?: string
          scanner_profile_id?: string | null
          city_id?: string
          client_meta?: Json
          ip_hash?: string | null
          status?: ScanStatus
          created_at?: string
        }
      }
      evidence_events: {
        Row: {
          id: string
          beacon_id: string
          type: EvidenceEventType
          actor_profile_id: string | null
          source_id: string | null
          visibility: EvidenceVisibility
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          beacon_id: string
          type: EvidenceEventType
          actor_profile_id?: string | null
          source_id?: string | null
          visibility?: EvidenceVisibility
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          beacon_id?: string
          type?: EvidenceEventType
          actor_profile_id?: string | null
          source_id?: string | null
          visibility?: EvidenceVisibility
          payload?: Json
          created_at?: string
        }
      }
      beacon_posts: {
        Row: {
          id: string
          beacon_id: string
          author_profile_id: string
          type: PostType
          body: string
          attachments: Json
          status: PostStatus
          moderation_flags: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          beacon_id: string
          author_profile_id: string
          type: PostType
          body: string
          attachments?: Json
          status?: PostStatus
          moderation_flags?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          beacon_id?: string
          author_profile_id?: string
          type?: PostType
          body?: string
          attachments?: Json
          status?: PostStatus
          moderation_flags?: Json
          created_at?: string
          updated_at?: string
        }
      }
      ticket_listings: {
        Row: {
          id: string
          beacon_id: string
          seller_profile_id: string
          price: number
          quantity: number
          currency: string
          terms: string | null
          proof_required: boolean
          proof_post_id: string | null
          evidence_required: EvidenceRequired
          status: ListingStatus
          review_notes: string | null
          report_count: number
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          beacon_id: string
          seller_profile_id: string
          price: number
          quantity?: number
          currency?: string
          terms?: string | null
          proof_required?: boolean
          proof_post_id?: string | null
          evidence_required?: EvidenceRequired
          status?: ListingStatus
          review_notes?: string | null
          report_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          beacon_id?: string
          seller_profile_id?: string
          price?: number
          quantity?: number
          currency?: string
          terms?: string | null
          proof_required?: boolean
          proof_post_id?: string | null
          evidence_required?: EvidenceRequired
          status?: ListingStatus
          review_notes?: string | null
          report_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      moderation_reports: {
        Row: {
          id: string
          reporter_profile_id: string | null
          target_type: ReportTargetType
          target_id: string
          category: ReportCategory
          details: string
          status: ReportStatus
          assigned_to: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_profile_id?: string | null
          target_type: ReportTargetType
          target_id: string
          category: ReportCategory
          details: string
          status?: ReportStatus
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_profile_id?: string | null
          target_type?: ReportTargetType
          target_id?: string
          category?: ReportCategory
          details?: string
          status?: ReportStatus
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      moderation_actions: {
        Row: {
          id: string
          actor_admin_id: string
          action: ModerationAction
          target_type: string
          target_id: string
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          actor_admin_id: string
          action: ModerationAction
          target_type: string
          target_id: string
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          actor_admin_id?: string
          action?: ModerationAction
          target_type?: string
          target_id?: string
          reason?: string
          created_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          object_type: string
          object_id: string | null
          before_state: Json | null
          after_state: Json | null
          reason: string | null
          request_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          object_type: string
          object_id?: string | null
          before_state?: Json | null
          after_state?: Json | null
          reason?: string | null
          request_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          object_type?: string
          object_id?: string | null
          before_state?: Json | null
          after_state?: Json | null
          reason?: string | null
          request_id?: string | null
          created_at?: string
        }
      }
      dsar_requests: {
        Row: {
          id: string
          user_id: string | null
          email: string
          type: DSARType
          status: DSARStatus
          admin_notes: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          type: DSARType
          status?: DSARStatus
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          type?: DSARType
          status?: DSARStatus
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          long_description: string | null
          collection: ProductCollection | null
          price: number
          currency: string
          stock_status: StockStatus
          quantity_available: number
          xp_reward: number
          images: Json
          variants: Json
          limited_edition: boolean
          drop_id: string | null
          status: ProductStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          long_description?: string | null
          collection?: ProductCollection | null
          price: number
          currency?: string
          stock_status: StockStatus
          quantity_available?: number
          xp_reward?: number
          images?: Json
          variants?: Json
          limited_edition?: boolean
          drop_id?: string | null
          status?: ProductStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          long_description?: string | null
          collection?: ProductCollection | null
          price?: number
          currency?: string
          stock_status?: StockStatus
          quantity_available?: number
          xp_reward?: number
          images?: Json
          variants?: Json
          limited_edition?: boolean
          drop_id?: string | null
          status?: ProductStatus
          created_at?: string
          updated_at?: string
        }
      }
      drops: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          start_at: string
          end_at: string
          status: DropStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          start_at: string
          end_at: string
          status?: DropStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          start_at?: string
          end_at?: string
          status?: DropStatus
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          order_type: OrderType
          subtotal: number
          shipping: number
          tax: number
          total: number
          currency: string
          fulfilment_status: FulfilmentStatus
          payment_status: PaymentStatus
          shipping_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          email: string
          order_type: OrderType
          subtotal: number
          shipping?: number
          tax?: number
          total: number
          currency?: string
          fulfilment_status?: FulfilmentStatus
          payment_status?: PaymentStatus
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          order_type?: OrderType
          subtotal?: number
          shipping?: number
          tax?: number
          total?: number
          currency?: string
          fulfilment_status?: FulfilmentStatus
          payment_status?: PaymentStatus
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          listing_id: string | null
          title: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          listing_id?: string | null
          title: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          listing_id?: string | null
          title?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      market_sellers: {
        Row: {
          id: string
          owner_id: string
          display_name: string
          bio: string | null
          verification_status: SellerVerificationStatus
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          white_label_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          display_name: string
          bio?: string | null
          verification_status?: SellerVerificationStatus
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          white_label_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          display_name?: string
          bio?: string | null
          verification_status?: SellerVerificationStatus
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          white_label_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      market_listings: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          price: number
          currency: string
          quantity_available: number
          status: MarketListingStatus
          images: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          title: string
          description?: string | null
          price: number
          currency?: string
          quantity_available?: number
          status?: MarketListingStatus
          images?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string
          quantity_available?: number
          status?: MarketListingStatus
          images?: Json
          created_at?: string
          updated_at?: string
        }
      }
      xp_events: {
        Row: {
          id: string
          actor_id: string
          event_type: XPEventType
          points: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          actor_id: string
          event_type: XPEventType
          points: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string
          event_type?: XPEventType
          points?: number
          metadata?: Json
          created_at?: string
        }
      }
      radio_shows: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          host: string | null
          status: RadioShowStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          host?: string | null
          status?: RadioShowStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          host?: string | null
          status?: RadioShowStatus
          created_at?: string
          updated_at?: string
        }
      }
      schedule_blocks: {
        Row: {
          id: string
          show_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          status: ScheduleBlockStatus
          created_at: string
        }
        Insert: {
          id?: string
          show_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          status?: ScheduleBlockStatus
          created_at?: string
        }
        Update: {
          id?: string
          show_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          status?: ScheduleBlockStatus
          created_at?: string
        }
      }
      now_playing_overrides: {
        Row: {
          id: string
          track: string
          artist: string
          artwork_url: string | null
          set_by: string
          set_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          track: string
          artist: string
          artwork_url?: string | null
          set_by: string
          set_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          track?: string
          artist?: string
          artwork_url?: string | null
          set_by?: string
          set_at?: string
          expires_at?: string
        }
      }
      records_releases: {
        Row: {
          id: string
          slug: string
          title: string
          artist: string
          label: string
          release_date: string | null
          artwork_url: string | null
          soundcloud_url: string | null
          status: RecordReleaseStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          artist: string
          label?: string
          release_date?: string | null
          artwork_url?: string | null
          soundcloud_url?: string | null
          status?: RecordReleaseStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          artist?: string
          label?: string
          release_date?: string | null
          artwork_url?: string | null
          soundcloud_url?: string | null
          status?: RecordReleaseStatus
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      xp_balances: {
        Row: {
          actor_id: string
          balance: number
          total_events: number
          last_activity: string
        }
      }
      night_pulse_city_stats: {
        Row: {
          city_id: string
          hour: string
          scan_count: number
          unique_beacons: number
        }
      }
      beacon_stats: {
        Row: {
          beacon_id: string
          slug: string
          title: string
          type: BeaconType
          city_id: string
          status: BeaconStatus
          scan_count: number
          view_count: number
          listing_count: number
          post_count: number
        }
      }
      popular_beacons: {
        Row: {
          id: string
          slug: string
          title: string
          type: BeaconType
          city_id: string
          start_at: string | null
          end_at: string | null
          scan_count: number
          recent_scans: number
        }
      }
      products_available: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          collection: ProductCollection | null
          price: number
          currency: string
          stock_status: StockStatus
          quantity_available: number
          xp_reward: number
          images: Json
          variants: Json
          limited_edition: boolean
          drop_name: string | null
          drop_start: string | null
          drop_end: string | null
        }
      }
      seller_reputation: {
        Row: {
          seller_id: string
          display_name: string
          bio: string | null
          verification_status: SellerVerificationStatus
          total_listings: number
          active_listings: number
          total_sales: number
        }
      }
      radio_schedule_this_week: {
        Row: {
          show_id: string
          slug: string
          name: string
          description: string | null
          host: string | null
          day_of_week: number
          start_time: string
          end_time: string
        }
      }
      upcoming_releases: {
        Row: {
          id: string
          slug: string
          title: string
          artist: string
          label: string
          release_date: string | null
          artwork_url: string | null
          soundcloud_url: string | null
          status: RecordReleaseStatus
        }
      }
      moderation_queue_summary: {
        Row: {
          target_type: ReportTargetType
          status: ReportStatus
          count: number
          most_recent: string
        }
      }
      my_orders: {
        Row: {
          id: string
          order_number: string
          order_type: OrderType
          total: number
          currency: string
          fulfilment_status: FulfilmentStatus
          payment_status: PaymentStatus
          created_at: string
          item_count: number
        }
      }
      city_heat_map: {
        Row: {
          city_id: string
          beacon_count: number
          active_beacon_count: number
          last_beacon_created: string
        }
      }
      xp_leaderboard: {
        Row: {
          user_id: string
          username: string | null
          avatar_url: string | null
          total_xp: number
          total_events: number
          last_activity: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_moderator: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}
