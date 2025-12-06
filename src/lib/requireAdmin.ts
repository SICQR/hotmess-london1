// lib/requireAdmin.ts
// Server-side admin guard for protected pages

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  // Check if user is admin via is_admin() RPC
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    redirect("/");
  }

  return user;
}