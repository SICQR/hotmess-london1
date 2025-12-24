import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

export interface KvEntry<T = unknown> {
  key: string;
  value: T;
}

const client = () =>
  createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  );

export async function getEntriesByPrefix<T = unknown>(prefix: string): Promise<KvEntry<T>[]> {
  const supabase = client();

  const { data, error } = await supabase
    .from("kv_store_a670c824")
    .select("key, value")
    .like("key", `${prefix}%`);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({ key: row.key as string, value: row.value as T }));
}
