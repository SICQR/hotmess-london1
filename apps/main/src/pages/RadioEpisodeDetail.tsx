// HOTMESS LONDON - Radio Episode Detail Page
// Podcast playback with embedded audio player

import { useState } from 'react';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Download, Share2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { NavFunction } from '../lib/routes';

interface RadioEpisodeDetailProps {
  slug: string;
  onNavigate: NavFunction;
}

// Mock episode data - in production this would come from API/Supabase
const episodeData: Record<string, any> = {
  'nightbody-001': {
    title: 'Nightbody Mixes #001',
    show: 'Nightbody Mixes',
    showSlug: 'nightbody-mixes',
    description: 'Deep house & tech from the underground. A journey through dark basements and sweaty dancefloors, featuring unreleased tracks and forgotten gems.',
    date: '2025-11-27',
    duration: '2h 15m',
    durationSeconds: 8100,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    audioUrl: 'https://listen.radioking.com/radio/736103/stream/802454', // Placeholder - would be actual podcast file
    tracklist: [
      { time: '00:00', artist: 'Petre Inspirescu', track: 'Balamuc' },
      { time: '12:30', artist: 'Raresh', track: 'Need' },
      { time: '24:15', artist: 'Margaret Dygas', track: 'So Much Better' },
      { time: '38:00', artist: 'Praslea', track: 'Catharsis' },
      { time: '52:45', artist: 'Zip', track: 'Unknown Track' },
      { time: '1:08:20', artist: 'Rhadoo', track: 'Poiana Zambilelor' },
      { time: '1:24:00', artist: 'SIT', track: 'Love Unlimited' },
      { time: '1:45:30', artist: 'Ricardo Villalobos', track: 'Fizheuer Zieheuer' },
      { time: '2:00:00', artist: 'Sonja Moonear', track: 'Dazzle Me' },
    ],
  },
  'wake-mess-special': {
    title: 'Wake the Mess: Pride Special',
    show: 'Wake the Mess',
    showSlug: 'wake-the-mess',
    description: 'Anthems that shaped us. A celebration of queer club culture with tracks that defined generations—from ballroom classics to modern bangers.',
    date: '2025-11-25',
    duration: '3h',
    durationSeconds: 10800,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    audioUrl: 'https://listen.radioking.com/radio/736103/stream/802454',
    tracklist: [
      { time: '00:00', artist: 'Sylvester', track: 'You Make Me Feel (Mighty Real)' },
      { time: '08:15', artist: 'Crystal Waters', track: 'Gypsy Woman' },
      { time: '16:30', artist: 'Ultra Naté', track: 'Free' },
      { time: '24:00', artist: 'RuPaul', track: 'Supermodel (You Better Work)' },
      { time: '32:45', artist: 'Hercules & Love Affair', track: 'Blind' },
    ],
  },
  'dial-daddy-112': {
    title: 'Coming Out Stories',
    show: 'Dial-A-Daddy',
    showSlug: 'dial-a-daddy',
    description: 'Real talk from real men. Listeners share their coming out experiences—the good, the bad, the messy. No script, no judgment, just honesty.',
    date: '2025-11-23',
    duration: '1h 45m',
    durationSeconds: 6300,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    audioUrl: 'https://listen.radioking.com/radio/736103/stream/802454',
  },
  'hand-n-hand-ep5': {
    title: 'Harm Reduction Basics',
    show: 'Hand N Hand',
    showSlug: 'hand-n-hand',
    description: 'Safe use, testing, and looking out for each other. Practical harm reduction information delivered without shame or judgment. Topics include testing kits, overdose prevention, and community care.',
    date: '2025-11-20',
    duration: '2h',
    durationSeconds: 7200,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    audioUrl: 'https://listen.radioking.com/radio/736103/stream/802454',
  },
};

export function RadioEpisodeDetail({ slug, onNavigate }: RadioEpisodeDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const episode = episodeData[slug];

  if (!episode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Episode not found</h2>
          <button
            onClick={() => onNavigate('radioSchedule')}
            className="text-red-500 hover:underline"
          >
            Back to Schedule
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: episode.title,
        text: episode.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative border-b border-red-500/30 px-6 md:px-16 lg:px-24 py-12 md:py-16">
        <button
          onClick={() => onNavigate('radioShow', { slug: episode.showSlug })}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to {episode.show}</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Album Art */}
          <motion.div
            className="aspect-square w-full max-w-lg rounded-lg overflow-hidden bg-zinc-900"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ImageWithFallback
              src={episode.image}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Episode Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-red-500 uppercase text-sm tracking-wider font-bold mb-3">
              {episode.show}
            </p>

            <h1 className="text-5xl md:text-6xl text-white font-black uppercase tracking-tighter mb-6">
              {episode.title}
            </h1>

            <div className="flex items-center gap-4 text-zinc-400 mb-6">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {episode.duration}
              </span>
              <span>·</span>
              <span>{new Date(episode.date).toLocaleDateString('en-GB', { 
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>

            <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
              {episode.description}
            </p>

            {/* Player Controls */}
            <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-6 mb-6">
                <button className="text-zinc-400 hover:text-white transition-colors">
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center transition-all shadow-lg shadow-red-500/50"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" fill="white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  )}
                </button>

                <button className="text-zinc-400 hover:text-white transition-colors">
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all"
                    style={{ width: `${(currentTime / episode.durationSeconds) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{episode.duration}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="flex-1 px-6 py-3 bg-zinc-900 border border-red-500/30 hover:border-red-500/50 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button className="flex-1 px-6 py-3 bg-zinc-900 border border-red-500/30 hover:border-red-500/50 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-all">
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracklist (if available) */}
      {episode.tracklist && (
        <section className="px-6 md:px-16 lg:px-24 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white font-black uppercase tracking-tighter mb-8">
              Tracklist
            </h2>

            <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg divide-y divide-red-500/10">
              {episode.tracklist.map((track: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    // In production: seek to track time
                    console.log('Seek to', track.time);
                  }}
                  className="w-full text-left p-4 hover:bg-red-500/5 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-red-500 font-mono text-sm min-w-[60px]">
                      {track.time}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-bold group-hover:text-red-500 transition-colors">
                        {track.track}
                      </p>
                      <p className="text-zinc-400 text-sm">{track.artist}</p>
                    </div>
                    <Play className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* More Episodes */}
      <section className="px-6 md:px-16 lg:px-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-white font-black uppercase tracking-tighter mb-8">
            More from {episode.show}
          </h2>

          <button
            onClick={() => onNavigate('radioShow', { slug: episode.showSlug })}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30"
          >
            View All Episodes
          </button>
        </motion.div>
      </section>

      {/* Hidden audio element for actual playback */}
      <audio
        src={episode.audioUrl}
        onTimeUpdate={(e) => setCurrentTime(Math.floor((e.target as HTMLAudioElement).currentTime))}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
