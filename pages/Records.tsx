/**
 * RAW CONVICT RECORDS Hub
 * Mobile-first responsive layout with MP3 playback
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, ShoppingBag, Users, Radio, ExternalLink, Disc3, Clock, Music, Headphones, Volume2 } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import bannerImage from 'figma:asset/e75eb0e74a1b0bee0cd6030c72cf836c66d1613a.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RecordsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Track {
  id: string;
  title: string;
  mp3Url: string;
  duration: string;
}

interface Record {
  slug: string;
  title: string;
  artist: string;
  type: string;
  status: string;
  tagline: string;
  coverUrl: string;
  releaseDate: string;
  totalDuration: string;
  soundcloudUrl: string;
  cuts: Track[];
  tags: string[];
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/records`;

// Mock data with MP3 URLs (fallback)
const featuredRelease = {
  slug: 'hotmess',
  title: 'HOTMESS',
  artist: 'RAW CONVICT',
  type: 'RELEASE PACK',
  coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  tagline: 'RCR RELEASE ACTIVE. ACT ACCORDINGLY.',
  tracks: 4,
  duration: '18:07',
  releaseDate: 'Nov 2024',
  previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Demo MP3
};

const latestReleases = [
  {
    slug: 'hotmess',
    title: 'HOTMESS',
    artist: 'RAW CONVICT',
    type: 'RELEASE PACK',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    tracks: 4,
    duration: '18:07',
    date: 'Nov 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    slug: 'after-dark',
    title: 'AFTER DARK',
    artist: 'VOID SIGNAL',
    type: 'SINGLE',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    tracks: 1,
    duration: '6:42',
    date: 'Oct 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    slug: 'warehouse',
    title: 'WAREHOUSE',
    artist: 'BASEMENT FREQ',
    type: 'EP',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tracks: 5,
    duration: '22:15',
    date: 'Sep 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    slug: 'industrial',
    title: 'INDUSTRIAL',
    artist: 'REDACTED',
    type: 'EP',
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800',
    tracks: 4,
    duration: '19:30',
    date: 'Aug 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    slug: 'raw-013',
    title: 'RAW 013',
    artist: 'VARIOUS',
    type: 'COMPILATION',
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    tracks: 8,
    duration: '35:42',
    date: 'Jul 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    slug: 'midnight-freq',
    title: 'MIDNIGHT FREQ',
    artist: 'DJ MESS',
    type: 'SINGLE',
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    tracks: 1,
    duration: '7:23',
    date: 'Jun 2024',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
];

export function Records({ onNavigate }: RecordsProps) {
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch records from API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_BASE}/records`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded records:', data.records);
          setRecords(data.records || []);
        } else {
          console.error('Failed to fetch records');
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handlePlayPause = (slug: string, previewUrl: string) => {
    if (playingSlug === slug && audioElement) {
      // Pause current
      audioElement.pause();
      setPlayingSlug(null);
    } else {
      // Stop previous
      if (audioElement) {
        audioElement.pause();
      }
      // Play new
      const audio = new Audio(previewUrl);
      audio.play();
      audio.onended = () => setPlayingSlug(null);
      setAudioElement(audio);
      setPlayingSlug(slug);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Banner Image Header */}
      <section className="relative overflow-hidden border-b border-hot/30">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={bannerImage}
            alt="RAW CONVICT RECORDS"
            className="w-full h-auto"
          />
        </motion.div>
      </section>

      {/* Quick Actions Section - Below Banner */}
      <section className="px-4 md:px-8 lg:px-12 py-6 border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/60 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '12px' }}>
            Underground techno. Industrial. Kink. Artists keep 70%.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('radio')}
              className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              style={{ fontWeight: 900, fontSize: '12px' }}
            >
              <Radio size={16} />
              Listen Live
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-black border-2 border-white text-white px-6 py-3 uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              style={{ fontWeight: 900, fontSize: '12px' }}
            >
              <ShoppingBag size={16} />
              Shop Drops
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Release Hero - Mobile Optimized */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden border-b border-white/10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={featuredRelease.coverUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-12 py-12 flex flex-col justify-end min-h-[60vh] md:min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Badge */}
            <div className="inline-block bg-hot px-3 py-2 mb-4">
              <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '11px' }}>
                🔥 FEATURED RELEASE
              </span>
            </div>

            {/* Title - Responsive */}
            <h2
              className="uppercase tracking-[-0.04em] leading-[0.85] text-white mb-4"
              style={{ fontWeight: 900, fontSize: 'clamp(48px, 12vw, 120px)' }}
            >
              {featuredRelease.title}
            </h2>

            {/* Artist */}
            <p className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 700, fontSize: 'clamp(14px, 3vw, 18px)' }}>
              by {featuredRelease.artist}
            </p>

            {/* Meta Grid - Responsive */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-6 mb-6 text-white/60">
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>TYPE</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '13px' }}>{featuredRelease.type}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>TRACKS</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '13px' }}>{featuredRelease.tracks}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>DURATION</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '13px' }}>{featuredRelease.duration}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>RELEASED</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '13px' }}>{featuredRelease.releaseDate}</span>
              </div>
            </div>

            {/* Actions - Mobile Full Width */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handlePlayPause(featuredRelease.slug, featuredRelease.previewUrl)}
                className="bg-hot hover:bg-white text-white hover:text-black px-8 py-4 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                {playingSlug === featuredRelease.slug ? (
                  <>
                    <Pause size={20} />
                    Pause Preview
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Play Preview
                  </>
                )}
              </button>
              <button
                onClick={() => onNavigate('recordsRelease', { slug: featuredRelease.slug })}
                className="bg-black border-2 border-white text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                View Full Release
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Releases - Mobile Grid */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Music className="text-hot" size={20} />
              <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: 'clamp(18px, 4vw, 28px)' }}>
                LATEST RELEASES
              </h3>
            </div>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
              {records.length > 0 ? `${records.length} RELEASES AVAILABLE` : 'NEW DAMAGE. STREAM OR DOWNLOAD.'}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hot"></div>
              <p className="text-white/60 mt-4">Loading records...</p>
            </div>
          )}

          {/* Real Records from Database */}
          {!loading && records.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {records.map((record, idx) => {
                // Get first track's mp3 URL for preview
                const previewUrl = record.cuts && record.cuts.length > 0 ? record.cuts[0].mp3Url : '';
                
                return (
                  <ReleaseCard
                    key={record.slug}
                    release={{
                      slug: record.slug,
                      title: record.title,
                      artist: record.artist,
                      type: record.type,
                      coverUrl: record.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
                      tracks: record.cuts?.length || 0,
                      duration: record.totalDuration,
                      date: new Date(record.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    }}
                    isPlaying={playingSlug === record.slug}
                    onPlayPause={() => previewUrl && handlePlayPause(record.slug, previewUrl)}
                    onNavigate={() => onNavigate('recordsRelease', { slug: record.slug })}
                    delay={idx * 0.1}
                  />
                );
              })}
            </div>
          )}

          {/* Mock Data Fallback - Show if no real records */}
          {!loading && records.length === 0 && (
            <>
              <div className="mb-6 bg-white/5 border border-hot/30 p-4">
                <p className="text-hot uppercase tracking-wider text-center" style={{ fontWeight: 700, fontSize: '12px' }}>
                  ⚠️ No records uploaded yet. Showing demo data.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {latestReleases.map((release, idx) => (
                  <ReleaseCard
                    key={release.slug}
                    release={release}
                    isPlaying={playingSlug === release.slug}
                    onPlayPause={() => handlePlayPause(release.slug, release.previewUrl)}
                    onNavigate={() => onNavigate('recordsRelease', { slug: release.slug })}
                    delay={idx * 0.1}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 lg:px-12 py-12 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Disc3 />} value="24" label="Releases" />
          <StatCard icon={<Music />} value="156" label="Tracks" />
          <StatCard icon={<Users />} value="18" label="Artists" />
          <StatCard icon={<Headphones />} value="42K" label="Streams" />
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface ReleaseCardProps {
  release: {
    slug: string;
    title: string;
    artist: string;
    type: string;
    coverUrl: string;
    tracks: number;
    duration: string;
    date: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onNavigate: () => void;
  delay: number;
}

function ReleaseCard({ release, isPlaying, onPlayPause, onNavigate, delay }: ReleaseCardProps) {
  return (
    <motion.div
      className="group relative bg-white/5 border border-white/10 hover:border-hot overflow-hidden transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      {/* Cover Image */}
      <div className="aspect-square relative overflow-hidden cursor-pointer" onClick={onNavigate}>
        <ImageWithFallback
          src={release.coverUrl}
          alt={release.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            className="w-16 h-16 bg-hot hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ml-1" />
            )}
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 border border-hot/50">
          <span className="text-hot uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '9px' }}>
            {release.type}
          </span>
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute top-3 left-3 bg-hot px-2 py-1 flex items-center gap-1.5 animate-pulse">
            <Volume2 size={12} className="text-white" />
            <span className="text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '9px' }}>
              Playing
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 
          className="text-white uppercase mb-1 leading-tight cursor-pointer hover:text-hot transition-colors"
          style={{ fontWeight: 900, fontSize: '16px' }}
          onClick={onNavigate}
        >
          {release.title}
        </h3>
        <p className="text-white/60 mb-3" style={{ fontSize: '13px' }}>
          {release.artist}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-white/40 text-xs">
          <div className="flex items-center gap-1.5">
            <Music size={12} />
            <span>{release.tracks} tracks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{release.duration}</span>
          </div>
        </div>

        {/* Date */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
            {release.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 text-center hover:border-hot transition-colors">
      <div className="text-hot mb-2 flex justify-center">{icon}</div>
      <div className="text-white mb-1" style={{ fontWeight: 900, fontSize: '28px' }}>
        {value}
      </div>
      <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
        {label}
      </div>
    </div>
  );
}