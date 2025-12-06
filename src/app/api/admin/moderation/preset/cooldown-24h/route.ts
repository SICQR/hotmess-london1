// app/api/admin/moderation/preset/cooldown-24h/route.ts
// One-click preset: Cooldown user 24h from report

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

    // Apply cooldown
    const { data: affected, error: cooldownErr } = await supabase.rpc("admin_cooldown_24h_from_report", {
      p_report_id: String(reportId),
      p_note: note ? String(note) : null,
    });

    if (cooldownErr) {
      console.error("[Cooldown Preset] Error:", cooldownErr);
      return NextResponse.json({ ok: false, error: cooldownErr.message }, { status: 400 });
    }

    // Mark report as actioned
    const { error: statusErr } = await supabase.rpc("admin_set_report_status", {
      p_report_id: String(reportId),
      p_status: "actioned",
      p_note: note ? String(note) : null,
    });

    if (statusErr) {
      console.error("[Cooldown Preset] Status update error:", statusErr);
      return NextResponse.json({ ok: false, error: statusErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, affected: affected ?? 0 });
  } catch (e: any) {
    console.error("[Cooldown Preset] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "preset_failed" }, { status: 500 });
  }
}
