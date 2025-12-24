/**
 * PRIVACY / DSAR API (GDPR)
 *
 * - User endpoints: create DSAR requests, download data export
 * - Admin endpoints: view queue, update status, execute deletion
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { requireAuth } from './auth-middleware.ts';
import { getEntriesByPrefix } from './kv_entries.ts';

type DsarType = 'export' | 'delete';
type DsarStatus = 'pending' | 'processing' | 'completed' | 'rejected';

interface DsarRequest {
  id: string;
  userId: string;
  userEmailHash?: string;
  type: DsarType;
  status: DsarStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  details?: string;
  notes?: string;
  exportMeta?: {
    bytes: number;
    sha256: string;
    generatedAt: string;
  };
}

const app = new Hono();
app.use('*', cors());
app.use('*', requireAuth());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

function nowIso() {
  return new Date().toISOString();
}

function asUtf8Bytes(input: string) {
  return new TextEncoder().encode(input);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', asUtf8Bytes(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getUserEmailHash(userId: string): Promise<string | undefined> {
  try {
    const { data } = await supabase.auth.admin.getUserById(userId);
    const email = data?.user?.email;
    if (!email) return undefined;
    return await sha256Hex(email.toLowerCase().trim());
  } catch {
    return undefined;
  }
}

function isAdminRole(role: unknown): boolean {
  if (typeof role !== 'string') return false;
  const normalized = role.toLowerCase();
  return normalized === 'admin' || normalized === 'operator' || normalized === 'super_admin';
}

async function requirePrivacyAdmin(c: any, next: any) {
  const user = c.get('user') as { id: string } | undefined;
  if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

  // Role can live in multiple KV keys depending on which subsystem created it.
  const candidateKeys = [
    `user:${user.id}`,
    `user:profile:${user.id}`,
    `user:${user.id}:profile`,
  ];

  const records = await Promise.all(candidateKeys.map((k) => kv.get(k)));
  const role = records.find((r) => r?.role)?.role;

  if (!isAdminRole(role)) {
    return c.json({ error: 'Forbidden - admin access required' }, 403);
  }

  await next();
}

function dsarKey(id: string) {
  return `dsar:${id}`;
}

function userIndexKey(userId: string) {
  // Intentionally NOT prefixed with dsar: so admin stats (dsar:*) only counts requests.
  return `dsar_user_index:${userId}`;
}

async function addToUserIndex(userId: string, id: string) {
  const key = userIndexKey(userId);
  const current = (await kv.get(key)) || [];
  const next = Array.isArray(current) ? current : [];
  if (!next.includes(id)) next.unshift(id);
  await kv.set(key, next);
}

async function getUserRequests(userId: string): Promise<DsarRequest[]> {
  const ids = (await kv.get(userIndexKey(userId))) || [];
  const list = Array.isArray(ids) ? (ids as string[]) : [];

  if (list.length === 0) {
    // Fallback: scan all DSARs then filter. (Safe but slower.)
    const all = (await kv.getByPrefix('dsar:')) as DsarRequest[];
    return (all || []).filter((r) => r?.userId === userId);
  }

  const rows = await Promise.all(list.map((id) => kv.get<DsarRequest>(dsarKey(id))));
  return rows.filter(Boolean) as DsarRequest[];
}

app.get('/dsar', async (c) => {
  const user = c.get('user') as { id: string };
  const requests = await getUserRequests(user.id);
  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return c.json({ success: true, requests });
});

app.post('/dsar', async (c) => {
  const user = c.get('user') as { id: string };
  const body = await c.req.json().catch(() => ({}));

  const type = body?.type as DsarType;
  const details = typeof body?.details === 'string' ? body.details : undefined;

  if (type !== 'export' && type !== 'delete') {
    return c.json({ error: 'Invalid request type' }, 400);
  }

  const id = crypto.randomUUID();
  const ts = nowIso();
  const userEmailHash = await getUserEmailHash(user.id);

  const request: DsarRequest = {
    id,
    userId: user.id,
    userEmailHash,
    type,
    status: 'pending',
    createdAt: ts,
    updatedAt: ts,
    details,
  };

  await kv.set(dsarKey(id), request);
  await addToUserIndex(user.id, id);

  return c.json({ success: true, request });
});

app.get('/export', async (c) => {
  const user = c.get('user') as { id: string };

  const { data } = await supabase.auth.admin.getUserById(user.id);
  const authUser = data?.user;

  // Collect per-user KV entries (avoids scanning global keys containing other users)
  const prefixes = [
    `user:${user.id}:`,
    `user:profile:${user.id}`,
    `user:settings:${user.id}`,
    `beacon_by_user:${user.id}:`,
  ];

  const entriesByPrefix = await Promise.all(
    prefixes.map(async (prefix) => ({ prefix, entries: await getEntriesByPrefix(prefix) })),
  );

  const exportPayload = {
    meta: {
      version: '1',
      generatedAt: nowIso(),
      userId: user.id,
      limitations: [
        'Export includes user-scoped KV entries only.',
        'Global datasets (e.g., all orders) are not scanned to avoid leaking other users\' data.',
      ],
    },
    auth: authUser
      ? {
          id: authUser.id,
          email: authUser.email,
          createdAt: authUser.created_at,
          lastSignInAt: authUser.last_sign_in_at,
          appMetadata: authUser.app_metadata,
          userMetadata: authUser.user_metadata,
        }
      : null,
    kv: Object.fromEntries(
      entriesByPrefix.map(({ prefix, entries }) => [
        prefix,
        entries.map((e) => ({ key: e.key, value: e.value })),
      ]),
    ),
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const bytes = asUtf8Bytes(jsonStr).byteLength;
  const sha256 = await sha256Hex(jsonStr);

  // Record as a completed DSAR export (audit trail)
  const id = crypto.randomUUID();
  const ts = nowIso();
  const request: DsarRequest = {
    id,
    userId: user.id,
    userEmailHash: authUser?.email ? await sha256Hex(authUser.email.toLowerCase().trim()) : undefined,
    type: 'export',
    status: 'completed',
    createdAt: ts,
    updatedAt: ts,
    completedAt: ts,
    exportMeta: {
      bytes,
      sha256,
      generatedAt: ts,
    },
  };

  await kv.set(dsarKey(id), request);
  await addToUserIndex(user.id, id);

  const filename = `hotmess-data-export-${new Date().toISOString().slice(0, 10)}.json`;

  return c.body(jsonStr, 200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
  });
});

// ----------------------
// Admin endpoints
// ----------------------

app.use('/admin/*', requirePrivacyAdmin);

app.get('/admin/dsar', async (c) => {
  const all = (await kv.getByPrefix('dsar:')) as DsarRequest[];
  const raw = (all || []).filter(Boolean);
  raw.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const requests = await Promise.all(
    raw.map(async (r) => {
      let userEmail: string | undefined;
      try {
        const { data } = await supabase.auth.admin.getUserById(r.userId);
        userEmail = data?.user?.email || undefined;
      } catch {
        userEmail = undefined;
      }

      return {
        ...r,
        userEmail,
        notes: r.notes || r.details || '',
      };
    }),
  );

  return c.json({ success: true, requests });
});

app.post('/admin/dsar/:id/status', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));

  const status = body?.status as DsarStatus;
  const notes = typeof body?.notes === 'string' ? body.notes : undefined;

  if (!['pending', 'processing', 'completed', 'rejected'].includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const existing = await kv.get<DsarRequest>(dsarKey(id));
  if (!existing) {
    return c.json({ error: 'Request not found' }, 404);
  }

  const updated: DsarRequest = {
    ...existing,
    status,
    notes: notes ?? existing.notes,
    updatedAt: nowIso(),
    completedAt: status === 'completed' ? nowIso() : existing.completedAt,
  };

  await kv.set(dsarKey(id), updated);

  return c.json({ success: true, request: updated });
});

app.post('/admin/dsar/:id/execute-delete', async (c) => {
  const id = c.req.param('id');

  const existing = await kv.get<DsarRequest>(dsarKey(id));
  if (!existing) {
    return c.json({ error: 'Request not found' }, 404);
  }

  if (existing.type !== 'delete') {
    return c.json({ error: 'Only delete requests can be executed' }, 400);
  }

  // Delete user-scoped KV entries first
  const prefixes = [
    `user:${existing.userId}:`,
    `user:profile:${existing.userId}`,
    `user:settings:${existing.userId}`,
    `beacon_by_user:${existing.userId}:`,
  ];

  for (const prefix of prefixes) {
    const entries = await getEntriesByPrefix(prefix);
    const keys = entries.map((e) => e.key);
    if (keys.length) {
      await kv.mdel(keys);
    }
  }

  // Also delete known single-key variants
  await Promise.all([
    kv.del(`user:${existing.userId}`),
    kv.del(`user:${existing.userId}:profile`),
    kv.del(`user:profile:${existing.userId}`),
    kv.del(`user:settings:${existing.userId}`),
  ]).catch(() => {
    // Ignore missing keys
  });

  // Delete Supabase Auth user
  try {
    await supabase.auth.admin.deleteUser(existing.userId);
  } catch (err) {
    console.warn('Auth delete failed (continuing):', err);
  }

  const completedAt = nowIso();
  const updated: DsarRequest = {
    ...existing,
    status: 'completed',
    updatedAt: completedAt,
    completedAt,
    notes: existing.notes || 'Account deletion executed',
  };

  await kv.set(dsarKey(id), updated);

  return c.json({ success: true, request: updated });
});

export default app;
