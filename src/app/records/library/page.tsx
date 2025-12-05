// app/records/library/page.tsx
// User's saved releases + unlocked HQ

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Your Library | RAW CONVICT RECORDS",
  description: "Saved releases and unlocked HQ",
};

export default async function LibraryPage() {
  // Get user (optional: use requireUser if library should be auth-only)
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return (
      <main className="mx-auto max-w-4xl p-6 space-y-4">
        <div className="rounded-3xl border p-12 text-center space-y-4">
          <div className="text-6xl">🔐</div>
          <div className="text-xl font-bold">Sign in to view your library</div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </main>
    );
  }

  const { data: lib } = await supabase
    .from("record_library")
    .select("release_id, record_releases(id,slug,title,artist_name,release_date,catalog_no)")
    .eq("user_id", userData.user.id)
    .order("saved_at", { ascending: false });

  // Fetch entitlements for unlocked releases
  const releaseIds = (lib ?? [])
    .map((x: any) => x.record_releases?.id)
    .filter(Boolean);

  const { data: ents } = releaseIds.length
    ? await supabase
        .from("record_entitlements")
        .select("release_id, kind, ends_at")
        .eq("user_id", userData.user.id)
        .in("release_id", releaseIds)
    : { data: [] as any[] };

  // Build unlocked set (release_access or download_pack)
  const unlocked = new Set(
    (ents ?? [])
      .filter((e) => 
        e.kind === "release_access" || e.kind === "download_pack"
      )
      .map((e) => e.release_id)
  );

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">Your Library</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          SAVED RELEASES
        </h1>
        <div className="text-sm opacity-80">
          Your saved releases and unlocked HQ.
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {(lib ?? []).map((item: any) => {
          const isUnlocked = unlocked.has(item.record_releases?.id);
          
          return (
            <Link
              key={item.release_id}
              href={`/records/releases/${item.record_releases.slug}`}
              className="rounded-3xl border p-6 hover:border-hot transition-colors space-y-3"
            >
              {/* Cover placeholder */}
              <div className="aspect-square rounded-2xl bg-black/10 flex items-center justify-center">
                <div className="text-4xl">🎵</div>
              </div>

              {/* Details */}
              <div>
                <div className="text-sm opacity-80">
                  {item.record_releases.artist_name}
                </div>
                <div className="text-lg font-bold">{item.record_releases.title}</div>
                <div className="text-xs opacity-70 mt-2">
                  {item.record_releases.catalog_no} •{" "}
                  {new Date(item.record_releases.release_date).toLocaleDateString("en-GB")}
                </div>
                
                {/* Unlock status badge */}
                <div className="mt-2">
                  {isUnlocked ? (
                    <Badge variant="outline" className="rounded-full text-xs bg-hot/10 text-hot border-hot">
                      Unlocked • Downloads available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-full text-xs">
                      Saved
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {(!lib || lib.length === 0) && (
        <div className="rounded-3xl border p-12 text-center space-y-4">
          <div className="text-6xl">📚</div>
          <div className="text-xl font-bold">Nothing saved yet</div>
          <div className="text-sm opacity-80">
            Save releases to keep them close.
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/records/releases">Browse Releases</Link>
          </Button>
        </div>
      )}
    </main>
  );
}