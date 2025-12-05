// HOTMESS LONDON - Radio Schedule & Show Submission
// Weekly schedule grid, podcast archive, and booking form

import { useState } from 'react';
import { Calendar, Clock, Headphones, ChevronLeft, Play, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RadioScheduleNewProps {
  onNavigate: (page: string) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const schedule = {
  monday: [
    { time: '06:00', duration: 3, name: 'Wake the Mess', host: 'DJ Dominik', slug: 'wake-the-mess' },
    { time: '14:00', duration: 2, name: 'Afternoon Deep Cuts', host: 'Alex', slug: 'afternoon-deep' },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-mon' },
  ],
  tuesday: [
    { time: '06:00', duration: 3, name: 'Wake the Mess', host: 'DJ Dominik', slug: 'wake-the-mess' },
    { time: '14:00', duration: 2, name: 'Dial-A-Daddy', host: 'Marcus & Friends', slug: 'dial-a-daddy', special: true },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-tue' },
  ],
  wednesday: [
    { time: '06:00', duration: 3, name: 'Wake the Mess', host: 'DJ Dominik', slug: 'wake-the-mess' },
    { time: '14:00', duration: 2, name: 'Afternoon Deep Cuts', host: 'Alex', slug: 'afternoon-deep' },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-wed' },
  ],
  thursday: [
    { time: '06:00', duration: 3, name: 'Wake the Mess', host: 'DJ Dominik', slug: 'wake-the-mess' },
    { time: '14:00', duration: 2, name: 'Dial-A-Daddy', host: 'Marcus & Friends', slug: 'dial-a-daddy', special: true },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-thu' },
  ],
  friday: [
    { time: '06:00', duration: 3, name: 'Wake the Mess', host: 'DJ Dominik', slug: 'wake-the-mess' },
    { time: '18:00', duration: 3, name: 'Friday Night Warm-Up', host: 'DJ Rico', slug: 'friday-warmup' },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-fri' },
  ],
  saturday: [
    { time: '10:00', duration: 2, name: 'Weekend Recovery', host: 'Care Team', slug: 'weekend-recovery' },
    { time: '14:00', duration: 2, name: 'Dial-A-Daddy', host: 'Marcus & Friends', slug: 'dial-a-daddy', special: true },
    { time: '20:00', duration: 6, name: 'Saturday Night Sessions', host: 'Guest DJs', slug: 'sat-sessions' },
  ],
  sunday: [
    { time: '10:00', duration: 2, name: 'Sunday Morning Bliss', host: 'Various', slug: 'sunday-bliss' },
    { time: '20:00', duration: 2, name: 'Hand N Hand — Sunday', host: 'Care Team', slug: 'hand-n-hand', special: true, care: true },
    { time: '22:00', duration: 4, name: 'Nightbody Mixes', host: 'Various', slug: 'nightbody-sun' },
  ],
};

export function RadioScheduleNew({ onNavigate }: RadioScheduleNewProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    showTitle: '',
    description: '',
    format: '',
    experience: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    alert('Show submission received! We\'ll be in touch soon.');
    setShowSubmissionForm(false);
    setFormData({ name: '', email: '', showTitle: '', description: '', format: '', experience: '' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative border-b border-red-500/30 px-6 md:px-16 lg:px-24 py-12 md:py-16">
        <button
          onClick={() => onNavigate('radio')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Radio</span>
        </button>

        <h1 className="text-6xl md:text-8xl uppercase tracking-tighter text-white font-black mb-6">
          Schedule
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl">
          Weekly programming lineup. All times in GMT. 24/7 broadcast with live shows, DJ sets, and automated mixes.
        </p>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-16">
        {/* Weekly Schedule Grid */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid lg:grid-cols-7 gap-4">
            {weekDays.map((day, dayIndex) => {
              const dayKey = day.toLowerCase();
              const dayShows = schedule[dayKey as keyof typeof schedule] || [];
              
              return (
                <div key={day} className="bg-zinc-900/30 border border-red-500/30 rounded-lg overflow-hidden">
                  <div className="p-4 bg-zinc-900/50 border-b border-red-500/30">
                    <h3 className="text-white font-bold uppercase tracking-wider text-center">
                      {day.substring(0, 3)}
                    </h3>
                  </div>
                  
                  <div className="p-2 space-y-2 min-h-[400px]">
                    {dayShows.map((show, showIndex) => (
                      <motion.button
                        key={`${day}-${showIndex}`}
                        onClick={() => onNavigate('radioShow', { slug: show.slug })}
                        className={`w-full text-left p-3 rounded transition-all hover:scale-105 ${
                          show.care
                            ? 'bg-pink-600/20 border border-pink-600/50'
                            : show.special
                            ? 'bg-red-500/20 border border-red-500/50'
                            : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/50'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: dayIndex * 0.05 + showIndex * 0.05 }}
                      >
                        <div className="flex items-center gap-2 text-xs text-red-500 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{show.time}</span>
                          <span className="text-zinc-500">· {show.duration}h</span>
                        </div>
                        <h4 className="text-white text-sm font-bold mb-1 line-clamp-2">
                          {show.name}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">{show.host}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Episodes Archive */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl uppercase tracking-tighter text-white font-black mb-12">
            Podcast Archive
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                slug: 'nightbody-001',
                title: 'Nightbody Mixes #001',
                show: 'Nightbody Mixes',
                date: '2025-11-27',
                duration: '2h 15m',
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
              },
              {
                id: 2,
                slug: 'wake-mess-special',
                title: 'Wake the Mess: Pride Special',
                show: 'Wake the Mess',
                date: '2025-11-25',
                duration: '3h',
                image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
              },
              {
                id: 3,
                slug: 'dial-daddy-112',
                title: 'Coming Out Stories',
                show: 'Dial-A-Daddy',
                date: '2025-11-23',
                duration: '1h 45m',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
              },
              {
                id: 4,
                slug: 'hand-n-hand-ep5',
                title: 'Harm Reduction Basics',
                show: 'Hand N Hand',
                date: '2025-11-20',
                duration: '2h',
                image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400',
              },
              {
                id: 5,
                slug: 'friday-warmup-nov15',
                title: 'Friday Night Warm-Up',
                show: 'Friday Warm-Up',
                date: '2025-11-15',
                duration: '3h',
                image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
              },
              {
                id: 6,
                slug: 'sat-sessions-nov13',
                title: 'Guest: DJ Honey Dijon',
                show: 'Saturday Sessions',
                date: '2025-11-13',
                duration: '4h',
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
              },
            ].map((episode) => (
              <motion.button
                key={episode.id}
                onClick={() => onNavigate('radioEpisode', { slug: episode.slug })}
                className="group text-left bg-zinc-900/50 border border-red-500/30 hover:border-red-500 rounded-lg overflow-hidden transition-all"
                whileHover={{ scale: 1.03 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback
                    src={episode.image}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-16 h-16 text-white" fill="white" />
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-xs text-red-500 uppercase tracking-wider mb-2">{episode.show}</p>
                  <h3 className="text-lg text-white font-bold mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                    {episode.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{new Date(episode.date).toLocaleDateString()}</span>
                    <span>{episode.duration}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Submit a Show */}
        <motion.div
          className="p-12 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Headphones className="w-12 h-12 text-red-500 mb-6" />
          <h2 className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter mb-4">
            Submit Your Show
          </h2>
          <p className="text-lg text-zinc-300 max-w-3xl mb-8">
            Got a show idea? Want to host a slot? HOTMESS Radio is community-driven. 
            We're looking for DJs, hosts, educators, and storytellers who get what we're about: 
            care-first, kink-aware, and unapologetically queer.
          </p>

          {!showSubmissionForm ? (
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30"
            >
              Start Application
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2 font-bold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2 font-bold">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Show Title *</label>
                <input
                  type="text"
                  required
                  value={formData.showTitle}
                  onChange={(e) => setFormData({ ...formData, showTitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Show Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  placeholder="What's your show about? What makes it unique?"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Format *</label>
                <select
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select format...</option>
                  <option value="dj-mix">DJ Mix / Music</option>
                  <option value="talk">Talk / Discussion</option>
                  <option value="interview">Interview</option>
                  <option value="education">Education / Care</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  placeholder="Any prior radio/podcast/DJ experience? (Optional but helpful)"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Application
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(false)}
                  className="px-8 py-4 bg-zinc-900 border border-red-500/30 hover:border-red-500/50 rounded-full text-white font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
