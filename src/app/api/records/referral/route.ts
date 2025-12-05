// app/api/records/referral/route.ts
// Track referrals, UTMs, and conversion funnel events

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const sb = supabaseServer();
    const { data: userData } = await sb.auth.getUser();
    const body = await req.json();

    const { error } = await sb.from("record_referrals").insert({
      user_id: userData.user?.id ?? null,
      release_id: body.releaseId ?? null,
      event: String(body.event || "view"),
      source: String(body.source || "site"),
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_content: body.utm_content ?? null,
      utm_term: body.utm_term ?? null,
      drop_id: body.drop_id ?? null,
    });

    if (error) {
      console.error("Referral tracking error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Referral tracking exception:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
