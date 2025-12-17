/**
 * RAW CONVICT - Drop Manager
 * Internal label dashboard for managing releases
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, TrendingUp, QrCode, Radio, Play, ExternalLink, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface Release {
  id: string;
  title: string;
  artist: {
    name: string;
    avatar: string;
    city: string;
  };
  artwork: string;
  soundcloud_url: string;
  release_date: string;
  bpm: number;
  genre: string;
  duration: number;
  plays: number;
  tiktok_reel_url: string | null;
  qr_poster_url: string | null;
  created_at: string;
}

interface RawManagerProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function RawManager({ onNavigate }: RawManagerProps) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const loadReleases = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/raw/releases`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setReleases(data);
    } catch (error) {
      console.error('Failed to load releases:', error);
      toast.error('Failed to load releases');
    } finally {
      setLoading(false);
    }
  };

  const generateTikTok = async (releaseId: string) => {
    try {
      setGenerating(releaseId);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/raw/generate-tiktok`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ releaseId }),
        }
      );

      if (response.ok) {
        toast.success('TikTok reel generation started', {
          icon: '🎥',
        });
      } else {
        toast.error('Failed to generate TikTok reel');
      }
    } catch (error) {
      console.error('TikTok generation error:', error);
      toast.error('Failed to generate TikTok reel');
    } finally {
      setGenerating(null);
    }
  };

  const generateQRPoster = async (releaseId: string) => {
    try {
      setGenerating(releaseId);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/raw/generate-qr-poster`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ releaseId }),
        }
      );

      if (response.ok) {
        toast.success('QR poster generated', {
          icon: '📱',
        });
        loadReleases(); // Refresh to show new poster
      } else {
        toast.error('Failed to generate QR poster');
      }
    } catch (error) {
      console.error('QR poster generation error:', error);
      toast.error('Failed to generate QR poster');
    } finally {
      setGenerating(null);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#5200ff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60">Loading RAW Convict releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => onNavigate('home')}
                className="text-sm text-white/40 hover:text-white mb-2 flex items-center gap-2"
              >
                ← Back
              </button>
              <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
                RAW Convict
              </h1>
              <p className="text-white/60 mt-1">Drop Manager</p>
            </div>

            <button
              onClick={loadReleases}
              className="flex items-center gap-2 px-4 py-2 bg-[#5200ff] hover:bg-[#5200ff]/90 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{releases.length}</p>
              <p className="text-white/50 text-sm uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
                Total Releases
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {releases.reduce((sum, r) => sum + r.plays, 0).toLocaleString()}
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
                Total Plays
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {releases.filter(r => r.tiktok_reel_url).length}
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
                TikTok Reels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Releases Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {releases.length === 0 ? (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No releases yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release) => (
              <motion.div
                key={release.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#5200ff]/50 transition-all"
                whileHover={{ y: -4 }}
              >
                {/* Artwork */}
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={release.artwork}
                    alt={release.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
                    {release.bpm} BPM
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{release.title}</h3>
                    <p className="text-white/60 text-sm">{release.artist.name}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {release.genre} • {Math.floor(release.duration / 60)}:{String(release.duration % 60).padStart(2, '0')}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      <span>{release.plays.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{release.artist.city}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* SoundCloud Link */}
                    <a
                      href={release.soundcloud_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#ff7700] hover:bg-[#ff7700]/90 rounded-lg text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span style={{ fontWeight: 700 }}>Open in SoundCloud</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      {/* TikTok Generation */}
                      <button
                        onClick={() => generateTikTok(release.id)}
                        disabled={generating === release.id}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        {release.tiktok_reel_url ? (
                          <>
                            <Play className="w-3 h-3" />
                            <span>View Reel</span>
                          </>
                        ) : (
                          <>
                            {generating === release.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Music className="w-3 h-3" />
                            )}
                            <span>Gen Reel</span>
                          </>
                        )}
                      </button>

                      {/* QR Poster */}
                      <button
                        onClick={() => generateQRPoster(release.id)}
                        disabled={generating === release.id}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        {release.qr_poster_url ? (
                          <>
                            <QrCode className="w-3 h-3" />
                            <span>View QR</span>
                          </>
                        ) : (
                          <>
                            {generating === release.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <QrCode className="w-3 h-3" />
                            )}
                            <span>Gen QR</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Push to Radio */}
                    <button
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#5200ff]/20 hover:bg-[#5200ff]/30 border border-[#5200ff]/40 rounded-lg text-sm transition-colors"
                    >
                      <Radio className="w-4 h-4" />
                      <span className="text-[#5200ff]" style={{ fontWeight: 700 }}>
                        Push to Radio
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
