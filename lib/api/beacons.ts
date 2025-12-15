/**
 * BEACON API CLIENT
 * Frontend API calls for beacon system
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/v2`;

/**
 * Scan a beacon by code
 */
export async function scanBeacon(code: string, accessToken?: string) {
  const response = await fetch(`${API_BASE}/beacons/${code}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`,
    },
    body: JSON.stringify({
      location: null, // TODO: Get from geolocation API
      userAgent: navigator.userAgent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Scan failed');
  }

  return response.json();
}

/**
 * Get beacon by code (without scanning)
 */
export async function getBeacon(code: string) {
  const response = await fetch(`${API_BASE}/beacons/${code}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Beacon not found');
  }

  return response.json();
}

/**
 * List all beacons (with filters)
 */
export async function listBeacons(filters?: {
  status?: string;
  ownerType?: string;
  city?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.ownerType) params.append('ownerType', filters.ownerType);
  if (filters?.city) params.append('city', filters.city);

  const response = await fetch(`${API_BASE}/beacons?${params}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch beacons');
  }

  return response.json();
}

/**
 * Create a new beacon
 */
export async function createBeacon(data: any, accessToken: string) {
  const response = await fetch(`${API_BASE}/beacons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create beacon');
  }

  return response.json();
}

/**
 * Update a beacon
 */
export async function updateBeacon(code: string, updates: any, accessToken: string) {
  const response = await fetch(`${API_BASE}/beacons/${code}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update beacon');
  }

  return response.json();
}

/**
 * Delete a beacon
 */
export async function deleteBeacon(code: string, accessToken: string) {
  const response = await fetch(`${API_BASE}/beacons/${code}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete beacon');
  }

  return response.json();
}