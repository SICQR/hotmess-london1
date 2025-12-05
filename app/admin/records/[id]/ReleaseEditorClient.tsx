// app/admin/records/[id]/ReleaseEditorClient.tsx
// Release editor client component with SoundCloud widget helper

"use client";

import * as React from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { SoundCloudWidgetHelper } from "@/components/admin/SoundCloudWidgetHelper";

type Release = any;
type Track = any;
type Version = any;
type Product = any;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function money(cents: number, currency: string) {
  const v = (cents / 100).toFixed(2);
  return currency === "GBP" ? `£${v}` : `${currency} ${v}`;
}

async function api<T>(url: string, method: string, body?: any): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "request_failed");
  return j;
}

async function uploadViaSignedUrl(opts: {
  bucket: string;
  path: string;
  file: File;
}) {
  const { bucket, path, file } = opts;

  const signed = await api<{ signedUrl: string; token: string }>(
    "/api/admin/records/storage/signed-upload",
    "POST",
    { bucket, path }
  );

  const sb = supabaseBrowser();
  const up = await sb.storage
    .from(bucket)
    .uploadToSignedUrl(path, signed.token, file, {
      contentType: file.type,
      upsert: true,
    });
  if (up.error) throw new Error(up.error.message);

  const reg = await api<{ assetId: string }>("/api/admin/records/assets", "POST", {
    kind: bucket === "records-public" ? "cover" : file.type.includes("zip") ? "zip" : "audio",
    bucket,
    path,
    mime_type: file.type || "application/octet-stream",
    bytes: file.size,
  });

  return { assetId: reg.assetId };
}

function findVersion(versions: Version[], trackId: string, kind: string) {
  return (
    versions.find(
      (v) => v.track_id === trackId && String(v.kind) === String(kind)
    ) || null
  );
}

export function ReleaseEditorClient({
  initial,
}: {
  initial: {
    release: Release;
    tracks: Track[];
    versions: Version[];
    products: Product[];
    downloads: { kind: string; asset_id: string }[];
  };
}) {
  const [release, setRelease] = React.useState<Release>(initial.release);
  const [tracks, setTracks] = React.useState<Track[]>(initial.tracks);
  const [versions, setVersions] = React.useState<Version[]>(initial.versions);
  const [products, setProducts] = React.useState<Product[]>(initial.products);
  const [downloads, setDownloads] = React.useState(initial.downloads);

  const [busy, setBusy] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [scOpenForTrackId, setScOpenForTrackId] = React.useState<string | null>(null);

  function t(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1300);
  }

  async function refresh() {
    const j = await api<any>(`/api/admin/records/release/${release.id}`, "GET");
    setRelease(j.release);
    setTracks(j.tracks);
    setVersions(j.versions);
    setProducts(j.products);
    setDownloads(
      j.downloads.map((d: any) => ({ kind: d.kind, asset_id: d.asset_id }))
    );
  }

  async function patchRelease(patch: any) {
    setBusy("Saving…");
    try {
      await api(`/api/admin/records/release/${release.id}`, "PATCH", patch);
      await refresh();
      t("Saved.");
    } finally {
      setBusy(null);
    }
  }

  async function addTrack(title: string) {
    setBusy("Adding track…");
    try {
      const track_no =
        (tracks.length ? Math.max(...tracks.map((x) => Number(x.track_no))) : 0) + 1;
      const j = await api<any>("/api/admin/records/track", "POST", {
        releaseId: release.id,
        track_no,
        title,
      });
      setTracks((prev) =>
        [...prev, j.track].sort((a, b) => a.track_no - b.track_no)
      );
      t("Track added.");
    } finally {
      setBusy(null);
    }
  }

  async function updateTrack(id: string, patch: any) {
    setBusy("Saving track…");
    try {
      await api("/api/admin/records/track", "PATCH", { id, ...patch });
      await refresh();
      t("Saved.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteTrack(id: string) {
    if (!confirm("Delete this track? This will delete its versions too.")) return;
    setBusy("Deleting…");
    try {
      await api("/api/admin/records/track", "DELETE", { id });
      await refresh();
      t("Deleted.");
    } finally {
      setBusy(null);
    }
  }

  async function upsertVersion(track_id: string, kind: string, patch: any) {
    setBusy("Saving version…");
    try {
      await api("/api/admin/records/version", "POST", {
        track_id,
        kind,
        ...patch,
      });
      await refresh();
      t("Saved.");
    } finally {
      setBusy(null);
    }
  }

  async function uploadCover(file: File) {
    setBusy("Uploading cover…");
    try {
      const path = `covers/${release.id}/${Date.now()}-${slugify(file.name)}`;
      const { assetId } = await uploadViaSignedUrl({
        bucket: "records-public",
        path,
        file,
      });
      await patchRelease({ cover_asset_id: assetId });
      t("Cover set.");
    } finally {
      setBusy(null);
    }
  }

  async function uploadHqAudio(trackId: string, file: File) {
    setBusy("Uploading HQ…");
    try {
      const path = `audio/${release.id}/${trackId}/${Date.now()}-${slugify(
        file.name
      )}`;
      const { assetId } = await uploadViaSignedUrl({
        bucket: "records-private",
        path,
        file,
      });
      await upsertVersion(trackId, "hq", {
        audio_asset_id: assetId,
        is_streamable: true,
        is_downloadable: false,
      });
      t("HQ uploaded.");
    } finally {
      setBusy(null);
    }
  }

  async function uploadPack(kind: "digital" | "studio_pack", file: File) {
    setBusy("Uploading pack…");
    try {
      const path = `packs/${release.id}/${kind}/${Date.now()}-${slugify(
        file.name
      )}`;
      const { assetId } = await uploadViaSignedUrl({
        bucket: "records-private",
        path,
        file,
      });
      await api("/api/admin/records/downloads", "POST", {
        releaseId: release.id,
        kind,
        assetId,
      });
      await refresh();
      t("Pack attached.");
    } finally {
      setBusy(null);
    }
  }

  async function addProduct(p: any) {
    setBusy("Creating product…");
    try {
      const j = await api<any>("/api/admin/records/product", "POST", {
        ...p,
        release_id: release.id,
        currency: "GBP",
        is_active: true,
      });
      setProducts((prev) => [j.product, ...prev]);
      t("Product created.");
    } finally {
      setBusy(null);
    }
  }

  async function patchProduct(id: string, patch: any) {
    setBusy("Saving product…");
    try {
      await api("/api/admin/records/product", "PATCH", { id, ...patch });
      await refresh();
      t("Saved.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    setBusy("Deleting…");
    try {
      await api("/api/admin/records/product", "DELETE", { id });
      await refresh();
      t("Deleted.");
    } finally {
      setBusy(null);
    }
  }

  async function publish(publish: boolean) {
    setBusy(publish ? "Publishing…" : "Unpublishing…");
    try {
      await api("/api/admin/records/publish", "POST", {
        releaseId: release.id,
        publish,
      });
      await refresh();
      t(publish ? "Published." : "Unpublished.");
    } finally {
      setBusy(null);
    }
  }

  const publicUrl = `/records/releases/${release.slug}`;
  const previewNeeded =
    "Attach SoundCloud preview (widget URL) to at least one track.";
  const coverNeeded = "Upload a cover image.";
  const tracksNeeded = "Add at least one track.";
  const hasTracks = tracks.length > 0;
  const hasCover = !!release.cover_asset_id;
  const hasAnyPreview = tracks.some(
    (tr) => !!findVersion(versions, tr.id, "preview")?.soundcloud_widget_url
  );

  return (
    <>
      <main className="mx-auto max-w-6xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-80">Release Editor</div>
            <h1 className="text-2xl font-semibold">{release.title}</h1>
            <div className="text-sm opacity-80 mt-1">
              Preview on SoundCloud. HQ and drops live here.
            </div>
            <div className="text-xs opacity-70 mt-2">
              Status:{" "}
              <span className="font-semibold">
                {release.is_published ? "Published" : "Draft"}
              </span>
              {" • "}Slug: <span className="font-mono">{release.slug}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {toast ? (
              <div className="rounded-2xl border px-4 py-2 text-sm">{toast}</div>
            ) : null}
            {release.is_published ? (
              <Link
                className="rounded-2xl border px-4 py-2"
                href={publicUrl}
                target="_blank"
              >
                Open Public
              </Link>
            ) : (
              <span className="text-xs opacity-70">Not published</span>
            )}
            <Link className="rounded-2xl border px-4 py-2" href="/admin/records">
              Back
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="font-semibold">Release details</div>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="space-y-1">
              <div className="text-xs opacity-70">Title</div>
              <input
                className="w-full rounded-2xl border px-3 py-2"
                value={release.title}
                onChange={(e) =>
                  setRelease({ ...release, title: e.target.value })
                }
                onBlur={() => patchRelease({ title: release.title })}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Artist</div>
              <input
                className="w-full rounded-2xl border px-3 py-2"
                value={release.artist_name}
                onChange={(e) =>
                  setRelease({ ...release, artist_name: e.target.value })
                }
                onBlur={() => patchRelease({ artist_name: release.artist_name })}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Slug (public URL)</div>
              <input
                className="w-full rounded-2xl border px-3 py-2"
                value={release.slug}
                onChange={(e) =>
                  setRelease({ ...release, slug: slugify(e.target.value) })
                }
                onBlur={() => patchRelease({ slug: release.slug })}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Catalog No.</div>
              <input
                className="w-full rounded-2xl border px-3 py-2"
                value={release.catalog_no}
                onChange={(e) =>
                  setRelease({ ...release, catalog_no: e.target.value })
                }
                onBlur={() => patchRelease({ catalog_no: release.catalog_no })}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Release date</div>
              <input
                type="date"
                className="w-full rounded-2xl border px-3 py-2"
                value={release.release_date}
                onChange={(e) =>
                  setRelease({ ...release, release_date: e.target.value })
                }
                onBlur={() => patchRelease({ release_date: release.release_date })}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Release type</div>
              <select
                className="w-full rounded-2xl border px-3 py-2"
                value={release.release_type}
                onChange={(e) => {
                  const v = e.target.value;
                  setRelease({ ...release, release_type: v });
                  patchRelease({ release_type: v });
                }}
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="lp">LP</option>
                <option value="compilation">Compilation</option>
              </select>
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">Access</div>
              <select
                className="w-full rounded-2xl border px-3 py-2"
                value={release.access}
                onChange={(e) => {
                  const v = e.target.value;
                  setRelease({ ...release, access: v });
                  patchRelease({ access: v });
                }}
              >
                <option value="public_preview">Public preview (SoundCloud)</option>
                <option value="premium_early">Premium early access</option>
                <option value="purchase_required">Purchase required</option>
                <option value="public_hq">Public HQ</option>
              </select>
            </label>

            <label className="space-y-1">
              <div className="text-xs opacity-70">
                Premium early until (optional)
              </div>
              <input
                type="datetime-local"
                className="w-full rounded-2xl border px-3 py-2"
                value={
                  release.premium_early_until
                    ? String(release.premium_early_until).slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const v = e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null;
                  setRelease({ ...release, premium_early_until: v });
                }}
                onBlur={() =>
                  patchRelease({ premium_early_until: release.premium_early_until })
                }
              />
            </label>
          </div>

          <label className="block space-y-1">
            <div className="text-xs opacity-70">Blurb</div>
            <textarea
              className="w-full rounded-2xl border px-3 py-2 min-h-[90px]"
              value={release.blurb}
              onChange={(e) =>
                setRelease({ ...release, blurb: e.target.value })
              }
              onBlur={() => patchRelease({ blurb: release.blurb })}
            />
          </label>

          <label className="block space-y-1">
            <div className="text-xs opacity-70">Credits</div>
            <textarea
              className="w-full rounded-2xl border px-3 py-2 min-h-[110px]"
              value={release.credits}
              onChange={(e) =>
                setRelease({ ...release, credits: e.target.value })
              }
              onBlur={() => patchRelease({ credits: release.credits })}
            />
          </label>

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!release.is_explicit}
                onChange={(e) => {
                  setRelease({ ...release, is_explicit: e.target.checked });
                  patchRelease({ is_explicit: e.target.checked });
                }}
              />
              Explicit
            </label>

            <label className="text-sm">
              <span className="mr-2 opacity-80">Cover</span>
              <input
                type="file"
                accept="image/*"
                disabled={!!busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCover(f);
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Tracklist</div>
            <button
              className="rounded-2xl border px-4 py-2"
              disabled={!!busy}
              onClick={() => {
                const title = prompt("Track title?");
                if (title) addTrack(title);
              }}
            >
              Add track
            </button>
          </div>

          {tracks.length === 0 ? (
            <div className="text-sm opacity-80">No tracks yet. Add one.</div>
          ) : (
            <div className="grid gap-2">
              {tracks.map((tr) => {
                const pv = findVersion(versions, tr.id, "preview");
                const hq = findVersion(versions, tr.id, "hq");

                return (
                  <div
                    key={tr.id}
                    className="rounded-2xl border p-4 space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-xs opacity-70">
                          Track #{tr.track_no}
                        </div>
                        <input
                          className="w-full rounded-2xl border px-3 py-2 mt-1"
                          value={tr.title}
                          onChange={(e) =>
                            setTracks((prev) =>
                              prev.map((x) =>
                                x.id === tr.id
                                  ? { ...x, title: e.target.value }
                                  : x
                              )
                            )
                          }
                          onBlur={() => {
                            const curr = tracks.find((x) => x.id === tr.id);
                            if (curr) updateTrack(tr.id, { title: curr.title });
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="rounded-2xl border px-4 py-2"
                          onClick={() => deleteTrack(tr.id)}
                          disabled={!!busy}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="rounded-2xl border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm">
                            Preview (SoundCloud)
                          </div>
                          <button
                            className="rounded-2xl border px-3 py-1 text-xs"
                            onClick={() => setScOpenForTrackId(tr.id)}
                            disabled={!!busy}
                          >
                            Get from link
                          </button>
                        </div>
                        <div className="text-xs opacity-70">
                          Paste the widget URL for this track.
                        </div>
                        <input
                          className="w-full rounded-2xl border px-3 py-2"
                          value={pv?.soundcloud_widget_url ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVersions((prev) => {
                              const existing = prev.find(
                                (v) =>
                                  v.track_id === tr.id && v.kind === "preview"
                              );
                              if (existing)
                                return prev.map((v) =>
                                  v.id === existing.id
                                    ? { ...v, soundcloud_widget_url: val }
                                    : v
                                );
                              return [
                                ...prev,
                                {
                                  id: `tmp-${Date.now()}`,
                                  track_id: tr.id,
                                  kind: "preview",
                                  soundcloud_widget_url: val,
                                },
                              ];
                            });
                          }}
                          onBlur={() => {
                            const current = findVersion(versions, tr.id, "preview");
                            upsertVersion(tr.id, "preview", {
                              soundcloud_widget_url:
                                current?.soundcloud_widget_url ?? null,
                              is_streamable: true,
                              is_downloadable: false,
                            });
                          }}
                          placeholder="https://w.soundcloud.com/player/?url=..."
                        />
                      </div>

                      <div className="rounded-2xl border p-3 space-y-2">
                        <div className="font-semibold text-sm">
                          HQ (RAW private)
                        </div>
                        <div className="text-xs opacity-70">
                          Upload HQ audio (private bucket). Unlock controlled by
                          entitlements.
                        </div>
                        <div className="text-xs opacity-70">
                          Status:{" "}
                          <span className="font-semibold">
                            {hq?.audio_asset_id ? "Uploaded" : "Missing"}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="audio/*"
                          disabled={!!busy}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadHqAudio(tr.id, f);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="font-semibold">Downloads (packs)</div>
          <div className="text-sm opacity-80">
            Attach zip files for digital/studio packs (delivered via signed URLs).
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-2xl border p-3 space-y-2">
              <div className="font-semibold text-sm">Digital pack (zip)</div>
              <div className="text-xs opacity-70">
                Status:{" "}
                {downloads.find((d) => d.kind === "digital")
                  ? "Attached"
                  : "Not attached"}
              </div>
              <input
                type="file"
                accept=".zip,application/zip"
                disabled={!!busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPack("digital", f);
                }}
              />
            </div>
            <div className="rounded-2xl border p-3 space-y-2">
              <div className="font-semibold text-sm">Studio pack (zip)</div>
              <div className="text-xs opacity-70">
                Status:{" "}
                {downloads.find((d) => d.kind === "studio_pack")
                  ? "Attached"
                  : "Not attached"}
              </div>
              <input
                type="file"
                accept=".zip,application/zip"
                disabled={!!busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPack("studio_pack", f);
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Products</div>
            <button
              className="rounded-2xl border px-4 py-2"
              disabled={!!busy}
              onClick={() => {
                const name =
                  prompt("Product name? (e.g. Digital Download)") || "";
                const kind =
                  (prompt("Kind? digital or studio_pack") || "digital") as any;
                const price = Number(
                  prompt("Price in pence? (e.g. 999 for £9.99)") || "0"
                );
                const stripe_price_id =
                  prompt("Stripe price id? (price_...)") || "";
                if (!name || !stripe_price_id || !price) return;
                addProduct({
                  name,
                  kind,
                  price_cents: price,
                  stripe_price_id,
                  grants: {},
                });
              }}
            >
              Add product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-sm opacity-80">
              No products yet. Add at least one to sell.
            </div>
          ) : (
            <div className="grid gap-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs opacity-70">
                      {p.kind} • {money(p.price_cents, p.currency)} •{" "}
                      {p.is_active ? "Active" : "Inactive"}
                    </div>
                    <div className="text-xs opacity-70 font-mono break-all mt-1">
                      {p.stripe_price_id}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="rounded-2xl border px-4 py-2"
                      disabled={!!busy}
                      onClick={() =>
                        patchProduct(p.id, { is_active: !p.is_active })
                      }
                    >
                      {p.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="rounded-2xl border px-4 py-2"
                      disabled={!!busy}
                      onClick={() => {
                        const v = prompt(
                          "New price (pence)?",
                          String(p.price_cents)
                        );
                        if (!v) return;
                        patchProduct(p.id, { price_cents: Number(v) });
                      }}
                    >
                      Edit price
                    </button>
                    <button
                      className="rounded-2xl border px-4 py-2"
                      disabled={!!busy}
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="font-semibold">Publish</div>
          <div className="text-sm opacity-80">
            No missing parts. No haunted releases.
          </div>

          <div className="rounded-2xl border p-3 text-sm space-y-1">
            <div>Checklist:</div>
            <div className={hasTracks ? "opacity-80" : "text-red-600"}>
              • {hasTracks ? "Tracklist OK" : tracksNeeded}
            </div>
            <div className={hasCover ? "opacity-80" : "text-red-600"}>
              • {hasCover ? "Cover OK" : coverNeeded}
            </div>
            <div className={hasAnyPreview ? "opacity-80" : "text-red-600"}>
              • {hasAnyPreview ? "Preview OK" : previewNeeded}
            </div>
          </div>

          <div className="flex gap-2">
            {!release.is_published ? (
              <button
                className="rounded-2xl border px-4 py-2"
                disabled={
                  !!busy || !(hasTracks && hasCover && hasAnyPreview)
                }
                onClick={() => publish(true)}
              >
                Publish
              </button>
            ) : (
              <button
                className="rounded-2xl border px-4 py-2"
                disabled={!!busy}
                onClick={() => publish(false)}
              >
                Unpublish
              </button>
            )}

            {busy ? (
              <div className="text-sm opacity-70 flex items-center">{busy}</div>
            ) : null}
          </div>
        </div>
      </main>

      {/* SoundCloud Widget Helper Modal */}
      <SoundCloudWidgetHelper
        open={!!scOpenForTrackId}
        onClose={() => setScOpenForTrackId(null)}
        onPick={async (widgetUrl) => {
          const trackId = scOpenForTrackId!;
          setScOpenForTrackId(null);

          // Save immediately to DB
          await upsertVersion(trackId, "preview", {
            soundcloud_widget_url: widgetUrl,
            is_streamable: true,
            is_downloadable: false,
          });
        }}
      />
    </>
  );
}
