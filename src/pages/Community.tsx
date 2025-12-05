import { Shield, AlertTriangle, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CommunityProps {
  onNavigate: (page: string) => void;
}

export function Community({ onNavigate }: CommunityProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Hero */}
      <section className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000"
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
            <Users size={32} className="text-hot" />
            <span className="text-hot uppercase text-sm tracking-wider" style={{ fontWeight: 700 }}>
              The Brotherhood
            </span>
          </motion.div>

          <motion.h1 
            className="text-[96px] md:text-[180px] uppercase tracking-[-0.04em] leading-[0.85] text-white mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            COMMUNITY
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-hot">Respect is the only real kink.</span> Break that, and you're out.
          </motion.p>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-24 py-24">
        {/* Guidelines */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl uppercase tracking-[-0.03em] text-white mb-12" style={{ fontWeight: 900 }}>
            Guidelines
          </h2>
          
          <div className="space-y-6">
            {[
              {
                icon: Shield,
                title: 'Consent first.',
                desc: 'Always. No exceptions. It\'s not a mood — it\'s a muscle. Work it out before anything else.'
              },
              {
                icon: AlertTriangle,
                title: 'No racism, misogyny, or phobia of any flavour.',
                desc: 'We\'re building something better. Leave that shit at the door.'
              },
              {
                icon: Shield,
                title: 'No doxxing.',
                desc: 'Privacy is sacred. What happens in the Mess stays in the Mess.'
              },
              {
                icon: Heart,
                title: 'No glamorising harmful use.',
                desc: 'We\'re honest about what happens. But we don\'t celebrate harm. Care comes first.'
              },
              {
                icon: Shield,
                title: 'No shame-based behaviour.',
                desc: 'We lift each other up. Judgement stays outside.'
              },
              {
                icon: Shield,
                title: 'Gear is fine. Disrespect isn\'t.',
                desc: 'Express yourself. But never at someone else\'s expense.'
              },
            ].map((guideline, i) => (
              <motion.div 
                key={i}
                className="p-8 bg-black border-l-4 border-hot hover:bg-hot/5 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  <guideline.icon className="text-hot flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="text-white text-2xl mb-3" style={{ fontWeight: 700 }}>
                      {guideline.title}
                    </h3>
                    <p className="text-white/60 text-lg">
                      {guideline.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Report Section */}
        <motion.div 
          className="mb-24 p-12 bg-orange-950/20 border-2 border-orange-600"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-6">
            <AlertTriangle className="text-orange-400 flex-shrink-0" size={48} />
            <div>
              <h3 className="text-4xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-4" style={{ fontWeight: 900 }}>
                If someone crosses a line
              </h3>
              <p className="text-xl text-white/80 mb-8">
                We don't tolerate cruelty. Report it and we'll handle it.
                <br />
                <span className="text-orange-400">You're not snitching — you're protecting the brotherhood.</span>
              </p>
              <button 
                onClick={() => onNavigate('abuseReporting')}
                className="h-14 px-8 bg-orange-600 hover:bg-orange-700 transition-colors uppercase tracking-wider" 
                style={{ fontWeight: 700 }}
              >
                Report an Issue
              </button>
            </div>
          </div>
        </motion.div>

        {/* Create Post CTA */}
        <motion.div
          className="mb-24 p-12 bg-hot/10 border-2 border-hot"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-6">
            <Users className="text-hot flex-shrink-0" size={48} />
            <div className="flex-1">
              <h3 className="text-4xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-4" style={{ fontWeight: 900 }}>
                Start the conversation
              </h3>
              <p className="text-xl text-white/80 mb-8">
                Share your story. Set the tone. Keep it kind, keep it real.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onNavigate('communityNew')}
                  className="h-14 px-8 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider" 
                  style={{ fontWeight: 900 }}
                >
                  Create Post
                </button>
                <button 
                  onClick={() => onNavigate('ugcModeration')}
                  className="h-14 px-8 border border-white/20 hover:border-hot text-white transition-all uppercase tracking-wider" 
                  style={{ fontWeight: 700 }}
                >
                  Read Rules
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl uppercase tracking-[-0.03em] text-white mb-12" style={{ fontWeight: 900 }}>
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Stay Loud',
                desc: 'Be present. Be yourself. Take up space unapologetically.'
              },
              {
                title: 'Stay Held',
                desc: 'Look after each other. We\'re all we\'ve got. And that\'s enough.'
              },
              {
                title: 'We Look After Our Own',
                desc: 'Brotherhood without bullshit. Care without lectures.'
              },
              {
                title: 'Care Dressed as Kink',
                desc: 'Heat and heart. Swagger and safety. Both. Always.'
              },
            ].map((value, i) => (
              <motion.div 
                key={i}
                className="p-8 bg-black border border-hot/30 hover:border-hot transition-all hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h4 className="text-hot text-2xl mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                  {value.title}
                </h4>
                <p className="text-white/60 text-lg">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}