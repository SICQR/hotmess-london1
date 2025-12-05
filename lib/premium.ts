/**
 * PREMIUM STATUS UTILITIES
 * 
 * Check if user has active premium subscription.
 * Integrates with Supabase auth and subscription system.
 */

import { createClient } from '../utils/supabase/client';

/**
 * Check if current user has premium subscription
 * Returns true if premium, false otherwise
 */
export async function isPremiumUser(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return false;
    }
    
    // Check user metadata for premium flag
    // (Set this during Stripe webhook processing)
    if (user.user_metadata?.is_premium === true) {
      return true;
    }
    
    // Alternative: Check subscriptions table
    // const { data: subscription } = await supabase
    //   .from('subscriptions')
    //   .select('status')
    //   .eq('user_id', user.id)
    //   .eq('status', 'active')
    //   .single();
    
    // return !!subscription;
    
    return false;
  } catch (error) {
    console.error('Premium check error:', error);
    return false;
  }
}

/**
 * Get premium status from localStorage cache
 * Use this for instant checks, but refresh periodically
 */
export function getCachedPremiumStatus(): boolean {
  try {
    const cached = localStorage.getItem('hotmess_premium_status');
    if (!cached) return false;
    
    const { isPremium, expiresAt } = JSON.parse(cached);
    
    // Check if cache is expired (1 hour)
    if (Date.now() > expiresAt) {
      return false;
    }
    
    return isPremium === true;
  } catch (error) {
    return false;
  }
}

/**
 * Cache premium status in localStorage
 */
export function cachePremiumStatus(isPremium: boolean): void {
  try {
    localStorage.setItem('hotmess_premium_status', JSON.stringify({
      isPremium,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    }));
  } catch (error) {
    console.error('Cache premium status error:', error);
  }
}

/**
 * Refresh premium status from server and update cache
 */
export async function refreshPremiumStatus(): Promise<boolean> {
  const isPremium = await isPremiumUser();
  cachePremiumStatus(isPremium);
  return isPremium;
}
