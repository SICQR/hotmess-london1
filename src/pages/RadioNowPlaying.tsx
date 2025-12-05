import { useEffect, useState } from 'react';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { Card } from '../components/design-system/Card';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Radio as RadioIcon,
  Users,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { LiveChat } from '../components/radio/LiveChat';
import { useRadio } from '../contexts/RadioContext';
import { useRadioXP } from '../hooks/useRadioXP';
import { motion } from 'motion/react';

interface NowPlayingData {
  showName: string;
  djName: string;
  djAvatar: string;
  showImage: string;
  currentTrack: {
    title: string;
    artist: string;
    artwork?: string;
  };
  listeners: number;
  schedule: {
    startTime: string;
    endTime: string;
  };
  description: string;
  genre: string;
  isLive: boolean;
}

interface RadioNowPlayingProps {
  onNavigate?: (route: string, params?: Record<string, string>) => void;
}

export default function RadioNowPlaying({ onNavigate }: RadioNowPlayingProps) {
  const navigate = (route: string, params?: Record<string, string>) => onNavigate?.(route, params);
  
  // Legacy state for this component
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    showName: 'LATE NIGHT FREQUENCIES',
    djName: 'DJ VOLTAGE',
    djAvatar: '',
    showImage: '',
    currentTrack: {
      title: 'Untitled',
      artist: 'Unknown Artist',
    },
    listeners: 247,
    schedule: {
      startTime: '23:00',
      endTime: '02:00',
    },
    description: 'Underground techno and industrial sounds for the late night hours. Expect hard-hitting beats and dark atmospheres.',
    genre: 'Techno / Industrial',
    isLive: true,
  });
  
  // Use RadioContext for live data overlay
  const { 
    stats
  } = useRadio();
  
  // XP rewards for listening
  const { hasAwardedInitial, hasAwardedExtended, listeningMinutes } = useRadioXP({
    initialXP: 10,
    extendedXP: 20,
    extendedThresholdMinutes: 10,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showChat, setShowChat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${nowPlaying.showName} - HOTMESS Radio`,
        text: `Listening to ${nowPlaying.djName} on HOTMESS Radio`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('radio')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {nowPlaying.isLive && (
              <Badge variant="danger" className="animate-pulse">
                ● LIVE
              </Badge>
            )}
            <h1 className="text-lg uppercase tracking-wider">Now Playing</h1>
          </div>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Artwork Hero */}
      <div className="relative aspect-square max-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
        {nowPlaying.showImage || nowPlaying.currentTrack.artwork ? (
          <img
            src={nowPlaying.currentTrack.artwork || nowPlaying.showImage || 'https://images.unsplash.com/photo-1571266028243-d220c6e2e6ca?w=800&h=800&fit=crop'}
            alt="Now playing"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-hot/20 to-purple-600/20 flex items-center justify-center">
            <RadioIcon className="w-32 h-32 text-white/20" />
          </div>
        )}
        
        {/* Floating Controls */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-3 bg-black/60 backdrop-blur rounded-full hover:bg-black/80 transition-colors"
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-hot text-hot' : 'text-white'}`} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-6 bg-hot rounded-full hover:bg-hot/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" fill="white" />
              ) : (
                <Play className="w-10 h-10" fill="white" />
              )}
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 bg-black/60 backdrop-blur rounded-full hover:bg-black/80 transition-colors relative"
            >
              <MessageCircle className="w-6 h-6" />
              {showChat && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-hot rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Now Playing Info */}
      <section className="px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black mb-2">{nowPlaying.currentTrack.title}</h2>
          <p className="text-white/60 mb-4">{nowPlaying.currentTrack.artist}</p>
          <Badge variant="secondary">{nowPlaying.genre}</Badge>
        </div>

        {/* Volume Control */}
        <Card className="p-4 bg-white/5 border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handleMute} className="shrink-0">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-white/60" />
              ) : (
                <Volume2 className="w-5 h-5 text-white/60" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-hot"
            />
            <span className="text-sm text-white/60 w-12 text-right">{isMuted ? 0 : volume}%</span>
          </div>
        </Card>

        {/* Show Info */}
        <Card className="p-6 bg-white/5 border-white/10 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden shrink-0">
              {nowPlaying.djAvatar ? (
                <img src={nowPlaying.djAvatar} alt={nowPlaying.djName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black">
                  {nowPlaying.djName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black mb-1">{nowPlaying.showName}</h3>
              <p className="text-white/60 mb-2">with {nowPlaying.djName}</p>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{nowPlaying.listeners} listening</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{nowPlaying.schedule.startTime} - {nowPlaying.schedule.endTime}</span>
                </div>
              </div>
            </div>
          </div>

          {nowPlaying.description && (
            <p className="text-sm text-white/80 leading-relaxed">
              {nowPlaying.description}
            </p>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={() => navigate('radioShow', { slug: nowPlaying.showName.toLowerCase().replace(/ /g, '-') })}
            variant="outline"
          >
            View Show
          </Button>
          <Button
            onClick={() => navigate('radioSchedule')}
            variant="outline"
          >
            Full Schedule
          </Button>
        </div>
      </section>

      {/* Chat Panel (Slide in from bottom) */}
      {showChat && (
        <div className="fixed inset-x-0 bottom-0 z-50 h-[60vh] bg-black border-t border-white/10 transform transition-transform duration-300">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold">Live Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <LiveChat />
            </div>
          </div>
        </div>
      )}

      {/* Track History */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Recently Played</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="space-y-3">
          {[
            { title: 'Dark Energy', artist: 'Voltage', time: '5 min ago' },
            { title: 'Industrial Complex', artist: 'The Hacker', time: '12 min ago' },
            { title: 'Midnight Ritual', artist: 'Rebekah', time: '20 min ago' },
          ].map((track, index) => (
            <Card key={index} className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-white/60 truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-white/40 shrink-0 ml-4">{track.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
