/**
 * ABOUT PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Heart, Users, Zap, Radio, Shield, Target } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 md:py-32 text-center border-b border-hot/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 glow-text">HOTMESS LONDON</h1>
          <p className="text-2xl md:text-3xl text-heat italic mb-6">
            Always too much, never enough.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            HOTMESS is a complete masculine nightlife OS for queer men 18+ that combines care-first 
            principles with kink aesthetics. Built for the guys who don't scare easy.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Target size={64} className="mx-auto mb-6 text-hot" />
            <h2 className="mb-6 text-3xl md:text-4xl text-hot uppercase tracking-wider">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              To build a care-first nightlife ecosystem where queer men can be held, not just fucked. 
              Where showing up gets rewarded. Where the brotherhood looks after its own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <Heart size={48} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-3 text-white uppercase tracking-wider">Care First</h4>
              <p className="text-gray-400 text-sm">
                No cruelty. No shame. Just resources, real talk, and support.
              </p>
            </div>
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-3 text-white uppercase tracking-wider">Brotherhood</h4>
              <p className="text-gray-400 text-sm">
                Built by and for the community. Peer-led. Authentic.
              </p>
            </div>
            <div className="text-center">
              <Zap size={48} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-3 text-white uppercase tracking-wider">Rewarding</h4>
              <p className="text-gray-400 text-sm">
                Show up. Earn XP. Unlock rewards. The night reacts to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl md:text-4xl text-hot uppercase tracking-wider text-center">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Beacon System */}
            <div className="p-8 bg-black/50 border border-hot/30">
              <div className="flex items-center gap-4 mb-4">
                <Zap size={32} className="text-hot" />
                <h3 className="text-xl text-white uppercase tracking-wider">Beacon System</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Scan QR beacons at partner venues and events across London. Earn XP. Track heat maps. 
                The city becomes a game. The night reacts.
              </p>
            </div>

            {/* Radio */}
            <div className="p-8 bg-black/50 border border-hot/30">
              <div className="flex items-center gap-4 mb-4">
                <Radio size={32} className="text-hot" />
                <h3 className="text-xl text-white uppercase tracking-wider">24/7 Radio</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                HOTMESS Radio runs around the clock. Bass-heavy mixes, care-first shows, and live sets 
                from the brotherhood. Stay loud. Stay held.
              </p>
            </div>

            {/* Marketplace */}
            <div className="p-8 bg-black/50 border border-hot/30">
              <div className="flex items-center gap-4 mb-4">
                <Shield size={32} className="text-hot" />
                <h3 className="text-xl text-white uppercase tracking-wider">Marketplace</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                RAW. HUNG. HIGH. Shop gear from vetted vendors. Earn XP with every purchase. 
                Care-first commerce for the community.
              </p>
            </div>

            {/* Hand N Hand */}
            <div className="p-8 bg-black/50 border border-hot/30">
              <div className="flex items-center gap-4 mb-4">
                <Heart size={32} className="text-hot" />
                <h3 className="text-xl text-white uppercase tracking-wider">Hand N Hand</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Mental health resources, sexual health info, substance support, and peer-led care shows. 
                No lectures. Just support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-12 text-3xl md:text-4xl text-hot uppercase tracking-wider text-center">
            Our Values
          </h2>

          <div className="space-y-8">
            <div className="p-6 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider">Care Dressed as Kink</h4>
              <p className="text-gray-300">
                We speak the language of nightlife—bold, masc, unapologetic—while centering care, 
                consent, and community support.
              </p>
            </div>

            <div className="p-6 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider">No Cruelty</h4>
              <p className="text-gray-300">
                Masculine doesn't mean cruel. We're grounded, direct, and real—but never mean. 
                The brotherhood holds each other up.
              </p>
            </div>

            <div className="p-6 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider">Survivors & Sinners Alike</h4>
              <p className="text-gray-300">
                HOTMESS is for everyone who shows up. No judgment. No gatekeeping. Just space to be 
                yourself—messy, hungry, healing, or all three.
              </p>
            </div>

            <div className="p-6 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider">Community Owned</h4>
              <p className="text-gray-300">
                Built by the community, for the community. Your feedback shapes what we build. 
                This is our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team (Optional) */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-3xl md:text-4xl text-hot uppercase tracking-wider">
            Built by the Brotherhood
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            HOTMESS is a community-led project. No VCs. No algorithms. Just queer men building 
            the nightlife OS we deserve.
          </p>
          <HMButton variant="secondary" onClick={() => onNavigate('community')}>
            Join the Community
          </HMButton>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-6 text-2xl text-hot uppercase tracking-wider">
            Get In Touch
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>General: hello@hotmesslondon.com</p>
            <p>Press: press@hotmesslondon.com</p>
            <p>Partnerships: partners@hotmesslondon.com</p>
            <p>Support: support@hotmesslondon.com</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <HMButton variant="tertiary" size="sm">
              Instagram
            </HMButton>
            <HMButton variant="tertiary" size="sm">
              Twitter
            </HMButton>
            <HMButton variant="tertiary" size="sm">
              Discord
            </HMButton>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-hot/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="mb-4 text-3xl text-hot uppercase tracking-wider">
            Ready to Join?
          </h3>
          <p className="text-xl text-gray-300 mb-8 italic">
            The brotherhood is waiting.
          </p>
          <HMButton variant="primary" size="lg" onClick={() => onNavigate('home')}>
            Enter HOTMESS
          </HMButton>
        </div>
      </section>
    </div>
  );
}
