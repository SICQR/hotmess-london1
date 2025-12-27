// lib/supabase/index.ts
// Re-export the permissive Supabase singleton.
//
// With TS `moduleResolution: "bundler"` and both `lib/supabase.ts` (file)
// and `lib/supabase/` (dir) present, imports like `../supabase` can resolve
// unexpectedly. Having an explicit index makes resolution deterministic.

export { supabase, createClient } from '../supabase.ts';
export type { Database } from '../supabase.ts';
