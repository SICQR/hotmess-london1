/**
 * TEXT OVER IMAGE SHOWCASE — Comprehensive examples of all variants
 * Demonstrates positions, modes, text treatments, and background types
 */

import { TextOverImage } from '../../components/editorial/TextOverImage';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { ArrowRight, Zap } from 'lucide-react';

interface TextOverImageShowcaseProps {
  onNavigate?: (page: string) => void;
}

export function TextOverImageShowcase({ onNavigate }: TextOverImageShowcaseProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <section className="px-6 py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-white uppercase tracking-wider mb-4">
            Text Over Image System
          </h1>
          <p className="text-lg text-gray-400">
            Comprehensive editorial component set with multiple positions, modes, and text treatments
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <HMTabs
          tabs={[
            {
              id: 'positions',
              label: 'Position Variants',
              content: (
                <div className="space-y-16 py-8">
                  {/* Top-Left */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Top-Left Position
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Text anchored to top-left. Ideal for editorial intros.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="RAW POWER"
                      subhead="Masculine Energy"
                      body="Industrial strength meets uncompromising design. For men who show up heavy."
                      position="top-left"
                      mode="dark"
                      height="tall"
                      cta={<HMButton variant="primary" icon={<ArrowRight size={20} />}>Explore</HMButton>}
                    />
                  </div>

                  {/* Top-Right */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Top-Right Position
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Text anchored to top-right. Creates asymmetry.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="STRENGTH"
                      subhead="Built Different"
                      body="Power. Endurance. Brotherhood."
                      position="top-right"
                      mode="light"
                      height="tall"
                      cta={<HMButton variant="secondary" icon={<Zap size={20} />}>Join</HMButton>}
                    />
                  </div>

                  {/* Center */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Center Position
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Classic centered hero layout. Maximum impact.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="HOTMESS"
                      subhead="London's Queer Nightlife OS"
                      body="This is more than nightlife. This is family. Join the brotherhood."
                      position="center"
                      mode="neon"
                      height="hero"
                      cta={<HMButton variant="primary">Enter</HMButton>}
                    />
                  </div>

                  {/* Bottom-Left */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Bottom-Left Position
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Text grounded at bottom. Subtle and editorial.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="NIGHT CITY"
                      subhead="Where the heat lives"
                      body="Scan beacons. Find the mess. Own the night."
                      position="bottom-left"
                      mode="dark"
                      height="tall"
                    />
                  </div>

                  {/* Bottom-Right */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Bottom-Right Position
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Text anchored bottom-right. Dramatic balance.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1618423460823-fe7f29528433?q=80&w=2000"
                      headline="HORIZON"
                      subhead="Beyond the edge"
                      body="Chase the sun. Find your tribe. Never stop."
                      position="bottom-right"
                      mode="light"
                      height="tall"
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'modes',
              label: 'Color Modes',
              content: (
                <div className="space-y-16 py-8">
                  {/* Dark Mode */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Dark Mode
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Dark overlays. White text. Classic editorial.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                      headline="MASCULINE"
                      subhead="Bold. Confident. Real."
                      body="For men who own their power without apology. Grounded in care, dressed in kink."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="default"
                      cta={<HMButton variant="primary">Discover</HMButton>}
                    />
                  </div>

                  {/* Light Mode */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Light Mode
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Light overlays. Dark text. High contrast.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                      headline="SUPER"
                      subhead="Extreme Minimalism"
                      body="Luxury. Refined. Elite taste for those who demand perfection."
                      position="center"
                      mode="light"
                      height="hero"
                      textTreatment="default"
                      cta={<HMButton variant="secondary">Shop SUPER</HMButton>}
                    />
                  </div>

                  {/* Neon Mode */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Neon Mode
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Hot neon glow. Wet textures. Queer rave aesthetic.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1744314080490-ed41f6319475?q=80&w=2000"
                      headline="ELECTRIC"
                      subhead="Heat × Sweat × Brotherhood"
                      body="This is the mess. This is the family. This is where you belong."
                      position="center"
                      mode="neon"
                      height="hero"
                      textTreatment="default"
                      cta={<HMButton variant="primary">Join Now</HMButton>}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'treatments',
              label: 'Text Treatments',
              content: (
                <div className="space-y-16 py-8">
                  {/* Default */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Default Treatment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Clean, bold typography with drop shadow.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                      headline="BROTHERHOOD"
                      subhead="Built for the bold"
                      body="Classic editorial typography with maximum readability."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="default"
                    />
                  </div>

                  {/* Masked Text */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Masked Text Treatment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Gradient fills with background clip. Hot neon colors.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="INFERNO"
                      subhead="Too hot to handle"
                      body="Gradient masked typography with neon glow effect. Pure heat."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="masked"
                      cta={<HMButton variant="primary">Feel the Heat</HMButton>}
                    />
                  </div>

                  {/* Chrome Gradient */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Chrome Gradient Treatment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Metallic chrome gradient. Luxury industrial aesthetic.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000"
                      headline="CHROME"
                      subhead="Steel. Sweat. Strength."
                      body="RAW industrial typography with chrome gradient and accent line."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="chrome"
                      cta={<HMButton variant="secondary">Shop RAW</HMButton>}
                    />
                  </div>

                  {/* Motion Blur */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Motion Blur Treatment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Kinetic blur effect. Movement and energy.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1605727328079-f3115619d3a5?q=80&w=2000"
                      headline="VELOCITY"
                      subhead="Speed × Power × Momentum"
                      body="Typography with horizontal motion blur and pulsing overlay."
                      position="center"
                      mode="neon"
                      height="hero"
                      textTreatment="motion-blur"
                      cta={<HMButton variant="primary">Accelerate</HMButton>}
                    />
                  </div>

                  {/* Knockout */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Knockout Text Treatment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Bold outline effect. Maximum contrast and impact.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="IMPACT"
                      subhead="Unmissable. Undeniable."
                      body="Heavy outline typography for maximum visibility on any background."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="knockout"
                      cta={<HMButton variant="primary">Make Waves</HMButton>}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'backgrounds',
              label: 'Background Types',
              content: (
                <div className="space-y-16 py-8">
                  {/* Hero Portrait */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Hero Portrait Backgrounds
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Dramatic male portraits. Fashion editorial style.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1671520341109-8cfdda981841?q=80&w=2000"
                        headline="RAW"
                        subhead="Hyper-Masculine"
                        position="bottom-left"
                        mode="dark"
                        height="tall"
                        textTreatment="masked"
                      />
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1729281008800-539686eaedc0?q=80&w=2000"
                        headline="STRENGTH"
                        subhead="Built Different"
                        position="top-right"
                        mode="light"
                        height="tall"
                        textTreatment="chrome"
                      />
                    </div>
                  </div>

                  {/* Macro Texture */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Macro Texture Backgrounds
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Close-up textures. Water, fabric, steel, abstract.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1668178894158-f05eee159c46?q=80&w=1200"
                        headline="WET"
                        subhead="Moisture"
                        position="center"
                        mode="neon"
                        height="tall"
                        textTreatment="masked"
                      />
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=1200"
                        headline="STEEL"
                        subhead="Industrial"
                        position="center"
                        mode="dark"
                        height="tall"
                        textTreatment="chrome"
                      />
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1762354766704-cb386e60dfe9?q=80&w=1200"
                        headline="FABRIC"
                        subhead="Tactile"
                        position="center"
                        mode="light"
                        height="tall"
                        textTreatment="default"
                      />
                    </div>
                  </div>

                  {/* Full-Bleed Scenic */}
                  <div>
                    <h3 className="text-2xl text-white uppercase tracking-wider mb-4">
                      Full-Bleed Scenic Shots
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Cityscape, landscape, architectural. Cinematic scale.
                    </p>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1716661188771-feac4eafd19b?q=80&w=2000"
                      headline="LONDON"
                      subhead="Where the Sweat Begins"
                      body="This is your city. Your night. Your brotherhood. Find the mess."
                      position="center"
                      mode="neon"
                      height="full"
                      textTreatment="masked"
                      cta={<HMButton variant="primary" icon={<ArrowRight size={20} />}>Explore Map</HMButton>}
                    />
                    
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1634317969401-a638e47bb55e?q=80&w=2000"
                        headline="URBAN"
                        subhead="City Life"
                        position="bottom-left"
                        mode="dark"
                        height="tall"
                        textTreatment="motion-blur"
                      />
                      <TextOverImage
                        image="https://images.unsplash.com/photo-1618423460823-fe7f29528433?q=80&w=2000"
                        headline="HORIZON"
                        subhead="Beyond"
                        position="bottom-right"
                        mode="light"
                        height="tall"
                        textTreatment="knockout"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'combinations',
              label: 'Combined Examples',
              content: (
                <div className="space-y-16 py-8">
                  <p className="text-gray-400 mb-6">
                    Real-world examples combining positions, modes, and treatments.
                  </p>

                  {/* Example 1: Hero Launch */}
                  <div>
                    <h3 className="text-xl text-white uppercase tracking-wider mb-4">
                      Hero Launch (Center × Neon × Masked)
                    </h3>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1744314080490-ed41f6319475?q=80&w=2000"
                      headline="HOTMESS"
                      subhead="The Brotherhood Begins"
                      body="London's first queer nightlife OS. Scan beacons. Earn XP. Connect with care."
                      position="center"
                      mode="neon"
                      height="hero"
                      textTreatment="masked"
                      cta={<HMButton variant="primary" size="lg">Join the Mess</HMButton>}
                    />
                  </div>

                  {/* Example 2: Collection Promo */}
                  <div>
                    <h3 className="text-xl text-white uppercase tracking-wider mb-4">
                      Collection Promo (Bottom-Left × Dark × Chrome)
                    </h3>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1763771420746-c75fefab51b5?q=80&w=2000"
                      headline="RAW"
                      subhead="Industrial Collection"
                      body="Heavy-duty gear. Built to last. Zero compromise."
                      position="bottom-left"
                      mode="dark"
                      height="tall"
                      textTreatment="chrome"
                      cta={<HMButton variant="secondary" icon={<ArrowRight size={20} />}>Shop Now</HMButton>}
                    />
                  </div>

                  {/* Example 3: Event Announcement */}
                  <div>
                    <h3 className="text-xl text-white uppercase tracking-wider mb-4">
                      Event Announcement (Top-Right × Light × Knockout)
                    </h3>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1618423460823-fe7f29528433?q=80&w=2000"
                      headline="HORIZON"
                      subhead="Summer Series 2024"
                      body="Four nights. Four venues. One brotherhood."
                      position="top-right"
                      mode="light"
                      height="tall"
                      textTreatment="knockout"
                      cta={<HMButton variant="primary">Get Tickets</HMButton>}
                    />
                  </div>

                  {/* Example 4: Editorial Feature */}
                  <div>
                    <h3 className="text-xl text-white uppercase tracking-wider mb-4">
                      Editorial Feature (Center × Dark × Motion Blur)
                    </h3>
                    <TextOverImage
                      image="https://images.unsplash.com/photo-1569444744140-83c39a75198f?q=80&w=2000"
                      headline="VELOCITY"
                      subhead="Never Stop Moving"
                      body="The city is alive. The night is yours. Chase it."
                      position="center"
                      mode="dark"
                      height="hero"
                      textTreatment="motion-blur"
                      cta={<HMButton variant="primary" icon={<Zap size={20} />}>Read Story</HMButton>}
                    />
                  </div>
                </div>
              ),
            },
          ]}
          defaultTab="positions"
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-12 mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            Text Over Image component system — Production ready
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wider mt-2">
            5 Positions × 3 Modes × 5 Treatments × 3 Background Types = 225 Combinations
          </p>
        </div>
      </footer>
    </div>
  );
}
