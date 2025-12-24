// lib/actions/_helpers.ts
// Shared helpers for Server Actions with clean error mapping

"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

/**
 * Map DB errors to user-friendly messages
 */
function mapError(message: string): { code: string; message: string } {
  const msg = (message || "").toLowerCase();

  if (msg.includes("rate_limit")) return { code: "rate_limited", message: "Slow down. Try again in a moment." };
  if (msg.includes("not_authenticated")) return { code: "auth", message: "Sign in to continue." };
  if (msg.includes("age18_required")) return { code: "age18", message: "You must confirm you're 18+ to continue." };
  if (msg.includes("consent_required")) return { code: "consent", message: "Consent is required to continue." };
  if (msg.includes("premium_required")) return { code: "premium", message: "Premium unlocks this action." };
  if (msg.includes("beacon_expired") || msg.includes("beacon_not_live")) return { code: "expired", message: "This beacon has burned out." };
  if (msg.includes("beacon_not_found")) return { code: "not_found", message: "Beacon not found." };
  if (msg.includes("beacon_type_mismatch")) return { code: "wrong_type", message: "Wrong beacon type." };
  if (msg.includes("beacon_not_started")) return { code: "not_started", message: "This beacon hasn't started yet." };
  if (msg.includes("intent_expired")) return { code: "expired", message: "This intent has expired." };
  if (msg.includes("intent_not_found")) return { code: "not_found", message: "Intent not found." };
  if (msg.includes("cannot_opt_in_to_self")) return { code: "self_optin", message: "You cannot opt-in to your own intent." };
  if (msg.includes("not_thread_member")) return { code: "forbidden", message: "You are not a member of this thread." };
  if (msg.includes("listing_not_found")) return { code: "not_found", message: "Listing not found." };
  if (msg.includes("listing_not_available")) return { code: "unavailable", message: "This listing is no longer available." };
  if (msg.includes("cannot_message_self")) return { code: "self_message", message: "You cannot message your own listing." };
  if (msg.includes("too_many_tags")) return { code: "validation", message: "Maximum 3 tags allowed." };

  return { code: "unknown", message: message || "Something went wrong." };
}

/**
 * Create Supabase client using the current user's session
 */
export async function supabaseServer() {
  const cookieStore = cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Require authenticated user
 */
export async function requireAuthedUser() {
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) throw new Error("not_authenticated");
  return { sb, user: data.user };
}

/**
 * Call Supabase RPC as the current user with clean error mapping
 */
export async function callRpc<T>(
  rpc: string,
  args: Record<string, string | number | boolean | null>
): Promise<ActionResult<T>> {
  try {
    const { sb } = await requireAuthedUser();
    
    // Type assertion is safe - Supabase RPC accepts Record<string, unknown>
    const { data, error } = await sb.rpc(rpc, args as Record<string, unknown>);
    
    if (error) {
      console.error(`RPC ${rpc} error:`, error);
      return { ok: false, error: mapError(error.message) };
    }
    
    return { ok: true, data: data as T };
  } catch (e) {
    const err = e as Error;
    console.error(`RPC ${rpc} exception:`, err);
    return { ok: false, error: mapError(err.message || String(e)) };
  }
}

/**
 * Create admin Supabase client (service role) - use with extreme caution
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  
  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}
