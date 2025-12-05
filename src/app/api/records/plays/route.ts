// app/api/records/plays/route.ts
// Log preview/HQ play events for analytics

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Get user (optional - works for anon too)
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("record_plays").insert({
      user_id: userData.user?.id ?? null,
      release_id: body.releaseId ?? null,
      track_version_id: body.trackVersionId ?? null,
      source: String(body.source ?? "site"),
      event_type: String(body.eventType),
      progress_ms: body.progress_ms ?? null,
    });

    if (error) {
      console.error("Failed to log play event:", error);
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Play logging error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
