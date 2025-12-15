/**
 * Admin Integrations - production trading readiness
 * Shows Vercel-provided runtime config (frontend) + Supabase Edge Function health.
 */

import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { getEnvStatus, SUPABASE_URL } from '../../lib/env';
import { RouteId } from '../../lib/routes';

type Props = { onNavigate?: (route: RouteId) => void };

type Health = { ok: boolean; latencyMs?: number; error?: string };

export function AdminIntegrations({ onNavigate }: Props) {
  const envStatus = useMemo(() => getEnvStatus(), []);
  const [serverHealth, setServerHealth] = useState<Health>({ ok: false });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const start = performance.now();
      try {
        const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/server/health`;
        const res = await fetch(url, { method: 'GET' });
        const ms = Math.round(performance.now() - start);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!cancelled) setServerHealth({ ok: true, latencyMs: ms });
      } catch (e: any) {
        if (!cancelled) setServerHealth({ ok: false, error: e?.message ?? 'Unknown error' });
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const missingRequired = envStatus.filter(s => s.required && s.scope === 'vercel' && !s.valuePresent);

  return (
    <AdminLayout currentPage="Integrations" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="mt-2 text-sm text-white/70">
            This panel verifies the live trading bridges. Nothing should fail silently.
          </p>

          {missingRequired.length > 0 ? (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
              <div className="font-semibold text-red-200">Missing required Vercel variables</div>
              <ul className="mt-2 list-disc pl-5 text-red-100/90">
                {missingRequired.map(m => (<li key={m.name}>{m.name}</li>))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              Required Vercel variables present.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Supabase Edge Function health</h2>
            <div className={`text-sm ${serverHealth.ok ? 'text-emerald-200' : 'text-red-200'}`}>
              {serverHealth.ok ? `OK (${serverHealth.latencyMs}ms)` : `DOWN (${serverHealth.error ?? 'unreachable'})`}
            </div>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Checks <span className="font-mono text-white/80">/functions/v1/server/health</span>.
            Secrets are stored in Supabase and are not exposed to the frontend.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h2 className="text-lg font-semibold">Vercel runtime config</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Scope</th>
                  <th className="px-4 py-3">Required</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Used for</th>
                </tr>
              </thead>
              <tbody>
                {envStatus.map(s => (
                  <tr key={s.name} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono text-xs">{s.name}</td>
                    <td className="px-4 py-3">{s.scope}</td>
                    <td className="px-4 py-3">{s.required ? 'Yes' : 'No'}</td>
                    <td className={`px-4 py-3 ${s.valuePresent ? 'text-emerald-200' : 'text-red-200'}`}>
                      {s.valuePresent ? 'Present' : 'Missing'}
                    </td>
                    <td className="px-4 py-3 text-white/70">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-white/60">
            If something is missing, set it in Vercel Project Settings → Environment Variables, then redeploy.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
