import { SUPABASE_URL } from './env';

/**
 * Normalizes a Supabase Functions base URL so it always targets the deployed
 * function name used by this project: make-server-a670c824.
 */
export function getFunctionsBaseUrl(): string {
  const raw = (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string | undefined) ?? '';
  if (!raw.trim()) {
    // In local dev, go through Vite's same-origin proxy to avoid browser CORS.
    // This relies on the dev proxy configured in apps/main/vite.config.ts.
    if (import.meta.env.DEV) return '/functions/v1/make-server-a670c824';
    return `${SUPABASE_URL}/functions/v1/make-server-a670c824`;
  }

  let base = raw.trim().replace(/\/+$/, '');

  // Older docs referenced /functions/v1/server. This project deploys the function directly.
  base = base.replace(/\/server$/, '/make-server-a670c824');

  // If the value points at the functions root, append our function name.
  if (base.endsWith('/functions/v1')) {
    base = `${base}/make-server-a670c824`;
  }

  // If it points at the Supabase project root, append /functions/v1/<function>.
  if (!base.includes('/functions/v1/')) {
    base = `${base}/functions/v1/make-server-a670c824`;
  }

  return base;
}
