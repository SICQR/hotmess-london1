/**
 * BRAND HERO — Editorial full-bleed hero sections
 * Bold brutalism × luxury queer editorial
 * Oversized typography with masked text over imagery
 */

import { HMButton } from '../library/HMButton';
import { ArrowRight, Radio, Map } from 'lucide-react';

type BrandType = 'hotmess' | 'raw' | 'hung' | 'high' | 'super';

interface BrandHeroProps {
  brand: BrandType;
  onNavigate?: (page: string) => void;
}

const brandConfig = {
  hotmess: {
    title: 'HOTMESS LONDON',
    subtitle: 'The Ecosystem',
    statement: 'Built for the bold.',
    description: 'A men-only queer nightlife OS combining care-first principles with kink aesthetics.',
    image: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=2000',
    portraitImage: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=800',
    textureImage: 'https://images.unsplash.com/photo-1708689995034-7343f2e699b1?q=80&w=800',
    gradient: 'from-hot via-heat to-hot',
    textColor: 'text-hot',
    glowColor: 'shadow-[0_0_80px_rgba(231,15,60,0.6)]',
    ctas: [
      { label: 'Explore Radio', icon: <Radio size={20} />, page: 'radio' },
      { label: 'Scan Beacons', icon: <Map size={20} />, page: 'map' },
      { label: 'Shop Heat', icon: <ArrowRight size={20} />, page: 'shop' },
    ],
  },
  raw: {
    title: 'RAW',
    subtitle: 'Hyper-Masculine',
    statement: 'Steel. Sweat. Chrome.',
    description: 'Industrial strength. Brutal honesty. Zero compromise.',
    image: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=2000',
    portraitImage: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=800',
    textureImage: 'https://images.unsplash.com/photo-1758558309640-132f8f97fb44?q=80&w=800',
    gradient: 'from-steel via-gray-400 to-steel',
    textColor: 'text-steel',
    glowColor: 'shadow-[0_0_80px_rgba(155,161,166,0.8)]',
    ctas: [
      { label: 'Shop RAW', icon: <ArrowRight size={20} />, page: 'shop' },
    ],
  },
  hung: {
    title: 'HUNG',
    subtitle: 'Sexual Confidence',
    statement: 'Own your power.',
    description: 'Tension. Release. Unapologetic desire.',
    image: 'https://images.unsplash.com/photo-1574622731854-f06af7345d28?q=80&w=2000',
    portraitImage: 'https://images.unsplash.com/photo-1605553703411-73938914721b?q=80&w=800',
    textureImage: 'https://images.unsplash.com/photo-1708689995034-7343f2e699b1?q=80&w=800',
    gradient: 'from-hot via-red-600 to-heat',
    textColor: 'text-hot',
    glowColor: 'shadow-[0_0_80px_rgba(231,15,60,0.9)]',
    ctas: [
      { label: 'Shop HUNG', icon: <ArrowRight size={20} />, page: 'shop' },
    ],
  },
  high: {
    title: 'HIGH',
    subtitle: 'Psychedelia',
    statement: 'Drift beyond.',
    description: 'Glitch. Vapor. Dreamy escape.',
    image: 'https://images.unsplash.com/photo-1763931504138-3b9fb539f737?q=80&w=2000',
    portraitImage: 'https://images.unsplash.com/photo-1759171052839-b089561eb740?q=80&w=800',
    textureImage: 'https://images.unsplash.com/photo-1705274289611-614c37ad8bcd?q=80&w=800',
    gradient: 'from-neon-lime via-cyan-static to-purple-500',
    textColor: 'text-neon-lime',
    glowColor: 'shadow-[0_0_80px_rgba(178,255,82,0.8)]',
    ctas: [
      { label: 'Shop HIGH', icon: <ArrowRight size={20} />, page: 'shop' },
    ],
  },
  super: {
    title: 'SUPER',
    subtitle: 'Elite Editorial',
    statement: 'Luxury. Refined.',
    description: 'Stark minimalism. Extreme confidence.',
    image: 'https://images.unsplash.com/photo-1739616194227-0c4a98642c83?q=80&w=2000',
    portraitImage: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=800',
    textureImage: 'https://images.unsplash.com/photo-1758558309640-132f8f97fb44?q=80&w=800',
    gradient: 'from-white via-gray-200 to-white',
    textColor: 'text-white',
    glowColor: 'shadow-[0_0_80px_rgba(255,255,255,0.4)]',
    ctas: [
      { label: 'Shop SUPER', icon: <ArrowRight size={20} />, page: 'shop' },
    ],
  },
};

export function BrandHero({ brand, onNavigate }: BrandHeroProps) {
  const config = brandConfig[brand];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Background Image — Full Bleed */}
      <div className="absolute inset-0 z-0">
        <img
          src={config.image}
          alt={config.title}
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        {/* Motion Blur Streak Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hot/20 to-transparent opacity-40 blur-3xl animate-pulse" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32 min-h-screen flex flex-col justify-between">
        {/* Top: Small Brand Identifier */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
            {config.subtitle}
          </span>
        </div>

        {/* Center: Oversized Masked Typography */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Giant Title with Image Mask */}
            <h1 
              className={`
                text-[96px] md:text-[160px] lg:text-[240px] 
                leading-none tracking-tighter
                bg-clip-text text-transparent
                bg-gradient-to-br ${config.gradient}
                drop-shadow-2xl
                ${config.glowColor}
                mb-8
              `}
              style={{
                fontWeight: 900,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {config.title}
            </h1>

            {/* Statement Typography */}
            <p className={`
              text-2xl md:text-4xl lg:text-5xl 
              uppercase tracking-wider
              ${config.textColor}
              mb-12
              drop-shadow-lg
            `}>
              {config.statement}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              {config.ctas.map((cta, idx) => (
                <HMButton
                  key={idx}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  size="lg"
                  icon={cta.icon}
                  onClick={() => onNavigate?.(cta.page)}
                >
                  {cta.label}
                </HMButton>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Secondary Imagery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-24">
          {/* Portrait Shot */}
          <div className="relative h-64 lg:h-80 overflow-hidden border-2 border-white/20">
            <img
              src={config.portraitImage}
              alt="Portrait"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* Texture Macro Shot */}
          <div className="relative h-64 lg:h-80 overflow-hidden border-2 border-white/20">
            <img
              src={config.textureImage}
              alt="Texture"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* Statement Block */}
          <div className="relative h-64 lg:h-80 bg-black/80 border-2 border-white/20 p-8 flex flex-col justify-end col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {config.description}
            </p>
            <div className={`h-1 w-16 bg-gradient-to-r ${config.gradient}`} />
          </div>
        </div>
      </div>

      {/* Chrome Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20" />
    </section>
  );
}

// Export individual brand heroes for convenience
export function HotmessHero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHero brand="hotmess" onNavigate={onNavigate} />;
}

export function RawHero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHero brand="raw" onNavigate={onNavigate} />;
}

export function HungHero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHero brand="hung" onNavigate={onNavigate} />;
}

export function HighHero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHero brand="high" onNavigate={onNavigate} />;
}

export function SuperHero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return <BrandHero brand="super" onNavigate={onNavigate} />;
}
