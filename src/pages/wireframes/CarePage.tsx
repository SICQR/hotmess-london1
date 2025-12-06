/**
 * CARE (Hand N Hand) PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Heart, Phone, MessageCircle, MapPin, Clock, Radio } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMRadioShowCard } from '../../components/library/HMCard';

interface CarePageProps {
  onNavigate: (page: string) => void;
}

export function CarePage({ onNavigate }: CarePageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-4xl mx-auto text-center">
          <Heart size={64} className="mx-auto mb-6 text-hot" />
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Hand N Hand
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Care-first resources for the brotherhood. No lectures. No shame. Just support.
          </p>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="px-6 py-12 bg-hot/10 border-b border-hot/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="mb-6 text-xl text-hot uppercase tracking-wider text-center">
            Need Help Right Now?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:116123"
              className="p-6 bg-black/50 border-2 border-hot hover:bg-hot/20 transition-all text-center"
            >
              <Phone size={32} className="mx-auto mb-3 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Crisis Line</h4>
              <p className="text-2xl text-hot mb-1">116 123</p>
              <p className="text-xs text-gray-400">24/7 Samaritans</p>
            </a>
            <a
              href="tel:08001111"
              className="p-6 bg-black/50 border-2 border-hot hover:bg-hot/20 transition-all text-center"
            >
              <MessageCircle size={32} className="mx-auto mb-3 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Text Support</h4>
              <p className="text-2xl text-hot mb-1">SHOUT 85258</p>
              <p className="text-xs text-gray-400">Free 24/7 text line</p>
            </a>
            <a
              href="https://switchboard.lgbt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-black/50 border-2 border-hot hover:bg-hot/20 transition-all text-center"
            >
              <Heart size={32} className="mx-auto mb-3 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">LGBTQ+ Support</h4>
              <p className="text-2xl text-hot mb-1">0300 330 0630</p>
              <p className="text-xs text-gray-400">Switchboard LGBT+</p>
            </a>
          </div>
        </div>
      </section>

      {/* Care Resources Categories */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl text-hot uppercase tracking-wider">
            Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mental Health */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Mental Health</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Mind - Mental health charity
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Anxiety support groups
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Depression resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Therapy finder (London)
                  </a>
                </li>
              </ul>
            </div>

            {/* Sexual Health */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Sexual Health</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Free STI testing (London)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    PrEP access & info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    56 Dean Street clinic
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    HIV support services
                  </a>
                </li>
              </ul>
            </div>

            {/* Substance Use */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Substance Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Antidote (LGBTQ+ substance support)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Harm reduction info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Chemsex support groups
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Recovery pathways
                  </a>
                </li>
              </ul>
            </div>

            {/* Housing */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Housing</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Emergency accommodation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    LGBTQ+ housing services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Shelter UK
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Albert Kennedy Trust
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Support */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Legal Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Free legal advice
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Hate crime reporting
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Discrimination support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Galop (LGBTQ+ legal)
                  </a>
                </li>
              </ul>
            </div>

            {/* Community Support */}
            <div className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
              <h4 className="mb-4 text-white uppercase tracking-wider">Community</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Men's support groups
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Peer mentoring
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Social meetups
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-hot transition-colors">
                    Brotherhood circles
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Care Shows on Radio */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Radio size={32} className="text-hot" />
            <h2 className="text-2xl md:text-3xl text-hot uppercase tracking-wider">
              Care Shows
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <HMRadioShowCard
              name="Hand N Hand Sunday"
              host="Stewart Who?"
              time="Sundays, 2PM-4PM"
              live={false}
              description="Care-first radio. Aftercare, resources, real talk. No lectures."
            />
            <HMRadioShowCard
              name="Recovery Sessions"
              host="Various Hosts"
              time="Saturdays, 10AM-12PM"
              live={false}
              description="Peer-led discussions on healing, harm reduction, and hope."
            />
          </div>

          <div className="text-center">
            <HMButton variant="secondary" onClick={() => onNavigate('radio')}>
              Listen to Care Shows
            </HMButton>
          </div>
        </div>
      </section>

      {/* In-Person Support */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl text-hot uppercase tracking-wider">
            In-Person Support
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/50 border border-hot/30">
              <div className="flex items-start gap-4 mb-4">
                <MapPin size={24} className="text-hot flex-shrink-0" />
                <div>
                  <h4 className="text-white mb-2 uppercase tracking-wider">Monday Drop-In</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Peer support group for queer men. No booking needed. Free tea.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>Every Monday, 7PM-9PM</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Vauxhall Community Centre</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/50 border border-hot/30">
              <div className="flex items-start gap-4 mb-4">
                <MapPin size={24} className="text-hot flex-shrink-0" />
                <div>
                  <h4 className="text-white mb-2 uppercase tracking-wider">Aftercare Circle</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Post-event decompression. Quiet space. Peer support.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>After major events</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Location announced via app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethos */}
      <section className="px-6 py-16 bg-hot/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-6 text-2xl text-hot uppercase tracking-wider">
            Our Care Ethos
          </h3>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              HOTMESS is for the guys who don't scare easy — but that doesn't mean we don't need support.
            </p>
            <p>
              Hand N Hand is care dressed as kink. No shame. No lectures. Just resources, real talk, 
              and the knowledge that the brotherhood looks after its own.
            </p>
            <p className="text-hot italic">
              You deserve to be held. Not just fucked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
