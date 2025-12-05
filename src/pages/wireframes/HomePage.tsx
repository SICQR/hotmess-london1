/**
 * HOME PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { useState } from 'react';
import { Scan, Radio, ShoppingBag, Zap, MapPin, Heart } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMBeaconCard } from '../../components/library/HMCard';
import { HMXPMeter } from '../../components/library/HMXPMeter';
import { BeaconScanner } from '../../components/BeaconScanner';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Scanner Modal */}
      {scannerOpen && (
        <BeaconScanner
          onScanSuccess={() => setScannerOpen(false)}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 lg:py-40 text-center">
        <h1 className="mb-6 glow-text">HOTMESS</h1>
        <p className="mb-4 text-xl md:text-2xl lg:text-3xl text-heat italic">
          Always too much, never enough.
        </p>
        <p className="mb-12 text-gray-300 max-w-2xl mx-auto">
          Masculine nightlife engineered for the guys who don't scare easy.
        </p>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <HMButton
            variant="primary"
            icon={<Scan size={20} />}
            onClick={() => setScannerOpen(true)}
            className="w-full"
          >
            Scan Beacon
          </HMButton>
          <HMButton
            variant="primary"
            icon={<Radio size={20} />}
            onClick={() => onNavigate('radio')}
            className="w-full"
          >
            Listen Live
          </HMButton>
          <HMButton
            variant="secondary"
            icon={<ShoppingBag size={20} />}
            onClick={() => onNavigate('shop')}
            className="w-full"
          >
            Shop Heat
          </HMButton>
          <HMButton
            variant="secondary"
            icon={<Zap size={20} />}
            onClick={() => onNavigate('rewards')}
            className="w-full"
          >
            Rewards
          </HMButton>
        </div>
      </section>

      {/* XP Status (if logged in) */}
      <section className="px-6 py-12 bg-charcoal/50">
        <div className="max-w-4xl mx-auto">
          <HMXPMeter current={2847} max={5000} level={12} />
        </div>
      </section>

      {/* Hot Beacons Right Now */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl text-hot uppercase tracking-wider">
            Hot Beacons Right Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HMBeaconCard
              name="Vauxhall Heat"
              location="Vauxhall, SE11"
              heat="scorching"
              scans={142}
              active={true}
              xpReward={50}
            />
            <HMBeaconCard
              name="Soho Pulse"
              location="Soho, W1D"
              heat="hot"
              scans={89}
              active={true}
              xpReward={35}
            />
            <HMBeaconCard
              name="Shoreditch Sweat"
              location="Shoreditch, E2"
              heat="warm"
              scans={45}
              active={true}
              xpReward={25}
            />
          </div>

          <div className="mt-8 text-center">
            <HMButton variant="secondary" onClick={() => onNavigate('map')}>
              View Full Map
            </HMButton>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 text-hot" />
            <h4 className="mb-3 text-hot uppercase tracking-wider">Scan. Sweat. Repeat.</h4>
            <p className="text-gray-300">
              Hit beacons across the city. Earn XP. Unlock rewards.
            </p>
          </div>
          <div className="text-center">
            <Radio size={48} className="mx-auto mb-4 text-hot" />
            <h4 className="mb-3 text-hot uppercase tracking-wider">Stay Loud. Stay Held.</h4>
            <p className="text-gray-300">
              24/7 radio. Sunday care shows. Brotherhood without the bullshit.
            </p>
          </div>
          <div className="text-center">
            <Heart size={48} className="mx-auto mb-4 text-hot" />
            <h4 className="mb-3 text-hot uppercase tracking-wider">We Look After Our Own.</h4>
            <p className="text-gray-300">
              Hand N Hand aftercare. Resources. Real talk. No lectures.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <HMButton variant="tertiary" onClick={() => onNavigate('care')} className="w-full">
            Care
          </HMButton>
          <HMButton variant="tertiary" onClick={() => onNavigate('community')} className="w-full">
            Community
          </HMButton>
          <HMButton variant="tertiary" onClick={() => onNavigate('drops')} className="w-full">
            Drops
          </HMButton>
          <HMButton variant="tertiary" onClick={() => onNavigate('profile')} className="w-full">
            Profile
          </HMButton>
        </div>
      </section>
    </div>
  );
}
