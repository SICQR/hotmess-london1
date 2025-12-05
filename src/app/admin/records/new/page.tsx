// app/admin/records/new/page.tsx
// Create new draft release and redirect to editor

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseServer } from "@/lib/supabase/server";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default async function NewReleasePage() {
  await requireAdmin();
  const sb = supabaseServer();

  const seed = `new-release-${Date.now()}`;
  const slug = slugify(seed);

  const { data, error } = await sb
    .from("record_releases")
    .insert({
      slug,
      title: "New Release",
      artist_name: "RAW CONVICT",
      release_type: "single",
      catalog_no: `RC-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 999
      )
        .toString()
        .padStart(3, "0")}`,
      release_date: new Date().toISOString().slice(0, 10),
      blurb: "",
      credits: "",
      access: "public_preview",
      is_published: false,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    redirect("/admin/records");
  }

  redirect(`/admin/records/${data.id}`);
}
