/**
 * HOTMESS - Dynamic Artist Page
 * Shows artist profile, releases, mixes
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, MapPin, ExternalLink, Play, TrendingUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface Artist {
  id: string;
  name: string;
  city: string;
  avatar: string;
  soundcloud_url: string;
  bio: string;
  releases: Release[];
}

interface Release {
  id: string;
  title: string;
  artwork: string;
  soundcloud_url: string;
  release_date: string;
  bpm: number;
  genre: string;
  duration: number;
  plays: number;
}

interface ArtistPageProps {
  artistId?: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function ArtistPage({ artistId = '1', onNavigate }: ArtistPageProps) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  const loadArtist = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/raw/artist/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Artist not found');
      }

      const data = await response.json();
      setArtist(data);
    } catch (error) {
      console.error('Failed to load artist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtist();
  }, [artistId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#5200ff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60">Loading artist...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Music className="w-16 h-16 text-white/20 mx-auto" />
          <p className="text-white/40">Artist not found</p>
          <button
            onClick={() => onNavigate('rawManager')}
            className="px-6 py-2 bg-[#5200ff] rounded-lg text-white"
          >
            Back to RAW Convict
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5200ff]/20 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => onNavigate('rawManager')}
            className="text-sm text-white/40 hover:text-white mb-8 flex items-center gap-2"
          >
            ← Back to RAW Convict
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative"
            >
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-[#5200ff]/30">
                <ImageWithFallback
                  src={artist.avatar || 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400'}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#5200ff] rounded-full flex items-center justify-center border-4 border-black">
                <Music className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <h1 className="text-5xl md:text-7xl uppercase tracking-tight mb-3" style={{ fontWeight: 900 }}>
                {artist.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>{artist.city}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Music className="w-4 h-4" />
                  <span>{artist.releases?.length || 0} releases</span>
                </div>
              </div>

              {artist.bio && (
                <p className="text-white/80 max-w-2xl mb-6">{artist.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                {artist.soundcloud_url && (
                  <a
                    href={artist.soundcloud_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#ff7700] hover:bg-[#ff7700]/90 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span style={{ fontWeight: 700 }}>SoundCloud</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Releases */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl uppercase tracking-tight mb-8" style={{ fontWeight: 900 }}>
          Releases
        </h2>

        {artist.releases && artist.releases.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artist.releases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#5200ff]/50 transition-all group"
              >
                {/* Artwork */}
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback
                    src={release.artwork}
                    alt={release.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" fill="white" />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
                    {release.bpm} BPM
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold mb-1">{release.title}</h3>
                  <p className="text-white/50 text-sm mb-3">
                    {release.genre} • {Math.floor(release.duration / 60)}:{String(release.duration % 60).padStart(2, '0')}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                    <div className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      <span>{release.plays.toLocaleString()}</span>
                    </div>
                    <span>{new Date(release.release_date).toLocaleDateString()}</span>
                  </div>

                  <a
                    href={release.soundcloud_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#5200ff] hover:bg-[#5200ff]/90 rounded-lg text-sm transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span style={{ fontWeight: 700 }}>Listen</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No releases yet</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {artist.releases && artist.releases.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-[#5200ff]/10 border border-[#5200ff]/20 rounded-2xl p-8">
            <h3 className="text-2xl uppercase tracking-tight mb-6" style={{ fontWeight: 900 }}>
              Stats
            </h3>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <Music className="w-4 h-4" />
                  <span>Total Releases</span>
                </div>
                <p className="text-3xl font-bold">{artist.releases.length}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <Play className="w-4 h-4" />
                  <span>Total Plays</span>
                </div>
                <p className="text-3xl font-bold">
                  {artist.releases.reduce((sum, r) => sum + r.plays, 0).toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg BPM</span>
                </div>
                <p className="text-3xl font-bold">
                  {Math.round(artist.releases.reduce((sum, r) => sum + r.bpm, 0) / artist.releases.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
