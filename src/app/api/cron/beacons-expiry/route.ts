// app/api/cron/beacons-expiry/route.ts
// Cron worker to enqueue beacon expiry notifications

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(req: Request) {
  // Protect with secret header
  const secret = req.headers.get("x-cron-secret");
  
  if (!secret || secret !== process.env.CRON_SECRET) {
    console.error("[Beacon Expiry] Unauthorized: missing or invalid cron secret");
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Create admin client
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    console.log("[Beacon Expiry] Starting worker...");

    // Find saved beacons with live beacons
    const { data: saved, error: savedError } = await admin
      .from("saved_beacons")
      .select(`
        user_id,
        beacon_id,
        notify_before_minutes,
        notify_on_expiry,
        beacons!inner(
          id,
          title,
          beacon_type,
          expires_at,
          status
        )
      `)
      .eq("beacons.status", "live")
      .limit(2000);

    if (savedError) {
      console.error("[Beacon Expiry] Error fetching saved beacons:", savedError);
      throw savedError;
    }

    if (!saved || saved.length === 0) {
      console.log("[Beacon Expiry] No saved beacons found.");
      return NextResponse.json({ ok: true, processed: 0 });
    }

    console.log(`[Beacon Expiry] Found ${saved.length} saved beacons`);

    const now = Date.now();
    let expiringSoonCount = 0;
    let expiredCount = 0;

    for (const row of saved) {
      const beacon = (row as any).beacons;
      const expiresAt = new Date(beacon.expires_at).getTime();
      const minutesLeft = Math.floor((expiresAt - now) / 60000);

      // Expiring soon notification
      if (
        row.notify_before_minutes > 0 &&
        minutesLeft <= row.notify_before_minutes &&
        minutesLeft > 0
      ) {
        const dedupeKey = `beacon:expiring:${row.beacon_id}:${row.user_id}`;

        // Check if notification already exists
        const { data: existing } = await admin
          .from("notification_outbox")
          .select("id")
          .eq("dedupe_key", dedupeKey)
          .single();

        if (!existing) {
          // Enqueue notification
          const { error: notifError } = await admin
            .from("notification_outbox")
            .insert({
              user_id: row.user_id,
              notification_type: "beacon.expiring_soon",
              payload: {
                beaconId: beacon.id,
                beaconTitle: beacon.title,
                beaconType: beacon.beacon_type,
                minutesLeft,
                expiresAt: beacon.expires_at,
              },
              dedupe_key: dedupeKey,
              priority: 60,
              channel: "in_app",
              template_key: "beacon.expiring_soon",
              not_before: new Date().toISOString(),
            });

          if (notifError) {
            console.error(`[Beacon Expiry] Failed to enqueue expiring_soon for ${beacon.id}:`, notifError);
          } else {
            expiringSoonCount++;
            console.log(`[Beacon Expiry] Enqueued expiring_soon for beacon ${beacon.id}, user ${row.user_id}, ${minutesLeft} min left`);
          }
        }
      }

      // Expired notification
      if (minutesLeft <= 0 && row.notify_on_expiry) {
        const dedupeKey = `beacon:expired:${row.beacon_id}:${row.user_id}`;

        // Check if notification already exists
        const { data: existing } = await admin
          .from("notification_outbox")
          .select("id")
          .eq("dedupe_key", dedupeKey)
          .single();

        if (!existing) {
          // Enqueue notification
          const { error: notifError } = await admin
            .from("notification_outbox")
            .insert({
              user_id: row.user_id,
              notification_type: "beacon.expired",
              payload: {
                beaconId: beacon.id,
                beaconTitle: beacon.title,
                beaconType: beacon.beacon_type,
                expiredAt: beacon.expires_at,
              },
              dedupe_key: dedupeKey,
              priority: 50,
              channel: "in_app",
              template_key: "beacon.expired",
              not_before: new Date().toISOString(),
            });

          if (notifError) {
            console.error(`[Beacon Expiry] Failed to enqueue expired for ${beacon.id}:`, notifError);
          } else {
            expiredCount++;
            console.log(`[Beacon Expiry] Enqueued expired for beacon ${beacon.id}, user ${row.user_id}`);
          }
        }
      }
    }

    console.log(`[Beacon Expiry] Complete. Expiring soon: ${expiringSoonCount}, Expired: ${expiredCount}`);

    return NextResponse.json({
      ok: true,
      processed: saved.length,
      expiringSoon: expiringSoonCount,
      expired: expiredCount,
    });
  } catch (e: any) {
    console.error("[Beacon Expiry] Fatal error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "worker_failed" },
      { status: 500 }
    );
  }
}
