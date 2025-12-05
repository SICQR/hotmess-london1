// app/api/admin/moderation/preset/remove-listing/route.ts
// One-click preset: Remove ticket listing from report

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }

  try {
    const { reportId, note } = await req.json();

    // Remove listing
    const { error: removeErr } = await supabase.rpc("admin_remove_ticket_listing_from_report", {
      p_report_id: String(reportId),
      p_note: note ? String(note) : null,
    });

    if (removeErr) {
      console.error("[Remove Listing Preset] Error:", removeErr);
      return NextResponse.json({ ok: false, error: removeErr.message }, { status: 400 });
    }

    // Mark report as actioned
    const { error: statusErr } = await supabase.rpc("admin_set_report_status", {
      p_report_id: String(reportId),
      p_status: "actioned",
      p_note: note ? String(note) : null,
    });

    if (statusErr) {
      console.error("[Remove Listing Preset] Status update error:", statusErr);
      return NextResponse.json({ ok: false, error: statusErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Remove Listing Preset] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "preset_failed" }, { status: 500 });
  }
}
