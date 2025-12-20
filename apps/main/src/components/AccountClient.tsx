'use client';

/**
 * Client-side Account/Profile component with real data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useUserProfile, useUserXP } from '../lib/useUserData';
import { User, Mail, Calendar, Shield, Zap, Settings } from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface AccountClientProps {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

export function AccountClient({ user }: AccountClientProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || null);
    }
    getSession();
  }, []);

  const { data: profile, loading: profileLoading } = useUserProfile(
    user.id,
    accessToken || undefined
  );
  const { data: xpData } = useUserXP(accessToken || undefined);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-3xl border border-hot/30 bg-hot/5 p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="size-24 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="size-24 rounded-full object-cover"
              />
            ) : (
              <User size={48} className="text-white/40" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-white mb-1" style={{ fontSize: '28px', fontWeight: 900 }}>
                {profile?.displayName || user.email.split('@')[0]}
              </h2>
              {profile?.bio && (
                <p className="text-white/70" style={{ fontSize: '14px' }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Role Badge */}
            {profile?.role && profile.role !== 'USER' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-heat/20 border border-heat/50">
                <Shield size={16} className="text-heat" />
                <span className="text-heat uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 700 }}>
                  {profile.role}
                </span>
              </div>
            )}

            {/* XP Stats */}
            {xpData && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-hot" />
                  <div>
                    <div className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
                      Level {xpData.level}
                    </div>
                    <div className="text-white/60" style={{ fontSize: '12px' }}>
                      {xpData.totalXP.toLocaleString()} XP
                    </div>
                  </div>
                </div>
                {xpData.streakDays > 0 && (
                  <div>
                    <div className="text-heat" style={{ fontSize: '20px', fontWeight: 700 }}>
                      {xpData.streakDays} 🔥
                    </div>
                    <div className="text-white/60" style={{ fontSize: '12px' }}>
                      Day streak
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-3xl border p-6 space-y-6">
        <h3 className="text-white uppercase tracking-wider" style={{ fontSize: '14px', fontWeight: 900 }}>
          Account Details
        </h3>

        <div className="grid gap-6">
          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail size={20} className="text-white/40 mt-1" />
            <div className="flex-1">
              <div className="text-white/60" style={{ fontSize: '12px' }}>Email</div>
              <div className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-start gap-4">
            <User size={20} className="text-white/40 mt-1" />
            <div className="flex-1">
              <div className="text-white/60" style={{ fontSize: '12px' }}>User ID</div>
              <div className="text-white/80 font-mono break-all" style={{ fontSize: '12px' }}>
                {user.id}
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start gap-4">
            <Calendar size={20} className="text-white/40 mt-1" />
            <div className="flex-1">
              <div className="text-white/60" style={{ fontSize: '12px' }}>Member since</div>
              <div className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                {new Date(user.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {profile?.stats && (
        <div className="rounded-3xl border p-6">
          <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontSize: '14px', fontWeight: 900 }}>
            Activity Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-hot" style={{ fontSize: '32px', fontWeight: 700 }}>
                {profile.stats.beaconsScanned}
              </div>
              <div className="text-white/60" style={{ fontSize: '12px' }}>Beacons Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-heat" style={{ fontSize: '32px', fontWeight: 700 }}>
                {profile.stats.eventsAttended}
              </div>
              <div className="text-white/60" style={{ fontSize: '12px' }}>Events Attended</div>
            </div>
            <div className="text-center">
              <div className="text-neon-lime" style={{ fontSize: '32px', fontWeight: 700 }}>
                {profile.stats.level}
              </div>
              <div className="text-white/60" style={{ fontSize: '12px' }}>Level</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-static" style={{ fontSize: '32px', fontWeight: 700 }}>
                {profile.stats.streak}
              </div>
              <div className="text-white/60" style={{ fontSize: '12px' }}>Day Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Social Links */}
      {profile?.social && (
        <div className="rounded-3xl border p-6">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Social Links
          </h3>
          <div className="space-y-3">
            {profile.social.instagram && (
              <a
                href={`https://instagram.com/${profile.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-hot transition-colors"
                style={{ fontSize: '14px' }}
              >
                Instagram: @{profile.social.instagram}
              </a>
            )}
            {profile.social.twitter && (
              <a
                href={`https://twitter.com/${profile.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-hot transition-colors"
                style={{ fontSize: '14px' }}
              >
                Twitter: @{profile.social.twitter}
              </a>
            )}
            {profile.social.telegram && (
              <div className="text-white/70" style={{ fontSize: '14px' }}>
                Telegram: @{profile.social.telegram}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      <div className="rounded-3xl border p-8 text-center space-y-4">
        <Settings size={48} className="mx-auto text-white/40" />
        <div className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          More Settings Coming Soon
        </div>
        <p className="text-white/60 max-w-md mx-auto" style={{ fontSize: '14px' }}>
          Profile editing, privacy controls, notification preferences, and more.
        </p>
      </div>
    </div>
  );
}
