// lib/actions/proofs.ts
// Server Actions for proof management (admin-only signed URLs)

"use server";

import { requireAuthedUser, supabaseAdmin, type ActionResult } from "./_helpers";

/**
 * Admin: Get signed URL for ticket proof (moderator/admin only)
 * Uses service role to generate signed URL
 */
export async function adminGetSignedTicketProofUrl(
  proofPath: string
): Promise<ActionResult<{ url: string }>> {
  try {
    const { sb, user } = await requireAuthedUser();

    // Check if user is admin
    const { data: profile, error: profileError } = await sb
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return {
        ok: false,
        error: { code: "forbidden", message: "Not authorized." }
      };
    }

    // Use admin client to generate signed URL
    const admin = supabaseAdmin();

    const { data, error } = await admin.storage
      .from("ticket-proofs")
      .createSignedUrl(proofPath, 60 * 10); // 10 minutes

    if (error || !data?.signedUrl) {
      console.error("Failed to generate signed URL:", error);
      return {
        ok: false,
        error: { code: "proof", message: "Could not generate proof link." }
      };
    }

    return { ok: true, data: { url: data.signedUrl } };
  } catch (e: any) {
    console.error("Admin proof URL error:", e);
    return {
      ok: false,
      error: { code: "unknown", message: "Could not generate proof link." }
    };
  }
}

/**
 * Upload ticket proof to storage (client-side RLS handles write permissions)
 * This is just a helper - actual upload happens client-side
 */
export async function getTicketProofUploadPath(userId: string): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${userId}/${timestamp}-${random}`;
}
