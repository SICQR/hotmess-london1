/**
 * Auth utilities for Supabase authentication
 */
import { supabase } from './supabase';
import { debug } from './debug';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  role?: 'user' | 'admin' | 'venue_admin' | 'seller';
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  try {
    // Try to get from Supabase session in localStorage
    const keys = Object.keys(localStorage);
    const sessionKey = keys.find(key => key.startsWith('sb-') && key.includes('-auth-token'));
    
    if (sessionKey) {
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Check both access_token and the nested structure
        if (parsed?.access_token) return parsed.access_token;
        if (parsed?.accessToken) return parsed.accessToken;
        if (parsed?.currentSession?.access_token) return parsed.currentSession.access_token;
      }
    }
    
    // Fallback: try legacy key
    const legacyToken = localStorage.getItem('supabase.auth.token');
    if (legacyToken) return legacyToken;
    
    return null;
  } catch (err) {
    console.error('[Auth] Failed to get access token:', err);
    return null;
  }
}

/**
 * Get access token async (more reliable)
 */
export async function getAccessTokenAsync(): Promise<string | null> {
  try {
    if (import.meta.env.DEV) {
      debug.log('[Auth] Checking for auth token...');
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (import.meta.env.DEV) {
      debug.log('[Auth] Session check:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasAccessToken: !!session?.access_token,
        // Never log actual tokens, user IDs, or emails - even in dev
        error: error?.message
      });
    }
    
    if (error) {
      console.error('[Auth] Error getting session for token:', error);
      return null;
    }
    
    if (import.meta.env.DEV) {
      if (session?.access_token) {
        debug.log('[Auth] ✅ Access token retrieved');
      } else {
        debug.warn('[Auth] ⚠️ No access token in session');
      }
    }
    
    return session?.access_token || null;
  } catch (err) {
    console.error('[Auth] Failed to get access token async:', err);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Get current user from Supabase session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Auth] Error getting session:', error);
      return null;
    }
    
    if (!session?.user) {
      return null;
    }
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      displayName: session.user.user_metadata?.displayName || session.user.user_metadata?.name || session.user.email,
      role: (session.user.user_metadata?.role || session.user.role || 'user')
    };
  } catch (err) {
    console.error('[Auth] Failed to get current user:', err);
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<void> {
  if (import.meta.env.DEV) {
    debug.log('[Auth] Attempting sign in...');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (import.meta.env.DEV) {
    debug.log('[Auth] Sign in response:', {
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      emailConfirmed: !!data?.user?.email_confirmed_at,
      error: error?.message
    });
  }
  
  if (error) {
    console.error('[Auth] Sign in error:', error);
    throw new Error(`Sign in failed: ${error.message}`);
  }
  
  if (!data?.session) {
    throw new Error('Sign in failed: No session created');
  }
  
  if (import.meta.env.DEV) {
    debug.log('[Auth] ✅ Sign in successful!');
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName?: string): Promise<void> {
  const emailRedirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?route=login&confirmed=1`
      : undefined;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: displayName ? { displayName } : undefined,
    },
  });

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }

  if (!data?.user) {
    throw new Error('Sign up failed: No user created');
  }

  if (import.meta.env.DEV) {
    debug.log('[Auth] ✅ Sign up succeeded (email confirmation may be required).');
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (import.meta.env.DEV) {
      debug.log('[Auth] Auth state changed:', event);
    }
    
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        displayName: session.user.user_metadata?.displayName || session.user.user_metadata?.name || session.user.email,
        role: (session.user.user_metadata?.role || session.user.role || 'user')
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Get current Supabase session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[Auth] Error getting session:', error);
    return null;
  }
  
  return session;
}