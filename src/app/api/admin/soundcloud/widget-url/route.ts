// app/api/admin/soundcloud/widget-url/route.ts
// Admin-only: Convert SoundCloud track URL → widget URL via oEmbed

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

async function requireAdminApi() {
  const sb = supabaseServer();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return { ok: false as const, status: 401 };
  const { data: prof } = await sb
    .from("profiles")
    .select("role")
    .eq("user_id", u.user.id)
    .maybeSingle();
  if (!prof || prof.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

function extractIframeSrc(html: string): string | null {
  // Typical: <iframe ... src="https://w.soundcloud.com/player/?url=..."></iframe>
  const match = html.match(/src="([^"]+)"/i);
  return match?.[1] ?? null;
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ ok: false }, { status: guard.status });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { ok: false, error: "url_required" },
      { status: 400 }
    );
  }

  try {
    // SoundCloud oEmbed endpoint
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
      url
    )}&maxheight=166`;

    const response = await fetch(oembedUrl, {
      headers: { "user-agent": "HOTMESS-Records-Admin" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("SoundCloud oEmbed failed:", response.status);
      return NextResponse.json(
        { ok: false, error: "oembed_failed" },
        { status: 400 }
      );
    }

    const data = (await response.json().catch(() => null)) as any;
    const html = data?.html as string | undefined;

    if (!html) {
      return NextResponse.json(
        { ok: false, error: "oembed_no_html" },
        { status: 400 }
      );
    }

    const widgetSrc = extractIframeSrc(html);

    if (!widgetSrc || !widgetSrc.includes("w.soundcloud.com/player")) {
      return NextResponse.json(
        { ok: false, error: "widget_src_not_found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, widgetUrl: widgetSrc });
  } catch (err) {
    console.error("SoundCloud widget fetch error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
