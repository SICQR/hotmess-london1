/**
 * AUTH MIDDLEWARE
 * Helpers for protecting routes that require authentication
 */

import { Context } from 'npm:hono@4';
import { createClient } from 'jsr:@supabase/supabase-js@2';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Verify JWT and extract user from Authorization header
 * Returns user object or null if invalid/missing
 */
export async function verifyAuth(c: Context): Promise<AuthUser | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth verification failed:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (err) {
    console.error('Auth middleware error:', err);
    return null;
  }
}

/**
 * Middleware factory: require authentication
 * Returns 401 if user is not authenticated
 */
export function requireAuth() {
  return async (c: Context, next: () => Promise<void>) => {
    const user = await verifyAuth(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Attach user to context for downstream handlers
    c.set('user', user);
    await next();
  };
}

/**
 * Middleware factory: require admin role
 * Returns 403 if user is not an admin
 */
export function requireAdmin() {
  return async (c: Context, next: () => Promise<void>) => {
    const user = await verifyAuth(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user has admin role (customize this check based on your schema)
    // Option 1: Check user.role
    // Option 2: Check custom claims
    // Option 3: Check a users table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile } = await supabase
      .from('kv_store_a670c824')
      .select('value')
      .eq('key', `user:${user.id}:role`)
      .single();

    const isAdmin = profile?.value === 'admin' || user.role === 'admin';
    
    if (!isAdmin) {
      return c.json({ error: 'Forbidden - admin access required' }, 403);
    }
    
    c.set('user', user);
    await next();
  };
}

/**
 * Optional auth - extracts user if present, but doesn't require it
 * Useful for routes that behave differently for authenticated users
 */
export async function optionalAuth(c: Context, next: () => Promise<void>) {
  const user = await verifyAuth(c);
  if (user) {
    c.set('user', user);
  }
  await next();
}
