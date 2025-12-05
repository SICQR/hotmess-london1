import { Heart, Users, Target, Award, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface AboutProps {
  onNavigate: (route: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const team = [
    { name: 'Marcus Chen', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400' },
    { name: 'Javier Rodriguez', role: 'Head of Care & Safety', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { name: 'Kai Thompson', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { name: 'Diego Martinez', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Care-First',
      description: 'Every feature, every interaction designed with your wellbeing at the center. Aftercare isn\'t optional—it\'s foundational.'
    },
    {
      icon: Users,
      title: 'Men-Only, 18+',
      description: 'A deliberate space for adult queer men to connect, explore, and exist without apology or explanation.'
    },
    {
      icon: Target,
      title: 'Kink-Positive',
      description: 'From leather to lube, we celebrate the full spectrum of masculine desire with honesty and respect.'
    },
    {
      icon: Award,
      title: 'London-Rooted',
      description: 'Born in the clubs, saunas, and backrooms of London. Built for a global community that shares our values.'
    },
  ];

  const milestones = [
    { year: '2023', event: 'HOTMESS founded in Vauxhall' },
    { year: '2024', event: 'P2P ticketing launched' },
    { year: '2024', event: 'MessMarket opens for sellers' },
    { year: '2025', event: 'Records label debut' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1556035511-3168381ea4d4?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-16">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.85] mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ABOUT<br />HOTMESS
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We're not trying to be everyone's platform.<br />
            We're here for <span className="text-hotmess-red">queer men 18+</span> who deserve better.
          </motion.p>
        </div>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-24">
        {/* Mission Statement */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h2 className="text-4xl md:text-5xl mb-8 uppercase">Our Mission</h2>
            <div className="space-y-6 text-xl text-zinc-300 leading-relaxed">
              <p>
                HOTMESS LONDON exists to create a <strong className="text-white">masculine nightlife operating system</strong> that
                combines radical care with unapologetic kink aesthetics.
              </p>
              <p>
                We're building infrastructure for queer men to <strong className="text-hotmess-red">connect, party, trade, listen, and grow</strong>—without
                sacrificing safety, consent, or community standards.
              </p>
              <p>
                From P2P event tickets to marketplace gear, from radio shows to music releases,
                every feature is designed with <strong className="text-white">care-first principles</strong> baked in from day one.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 bg-zinc-900 border border-hotmess-red/20 hover:border-hotmess-red/50 transition-colors"
                >
                  <Icon className="w-12 h-12 text-hotmess-red mb-4" />
                  <h3 className="text-2xl mb-3">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-center gap-8 p-6 bg-zinc-900/50 border-l-4 border-hotmess-red"
              >
                <div className="text-4xl text-hotmess-red min-w-[100px]" style={{ fontWeight: 900 }}>
                  {milestone.year}
                </div>
                <div className="text-xl text-white">{milestone.event}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-square mb-4 overflow-hidden bg-zinc-900 border-2 border-transparent group-hover:border-hotmess-red transition-all">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h4 className="text-xl mb-1">{member.name}</h4>
                <p className="text-sm text-zinc-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-12 bg-gradient-to-br from-hotmess-red/20 to-black border-2 border-hotmess-red text-center">
          <h3 className="text-3xl mb-4">Want to Work With Us?</h3>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            We're always looking for partners, sponsors, and collaborators who share our values.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('?route=affiliate')}
              className="px-8 py-4 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              Affiliate Program
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('?route=care')}
              className="px-8 py-4 bg-white text-black hover:bg-zinc-200 transition-colors uppercase tracking-wider"
            >
              Learn About Care
            </button>
          </div>
        </section>

        {/* Legal Links */}
        <section className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 justify-center text-sm text-zinc-500">
            <button onClick={() => onNavigate('?route=legalPrivacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('?route=legalTerms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('?route=accessibility')} className="hover:text-white transition-colors">
              Accessibility
            </button>
            <button onClick={() => onNavigate('?route=dataPrivacy')} className="hover:text-white transition-colors">
              Data & Privacy
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
