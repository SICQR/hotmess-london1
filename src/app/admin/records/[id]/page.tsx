// app/admin/records/[id]/page.tsx
// Release editor (server component)

import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseServer } from "@/lib/supabase/server";
import { ReleaseEditorClient } from "./ReleaseEditorClient";

export default async function ReleaseEditorPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const sb = supabaseServer();

  const { data: release } = await sb
    .from("record_releases")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  const { data: tracks } = await sb
    .from("record_tracks")
    .select("*")
    .eq("release_id", params.id)
    .order("track_no", { ascending: true });

  const trackIds = (tracks ?? []).map((t) => t.id);
  const { data: versions } = trackIds.length
    ? await sb.from("record_track_versions").select("*").in("track_id", trackIds)
    : { data: [] as any[] };

  const { data: products } = await sb
    .from("record_products")
    .select("*")
    .eq("release_id", params.id)
    .order("created_at", { ascending: false });

  const { data: downloads } = await sb
    .from("record_release_downloads")
    .select("kind, asset_id")
    .eq("release_id", params.id);

  if (!release) {
    return (
      <main className="p-6">
        <div className="text-center">Release not found.</div>
      </main>
    );
  }

  return (
    <ReleaseEditorClient
      initial={{
        release,
        tracks: tracks ?? [],
        versions: versions ?? [],
        products: products ?? [],
        downloads: downloads ?? [],
      }}
    />
  );
}
