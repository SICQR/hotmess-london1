// supabase/functions/beacon-expiry-worker/index.ts
// Worker to process saved beacons and enqueue expiry notifications

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/**
 * Beacon Expiry Worker
 * 
 * Runs every 5 minutes to check saved beacons and enqueue notifications:
 * 1. "Expiring soon" - N minutes before expiry (user-configurable, default 30)
 * 2. "Expired" - At expiry time (if notify_on_expiry = true)
 * 
 * Uses dedupe keys to prevent duplicate notifications.
 */

interface SavedBeacon {
  user_id: string;
  beacon_id: string;
  notify_before_minutes: number;
  notify_on_expiry: boolean;
}

interface Beacon {
  id: string;
  title: string;
  beacon_type: string;
  expires_at: string;
  status: string;
}

Deno.serve(async (req) => {
  try {
    // Only allow POST from cron or internal
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    console.log("[Beacon Expiry Worker] Starting...");

    // Get all saved beacons for live beacons
    const { data: savedBeacons, error: savedError } = await supabase
      .from("saved_beacons")
      .select(`
        user_id,
        beacon_id,
        notify_before_minutes,
        notify_on_expiry
      `)
      .returns<SavedBeacon[]>();

    if (savedError) {
      console.error("[Worker] Error fetching saved beacons:", savedError);
      throw savedError;
    }

    if (!savedBeacons || savedBeacons.length === 0) {
      console.log("[Worker] No saved beacons found.");
      return new Response(
        JSON.stringify({ ok: true, processed: 0 }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    console.log(`[Worker] Found ${savedBeacons.length} saved beacons`);

    // Get all beacon IDs
    const beaconIds = [...new Set(savedBeacons.map((sb) => sb.beacon_id))];

    // Fetch beacon details
    const { data: beacons, error: beaconsError } = await supabase
      .from("beacons")
      .select("id, title, beacon_type, expires_at, status")
      .in("id", beaconIds)
      .eq("status", "live")
      .returns<Beacon[]>();

    if (beaconsError) {
      console.error("[Worker] Error fetching beacons:", beaconsError);
      throw beaconsError;
    }

    if (!beacons || beacons.length === 0) {
      console.log("[Worker] No live beacons found for saved beacons.");
      return new Response(
        JSON.stringify({ ok: true, processed: 0 }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    // Create beacon lookup
    const beaconMap = new Map<string, Beacon>();
    beacons.forEach((b) => beaconMap.set(b.id, b));

    const now = new Date();
    let expiringSoonCount = 0;
    let expiredCount = 0;

    // Process each saved beacon
    for (const sb of savedBeacons) {
      const beacon = beaconMap.get(sb.beacon_id);
      if (!beacon) continue;

      const expiresAt = new Date(beacon.expires_at);
      const minutesUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60);

      // Check if should send "expiring soon" notification
      if (minutesUntilExpiry > 0 && minutesUntilExpiry <= sb.notify_before_minutes) {
        const dedupeKey = `beacon:expiring:${beacon.id}:${sb.user_id}`;

        // Check if already sent
        const { data: existing } = await supabase
          .from("notification_outbox")
          .select("id")
          .eq("dedupe_key", dedupeKey)
          .single();

        if (!existing) {
          // Enqueue notification
          const { error: notifError } = await supabase
            .from("notification_outbox")
            .insert({
              user_id: sb.user_id,
              notification_type: "beacon.expiring_soon",
              payload: {
                beaconId: beacon.id,
                beaconTitle: beacon.title,
                beaconType: beacon.beacon_type,
                minutesLeft: Math.round(minutesUntilExpiry),
                expiresAt: beacon.expires_at,
              },
              dedupe_key: dedupeKey,
              priority: 60,
            });

          if (notifError) {
            console.error(`[Worker] Failed to enqueue expiring_soon for ${beacon.id}:`, notifError);
          } else {
            expiringSoonCount++;
            console.log(`[Worker] Enqueued expiring_soon for beacon ${beacon.id}, user ${sb.user_id}`);
          }
        }
      }

      // Check if should send "expired" notification
      if (minutesUntilExpiry <= 0 && sb.notify_on_expiry) {
        const dedupeKey = `beacon:expired:${beacon.id}:${sb.user_id}`;

        // Check if already sent
        const { data: existing } = await supabase
          .from("notification_outbox")
          .select("id")
          .eq("dedupe_key", dedupeKey)
          .single();

        if (!existing) {
          // Enqueue notification
          const { error: notifError } = await supabase
            .from("notification_outbox")
            .insert({
              user_id: sb.user_id,
              notification_type: "beacon.expired",
              payload: {
                beaconId: beacon.id,
                beaconTitle: beacon.title,
                beaconType: beacon.beacon_type,
                expiredAt: beacon.expires_at,
              },
              dedupe_key: dedupeKey,
              priority: 50,
            });

          if (notifError) {
            console.error(`[Worker] Failed to enqueue expired for ${beacon.id}:`, notifError);
          } else {
            expiredCount++;
            console.log(`[Worker] Enqueued expired for beacon ${beacon.id}, user ${sb.user_id}`);
          }
        }
      }
    }

    console.log(`[Worker] Complete. Expiring soon: ${expiringSoonCount}, Expired: ${expiredCount}`);

    return new Response(
      JSON.stringify({
        ok: true,
        processed: savedBeacons.length,
        expiringSoon: expiringSoonCount,
        expired: expiredCount,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("[Worker] Fatal error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
});
