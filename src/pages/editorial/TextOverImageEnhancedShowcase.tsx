/**
 * TEXT OVER IMAGE ENHANCED SHOWCASE — All advanced features demonstrated
 */

import { 
  TextOverImageEnhanced,
  TextOverImageRAW,
  TextOverImageHUNG,
  TextOverImageHIGH,
  TextOverImageSUPER,
} from '../../components/editorial/TextOverImageEnhanced';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { ArrowRight, Zap, Play } from 'lucide-react';

interface TextOverImageEnhancedShowcaseProps {
  onNavigate?: (page: string) => void;
}

export function TextOverImageEnhancedShowcase({ onNavigate }: TextOverImageEnhancedShowcaseProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <section className="px-6 py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-white uppercase tracking-wider mb-4">
            Text Over Image Enhanced
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            Advanced editorial component with 10 text effects, image treatments, animations, and smart features
          </p>
          <p className="text-sm text-hot uppercase tracking-wider">
            All Features Enabled ✨
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <HMTabs
          tabs={[
            {
              id: 'brand-presets',
              label: 'Brand Presets',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      🎯 One-Line Brand Components
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Pre-configured components with brand-specific styles, filters, and effects
                    </p>
                  </div>

                  {/* RAW */}
                  <div>
                    <h4 className="text-xl text-steel uppercase tracking-wider mb-4">
                      RAW — Industrial Chrome
                    </h4>
                    <p className="text-gray-500 text-sm mb-4 font-mono">
                      {'<TextOverImageRAW headline="STEEL" image={img} />'}
                    </p>
                    <TextOverImageRAW
                      image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000"
                      headline="STEEL SWEAT CHROME"
                      subhead="Hyper-Masculine"
                      body="Industrial strength. Heavy-duty gear. Zero compromise."
                      position="center"
                      height="tall"
                      cta={<HMButton variant="secondary">Shop RAW</HMButton>}
                    />
                  </div>

                  {/* HUNG */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      HUNG — Sexual Confidence
                    </h4>
                    <p className="text-gray-500 text-sm mb-4 font-mono">
                      {'<TextOverImageHUNG headline="TENSION" image={img} />'}
                    </p>
                    <TextOverImageHUNG
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="TENSION RELEASE"
                      subhead="Unapologetic Desire"
                      body="Electric energy. Bold confidence. Own your power."
                      position="center"
                      height="tall"
                      cta={<HMButton variant="primary">Feel It</HMButton>}
                    />
                  </div>

                  {/* HIGH */}
                  <div>
                    <h4 className="text-xl text-neon-lime uppercase tracking-wider mb-4">
                      HIGH — Psychedelic Glitch
                    </h4>
                    <p className="text-gray-500 text-sm mb-4 font-mono">
                      {'<TextOverImageHIGH headline="VAPOR" image={img} />'}
                    </p>
                    <TextOverImageHIGH
                      image="https://images.unsplash.com/photo-1759269151254-3d56fc07ae45?q=80&w=2000"
                      headline="VAPOR GLITCH DREAM"
                      subhead="Psychedelic Escape"
                      body="Ethereal. Transcendent. Beyond reality."
                      position="center"
                      height="tall"
                      cta={<HMButton variant="primary">Enter HIGH</HMButton>}
                    />
                  </div>

                  {/* SUPER */}
                  <div>
                    <h4 className="text-xl text-white uppercase tracking-wider mb-4">
                      SUPER — Elite Minimal
                    </h4>
                    <p className="text-gray-500 text-sm mb-4 font-mono">
                      {'<TextOverImageSUPER headline="REFINED" image={img} />'}
                    </p>
                    <TextOverImageSUPER
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="REFINED LUXURY"
                      subhead="Elite Taste"
                      body="Whispered power. Refined simplicity. Unmistakable quality."
                      position="center"
                      height="tall"
                      cta={<HMButton variant="secondary">Shop SUPER</HMButton>}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'text-effects',
              label: 'Text Effects (10)',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      ✨ 10 Advanced Text Treatments
                    </h3>
                    <p className="text-gray-400 mb-6">
                      From classic to experimental: masked, chrome, glitch, 3D, and more
                    </p>
                  </div>

                  {/* Glitch */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      1. Glitch Effect
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Digital distortion with RGB split and jitter animation
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1758787189572-21726bb77e69?q=80&w=2000"
                      headline="GLITCH"
                      subhead="Digital Distortion"
                      position="center"
                      textTreatment="glitch"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* 3D Extrusion */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      2. 3D Extrusion
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Layered shadows create depth and dimension
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="DEPTH"
                      subhead="Three Dimensions"
                      position="center"
                      textTreatment="3d-extrusion"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Outline + Fill */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      3. Outline + Fill
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Dual-color treatment with contrasting outline
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="CONTRAST"
                      subhead="Dual Color"
                      position="center"
                      textTreatment="outline-fill"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Liquid Drip */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      4. Liquid Drip
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Wet typography with subtle drip animation
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1668178894158-f05eee159c46?q=80&w=2000"
                      headline="SWEAT"
                      subhead="Wet Typography"
                      position="center"
                      textTreatment="liquid-drip"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Texture Overlay */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      5. Texture Overlay
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Noise/grain texture mapped to text
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1628083142881-dbd64bb129d1?q=80&w=2000"
                      headline="TEXTURE"
                      subhead="Concrete + Steel"
                      position="center"
                      textTreatment="texture-overlay"
                      mode="dark"
                      height="tall"
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'image-treatments',
              label: 'Image Treatments',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      🎨 Image Filter Controls
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Blur, duotone, grain, vignette, and desaturation effects
                    </p>
                  </div>

                  {/* Blur Background */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Background Blur
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Focus attention on text with background blur
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="FOCUS"
                      subhead="Blur Background"
                      body="imageBlur={12}"
                      position="center"
                      mode="dark"
                      height="tall"
                      imageBlur={12}
                    />
                  </div>

                  {/* Duotone */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Duotone Filter
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Two-color gradient overlay (Hot Red + Black)
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="DUOTONE"
                      subhead="Hot Red × Black"
                      body="duotone={{ dark: '#000', light: '#E70F3C' }}"
                      position="center"
                      mode="dark"
                      height="tall"
                      duotone={{ dark: '#000000', light: '#E70F3C' }}
                    />
                  </div>

                  {/* Grain */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Film Grain
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Analog film photography aesthetic
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="ANALOG"
                      subhead="Film Grain"
                      body="grain={0.5}"
                      position="center"
                      mode="dark"
                      height="tall"
                      grain={0.5}
                    />
                  </div>

                  {/* Vignette */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Vignette
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Darken edges to draw focus to center
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1618423460823-fe7f29528433?q=80&w=2000"
                      headline="VIGNETTE"
                      subhead="Edge Darkening"
                      body="vignette={0.7}"
                      position="center"
                      mode="dark"
                      height="tall"
                      vignette={0.7}
                    />
                  </div>

                  {/* Desaturate */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Desaturation
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Grayscale or partial desaturation
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="MONOCHROME"
                      subhead="Desaturated"
                      body="desaturate={0.8}"
                      position="center"
                      mode="dark"
                      height="tall"
                      desaturate={0.8}
                    />
                  </div>

                  {/* Combined */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Combined Effects
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Duotone + Grain + Vignette
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000"
                      headline="COMBINED"
                      subhead="Multiple Filters"
                      body="All image treatments applied at once"
                      position="center"
                      mode="dark"
                      height="tall"
                      duotone={{ dark: '#000000', light: '#9BA1A6' }}
                      grain={0.3}
                      vignette={0.5}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'animations',
              label: 'Animations',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      🎬 Scroll Animations
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Parallax, reveal on scroll, and staggered text animations
                    </p>
                  </div>

                  {/* Fade Reveal */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Fade In Reveal
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Scroll down to see fade-in animation
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="FADE IN"
                      subhead="Scroll Reveal"
                      body="revealOnScroll='fade'"
                      position="center"
                      mode="dark"
                      height="tall"
                      revealOnScroll="fade"
                    />
                  </div>

                  {/* Slide Up Reveal */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Slide Up Reveal
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Content slides up as you scroll
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="SLIDE UP"
                      subhead="From Below"
                      body="revealOnScroll='slide-up'"
                      position="center"
                      mode="dark"
                      height="tall"
                      revealOnScroll="slide-up"
                    />
                  </div>

                  {/* Zoom Reveal */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Zoom Reveal
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Scale up animation on reveal
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="ZOOM"
                      subhead="Scale Animation"
                      body="revealOnScroll='zoom'"
                      position="center"
                      mode="dark"
                      height="tall"
                      revealOnScroll="zoom"
                    />
                  </div>

                  {/* Stagger Text */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Staggered Text
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Words appear one by one with delay
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="WORD BY WORD REVEAL"
                      subhead="Staggered Animation"
                      body="staggerText={150}"
                      position="center"
                      mode="dark"
                      height="tall"
                      staggerText={150}
                    />
                  </div>

                  {/* Parallax */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Parallax Effect
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Background moves slower than foreground (scroll to see)
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="PARALLAX"
                      subhead="Depth Effect"
                      body="parallax={0.8}"
                      position="center"
                      mode="dark"
                      height="tall"
                      parallax={0.8}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'advanced',
              label: 'Advanced Features',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      🚀 Advanced Capabilities
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Vertical text, rotation, quotes, video backgrounds, and more
                    </p>
                  </div>

                  {/* Vertical Orientation */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Vertical Text Orientation
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Sideways text for narrow layouts or editorial variety
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="VERTICAL"
                      subhead="Sideways"
                      position="center"
                      mode="dark"
                      height="tall"
                      orientation="vertical"
                    />
                  </div>

                  {/* Rotated Text */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Rotated Text (-5°)
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Slight rotation for editorial tension and dynamism
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="ANGLED"
                      subhead="Rotated Typography"
                      body="rotation={-5}"
                      position="center"
                      mode="dark"
                      height="tall"
                      rotation={-5}
                    />
                  </div>

                  {/* Quote Style */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Pull Quote
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Editorial quote styling with quotation marks
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="This is more than nightlife. This is family."
                      byline="Marcus Chen"
                      position="center"
                      mode="dark"
                      height="tall"
                      quote={true}
                    />
                  </div>

                  {/* Date + Byline */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Editorial Byline
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Article-style with date and author attribution
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="BROTHERHOOD"
                      subhead="London's Queer Night Ecosystem"
                      body="An in-depth look at the community that powers the city's nightlife."
                      byline="Alex Rivera"
                      date="November 25, 2024"
                      position="bottom-left"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Custom Position */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Custom Positioning
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Precise control with custom coordinates
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="CUSTOM"
                      subhead="Positioned at 30% from top, 20% from left"
                      position="custom"
                      customPosition={{ top: '30%', left: '20%' }}
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Auto Contrast */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Auto Contrast Mode
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Automatically adjusts text color based on image brightness
                    </p>
                    <TextOverImageEnhanced
                      image="https://images.unsplash.com/photo-1618423460823-fe7f29528433?q=80&w=2000"
                      headline="AUTO"
                      subhead="Smart Contrast"
                      body="mode='auto'"
                      position="center"
                      mode="auto"
                      height="tall"
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'real-world',
              label: 'Real-World Examples',
              content: (
                <div className="space-y-16 py-8">
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      💼 Production-Ready Examples
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Complete implementations for common use cases
                    </p>
                  </div>

                  {/* Hero Launch with RAW preset */}
                  <div>
                    <h4 className="text-xl text-steel uppercase tracking-wider mb-4">
                      Collection Launch (RAW)
                    </h4>
                    <TextOverImageRAW
                      image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000"
                      headline="RAW DROP"
                      subhead="Industrial Collection 2024"
                      body="Heavy-duty gear built for the bold. Zero compromise. All strength."
                      position="center"
                      height="hero"
                      revealOnScroll="fade"
                      cta={<HMButton variant="secondary" icon={<ArrowRight size={20} />}>Shop Collection</HMButton>}
                    />
                  </div>

                  {/* Event Promo with HUNG preset */}
                  <div>
                    <h4 className="text-xl text-hot uppercase tracking-wider mb-4">
                      Event Announcement (HUNG)
                    </h4>
                    <TextOverImageHUNG
                      image="https://images.unsplash.com/photo-1744314080490-ed41f6319475?q=80&w=2000"
                      headline="ELECTRIC NIGHTS"
                      subhead="Saturday December 7"
                      body="Four floors. Endless heat. The brotherhood reunites."
                      position="bottom-left"
                      height="tall"
                      staggerText={120}
                      cta={<HMButton variant="primary" icon={<Zap size={20} />}>Get Tickets</HMButton>}
                    />
                  </div>

                  {/* Editorial Feature with HIGH preset */}
                  <div>
                    <h4 className="text-xl text-neon-lime uppercase tracking-wider mb-4">
                      Editorial Story (HIGH)
                    </h4>
                    <TextOverImageHIGH
                      image="https://images.unsplash.com/photo-1759269151254-3d56fc07ae45?q=80&w=2000"
                      headline="VAPOR STATE"
                      subhead="Inside the Psychedelic Renaissance"
                      body="How London's queer scene is redefining transcendence."
                      byline="Jordan Lee"
                      date="November 20, 2024"
                      position="center"
                      height="hero"
                      parallax={0.6}
                      cta={<HMButton variant="primary">Read Story</HMButton>}
                    />
                  </div>

                  {/* Luxury Promo with SUPER preset */}
                  <div>
                    <h4 className="text-xl text-white uppercase tracking-wider mb-4">
                      Luxury Campaign (SUPER)
                    </h4>
                    <TextOverImageSUPER
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="SUPER MINIMAL"
                      subhead="Elite Editorial Collection"
                      body="Whispered power. Refined simplicity. For those who know."
                      position="center"
                      height="hero"
                      revealOnScroll="zoom"
                      cta={<HMButton variant="secondary">Explore SUPER</HMButton>}
                    />
                  </div>
                </div>
              ),
            },
          ]}
          defaultTab="brand-presets"
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-12 mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 mb-2">
            Text Over Image Enhanced — All features production ready
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            10 Text Effects × 5 Image Treatments × Animations × Brand Presets
          </p>
          <p className="text-xs text-hot mt-4">
            Smart features, scroll animations, and advanced controls ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
