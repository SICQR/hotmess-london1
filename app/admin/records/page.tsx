// app/admin/records/page.tsx
// Admin records dashboard

import { requireAdmin } from "@/lib/requireAdmin";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Records Admin | HOTMESS",
  description: "Publish clean. Track the funnel. No ghosts.",
};

export default async function AdminRecordsPage() {
  await requireAdmin();

  const { data } = await supabase
    .from("record_releases")
    .select("id,slug,title,artist_name,is_published,release_date,catalog_no")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            RECORDS ADMIN
          </h1>
          <div className="text-sm opacity-80 mt-1">
            Publish clean. Track the funnel. No ghosts.
          </div>
        </div>
        <Button asChild variant="outline" className="rounded-2xl bg-hot text-white">
          <Link href="/admin/records/new">New Release</Link>
        </Button>
      </header>

      <div className="space-y-3">
        {(data ?? []).map((release) => (
          <Link
            key={release.id}
            href={`/admin/records/${release.id}`}
            className="block rounded-3xl border p-6 hover:border-hot transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80">{release.artist_name}</div>
                <div className="text-xl font-bold">{release.title}</div>
                <div className="text-xs opacity-70 mt-1">
                  {release.catalog_no} • {release.slug} •{" "}
                  {new Date(release.release_date).toLocaleDateString("en-GB")}
                </div>
              </div>
              <div>
                {release.is_published ? (
                  <Badge className="rounded-full bg-green-500">Published</Badge>
                ) : (
                  <Badge variant="outline" className="rounded-full">Draft</Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!data || data.length === 0) && (
        <div className="rounded-3xl border p-12 text-center space-y-4">
          <div className="text-6xl">📦</div>
          <div className="text-xl font-bold">No releases yet</div>
          <div className="text-sm opacity-80">Create your first release above.</div>
        </div>
      )}
    </main>
  );
}
