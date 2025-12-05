// app/api/admin/moderation/preset/close-thread/route.ts
// One-click preset: Close thread from report

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

    // Close thread
    const { error: closeErr } = await supabase.rpc("admin_close_thread_from_report", {
      p_report_id: String(reportId),
      p_note: note ? String(note) : null,
    });

    if (closeErr) {
      console.error("[Close Thread Preset] Error:", closeErr);
      return NextResponse.json({ ok: false, error: closeErr.message }, { status: 400 });
    }

    // Mark report as actioned
    const { error: statusErr } = await supabase.rpc("admin_set_report_status", {
      p_report_id: String(reportId),
      p_status: "actioned",
      p_note: note ? String(note) : null,
    });

    if (statusErr) {
      console.error("[Close Thread Preset] Status update error:", statusErr);
      return NextResponse.json({ ok: false, error: statusErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Close Thread Preset] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "preset_failed" }, { status: 500 });
  }
}
