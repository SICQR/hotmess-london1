/**
 * SUPABASE CLIENT SINGLETON
 * Single source of truth for browser-side Supabase client
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Get Supabase client singleton instance
 * This ensures only ONE client instance exists in the browser
 */
function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: return a new instance (won't persist)
    return createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
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