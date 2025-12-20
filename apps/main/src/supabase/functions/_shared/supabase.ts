import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function env(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`missing_env_${name}`);
  return v;
}

export function getAdminClient() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

export function getUserClient(req: Request) {
  const anon = env("SUPABASE_ANON_KEY");
  const url = env("SUPABASE_URL");
  const authHeader = req.headers.get("authorization") || "";
  return createClient(url, anon, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} },
    auth: { persistSession: false },
  });
}

export async function requireUser(req: Request) {
  const userClient = getUserClient(req);
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) throw new Error("not_authenticated");
  return data.user;
}

export function appBaseUrl() {
  return Deno.env.get("APP_BASE_URL") || "http://localhost:3000";
}
