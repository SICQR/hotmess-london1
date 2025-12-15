import { supabase } from './supabase'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export type RightNowMode = 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care'

export interface RightNowPost {
  id: string
  user_id: string
  mode: RightNowMode
  headline: string
  body?: string | null
  city: string
  country?: string | null
  lat?: number | null
  lng?: number | null
  geo_bin: string
  membership_tier: string
  xp_band: string
  safety_flags: string[]
  near_party: boolean
  sponsored: boolean
  created_at: string
  expires_at: string
  score: number
  // New columns from schema polish
  deleted_at?: string | null
  heat_bin_id?: string | null
  location?: any // PostGIS GEOGRAPHY type (optional, may not be present)
  is_beacon?: boolean | null
}

const EDGE_BASE = `https://${projectId}.supabase.co/functions/v1`

export async function fetchRightNowFeed(opts: {
  mode?: RightNowMode | 'all'
  city?: string
  safeOnly?: boolean
}) {
  const params = new URLSearchParams()
  if (opts.mode && opts.mode !== 'all') params.set('mode', opts.mode)
  if (opts.city) params.set('city', opts.city)
  if (opts.safeOnly) params.set('safeOnly', 'true')

  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(`${EDGE_BASE}/right-now?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to load RIGHT NOW: ${res.status}`)

  const json = await res.json()
  return json.posts as RightNowPost[]
}

export async function createRightNowPost(input: {
  mode: RightNowMode
  headline: string
  text?: string
  lat?: number
  lng?: number
}) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const res = await fetch(`${EDGE_BASE}/right-now`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(input),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create post')

  return json.post as RightNowPost
}

export async function deleteRightNowPost(id: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const res = await fetch(`${EDGE_BASE}/right-now/${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': publicAnonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.error || 'Failed to delete post')
  }
}