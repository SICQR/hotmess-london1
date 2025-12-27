import { corsHeaders } from "./cors.ts";

export function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders, ...extraHeaders },
  });
}

export async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (!text) throw new Error("empty_body");
  return JSON.parse(text) as T;
}

export function bad(message: string, status = 400) {
  return json({ ok: false, error: message }, status);
}
