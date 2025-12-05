// app/api/records/opt-in/route.ts
// Email opt-in for drop alerts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const sb = supabaseServer();
    const { data: userData } = await sb.auth.getUser();

    const body = await req.json();
    const email = String(body.email || userData.user?.email || "")
      .trim()
      .toLowerCase();
    const tag = String(body.tag || "records_drop_alerts");
    const releaseId = body.releaseId ? String(body.releaseId) : null;
    const source = String(body.source || "site");
    const consent_text = "Drop alerts only. Unsub anytime. 18+ only.";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 }
      );
    }

    const ua = req.headers.get("user-agent");

    const { error } = await sb.from("record_optins").upsert(
      {
        user_id: userData.user?.id ?? null,
        email,
        tag,
        release_id: releaseId,
        consent_text,
        source,
        user_agent: ua,
      },
      {
        onConflict: "email,tag,release_id",
      }
    );

    if (error) {
      console.error("Opt-in error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Opt-in exception:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
