'use client';

/**
 * Admin Beacons Overview with real backend data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { StatCard } from '../StatCard';
import { EmptyState } from '../EmptyState';
import { MapPin, Activity, Globe, Zap } from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface BeaconData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  city: string;
  country: string;
  status: string;
  scans?: number;
  created_at: string;
}

interface BeaconStats {
  total_beacons: number;
  active_beacons: number;
  total_scans: number;
  countries: number;
  cities: number;
}

export function AdminBeaconsClient() {
  const [beacons, setBeacons] = useState<BeaconData[]>([]);
  const [stats, setStats] = useState<BeaconStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || null);
    }
    getSession();
  }, []);

  useEffect(() => {
    async function fetchBeacons() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/beacons/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch beacons');
        }

        const result = await response.json();
        setBeacons(result.beacons || []);
        setStats(result.stats || null);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching beacons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBeacons();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-hot mb-4">
            <MapPin size={48} />
          </div>
          <p className="text-white/60" style={{ fontSize: '14px' }}>Loading beacon network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400" style={{ fontSize: '14px' }}>
          Failed to load beacons. Please try again.
        </p>
      </div>
    );
  }

  if (!stats || beacons.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No Beacons"
        description="No beacons found in the network."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={MapPin}
          label="Total Beacons"
          value={stats.total_beacons}
          color="hot"
          animate
        />
        <StatCard
          icon={Activity}
          label="Active"
          value={stats.active_beacons}
          color="lime"
          animate
        />
        <StatCard
          icon={Zap}
          label="Total Scans"
          value={stats.total_scans}
          color="heat"
          animate
        />
        <StatCard
          icon={Globe}
          label="Countries"
          value={stats.countries}
          color="cyan"
          animate
        />
        <StatCard
          icon={MapPin}
          label="Cities"
          value={stats.cities}
          color="hot"
          animate
        />
      </div>

      {/* Beacons List */}
      <div className="rounded-3xl border p-6">
        <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontSize: '14px', fontWeight: 900 }}>
          All Beacons ({beacons.length})
        </h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {beacons.map((beacon) => (
            <div
              key={beacon.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <MapPin
                  size={20}
                  className={beacon.status === 'active' ? 'text-neon-lime' : 'text-white/40'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white truncate" style={{ fontSize: '14px', fontWeight: 700 }}>
                      {beacon.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full uppercase ${
                        beacon.status === 'active'
                          ? 'bg-neon-lime/20 text-neon-lime'
                          : 'bg-white/10 text-white/60'
                      }`}
                      style={{ fontSize: '10px', fontWeight: 700 }}
                    >
                      {beacon.status}
                    </span>
                  </div>
                  <p className="text-white/60 truncate" style={{ fontSize: '12px' }}>
                    {beacon.city}, {beacon.country}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-hot" style={{ fontSize: '18px', fontWeight: 700 }}>
                  {beacon.scans || 0}
                </div>
                <div className="text-white/60" style={{ fontSize: '10px' }}>scans</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="rounded-3xl border p-8 text-center space-y-4">
        <Globe size={48} className="mx-auto text-white/40" />
        <div className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          Globe View Coming Soon
        </div>
        <p className="text-white/60 max-w-md mx-auto" style={{ fontSize: '14px' }}>
          Interactive 3D globe view with real-time beacon locations and activity heatmap.
        </p>
      </div>
    </div>
  );
}
