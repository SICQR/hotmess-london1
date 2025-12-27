// HOTMESS LONDON - Radio Show Detail Page
// Individual show page with host profile, schedule, and episodes

import { useState } from 'react';
import { ChevronLeft, Play, Clock, Calendar, Users, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { RadioPlayer } from '../components/radio/RadioPlayer';
import { LiveChat } from '../components/radio/LiveChat';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SaveButton } from '../components/SaveButton';
import type { NavFunction } from '../lib/routes';

interface RadioShowDetailProps {
  slug: string;
  onNavigate: NavFunction;
}

// Mock show data - in production this would come from the API
const showData: Record<string, any> = {
  'wake-the-mess': {
    name: 'Wake the Mess',
    tagline: 'Morning growl. Coffee, sweat, sin remnants from the night before.',
    description: 'Start your day the HOTMESS way. No small talk, no fake energy—just raw morning realness with beats that wake you up without apology. We play what you actually want to hear at 6am: the tracks that sound like last night\'s mistakes and tomorrow\'s possibilities.',
    schedule: 'Monday - Friday, 06:00 - 09:00 GMT',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    host: {
      name: 'DJ Dominik',
      bio: '15 years deep in underground club culture. Started in Berlin basements, now bringing that energy to your morning routine. Early riser by necessity, night owl by nature.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      socials: {
        instagram: '@djdominik',
        soundcloud: 'djdominik',
      },
    },
    episodes: [
      {
        id: 1,
        slug: 'wake-mess-nov29',
        title: 'Friday Feeling',
        date: '2025-11-29',
        duration: '3h',
        description: 'End of week energy with deep house and tech',
      },
      {
        id: 2,
        slug: 'wake-mess-nov28',
        title: 'Thursday Throwback',
        date: '2025-11-28',
        duration: '3h',
        description: 'Classic club anthems from the 2010s',
      },
      {
        id: 3,
        slug: 'wake-mess-nov27',
        title: 'Midweek Motivation',
        date: '2025-11-27',
        duration: '3h',
        description: 'Energetic beats to power through Wednesday',
      },
    ],
    isLive: false,
  },
  'dial-a-daddy': {
    name: 'Dial-A-Daddy',
    tagline: 'You call. He answers. Advice you didn\'t know you needed.',
    description: 'Call-in show where experienced queer men share wisdom, war stories, and real talk. No judgment, no sugar-coating. Questions about dating, sex, career, coming out, staying sane—anything goes. Sometimes funny, sometimes heavy, always honest.',
    schedule: 'Tuesday, Thursday, Saturday, 14:00 - 16:00 GMT',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    host: {
      name: 'Marcus & Friends',
      bio: 'Rotating panel of queer mentors, all 35+, all with stories to tell. Marcus anchors the show—therapist by training, troublemaker by choice. Joined by different guests each week.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      socials: {
        instagram: '@dialadaddyshow',
      },
    },
    episodes: [
      {
        id: 1,
        slug: 'dial-daddy-112',
        title: 'Coming Out Stories',
        date: '2025-11-23',
        duration: '2h',
        description: 'Listeners share their coming out experiences',
      },
      {
        id: 2,
        slug: 'dial-daddy-111',
        title: 'Dating Apps: Help or Hell?',
        date: '2025-11-21',
        duration: '2h',
        description: 'Real talk about modern dating',
      },
    ],
    isLive: false,
  },
  'hand-n-hand': {
    name: 'Hand N Hand — Sunday',
    tagline: 'Care without the lecture. You\'re not alone.',
    description: 'Sunday night care programming. Harm reduction, mental health, sexual health, and community support—with none of the shame. Hosted by trained peer educators and care workers. We talk about what actually keeps us safe and held.',
    schedule: 'Sunday, 20:00 - 22:00 GMT',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    host: {
      name: 'HOTMESS Care Team',
      bio: 'Rotating hosts from our care team—peer support workers, harm reduction specialists, sexual health educators. All with lived experience in queer nightlife.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    episodes: [
      {
        id: 1,
        slug: 'hand-n-hand-ep5',
        title: 'Harm Reduction Basics',
        date: '2025-11-20',
        duration: '2h',
        description: 'Safe use, testing, and looking out for each other',
      },
      {
        id: 2,
        slug: 'hand-n-hand-ep4',
        title: 'Mental Health & Party Culture',
        date: '2025-11-13',
        duration: '2h',
        description: 'Finding balance between celebration and self-care',
      },
    ],
    isLive: false,
    special: true,
  },
  'nightbody-mixes': {
    name: 'Nightbody Mixes',
    tagline: 'Sweaty silhouettes in sound form.',
    description: 'Deep, dark, and driving. The soundtrack to your night moves. Guest DJ sets and resident mixes that capture the heat of the dancefloor. House, tech, minimal, and everything that makes bodies move.',
    schedule: 'Daily, 22:00 - 02:00 GMT',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800',
    host: {
      name: 'Various DJs',
      bio: 'Rotating lineup of underground selectors from London and beyond. Residents include DJ Hex, Marla, and Tommy Fingers.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    },
    episodes: [
      {
        id: 1,
        slug: 'nightbody-001',
        title: 'Nightbody Mixes #001',
        date: '2025-11-27',
        duration: '4h',
        description: 'Deep house & tech from the underground',
      },
      {
        id: 2,
        slug: 'nightbody-guest-marla',
        title: 'Guest: Marla',
        date: '2025-11-25',
        duration: '4h',
        description: 'Berlin-based selector brings the heat',
      },
    ],
    isLive: true,
  },
};

export function RadioShowDetail({ slug, onNavigate }: RadioShowDetailProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const show = showData[slug];

  if (!show) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Show not found</h2>
          <button
            onClick={() => onNavigate('radio')}
            className="text-red-500 hover:underline"
          >
            Back to Radio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative min-h-[60vh] border-b border-red-500/30">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={show.image}
            alt={show.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <button
            onClick={() => onNavigate('radioSchedule')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Schedule</span>
          </button>

          {show.isLive && (
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 uppercase text-sm tracking-wider font-bold">Live Now</span>
            </motion.div>
          )}

          {show.special && (
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="px-3 py-1 bg-pink-600 text-white text-xs uppercase tracking-wider font-bold">
                Care Show
              </span>
            </motion.div>
          )}

          <motion.h1 
            className="text-6xl md:text-8xl uppercase tracking-tighter text-white font-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {show.name}
          </motion.h1>

          <motion.p 
            className="text-2xl text-zinc-300 mb-6 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {show.tagline}
          </motion.p>

          <motion.div 
            className="flex items-center gap-2 text-zinc-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Calendar className="w-5 h-5" />
            <span>{show.schedule}</span>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {show.isLive && (
              <button
                onClick={() => setShowPlayer(true)}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
              >
                <Play className="w-5 h-5" fill="white" />
                Listen Live
              </button>
            )}

            <button
              onClick={() => setShowChat(!showChat)}
              className="px-8 py-4 bg-zinc-900 border border-red-500/30 hover:border-red-500/50 rounded-full text-white font-bold transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join Discussion
            </button>

            <SaveButton
              contentType="show"
              contentId={slug}
              metadata={{
                title: show.name,
                description: show.tagline,
                image: show.image,
                schedule: show.schedule
              }}
              size="lg"
              showLabel={true}
            />
          </motion.div>
        </div>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-16">
        {/* About the Show */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-white font-black uppercase tracking-tighter mb-6">
            About the Show
          </h2>
          <p className="text-lg text-zinc-300 leading-relaxed max-w-4xl">
            {show.description}
          </p>
        </motion.div>

        {/* Host Profile */}
        <motion.div
          className="mb-16 bg-zinc-900/50 border border-red-500/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-white font-black uppercase tracking-tighter mb-8">
            Your Host
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={show.host.image}
                alt={show.host.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-3xl text-white font-bold mb-4">{show.host.name}</h3>
              <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                {show.host.bio}
              </p>

              {show.host.socials && (
                <div className="flex gap-4">
                  {show.host.socials.instagram && (
                    <a
                      href={`https://instagram.com/${show.host.socials.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {show.host.socials.instagram}
                    </a>
                  )}
                  {show.host.socials.soundcloud && (
                    <a
                      href={`https://soundcloud.com/${show.host.socials.soundcloud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      SoundCloud
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Episodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-white font-black uppercase tracking-tighter mb-8">
            Recent Episodes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {show.episodes.map((episode: any) => (
              <motion.button
                key={episode.id}
                onClick={() => onNavigate('radioEpisode', { slug: episode.slug })}
                className="group text-left bg-zinc-900/50 border border-red-500/30 hover:border-red-500 rounded-lg p-6 transition-all"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center gap-2 text-red-500 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(episode.date).toLocaleDateString()}</span>
                  <span className="text-zinc-600">·</span>
                  <span>{episode.duration}</span>
                </div>

                <h3 className="text-xl text-white font-bold mb-2 group-hover:text-red-500 transition-colors">
                  {episode.title}
                </h3>
                
                <p className="text-zinc-400 mb-4">
                  {episode.description}
                </p>

                <div className="flex items-center gap-2 text-red-500">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-bold">Listen</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Player Modal */}
      {showPlayer && (
        <RadioPlayer onClose={() => setShowPlayer(false)} expanded={true} />
      )}

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-black/95 border-l border-red-500/30 backdrop-blur-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-red-500/30">
            <h3 className="text-white font-bold">{show.name} Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <LiveChat showId={slug} className="flex-1 flex flex-col" />
        </div>
      )}
    </div>
  );
}
