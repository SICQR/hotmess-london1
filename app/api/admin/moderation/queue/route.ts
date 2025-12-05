// app/api/admin/moderation/queue/route.ts
// Fetch moderation queue with server-side report join

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "open";
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(200, Math.max(10, Number(url.searchParams.get("limit") || 50)));

  try {
    // Fetch moderation queue (admin-only by RLS)
    const { data: mq, error: mqErr } = await supabase
      .from("moderation_queue")
      .select("id, item_type, item_id, priority, status, created_at, updated_at")
      .eq("item_type", "report")
      .eq("status", status === "dismissed" ? "actioned" : status)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (mqErr) {
      console.error("[Queue API] Error fetching queue:", mqErr);
      return NextResponse.json({ ok: false, error: mqErr.message }, { status: 400 });
    }

    const ids = (mq ?? []).map((x: any) => x.item_id);
    
    if (ids.length === 0) {
      return NextResponse.json({ ok: true, items: [] });
    }

    // Fetch report details
    const { data: reports, error: rErr } = await supabase
      .from("reports")
      .select(`
        id,
        reporter_user_id,
        target_type,
        target_id,
        reason_code,
        details,
        status,
        created_at,
        updated_at,
        triaged_by,
        resolution_note
      `)
      .in("id", ids);

    if (rErr) {
      console.error("[Queue API] Error fetching reports:", rErr);
      return NextResponse.json({ ok: false, error: rErr.message }, { status: 400 });
    }

    // Join queue + reports
    const byId = new Map((reports ?? []).map((r: any) => [r.id, r]));

    let items = (mq ?? [])
      .map((row: any) => ({
        queue: row,
        report: byId.get(row.item_id) || null,
      }))
      .filter((x: any) => x.report);

    // Search filter
    if (q) {
      items = items.filter((x: any) => {
        const r = x.report;
        return (
          String(r.id).toLowerCase().includes(q) ||
          String(r.target_id).toLowerCase().includes(q) ||
          String(r.reporter_user_id).toLowerCase().includes(q) ||
          String(r.reason_code).toLowerCase().includes(q)
        );
      });
    }

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("[Queue API] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "queue_fetch_failed" }, { status: 500 });
  }
}
