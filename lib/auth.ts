/**
 * Auth utilities for Supabase authentication
 */
import { supabase } from './supabase';

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
    console.error('Failed to get access token:', err);
    return null;
  }
}

/**
 * Get access token async (more reliable)
 */
export async function getAccessTokenAsync(): Promise<string | null> {
  try {
    // Debug localStorage
    console.log('🔍 Checking localStorage for auth token...');
    const keys = Object.keys(localStorage);
    const authKeys = keys.filter(k => k.includes('auth') || k.startsWith('sb-'));
    console.log('Auth-related keys:', authKeys);
    
    authKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          console.log(`Key: ${key}`, {
            hasAccessToken: !!parsed?.access_token,
            hasCurrentSession: !!parsed?.currentSession,
            hasUser: !!parsed?.user || !!parsed?.currentSession?.user
          });
        }
      } catch {
        // Not JSON, skip
      }
    });
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('getAccessTokenAsync - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasAccessToken: !!session?.access_token,
      userId: session?.user?.id,
      email: session?.user?.email,
      error: error?.message
    });
    
    if (error) {
      console.error('Error getting session for token:', error);
      return null;
    }
    
    if (session?.access_token) {
      console.log('✅ Access token retrieved:', session.access_token.slice(0, 20) + '...');
    } else {
      console.warn('⚠️ No access token in session');
    }
    
    return session?.access_token || null;
  } catch (err) {
    console.error('Failed to get access token async:', err);
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
      console.error('Error getting session:', error);
      return null;
    }
    
    if (!session?.user) {
      return null;
    }
    
    // Check for dev admin override
    const adminOverride = localStorage.getItem('hotmess_admin_override') === 'true';
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      displayName: session.user.user_metadata?.displayName || session.user.user_metadata?.name || session.user.email,
      role: adminOverride ? 'admin' : (session.user.user_metadata?.role || session.user.role || 'user')
    };
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<void> {
  console.log('🔐 Attempting sign in...', { email });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  console.log('Sign in response:', {
    hasSession: !!data?.session,
    hasUser: !!data?.user,
    userId: data?.user?.id,
    userEmail: data?.user?.email,
    emailConfirmed: data?.user?.email_confirmed_at,
    error: error?.message
  });
  
  if (error) {
    console.error('❌ Sign in error:', error);
    throw new Error(`Sign in failed: ${error.message}`);
  }
  
  if (!data?.session) {
    throw new Error('Sign in failed: No session created');
  }
  
  console.log('✅ Sign in successful!');
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName?: string): Promise<void> {
  // Use server-side signup to auto-confirm email (since we have no email server configured)
  const { projectId, publicAnonKey } = await import('../utils/supabase/info');
  
  const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a670c824/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`Sign up failed: ${data.error || 'Unknown error'}`);
  }

  console.log('✅ User created successfully, now signing in...');

  // Now sign in with the newly created account
  await signIn(email, password);
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
    console.log('Auth state changed:', event);
    
    if (session?.user) {
      // Check for dev admin override
      const adminOverride = localStorage.getItem('hotmess_admin_override') === 'true';
      
      callback({
        id: session.user.id,
        email: session.user.email || '',
        displayName: session.user.user_metadata?.displayName || session.user.user_metadata?.name || session.user.email,
        role: adminOverride ? 'admin' : (session.user.user_metadata?.role || session.user.role || 'user')
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
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}