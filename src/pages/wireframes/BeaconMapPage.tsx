/**
 * BEACON MAP / DROPS PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { useState } from 'react';
import { MapPin, Scan, Filter } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMBeaconCard } from '../../components/library/HMCard';
import { HMBeaconBadge, HMMapPin } from '../../components/library/HMBeaconBadge';
import { HMChip } from '../../components/library/HMTabs';
import { BeaconScanner } from '../../components/BeaconScanner';

interface BeaconMapPageProps {
  onNavigate: (page: string) => void;
}

export function BeaconMapPage({ onNavigate }: BeaconMapPageProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [heatFilter, setHeatFilter] = useState<string>('all');
  const [selectedBeacon, setSelectedBeacon] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Scanner Modal */}
      {scannerOpen && (
        <BeaconScanner
          onScanSuccess={() => setScannerOpen(false)}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Live Heat Map
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Track real-time beacon activity across London. Scan. Earn XP. Own the night.
          </p>
        </div>
      </section>

      {/* Scan CTA */}
      <section className="px-6 py-8 bg-hot/10 border-b border-hot/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white mb-1">Near a beacon? Scan now.</p>
            <p className="text-sm text-gray-400">Earn up to 50 XP per scan</p>
          </div>
          <HMButton
            variant="primary"
            icon={<Scan size={20} />}
            onClick={() => setScannerOpen(true)}
          >
            Scan Beacon
          </HMButton>
        </div>
      </section>

      {/* Heat Filter */}
      <section className="px-6 py-6 bg-charcoal/50 sticky top-16 lg:top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Filter:
            </span>
            <HMChip
              label="All"
              active={heatFilter === 'all'}
              onClick={() => setHeatFilter('all')}
              variant="hot"
            />
            <HMChip
              label="Scorching"
              active={heatFilter === 'scorching'}
              onClick={() => setHeatFilter('scorching')}
              variant="hot"
            />
            <HMChip
              label="Hot"
              active={heatFilter === 'hot'}
              onClick={() => setHeatFilter('hot')}
              variant="heat"
            />
            <HMChip
              label="Warm"
              active={heatFilter === 'warm'}
              onClick={() => setHeatFilter('warm')}
              variant="lime"
            />
          </div>
        </div>
      </section>

      {/* Map Visualization (Placeholder) */}
      <section className="px-6 py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video md:aspect-[21/9] bg-black border border-hot/30 rounded relative overflow-hidden">
            {/* Map placeholder with pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-600 text-sm uppercase tracking-wider">
                Map Component (Integrate Google Maps / Mapbox)
              </p>
            </div>

            {/* Sample Pins */}
            <div className="absolute top-1/4 left-1/3">
              <HMMapPin heat="scorching" active={selectedBeacon === '1'} onClick={() => setSelectedBeacon('1')} />
            </div>
            <div className="absolute top-1/3 left-1/2">
              <HMMapPin heat="hot" active={selectedBeacon === '2'} onClick={() => setSelectedBeacon('2')} />
            </div>
            <div className="absolute top-2/3 left-2/3">
              <HMMapPin heat="warm" active={selectedBeacon === '3'} onClick={() => setSelectedBeacon('3')} />
            </div>
            <div className="absolute top-1/2 left-1/4">
              <HMMapPin heat="cold" active={selectedBeacon === '4'} onClick={() => setSelectedBeacon('4')} />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-400 uppercase tracking-wider">Legend:</span>
            <HMBeaconBadge heat="scorching" size="sm" />
            <HMBeaconBadge heat="hot" size="sm" />
            <HMBeaconBadge heat="warm" size="sm" />
            <HMBeaconBadge heat="cold" size="sm" />
          </div>
        </div>
      </section>

      {/* Beacon List */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl text-hot uppercase tracking-wider">
            All Beacons
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
            <HMBeaconCard
              name="Camden Mess"
              location="Camden, NW1"
              heat="warm"
              scans={38}
              active={true}
              xpReward={25}
            />
            <HMBeaconCard
              name="Clapham Heat"
              location="Clapham, SW4"
              heat="hot"
              scans={67}
              active={true}
              xpReward={35}
            />
            <HMBeaconCard
              name="King's Cross Zone"
              location="King's Cross, N1"
              heat="cold"
              scans={12}
              active={false}
              xpReward={15}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <h3 className="mb-8 text-2xl text-hot uppercase tracking-wider text-center">
            How Beacons Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl text-hot">01</div>
              <h4 className="mb-2 text-white uppercase tracking-wider">Find</h4>
              <p className="text-sm text-gray-400">
                Beacons are live at partner venues and events across London.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl text-hot">02</div>
              <h4 className="mb-2 text-white uppercase tracking-wider">Scan</h4>
              <p className="text-sm text-gray-400">
                Use the app to scan the QR code when you're there.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl text-hot">03</div>
              <h4 className="mb-2 text-white uppercase tracking-wider">Earn</h4>
              <p className="text-sm text-gray-400">
                Get XP instantly. More scans = more heat. Level up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
