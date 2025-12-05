/**
 * BRAND HOMEPAGE — Magazine-style editorial homepage layout
 * Fashion editorial × Brutalist luxury × Queer rave eroticism
 * Mobile-first responsive design
 */

import { HMButton } from '../../components/library/HMButton';
import { Radio, Map, Zap, ShoppingBag, ArrowRight, Play } from 'lucide-react';

type BrandType = 'hotmess' | 'raw' | 'hung' | 'high' | 'super';

interface BrandHomepageProps {
  brand: BrandType;
  onNavigate?: (page: string) => void;
}

const brandConfig = {
  hotmess: {
    name: 'HOTMESS LONDON',
    tagline: 'The Brotherhood',
    manifesto: {
      title: 'Built for the Bold',
      body: 'This is not an app. This is an ecosystem. A men-only queer nightlife OS that rewards loyalty, amplifies care, and celebrates the sweat, the heat, and the brotherhood. We combine kink aesthetics with care-first principles. Grounded. Masculine. Never cruel.',
    },
    hero: {
      image: 'https://images.unsplash.com/photo-1671695157166-c4bbd8e6e94e?q=80&w=2000',
      headline: 'WHERE THE SWEAT BEGINS',
      subhead: 'London\'s queer nightlife OS',
    },
    colors: {
      primary: 'hot',
      gradient: 'from-hot via-heat to-hot',
      textColor: 'text-hot',
      borderColor: 'border-hot',
      bgOverlay: 'bg-hot/20',
    },
    productSpotlight: {
      image: 'https://images.unsplash.com/photo-1734188668236-39e7e46e4390?q=80&w=1200',
      title: 'HOTMESS Essentials',
      description: 'Rep the brotherhood. Earn XP with every purchase.',
      cta: 'Shop Now',
    },
    radio: {
      image: 'https://images.unsplash.com/photo-1675709341324-9c98573f9281?q=80&w=2000',
      title: 'RADIO 24/7',
      description: 'Too-much energy. Non-stop. Stream the heat.',
    },
    beacon: {
      image: 'https://images.unsplash.com/photo-1688549450664-8189b4ac4751?q=80&w=2000',
      title: 'SCAN BEACONS',
      description: 'Find the mess. Earn XP. Light up the city.',
    },
  },
  raw: {
    name: 'RAW',
    tagline: 'Hyper-Masculine',
    manifesto: {
      title: 'Steel. Sweat. Chrome.',
      body: 'Industrial strength. No apologies. Raw is for men who show up heavy, work hard, and leave nothing on the table. Brutal honesty. Zero compromise. Built for the grind, designed for the bold.',
    },
    hero: {
      image: 'https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000',
      headline: 'INDUSTRIAL STRENGTH',
      subhead: 'Brutal honesty. Zero compromise.',
    },
    colors: {
      primary: 'steel',
      gradient: 'from-steel via-gray-400 to-steel',
      textColor: 'text-steel',
      borderColor: 'border-steel',
      bgOverlay: 'bg-steel/20',
    },
    productSpotlight: {
      image: 'https://images.unsplash.com/photo-1734188668236-39e7e46e4390?q=80&w=1200',
      title: 'RAW Collection',
      description: 'Heavy-duty gear. Built to last.',
      cta: 'Shop RAW',
    },
    radio: {
      image: 'https://images.unsplash.com/photo-1586549750090-52e7853dff22?q=80&w=2000',
      title: 'RAW RADIO',
      description: 'Industrial beats. Underground energy.',
    },
    beacon: {
      image: 'https://images.unsplash.com/photo-1688549450664-8189b4ac4751?q=80&w=2000',
      title: 'FIND THE MESS',
      description: 'Scan beacons. Earn rewards. Own the night.',
    },
  },
  hung: {
    name: 'HUNG',
    tagline: 'Sexual Confidence',
    manifesto: {
      title: 'Own Your Power',
      body: 'Hung is tension. Release. Unapologetic desire. For men who own their sexuality without shame, without apology. Bold. Confident. Electric. This is not subtle. This is heat.',
    },
    hero: {
      image: 'https://images.unsplash.com/photo-1684109230972-6c25706b1187?q=80&w=2000',
      headline: 'UNAPOLOGETIC DESIRE',
      subhead: 'Tension. Release. Power.',
    },
    colors: {
      primary: 'hot',
      gradient: 'from-hot via-red-600 to-heat',
      textColor: 'text-hot',
      borderColor: 'border-hot',
      bgOverlay: 'bg-hot/30',
    },
    productSpotlight: {
      image: 'https://images.unsplash.com/photo-1734188668236-39e7e46e4390?q=80&w=1200',
      title: 'HUNG Collection',
      description: 'Confidence you can wear.',
      cta: 'Shop HUNG',
    },
    radio: {
      image: 'https://images.unsplash.com/photo-1763322564752-12ce8fae2bfe?q=80&w=2000',
      title: 'HUNG RADIO',
      description: 'Sexual energy. Nonstop pulse.',
    },
    beacon: {
      image: 'https://images.unsplash.com/photo-1684109230972-6c25706b1187?q=80&w=2000',
      title: 'HEAT MAP',
      description: 'Find where the energy lives.',
    },
  },
  high: {
    name: 'HIGH',
    tagline: 'Psychedelia',
    manifesto: {
      title: 'Drift Beyond',
      body: 'High is vapor. Glitch. Dreamy escape. For men who chase the ethereal, the beautiful chaos, the psychedelic blur. Lose yourself. Find something new. Dance until the sun comes up.',
    },
    hero: {
      image: 'https://images.unsplash.com/photo-1763931504138-3b9fb539f737?q=80&w=2000',
      headline: 'DREAMY ESCAPE',
      subhead: 'Vapor. Glitch. Transcendence.',
    },
    colors: {
      primary: 'neon-lime',
      gradient: 'from-neon-lime via-cyan-static to-purple-500',
      textColor: 'text-neon-lime',
      borderColor: 'border-neon-lime',
      bgOverlay: 'bg-neon-lime/20',
    },
    productSpotlight: {
      image: 'https://images.unsplash.com/photo-1763931504138-3b9fb539f737?q=80&w=1200',
      title: 'HIGH Collection',
      description: 'Psychedelic energy. Limitless vibes.',
      cta: 'Shop HIGH',
    },
    radio: {
      image: 'https://images.unsplash.com/photo-1675709341324-9c98573f9281?q=80&w=2000',
      title: 'HIGH RADIO',
      description: 'Transcendent beats. Endless drift.',
    },
    beacon: {
      image: 'https://images.unsplash.com/photo-1763931504138-3b9fb539f737?q=80&w=2000',
      title: 'VAPOR TRAIL',
      description: 'Follow the lights. Find the vibe.',
    },
  },
  super: {
    name: 'SUPER',
    tagline: 'Elite Editorial',
    manifesto: {
      title: 'Luxury. Refined.',
      body: 'Super is minimalism. Stark confidence. Elite taste. For men who demand the best, who appreciate restraint, who know that power whispers. Clean lines. Perfect execution. No excess.',
    },
    hero: {
      image: 'https://images.unsplash.com/photo-1588717010980-f8f57f50b38e?q=80&w=2000',
      headline: 'EXTREME MINIMALISM',
      subhead: 'Luxury. Refined. Elite.',
    },
    colors: {
      primary: 'white',
      gradient: 'from-white via-gray-200 to-white',
      textColor: 'text-white',
      borderColor: 'border-white',
      bgOverlay: 'bg-white/10',
    },
    productSpotlight: {
      image: 'https://images.unsplash.com/photo-1739616194227-0c4a98642c83?q=80&w=1200',
      title: 'SUPER Collection',
      description: 'Elite minimalism. Perfect execution.',
      cta: 'Shop SUPER',
    },
    radio: {
      image: 'https://images.unsplash.com/photo-1675709341324-9c98573f9281?q=80&w=2000',
      title: 'SUPER RADIO',
      description: 'Curated sound. Refined taste.',
    },
    beacon: {
      image: 'https://images.unsplash.com/photo-1688549450664-8189b4ac4751?q=80&w=2000',
      title: 'ELITE LOCATIONS',
      description: 'Find the finest. Nothing less.',
    },
  },
};

export function BrandHomepage({ brand, onNavigate }: BrandHomepageProps) {
  const config = brandConfig[brand];
  const colors = config.colors;

  return (
    <div className="min-h-screen bg-black">
      {/* HERO SECTION — Cinematic Full-Bleed Opening */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src={config.hero.image}
          alt={config.name}
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        
        {/* Wet Texture Overlay */}
        <div className="absolute inset-0 wet-texture" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {/* Brand Name */}
          <div className="mb-8">
            <h1 
              className={`
                text-[80px] md:text-[140px] lg:text-[240px]
                leading-none tracking-tighter
                bg-clip-text text-transparent
                bg-gradient-to-br ${colors.gradient}
                drop-shadow-[0_0_60px_rgba(231,15,60,0.8)]
              `}
              style={{
                fontWeight: 900,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {config.name}
            </h1>
          </div>

          {/* Headline */}
          <h2 className={`text-2xl md:text-4xl lg:text-5xl ${colors.textColor} uppercase tracking-wider mb-4 drop-shadow-lg`}>
            {config.hero.headline}
          </h2>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-gray-300 tracking-wide mb-12">
            {config.hero.subhead}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <HMButton variant="primary" size="lg" icon={<ShoppingBag size={20} />} onClick={() => onNavigate?.('shop')}>
              Shop {config.name}
            </HMButton>
            <HMButton variant="secondary" size="lg" icon={<Radio size={20} />} onClick={() => onNavigate?.('radio')}>
              Listen Now
            </HMButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className={`w-1 h-16 bg-gradient-to-b ${colors.gradient} opacity-60`} />
        </div>
      </section>

      {/* CHROME DIVIDER */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-40`} />

      {/* MANIFESTO — Story Block */}
      <section className="px-6 py-24 lg:py-32 bg-charcoal/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-6xl lg:text-7xl ${colors.textColor} uppercase tracking-wider mb-8`}>
            {config.manifesto.title}
          </h2>
          <div className={`h-1 w-24 mx-auto bg-gradient-to-r ${colors.gradient} mb-12`} />
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            {config.manifesto.body}
          </p>
        </div>
      </section>

      {/* CHROME DIVIDER */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-40`} />

      {/* PRODUCT SPOTLIGHT — Full-Width Image + Text */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[60vh] lg:h-auto overflow-hidden">
            <img
              src={config.productSpotlight.image}
              alt={config.productSpotlight.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-24 bg-black">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
              Featured Collection
            </span>
            <h3 className={`text-4xl md:text-6xl lg:text-7xl ${colors.textColor} uppercase tracking-wider mb-6`}>
              {config.productSpotlight.title}
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {config.productSpotlight.description}
            </p>
            <div>
              <HMButton variant="primary" size="lg" icon={<ArrowRight size={20} />} onClick={() => onNavigate?.('shop')}>
                {config.productSpotlight.cta}
              </HMButton>
            </div>
          </div>
        </div>
      </section>

      {/* CHROME DIVIDER */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-40`} />

      {/* RADIO HERO — Full-Bleed with Overlay */}
      <section className="relative w-full h-[80vh] lg:h-screen overflow-hidden">
        <img
          src={config.radio.image}
          alt="Radio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        
        {/* Neon Haze Overlay */}
        <div className={`absolute inset-0 ${colors.bgOverlay} mix-blend-multiply`} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Radio size={80} className={`${colors.textColor} mb-8 drop-shadow-[0_0_40px_rgba(231,15,60,0.8)]`} />
          <h3 className={`text-5xl md:text-7xl lg:text-8xl ${colors.textColor} uppercase tracking-wider mb-6`}>
            {config.radio.title}
          </h3>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
            {config.radio.description}
          </p>
          <HMButton variant="primary" size="lg" icon={<Play size={24} />} onClick={() => onNavigate?.('radio')}>
            Start Streaming
          </HMButton>
        </div>

        {/* Animated Waveform Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-end justify-center gap-1 h-full pb-8">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-gradient-to-t ${colors.gradient} opacity-60 animate-pulse`}
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CHROME DIVIDER */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-40`} />

      {/* BEACON / DROPS PROMO — Split Layout */}
      <section className="relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Beacon Promo */}
          <div className="relative h-[70vh] overflow-hidden group cursor-pointer" onClick={() => onNavigate?.('map')}>
            <img
              src={config.beacon.image}
              alt="Beacons"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <Map size={60} className={`${colors.textColor} mb-6 drop-shadow-lg`} />
              <h4 className={`text-3xl md:text-5xl ${colors.textColor} uppercase tracking-wider mb-4`}>
                {config.beacon.title}
              </h4>
              <p className="text-lg text-gray-300 mb-8 max-w-md">
                {config.beacon.description}
              </p>
              <HMButton variant="secondary" icon={<Map size={20} />}>
                Open Map
              </HMButton>
            </div>
          </div>

          {/* Drops Promo */}
          <div className="relative h-[70vh] overflow-hidden group cursor-pointer bg-gradient-to-br from-black via-charcoal to-black" onClick={() => onNavigate?.('drops')}>
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1698514246092-a1e865f1ef7c?q=80&w=1200"
                alt="Texture"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
              <Zap size={60} className={`${colors.textColor} mb-6 animate-pulse drop-shadow-lg`} />
              <h4 className={`text-3xl md:text-5xl ${colors.textColor} uppercase tracking-wider mb-4`}>
                Limited Drops
              </h4>
              <p className="text-lg text-gray-300 mb-8 max-w-md">
                Blink and you'll miss it. Exclusive releases. Zero warning.
              </p>
              <HMButton variant="primary" icon={<Zap size={20} />}>
                View Drops
              </HMButton>
            </div>
          </div>
        </div>
      </section>

      {/* CHROME DIVIDER */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-40`} />

      {/* FULL-WIDTH CTA BLOCK */}
      <section className={`relative w-full py-24 lg:py-32 ${colors.bgOverlay} border-y ${colors.borderColor}/30`}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className={`text-4xl md:text-6xl lg:text-7xl ${colors.textColor} uppercase tracking-wider mb-8`}>
            Join the Brotherhood
          </h3>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            This is more than nightlife. This is family. Scan beacons. Earn XP. Shop exclusive drops. Stream 24/7 radio. Connect with care.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <HMButton variant="primary" size="lg" onClick={() => onNavigate?.('profile')}>
              Create Profile
            </HMButton>
            <HMButton variant="secondary" size="lg" onClick={() => onNavigate?.('community')}>
              Explore Community
            </HMButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h4 className={`text-2xl ${colors.textColor} mb-4 uppercase tracking-wider`}>
                {config.name}
              </h4>
              <p className="text-sm text-gray-400">
                {config.tagline}
              </p>
            </div>

            {/* Shop */}
            <div>
              <h5 className="text-white uppercase tracking-wider mb-4 text-sm">Shop</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('shop')} className="hover:text-hot transition-colors">All Products</button></li>
                <li><button onClick={() => onNavigate?.('shop')} className="hover:text-hot transition-colors">RAW</button></li>
                <li><button onClick={() => onNavigate?.('shop')} className="hover:text-hot transition-colors">HUNG</button></li>
                <li><button onClick={() => onNavigate?.('shop')} className="hover:text-hot transition-colors">HIGH</button></li>
                <li><button onClick={() => onNavigate?.('shop')} className="hover:text-hot transition-colors">SUPER</button></li>
              </ul>
            </div>

            {/* Experience */}
            <div>
              <h5 className="text-white uppercase tracking-wider mb-4 text-sm">Experience</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('radio')} className="hover:text-hot transition-colors">Radio</button></li>
                <li><button onClick={() => onNavigate?.('map')} className="hover:text-hot transition-colors">MessMap</button></li>
                <li><button onClick={() => onNavigate?.('drops')} className="hover:text-hot transition-colors">Drops</button></li>
                <li><button onClick={() => onNavigate?.('rewards')} className="hover:text-hot transition-colors">Rewards</button></li>
                <li><button onClick={() => onNavigate?.('care')} className="hover:text-hot transition-colors">Care</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-white uppercase tracking-wider mb-4 text-sm">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('legal')} className="hover:text-hot transition-colors">Terms</button></li>
                <li><button onClick={() => onNavigate?.('legal')} className="hover:text-hot transition-colors">Privacy</button></li>
                <li><button onClick={() => onNavigate?.('legal')} className="hover:text-hot transition-colors">Cookie Policy</button></li>
                <li><button onClick={() => onNavigate?.('legal')} className="hover:text-hot transition-colors">Age Verification</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className={`pt-8 border-t ${colors.borderColor}/20 flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className="text-sm text-gray-500">
              © 2024 HOTMESS LONDON. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">
              Care dressed as kink. Built for brotherhood.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Export individual brand homepages
export function HotmessHomepage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHomepage brand="hotmess" onNavigate={onNavigate} />;
}

export function RawHomepage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHomepage brand="raw" onNavigate={onNavigate} />;
}

export function HungHomepage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHomepage brand="hung" onNavigate={onNavigate} />;
}

export function HighHomepage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHomepage brand="high" onNavigate={onNavigate} />;
}

export function SuperHomepage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHomepage brand="super" onNavigate={onNavigate} />;
}