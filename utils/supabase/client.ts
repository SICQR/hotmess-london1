/**
 * SUPABASE CLIENT (Browser)
 * Re-exports singleton from /lib/supabase.ts to maintain backward compatibility
 */

import { supabase } from '../../lib/supabase';

/**
 * Get Supabase client instance (singleton)
 * This now returns the shared singleton from /lib/supabase.ts
 */
export function createClient() {
  return supabase;
}
