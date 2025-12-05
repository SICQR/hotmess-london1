// app/api/tickets/event/route.ts
// Lightweight ticket event logger for funnel tracking
// Degrades gracefully if events table doesn't exist

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { data: u } = await supabase.auth.getUser();

  const body = await req.json().catch(() => ({}));
  const event = String(body.event || "").slice(0, 64);
  const beacon_id = body.beacon_id ? String(body.beacon_id) : null;
  const listing_id = body.listing_id ? String(body.listing_id) : null;
  const meta = body.meta && typeof body.meta === "object" ? body.meta : {};

  if (!event) {
    return NextResponse.json({ ok: false, error: "event_required" }, { status: 400 });
  }

  // [Assumption] you have a generic events/telemetry table.
  // If not: this degrades safely and doesn't break UX.
  try {
    const { error } = await supabase.from("events").insert({
      user_id: u.user?.id ?? null,
      event,
      beacon_id,
      listing_id,
      meta,
      created_at: new Date().toISOString(),
    });

    // Even if logging fails, don't break the user experience
    if (error) {
      console.warn("[Tickets Event Logger] Failed to log event:", error.message);
      return NextResponse.json({ ok: false, error: "log_failed" }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.warn("[Tickets Event Logger] Exception:", e?.message);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 200 });
  }
}
