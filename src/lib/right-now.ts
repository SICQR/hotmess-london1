// lib/right-now.ts
// RIGHT NOW API Helper – Frontend integration for unified RIGHT NOW engine
// HOTMESS LONDON

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RIGHT_NOW_URL = `${supabaseUrl}/functions/v1/right-now`;

export type RightNowIntent = "hookup" | "drop" | "ticket" | "radio" | "crowd" | "care";

export interface RightNowPost {
  id: string;
  intent: RightNowIntent;
  text: string;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  expires_at: string;
  user_id: string;
  crowd_count?: number | null;
  crowd_verified?: boolean;
  safe_tags?: string[];
  heat_score?: number;
  show_on_globe?: boolean;
}

export interface CreateRightNowPostInput {
  kind: RightNowIntent;
  text: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  expires_in_minutes?: number;
  media_url?: string | null;
  show_on_globe?: boolean;
  telegram_mirror?: boolean;
  beacon_id?: string | null;
  crowd_count?: number | null;
  safe_tags?: string[];
}

export interface FeedOptions {
  city?: string;
  intent?: RightNowIntent;
  limit?: number;
  crowd_verified_only?: boolean;
  aftercare_only?: boolean;
}

export interface FeedResponse {
  posts: RightNowPost[];
  total: number;
  filters: {
    city?: string;
    intent?: string;
    crowd_verified_only?: boolean;
    aftercare_only?: boolean;
  };
}

/**
 * Fetch RIGHT NOW live feed
 */
export async function fetchRightNowFeed(opts: FeedOptions = {}): Promise<FeedResponse> {
  const params = new URLSearchParams();
  if (opts.city) params.set("city", opts.city);
  if (opts.intent) params.set("intent", opts.intent);
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.crowd_verified_only) params.set("crowd_verified_only", "true");
  if (opts.aftercare_only) params.set("aftercare_only", "true");

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Not authenticated");

  const res = await fetch(`${RIGHT_NOW_URL}/feed?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${data.session.access_token}`
    }
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to fetch feed");
  }
  
  return res.json();
}

/**
 * Create a new RIGHT NOW post
 */
export async function createRightNowPost(payload: CreateRightNowPostInput) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Not authenticated");

  const res = await fetch(`${RIGHT_NOW_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create post");
  }
  
  return res.json() as Promise<{
    post: RightNowPost;
    xp_awarded: number;
    ttl_minutes: number;
    message: string;
  }>;
}

/**
 * Delete a RIGHT NOW post (user's own posts only)
 */
export async function deleteRightNowPost(postId: string) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Not authenticated");

  const res = await fetch(`${RIGHT_NOW_URL}/posts?id=${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${data.session.access_token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to delete post");
  }
  
  return res.json();
}

/**
 * Report a RIGHT NOW post
 */
export async function reportRightNowPost(postId: string, reason: string) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Not authenticated");

  const res = await fetch(`${RIGHT_NOW_URL}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`
    },
    body: JSON.stringify({ post_id: postId, reason })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to report post");
  }
  
  return res.json();
}

/**
 * Subscribe to realtime RIGHT NOW updates for a city
 */
export function subscribeToRightNowUpdates(
  city: string,
  onNewPost: (post: RightNowPost) => void
) {
  const channel = supabase.channel(`right_now:${city}`);
  
  channel
    .on("broadcast", { event: "new_post" }, (payload) => {
      onNewPost(payload.payload.post);
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
