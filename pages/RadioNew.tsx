// HOTMESS LONDON - Radio Landing Page (Complete)
// Live streaming, schedule, DJ profiles, podcast archive, and chat

import { useState } from 'react';
import { Play, Pause, Radio as RadioIcon, Calendar, Clock, Users, Headphones, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { LiveChat } from '../components/radio/LiveChat';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useRadio } from '../contexts/RadioContext';
import { LiveListeners } from '../components/LiveListeners';
import { RadioStats } from '../components/RadioStats';
import { RadioNowPlayingBar } from '../components/RadioNowPlayingBar';
import { useRadioStatus } from '../hooks/useRadioStatus';
import { useRadioXP } from '../hooks/useRadioXP';

interface RadioNewProps {
  onNavigate: (page: string) => void;
}

export function RadioNew({ onNavigate }: RadioNewProps) {
  const [showChat, setShowChat] = useState(false);
  
  // Get radio state from global context
  const { nowPlaying, currentShow, stats, play, expand, isPlaying } = useRadio();
  
  // Live RadioKing data
  const { data: radioStatus, loading: radioLoading } = useRadioStatus();
  
  // XP rewards for listening
  const { startTracking, stopTracking, isTracking, listenDuration, xpAwarded } = useRadioXP();

  const upcomingShows = [
    {
      id: 1,
      slug: 'wake-the-mess',
      name: 'Wake the Mess',
      time: '06:00 - 09:00',
      days: 'Mon - Fri',
      description: 'Morning growl. Coffee, sweat, sin remnants from the night before.',
      host: 'DJ Dominik',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
      live: false,
    },
    {
      id: 2,
      slug: 'dial-a-daddy',
      name: 'Dial-A-Daddy',
      time: '14:00 - 16:00',
      days: 'Tue, Thu, Sat',
      description: 'You call. He answers. Advice you didn\'t know you needed, from men who\'ve lived it.',
      host: 'Marcus & Friends',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
      live: false,
    },
    {
      id: 3,
      slug: 'hand-n-hand-sunday',
      name: 'Hand N Hand — Sunday',
      time: '20:00 - 22:00',
      days: 'Sunday',
      description: 'Care without the lecture. You\'re not alone. You\'re just on the wrong frequency. Tune in. Stay held.',
      host: 'Care Team',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
      live: false,
      special: true,
    },
    {
      id: 4,
      slug: 'nightbody-mixes',
      name: 'Nightbody Mixes',
      time: '22:00 - 02:00',
      days: 'Daily',
      description: 'Sweaty silhouettes in sound form.',
      host: 'Various DJs',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400',
      live: true,
    },
  ];

  const recentEpisodes = [
    {
      id: 1,
      slug: 'nightbody-001',
      title: 'Nightbody Mixes #001',
      description: 'Deep house & tech from the underground',
      date: '2025-11-27',
      duration: '2h 15m',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300',
    },
    {
      id: 2,
      slug: 'wake-mess-special',
      title: 'Wake the Mess: Pride Special',
      description: 'Anthems that shaped us',
      date: '2025-11-25',
      duration: '3h',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300',
    },
    {
      id: 3,
      slug: 'dial-daddy-112',
      title: 'Dial-A-Daddy: Coming Out Stories',
      description: 'Real talk from real men',
      date: '2025-11-23',
      duration: '1h 45m',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero with Live Player */}
      <section className="relative min-h-[80vh] overflow-hidden border-b border-red-500/30">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2400"
            alt="HOTMESS Radio"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 py-16 md:py-24">
          {/* Live Badge */}
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
            <span className="text-red-500 uppercase text-sm tracking-widest font-bold">
              Live Now
            </span>
            {stats && stats.listeners > 0 && (
              <motion.div 
                className="flex items-center gap-2 text-zinc-400 text-sm ml-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-4 h-4" />
                <span>{stats.listeners} listening live</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </motion.div>
            )}
          </motion.div>

          <motion.h1 
            className="text-7xl md:text-9xl lg:text-[180px] uppercase tracking-tighter leading-[0.85] text-white mb-6 font-black"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            RADIO
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-zinc-300 max-w-3xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            24/7. Sweat, bass, and brotherhood. <span className="text-red-500 font-bold">Always too much.</span>
          </motion.p>

          {/* Now Playing */}
          {nowPlaying && (
            <motion.div 
              className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-lg p-6 max-w-2xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <RadioIcon className="w-4 h-4" />
                <span>Now Playing</span>
              </div>
              <h3 className="text-2xl text-white font-bold mb-1">{nowPlaying.title}</h3>
              <p className="text-lg text-zinc-400">{nowPlaying.artist}</p>
              {currentShow && (
                <p className="text-sm text-red-500 mt-3">{currentShow.name}</p>
              )}
            </motion.div>
          )}

          {/* Player Controls */}
          <motion.div 
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={async () => {
                if (!isPlaying) {
                  await play();
                }
                expand();
              }}
              className="h-16 px-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center gap-3 transition-all duration-200 shadow-lg shadow-red-500/50"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" fill="white" />
              ) : (
                <Play className="w-6 h-6 text-white" fill="white" />
              )}
              <span className="text-white font-bold uppercase tracking-wider">
                {isPlaying ? 'Now Playing' : 'Listen Live'}
              </span>
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="h-16 px-6 rounded-full bg-zinc-900 border border-red-500/30 hover:border-red-500/50 flex items-center gap-3 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-red-500" />
              <span className="text-white font-bold">Live Chat</span>
            </button>

            <button
              onClick={() => onNavigate('radioSchedule')}
              className="h-16 px-6 rounded-full bg-zinc-900 border border-red-500/30 hover:border-red-500/50 flex items-center gap-3 transition-all"
            >
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="text-white font-bold">Full Schedule</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Live Listeners Badge */}
      {radioStatus && radioStatus.listeners > 0 && (
        <LiveListeners listeners={radioStatus.listeners} position="top-right" />
      )}

      <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24">
        {/* Radio Stats */}
        {radioStatus && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RadioStats status={radioStatus} />
            
            {/* XP Status */}
            {isTracking && xpAwarded > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 px-4 py-3 bg-[#ff1694]/20 border border-[#ff1694]/40 rounded-xl text-sm text-white flex items-center justify-between"
              >
                <span>+{xpAwarded} XP earned from listening</span>
                {listenDuration > 0 && (
                  <span className="text-[#ff1694]">{Math.floor(listenDuration / 60)} min listened</span>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Upcoming Shows */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl uppercase tracking-tighter text-white mb-12 font-black">
            This Week
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingShows.map((show) => (
              <motion.button
                key={show.id}
                onClick={() => onNavigate('radioShow', { slug: show.slug })}
                className="group text-left bg-zinc-900/50 border border-red-500/30 hover:border-red-500 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <ImageWithFallback
                    src={show.image}
                    alt={show.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {show.live && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs uppercase tracking-wider font-bold animate-pulse">
                      Live
                    </div>
                  )}
                  {show.special && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-pink-600 text-white text-xs uppercase tracking-wider font-bold">
                      Care Show
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-red-500 transition-colors">
                    {show.name}
                  </h3>
                  <p className="text-zinc-400 mb-4 line-clamp-2">
                    {show.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {show.time}
                    </span>
                    <span>{show.days}</span>
                  </div>
                  <p className="text-sm text-red-500 mt-3">Hosted by {show.host}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Episodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl md:text-7xl uppercase tracking-tighter text-white font-black">
              Listen Back
            </h2>
            <button
              onClick={() => onNavigate('radioSchedule')}
              className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"
            >
              <span className="font-bold">All Episodes</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {recentEpisodes.map((episode) => (
              <motion.button
                key={episode.id}
                onClick={() => onNavigate('radioEpisode', { slug: episode.slug })}
                className="group text-left bg-zinc-900/50 border border-red-500/30 hover:border-red-500 rounded-lg overflow-hidden transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback
                    src={episode.image}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" fill="white" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg text-white font-bold mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                    {episode.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{new Date(episode.date).toLocaleDateString()}</span>
                    <span>{episode.duration}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Submit a Show CTA */}
        <motion.div
          className="mt-24 p-12 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Headphones className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h3 className="text-3xl md:text-5xl text-white font-black uppercase tracking-tighter mb-4">
            Got a Show Idea?
          </h3>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            HOTMESS Radio is always looking for new voices. Submit your show pitch and join the lineup.
          </p>
          <button
            onClick={() => onNavigate('radioSchedule')}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30"
          >
            Submit Your Show
          </button>
        </motion.div>
      </div>

      {/* Live Chat Sidebar */}
      {showChat && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-black/95 border-l border-red-500/30 backdrop-blur-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-red-500/30">
            <h3 className="text-white font-bold">Live Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <LiveChat className="flex-1 flex flex-col" />
        </div>
      )}

      {/* Now Playing Bar (Sticky Bottom) */}
      {radioStatus && (
        <RadioNowPlayingBar 
          status={radioStatus}
          isPlaying={isPlaying}
          onTogglePlay={() => {
            if (!isPlaying) {
              startTracking(); // Start XP tracking when play starts
            } else {
              stopTracking(); // Stop XP tracking when paused
            }
            play(); // Toggle play from RadioContext
          }}
          streamUrl="https://listen.radioking.com/radio/xxxxx/radio.mp3"
        />
      )}
    </div>
  );
}
