/**
 * EDITORIAL SHOWCASE — Demo page for all editorial components
 * View all brand heroes, splash screens, and shop pages
 */

import { useState } from 'react';
import { HMButton } from '../components/library/HMButton';
import { HMTabs } from '../components/library/HMTabs';
import {
  HotmessHero,
  RawHero,
  HungHero,
  HighHero,
  SuperHero,
  ChromeSplash,
  VaporSplash,
  PortraitSplash,
  RedRoomSplash,
  WhiteoutSplash,
} from '../components/editorial';
import { 
  ShopPLP, 
  ShopPDP,
  HotmessHomepage,
  RawHomepage,
  HungHomepage,
  HighHomepage,
  SuperHomepage,
  TextOverImageShowcase,
  TextOverImageEnhancedShowcase,
} from '../pages/editorial';

interface EditorialShowcaseProps {
  onNavigate?: (route: any, params?: any) => void;
}

export function EditorialShowcase({ onNavigate }: EditorialShowcaseProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [splashVariant, setSplashVariant] = useState<'chrome' | 'vapor' | 'portrait' | 'redroom' | 'whiteout'>('chrome');
  const [shopView, setShopView] = useState<'plp' | 'pdp'>('plp');

  const handleShowSplash = (variant: typeof splashVariant) => {
    setSplashVariant(variant);
    setShowSplash(true);
  };

  if (showSplash) {
    const SplashComponents = {
      chrome: ChromeSplash,
      vapor: VaporSplash,
      portrait: PortraitSplash,
      redroom: RedRoomSplash,
      whiteout: WhiteoutSplash,
    };
    const SplashComponent = SplashComponents[splashVariant];
    return <SplashComponent onEnter={() => setShowSplash(false)} isAgeGate={true} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl text-hot uppercase tracking-wider mb-4">
            Editorial Showcase
          </h1>
          <p className="text-gray-300 text-lg">
            Bold brutalism × luxury queer editorial for HOTMESS LONDON
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'heroes',
                label: 'Brand Heroes',
                content: (
                  <div className="space-y-16 py-8">
                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HOTMESS LONDON — The Ecosystem
                      </h3>
                      <HotmessHero onNavigate={onNavigate} />
                    </div>

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        RAW — Hyper-Masculine
                      </h3>
                      <RawHero onNavigate={onNavigate} />
                    </div>

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HUNG — Sexual Confidence
                      </h3>
                      <HungHero onNavigate={onNavigate} />
                    </div>

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HIGH — Psychedelia
                      </h3>
                      <HighHero onNavigate={onNavigate} />
                    </div>

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        SUPER — Elite Editorial
                      </h3>
                      <SuperHero onNavigate={onNavigate} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'text-over-image',
                label: 'Text Over Image',
                content: <TextOverImageEnhancedShowcase onNavigate={onNavigate} />,
              },
              {
                id: 'splash',
                label: 'Splash Screens',
                content: (
                  <div className="py-8">
                    <p className="text-gray-300 mb-8">
                      Click any variant to view the full splash screen experience
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <button
                        onClick={() => handleShowSplash('chrome')}
                        className="p-6 bg-charcoal border-2 border-steel/30 hover:border-steel transition-all text-left group"
                      >
                        <h4 className="text-xl text-steel mb-2 uppercase tracking-wider group-hover:text-white transition-colors">
                          Wet Black Chrome
                        </h4>
                        <p className="text-sm text-gray-400">
                          Chrome reflections on wet black texture
                        </p>
                      </button>

                      <button
                        onClick={() => handleShowSplash('vapor')}
                        className="p-6 bg-charcoal border-2 border-neon-lime/30 hover:border-neon-lime transition-all text-left group"
                      >
                        <h4 className="text-xl text-neon-lime mb-2 uppercase tracking-wider group-hover:text-white transition-colors">
                          Neon Vapor Haze
                        </h4>
                        <p className="text-sm text-gray-400">
                          Psychedelic vapor with neon gradients
                        </p>
                      </button>

                      <button
                        onClick={() => handleShowSplash('portrait')}
                        className="p-6 bg-charcoal border-2 border-hot/30 hover:border-hot transition-all text-left group"
                      >
                        <h4 className="text-xl text-hot mb-2 uppercase tracking-wider group-hover:text-white transition-colors">
                          Spotlight Portrait
                        </h4>
                        <p className="text-sm text-gray-400">
                          Dramatic portrait with spotlight focus
                        </p>
                      </button>

                      <button
                        onClick={() => handleShowSplash('redroom')}
                        className="p-6 bg-charcoal border-2 border-heat/30 hover:border-heat transition-all text-left group"
                      >
                        <h4 className="text-xl text-heat mb-2 uppercase tracking-wider group-hover:text-white transition-colors">
                          Red-Room Sweat Fog
                        </h4>
                        <p className="text-sm text-gray-400">
                          Intense red atmosphere with fog overlay
                        </p>
                      </button>

                      <button
                        onClick={() => handleShowSplash('whiteout')}
                        className="p-6 bg-white border-2 border-gray-300 hover:border-black transition-all text-left group"
                      >
                        <h4 className="text-xl text-black mb-2 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                          White-Out Minimal Luxury
                        </h4>
                        <p className="text-sm text-gray-600">
                          Stark white minimalism with extreme contrast
                        </p>
                      </button>
                    </div>
                  </div>
                ),
              },
              {
                id: 'shop',
                label: 'Shop Pages',
                content: (
                  <div className="py-8">
                    <div className="flex gap-4 mb-8">
                      <HMButton
                        variant={shopView === 'plp' ? 'primary' : 'secondary'}
                        onClick={() => setShopView('plp')}
                      >
                        Product Listing (PLP)
                      </HMButton>
                      <HMButton
                        variant={shopView === 'pdp' ? 'primary' : 'secondary'}
                        onClick={() => setShopView('pdp')}
                      >
                        Product Detail (PDP)
                      </HMButton>
                    </div>

                    {shopView === 'plp' && (
                      <ShopPLP 
                        onNavigate={onNavigate}
                        onProductClick={() => setShopView('pdp')}
                      />
                    )}

                    {shopView === 'pdp' && (
                      <ShopPDP 
                        onNavigate={onNavigate}
                        onBack={() => setShopView('plp')}
                      />
                    )}
                  </div>
                ),
              },
              {
                id: 'homepages',
                label: 'Brand Homepages',
                content: (
                  <div className="space-y-16 py-8">
                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HOTMESS LONDON Homepage
                      </h3>
                      <HotmessHomepage onNavigate={onNavigate} />
                    </div>

                    <div className="h-1 bg-gradient-to-r from-transparent via-hot to-transparent my-16" />

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        RAW Homepage
                      </h3>
                      <RawHomepage onNavigate={onNavigate} />
                    </div>

                    <div className="h-1 bg-gradient-to-r from-transparent via-steel to-transparent my-16" />

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HUNG Homepage
                      </h3>
                      <HungHomepage onNavigate={onNavigate} />
                    </div>

                    <div className="h-1 bg-gradient-to-r from-transparent via-hot to-transparent my-16" />

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        HIGH Homepage
                      </h3>
                      <HighHomepage onNavigate={onNavigate} />
                    </div>

                    <div className="h-1 bg-gradient-to-r from-transparent via-neon-lime to-transparent my-16" />

                    <div>
                      <h3 className="text-2xl text-white uppercase tracking-wider mb-6">
                        SUPER Homepage
                      </h3>
                      <SuperHomepage onNavigate={onNavigate} />
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="heroes"
          />
        </div>
      </section>
    </div>
  );
}