'use client';

/**
 * Client-side Drops component with real data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { EmptyState } from './EmptyState';
import { Package, Clock, MapPin, Zap } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { ImageGridSkeleton } from './LoadingSkeleton';
import { LazyImage } from './LazyImage';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface Drop {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  images: string[];
  type: 'instant' | 'timed' | 'location' | 'dual';
  status: 'scheduled' | 'live' | 'ended';
  scheduled_at?: string;
  ends_at?: string;
  beacon_id?: string;
  city: string;
  category: string;
  xp_reward?: number;
  created_at: string;
}

export function DropsClient() {
  const [drops, setDrops] = useState<Drop[]>([]);
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
    async function fetchDrops() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/drops/list?status=live&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch drops');
        }

        const result = await response.json();
        setDrops(result.drops || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching drops:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDrops();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ImageGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400" style={{ fontSize: '14px' }}>
          Failed to load drops. Please try again.
        </p>
      </div>
    );
  }

  if (drops.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Active Drops"
        description="Check back soon for exclusive releases, limited merch, and members-only perks."
        actionLabel="Explore Shop"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="rounded-3xl border border-hot/30 bg-black overflow-hidden hover:border-hot/60 transition-all group"
          >
            {/* Image */}
            {drop.images && drop.images[0] && (
              <div className="aspect-square bg-white/5 overflow-hidden">
                <LazyImage
                  src={drop.images[0]}
                  alt={drop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-full bg-hot/20 text-hot uppercase tracking-wider"
                  style={{ fontSize: '10px', fontWeight: 700 }}
                >
                  {drop.type} drop
                </span>
                {drop.xp_reward && (
                  <div className="flex items-center gap-1 text-hot">
                    <Zap size={14} />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>
                      +{drop.xp_reward} XP
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
                {drop.title}
              </h3>

              {/* Description */}
              <p className="text-white/60 line-clamp-2" style={{ fontSize: '14px' }}>
                {drop.description}
              </p>

              {/* Countdown (if timed) */}
              {drop.type === 'timed' && drop.ends_at && (
                <CountdownTimer
                  targetDate={new Date(drop.ends_at)}
                  label="Ends in"
                  compact
                />
              )}

              {/* Location (if location-based) */}
              {(drop.type === 'location' || drop.type === 'dual') && drop.beacon_id && (
                <div className="flex items-center gap-2 text-cyan-static">
                  <MapPin size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>
                    Location-locked
                  </span>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
                    £{drop.price}
                  </div>
                  <div className="text-white/60" style={{ fontSize: '12px' }}>
                    {drop.quantity - drop.sold} / {drop.quantity} left
                  </div>
                </div>
                <button
                  className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black rounded-xl transition-colors"
                  style={{ fontSize: '14px', fontWeight: 900 }}
                >
                  CLAIM
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}