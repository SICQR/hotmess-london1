import { Heart, Phone, MessageCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CareProps {
  onNavigate: (route: any, params?: any) => void;
}

const resources = [
  {
    title: 'Feeling wobbly?',
    description: 'Let\'s breathe together.',
    action: 'Grounding exercises',
  },
  {
    title: 'Need grounding?',
    description: 'Small steps. Slow voice. Present moment.',
    action: 'Calm techniques',
  },
  {
    title: 'Concerned about a mate?',
    description: 'You\'re not snitching — you\'re caring.',
    action: 'How to help',
  },
];

const emergencyContacts = [
  { name: 'Emergency Services', number: '999', description: 'Life-threatening emergency' },
  { name: 'NHS 111', number: '111', description: 'Urgent medical advice' },
  { name: 'Samaritans', number: '116 123', description: '24/7 listening service' },
  { name: 'Switchboard LGBT+', number: '0300 330 0630', description: 'Support & information' },
];

export function Care({ onNavigate }: CareProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Hero */}
      <section className="relative h-[70vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart size={32} className="text-pink-500" />
            <span className="text-pink-500 uppercase text-sm tracking-wider" style={{ fontWeight: 700 }}>
              Hand N Hand
            </span>
          </motion.div>

          <motion.h1 
            className="text-[96px] md:text-[180px] uppercase tracking-[-0.04em] leading-[0.85] text-white mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            CARE
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            No lectures. No sidelong looks. <span className="text-pink-500">Just men looking after men.</span>
          </motion.p>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-24 py-24">
        {/* Main Message */}
        <motion.div 
          className="mb-24 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-[-0.03em] text-white mb-8 leading-tight" style={{ fontWeight: 900 }}>
            The only place<br />to land.
          </h2>
          
          <div className="space-y-6 text-xl text-white/70">
            <p>
              If you're out, if you're slipping, if you're spinning — talk to us.
            </p>
            <p>
              We've been there. We're still here.
            </p>
            <p className="text-pink-500 text-2xl" style={{ fontWeight: 700 }}>
              And we don't let each other fall.
            </p>
          </div>
        </motion.div>

        {/* Care Resources */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Quick Support
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, i) => (
              <motion.div 
                key={i} 
                className="p-8 bg-black border border-pink-600/30 hover:border-pink-500 transition-all duration-300 cursor-pointer hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h4 className="mb-3 text-white text-xl" style={{ fontWeight: 700 }}>
                  {resource.title}
                </h4>
                <p className="mb-6 text-white/60">
                  {resource.description}
                </p>
                <button className="text-pink-500 hover:text-pink-400 uppercase tracking-wider flex items-center gap-2 transition-colors" style={{ fontWeight: 700 }}>
                  {resource.action}
                  <ExternalLink size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div 
          className="mb-24 p-12 bg-red-950/10 border-2 border-red-600"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-6 mb-12">
            <AlertCircle className="text-red-400 flex-shrink-0" size={48} />
            <div>
              <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-4" style={{ fontWeight: 900 }}>
                In Crisis?
              </h3>
              <p className="text-xl text-white/70">
                These numbers are always available. No shame in reaching out.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact, i) => (
              <motion.div 
                key={i} 
                className="p-6 bg-black border border-red-600/50 hover:border-red-400 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="mb-2 text-white text-xl" style={{ fontWeight: 700 }}>
                      {contact.name}
                    </h4>
                    <p className="text-white/60">{contact.description}</p>
                  </div>
                  <a
                    href={`tel:${contact.number.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-3 h-14 px-8 bg-red-600 hover:bg-red-700 transition-colors uppercase tracking-wider whitespace-nowrap"
                    style={{ fontWeight: 700 }}
                  >
                    <Phone size={20} />
                    {contact.number}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sunday Show Promo */}
        <motion.div 
          className="mb-24 relative h-[400px] overflow-hidden border border-purple-600"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center px-12">
            <MessageCircle className="text-purple-400 mb-6" size={48} />
            <h3 className="text-4xl md:text-6xl uppercase tracking-[-0.03em] text-white mb-4" style={{ fontWeight: 900 }}>
              Hand N Hand
            </h3>
            <p className="text-xl text-white/80 mb-6 max-w-2xl">
              Every Sunday, 20:00 - 22:00. Care without the lecture.
              <br />
              <span className="text-purple-400">You're not alone. You're just on the wrong frequency.</span>
            </p>
            <button
              onClick={() => onNavigate('radio')}
              className="h-14 px-8 bg-purple-600 hover:bg-purple-700 transition-colors uppercase tracking-wider w-fit"
              style={{ fontWeight: 700 }}
            >
              Tune In →
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="p-8 bg-black border border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="mb-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>
            Important
          </h4>
          <p className="text-white/40 leading-relaxed">
            <strong className="text-white/60">Aftercare means information & community — not medical advice.</strong>
            <br />
            We're here to support and connect, but we're not clinicians.
            Seek emergency help when needed. Always look after yourself and your mates.
          </p>
        </motion.div>
      </div>
    </div>
  );
}