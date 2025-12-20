/**
 * SUPABASE CLIENT SINGLETON
 * Single source of truth for browser-side Supabase client
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

const supabaseUrl = `https://${projectId}.supabase.co`;

/**
 * Get Supabase client singleton instance
 * This ensures only ONE client instance exists in the browser
 */
function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });

  return supabaseInstance;
}

// Export singleton instance
export const supabase = getSupabaseClient();

// Export function to create new client (for cases that need a fresh instance)
export function createClient() {
  return getSupabaseClient();
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          shopify_id: string;
          title: string;
          collection: string;
          price: number;
          image_url: string;
          description: string | null;
          sizes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shopify_id: string;
          title: string;
          collection: string;
          price: number;
          image_url: string;
          description?: string | null;
          sizes?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          shopify_id?: string;
          title?: string;
          collection?: string;
          price?: number;
          image_url?: string;
          description?: string | null;
          sizes?: string[];
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          size: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          size: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          size?: string;
          quantity?: number;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          updated_at?: string;
        };
      };
      consents: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          granted: boolean;
          granted_at: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          granted?: boolean;
          granted_at?: string;
          ip_address?: string | null;
        };
        Update: {
          granted?: boolean;
          granted_at?: string;
        };
      };
    };
  };
}
