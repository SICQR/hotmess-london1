/**
 * Record Release Detail Page
 * Mobile-first with full MP3 playback
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  ShoppingBag, 
  MessageSquare, 
  ExternalLink, 
  ArrowLeft, 
  Volume2, 
  Music,
  Clock,
  Download,
  Share2,
  Heart,
  Loader
} from 'lucide-react';
import { RouteId } from '../lib/routes';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SaveButton } from '../components/SaveButton';

interface RecordReleaseProps {
  slug: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Track {
  id: string;
  title: string;
  duration: string;
  badge: string | null;
  mp3Url: string;
}

interface Credit {
  role: string;
  name: string;
}

interface ShopItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface Release {
  slug: string;
  title: string;
  artist: string;
  tagline: string;
  type: string;
  status: string;
  tags: string[];
  coverUrl: string;
  releaseDate: string;
  totalDuration: string;
  soundcloudUrl: string;
  cuts: Track[];
  credits: Credit[];
  press: string;
  shopItems: ShopItem[];
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/records`;

// Mock data with MP3 URLs (fallback)
const releaseData: Record<string, any> = {
  hotmess: {
    slug: 'hotmess',
    title: 'HOTMESS',
    artist: 'RAW CONVICT',
    tagline: 'NEW VERSIONS. SAME PROBLEM.',
    type: 'RELEASE PACK',
    status: 'ACTIVE',
    tags: ['Remix', 'Radio Edit', 'Dirty'],
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    releaseDate: 'Nov 2024',
    totalDuration: '18:07',
    soundcloudUrl: 'https://soundcloud.com/hotmess-london',
    cuts: [
      { 
        id: '1', 
        title: 'HOTMESS (Radio Edit)', 
        duration: '3:45', 
        badge: 'FEATURED', 
        mp3Url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
      },
      { 
        id: '2', 
        title: 'HOTMESS (Dirty)', 
        duration: '4:12', 
        badge: 'EXPLICIT', 
        mp3Url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' 
      },
      { 
        id: '3', 
        title: 'HOTMESS (Extended Mix)', 
        duration: '6:30', 
        badge: 'FULL MIX', 
        mp3Url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' 
      },
      { 
        id: '4', 
        title: 'HOTMESS (Acapella)', 
        duration: '3:40', 
        badge: null, 
        mp3Url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' 
      },
    ],
    credits: [
      { role: 'PRODUCED BY', name: 'DJ MESS' },
      { role: 'MIXED BY', name: 'STUDIO RAW' },
      { role: 'MASTERED BY', name: 'BASS LABS' },
    ],
    press: 'High-octane edits built for peak-hour damage. Radio-safe versions for broadcast, dirty cuts for the rest. No filler, all heat.',
    shopItems: [
      { id: '1', title: 'HOTMESS TEE', price: '£35', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400' },
      { id: '2', title: 'HOTMESS HOODIE', price: '£65', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    ],
  },
  // Add default for other slugs
  'after-dark': {
    slug: 'after-dark',
    title: 'AFTER DARK',
    artist: 'VOID SIGNAL',
    tagline: 'WHEN THE LIGHTS GO OUT.',
    type: 'SINGLE',
    status: 'ACTIVE',
    tags: ['Industrial', 'Techno'],
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200',
    releaseDate: 'Oct 2024',
    totalDuration: '6:42',
    soundcloudUrl: 'https://soundcloud.com',
    cuts: [
      { 
        id: '1', 
        title: 'AFTER DARK (Original Mix)', 
        duration: '6:42', 
        badge: 'ORIGINAL', 
        mp3Url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' 
      },
    ],
    credits: [
      { role: 'PRODUCED BY', name: 'VOID SIGNAL' },
      { role: 'MASTERED BY', name: 'DARK LABS' },
    ],
    press: 'Industrial techno for the late-night hours. Heavy, relentless, uncompromising.',
    shopItems: [],
  },
};

export function RecordRelease({ slug, onNavigate }: RecordReleaseProps) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = release?.cuts.find((cut: any) => cut.id === currentTrackId);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track
      const cuts = release?.cuts ?? [];
      const currentIndex = cuts.findIndex((cut: any) => cut.id === currentTrackId);
      if (currentIndex >= 0 && currentIndex < cuts.length - 1) {
        const nextId = cuts[currentIndex + 1]?.id;
        if (nextId) playTrack(nextId);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackId, release]);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        console.log('🔍 Fetching record:', slug);
        const response = await fetch(`${API_BASE}/records/${slug}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        
        if (!response.ok) {
          console.error('❌ Record not found, using fallback data');
          throw new Error('Record not found');
        }
        
        const data = await response.json();
        console.log('✅ Loaded record:', data);
        
        // Backend returns { success: true, record: {...} }
        const recordData = data.record || data;
        setRelease(recordData);
      } catch (error) {
        console.error('Failed to fetch release data:', error);
        // Fallback to mock data
        setRelease(releaseData[slug] || releaseData.hotmess);
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, [slug]);

  const playTrack = (trackId: string) => {
    const track = release?.cuts.find((cut: any) => cut.id === trackId);
    if (!track || !audioRef.current) return;

    if (currentTrackId === trackId && isPlaying) {
      // Pause current track
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play new track or resume
      if (currentTrackId !== trackId) {
        audioRef.current.src = track.mp3Url;
        setCurrentTrackId(trackId);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Audio element */}
      <audio ref={audioRef} />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={release?.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200'}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Back Button */}
          <motion.button
            onClick={() => onNavigate('records')}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-hot transition-colors"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft size={20} />
            <span className="uppercase tracking-wider" style={{ fontSize: '12px' }}>Back to Records</span>
          </motion.button>

          <motion.div
            className="flex flex-col justify-end min-h-[50vh] md:min-h-[60vh]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-block bg-hot px-3 py-2 mb-4 w-fit">
              <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '11px' }}>
                {release?.status} · {release?.type}
              </span>
            </div>

            {/* Title */}
            <h1
              className="uppercase tracking-[-0.04em] leading-[0.85] text-white mb-3"
              style={{ fontWeight: 900, fontSize: 'clamp(48px, 12vw, 140px)' }}
            >
              {release?.title}
            </h1>

            {/* Artist */}
            <p className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 700, fontSize: 'clamp(16px, 3vw, 22px)' }}>
              by {release?.artist}
            </p>

            {/* Tagline */}
            <p className="text-white/80 mb-6 max-w-2xl" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
              {release?.tagline}
            </p>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-6 mb-6">
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>TRACKS</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{release?.cuts.length}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>DURATION</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{release?.totalDuration}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>RELEASED</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{formatDate(release?.releaseDate || new Date().toISOString())}</span>
              </div>
              <div>
                <span className="uppercase tracking-wider block text-hot" style={{ fontWeight: 900, fontSize: '10px' }}>TAGS</span>
                <span className="uppercase tracking-wider text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{release?.tags.join(' / ')}</span>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => playTrack(release?.cuts?.[0]?.id || '')}
                className="bg-hot hover:bg-white text-white hover:text-black px-8 py-4 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                <Play size={20} />
                Play All
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-black border-2 border-white text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                <ShoppingBag size={20} />
                Shop
              </button>
              <button
                className="bg-black border-2 border-white text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                <Share2 size={20} />
                Share
              </button>
              <SaveButton
                contentType="release"
                contentId={slug}
                metadata={{
                  title: release?.title,
                  description: `by ${release?.artist}`,
                  image: release?.coverUrl,
                  date: release?.releaseDate
                }}
                size="lg"
                showLabel={true}
                className="sm:ml-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks List */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 border-t border-white/10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Music className="text-hot" size={20} />
            <h2 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: 'clamp(20px, 4vw, 32px)' }}>
              TRACKS
            </h2>
          </div>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            PICK YOUR VERSION. STREAM OR DOWNLOAD.
          </p>
        </div>

        <div className="space-y-3">
          {release?.cuts.map((cut: any, idx: number) => (
            <TrackCard
              key={cut.id}
              track={cut}
              trackNumber={idx + 1}
              isPlaying={isPlaying && currentTrackId === cut.id}
              onPlay={() => playTrack(cut.id)}
              delay={idx * 0.05}
            />
          ))}
        </div>
      </section>

      {/* Now Playing Bar - Mobile Fixed Bottom */}
      {currentTrack && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-hot z-50 lg:left-80"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => playTrack(currentTrack.id)}
                className="w-12 h-12 bg-hot hover:bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-white uppercase truncate" style={{ fontWeight: 900, fontSize: '13px' }}>
                  {currentTrack.title}
                </div>
                <div className="text-white/60 uppercase truncate" style={{ fontWeight: 700, fontSize: '11px' }}>
                  {release?.artist}
                </div>
              </div>
              <div className="text-white/60 flex-shrink-0" style={{ fontWeight: 700, fontSize: '12px' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF1744 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`,
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Credits */}
      <section className="px-4 md:px-8 lg:px-12 py-12 border-t border-white/10">
        <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '20px' }}>
          CREDITS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {release?.credits.map((credit: any, idx: number) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4">
              <div className="text-hot uppercase tracking-wider mb-1" style={{ fontWeight: 900, fontSize: '10px' }}>
                {credit.role}
              </div>
              <div className="text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
                {credit.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section className="px-4 md:px-8 lg:px-12 py-12 border-t border-white/10">
        <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '20px' }}>
          ABOUT
        </h3>
        <p className="text-white/70 leading-relaxed max-w-3xl" style={{ fontSize: '15px' }}>
          {release?.press}
        </p>
      </section>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    duration: string;
    badge: string | null;
  };
  trackNumber: number;
  isPlaying: boolean;
  onPlay: () => void;
  delay: number;
}

function TrackCard({ track, trackNumber, isPlaying, onPlay, delay }: TrackCardProps) {
  return (
    <motion.div
      className="group bg-white/5 border border-white/10 hover:border-hot transition-all"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Track Number / Play Button */}
        <button
          onClick={onPlay}
          className="w-12 h-12 bg-hot hover:bg-white flex-shrink-0 flex items-center justify-center transition-all group-hover:scale-105"
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" />
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/40 uppercase tracking-wider flex-shrink-0" style={{ fontWeight: 900, fontSize: '12px' }}>
              {trackNumber.toString().padStart(2, '0')}
            </span>
            <h3 className="text-white uppercase tracking-wider truncate" style={{ fontWeight: 900, fontSize: 'clamp(13px, 2vw, 16px)' }}>
              {track.title}
            </h3>
            {track.badge && (
              <span className="bg-hot px-2 py-0.5 text-white uppercase tracking-wider flex-shrink-0" style={{ fontWeight: 700, fontSize: '9px' }}>
                {track.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Clock size={12} />
            <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              {track.duration}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="w-10 h-10 border border-white/20 hover:border-hot text-white/60 hover:text-hot flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
            <Download size={16} />
          </button>
          <button className="w-10 h-10 border border-white/20 hover:border-hot text-white/60 hover:text-hot flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
            <Heart size={16} />
          </button>
        </div>
      </div>

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-hot"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <Volume2 size={14} className="text-hot animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}