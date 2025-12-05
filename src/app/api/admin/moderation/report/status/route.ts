// app/api/admin/moderation/report/status/route.ts
// Set report status (triage / dismiss / actioned)

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
    const body = await req.json();
    const reportId = String(body.reportId || "");
    const status = String(body.status || "triaged");
    const note = body.note ? String(body.note) : null;

    if (!reportId) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const { error } = await supabase.rpc("admin_set_report_status", {
      p_report_id: reportId,
      p_status: status,
      p_note: note,
    });

    if (error) {
      console.error("[Report Status API] Error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Report Status API] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "status_update_failed" }, { status: 500 });
  }
}
