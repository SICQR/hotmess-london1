/**
 * HOTMESS LONDON — Component Library Showcase
 * View all components and their variants
 */

import { useState } from 'react';
import { Scan, Zap, ShoppingBag, Radio } from 'lucide-react';

// Import all library components
import { HMButton, ScanBeaconButton, ListenLiveButton, ShopHeatButton, RedeemButton } from '../components/library/HMButton';
import { HMInput } from '../components/library/HMInput';
import { HMProductCard, HMBeaconCard, HMRewardCard, HMVendorCard, HMRadioShowCard } from '../components/library/HMCard';
import { HMXPMeter } from '../components/library/HMXPMeter';
import { HMBeaconBadge, HMMapPin } from '../components/library/HMBeaconBadge';
import { HMModal } from '../components/library/HMModal';
import { HMTabs, HMChip } from '../components/library/HMTabs';
import { HMToggle } from '../components/library/HMToggle';
import { HMSlider } from '../components/library/HMSlider';

interface ComponentLibraryProps {
  onNavigate: (page: string) => void;
}

export function ComponentLibrary({ onNavigate }: ComponentLibraryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 glow-text">COMPONENT LIBRARY</h1>
          <p className="text-lg text-gray-300">
            hm/* components — Masculine. Bold. Care-first.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* Buttons */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Button
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <HMButton variant="primary">Primary Button</HMButton>
                  <HMButton variant="secondary">Secondary Button</HMButton>
                  <HMButton variant="tertiary">Tertiary Button</HMButton>
                  <HMButton variant="primary" disabled>Disabled</HMButton>
                  <HMButton variant="primary" loading>Loading...</HMButton>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Sizes</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <HMButton variant="primary" size="sm">Small</HMButton>
                  <HMButton variant="primary" size="md">Medium</HMButton>
                  <HMButton variant="primary" size="lg">Large</HMButton>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">With Icons</h4>
                <div className="flex flex-wrap gap-4">
                  <HMButton variant="primary" icon={<Scan size={16} />}>Scan Beacon</HMButton>
                  <HMButton variant="secondary" icon={<Radio size={16} />}>Listen Live</HMButton>
                  <HMButton variant="tertiary" icon={<ShoppingBag size={16} />}>Shop</HMButton>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Preset Buttons</h4>
                <div className="flex flex-wrap gap-4">
                  <ScanBeaconButton variant="primary" />
                  <ListenLiveButton variant="primary" />
                  <ShopHeatButton variant="secondary" />
                  <RedeemButton variant="primary" />
                </div>
              </div>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Input
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <HMInput variant="text" label="Text Input" placeholder="Enter text..." />
              <HMInput variant="email" label="Email Input" placeholder="your@email.com" />
              <HMInput variant="password" label="Password Input" placeholder="••••••••" />
              <HMInput variant="code" label="Code Input" placeholder="000000" maxLength={6} />
              <HMInput variant="text" label="Error State" error="Something went wrong." />
              <HMInput variant="text" label="Success State" success="Looking good!" />
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Card
            </h2>
            
            <div className="space-y-8">
              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Product Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <HMProductCard
                    image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
                    name="Sweat Tank"
                    collection="RAW"
                    price={45}
                    xp={25}
                    inStock={true}
                    bestseller={true}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Beacon Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HMBeaconCard
                    name="Vauxhall Heat"
                    location="Vauxhall, SE11"
                    heat="high"
                    scans={142}
                    active={true}
                    xpReward={50}
                  />
                  <HMBeaconCard
                    name="Soho Pulse"
                    location="Soho, W1D"
                    heat="medium"
                    scans={89}
                    active={true}
                    xpReward={35}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Reward Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <HMRewardCard
                    name="Free Drink Token"
                    description="Redeem at any HOTMESS event"
                    cost={500}
                    locked={false}
                    canAfford={true}
                  />
                  <HMRewardCard
                    name="VIP Access"
                    description="Skip the line at partner venues"
                    cost={1000}
                    locked={false}
                    canAfford={false}
                  />
                  <HMRewardCard
                    name="Secret Beacon"
                    description="Unlock exclusive high-XP beacon"
                    cost={2000}
                    locked={true}
                    canAfford={false}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Vendor Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <HMVendorCard
                    name="Sweat Supply Co."
                    category="Athletic Wear"
                    rating={4.8}
                    products={23}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Radio Show Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HMRadioShowCard
                    name="Nightbody Mixes"
                    host="Nic Denton"
                    time="Every Friday, 10PM-2AM"
                    live={true}
                    description="Bass-heavy, sweat-soaked beats for the men who move."
                  />
                  <HMRadioShowCard
                    name="Hand N Hand Sunday"
                    host="Stewart Who?"
                    time="Sundays, 2PM-4PM"
                    live={false}
                    description="Care-first radio. Aftercare, resources, real talk."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* XP Meter */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/XPMeter
            </h2>
            <div className="max-w-2xl space-y-6">
              <HMXPMeter current={2847} max={5000} level={12} />
              <HMXPMeter current={4950} max={5000} level={12} />
              <HMXPMeter current={5000} max={5000} level={12} />
            </div>
          </section>

          {/* Beacon Badge */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/BeaconBadge
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Heat States</h4>
                <div className="flex flex-wrap gap-4">
                  <HMBeaconBadge heat="cold" scans={12} />
                  <HMBeaconBadge heat="warm" scans={45} />
                  <HMBeaconBadge heat="hot" scans={89} />
                  <HMBeaconBadge heat="scorching" scans={142} />
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Map Pins</h4>
                <div className="flex flex-wrap gap-6 items-center p-8 bg-black/50 border border-hot/30">
                  <HMMapPin heat="cold" active={false} />
                  <HMMapPin heat="warm" active={false} />
                  <HMMapPin heat="hot" active={true} />
                  <HMMapPin heat="scorching" active={true} />
                </div>
              </div>
            </div>
          </section>

          {/* Modal */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Modal
            </h2>
            <HMButton variant="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </HMButton>

            <HMModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Example Modal"
              footer={
                <>
                  <HMButton variant="tertiary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </HMButton>
                  <HMButton variant="primary" onClick={() => setModalOpen(false)}>
                    Confirm
                  </HMButton>
                </>
              }
            >
              <p className="text-gray-300">
                This is a modal dialog. It traps focus, closes on Escape, and can be dismissed by clicking the backdrop.
              </p>
            </HMModal>
          </section>

          {/* Tabs */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Tabs
            </h2>
            <HMTabs
              tabs={[
                {
                  id: 'tab1',
                  label: 'Tab One',
                  content: <p className="text-gray-300">Content for tab one.</p>,
                },
                {
                  id: 'tab2',
                  label: 'Tab Two',
                  content: <p className="text-gray-300">Content for tab two.</p>,
                },
                {
                  id: 'tab3',
                  label: 'Tab Three',
                  content: <p className="text-gray-300">Content for tab three.</p>,
                },
              ]}
            />

            <div className="mt-8">
              <h4 className="mb-4 text-sm uppercase tracking-wider text-gray-400">Chips</h4>
              <div className="flex flex-wrap gap-3">
                <HMChip label="Default Active" active />
                <HMChip label="Default" />
                <HMChip label="Hot Active" variant="hot" active />
                <HMChip label="Hot" variant="hot" />
                <HMChip label="Heat Active" variant="heat" active />
                <HMChip label="Lime" variant="lime" />
              </div>
            </div>
          </section>

          {/* Toggle */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Toggle
            </h2>
            <div className="space-y-4">
              <HMToggle
                label="Enable Notifications"
                enabled={toggleEnabled}
                onChange={setToggleEnabled}
              />
              <HMToggle label="Auto-scan Beacons" enabled={true} onChange={() => {}} />
              <HMToggle label="Disabled Toggle" enabled={false} onChange={() => {}} disabled />
            </div>
          </section>

          {/* Slider */}
          <section>
            <h2 className="mb-6 text-2xl text-hot uppercase tracking-wider border-b border-hot/30 pb-3">
              hm/Slider
            </h2>
            <div className="max-w-2xl space-y-6">
              <HMSlider
                label="XP Multiplier"
                min={1}
                max={10}
                value={sliderValue}
                onChange={setSliderValue}
                unit="x"
              />
              <HMSlider
                label="Beacon Radius"
                min={100}
                max={1000}
                value={500}
                onChange={() => {}}
                unit="m"
                step={50}
              />
            </div>
          </section>
        </div>

        {/* Special Showcases */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <h2 className="text-3xl text-white uppercase tracking-wider mb-8 text-center">
            🎨 Special Showcases
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              className="bg-gradient-to-br from-hot to-heat p-8 rounded-lg text-left hover:scale-105 transition-transform"
              onClick={() => onNavigate('editorial')}
            >
              <h3 className="text-2xl uppercase tracking-wider mb-2 text-black">
                Editorial System
              </h3>
              <p className="text-black/80 mb-4">
                5 brand heroes, splash screens, shop pages, text over image (225+ combinations)
              </p>
              <p className="text-xs uppercase tracking-widest text-black/60">
                Bold Brutalism × Luxury Editorial
              </p>
            </button>
            
            <button
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 p-8 rounded-lg text-left hover:scale-105 transition-transform"
              onClick={() => onNavigate('agegate')}
            >
              <h3 className="text-2xl uppercase tracking-wider mb-2 text-white">
                18+ Age Gate
              </h3>
              <p className="text-gray-400 mb-4">
                3 color modes, 5 copy variants, beacon scanning, full splash animation
              </p>
              <p className="text-xs uppercase tracking-widest text-gray-600">
                Men-Only. Consent Required. 🔞
              </p>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-16 text-center">
          <HMButton variant="secondary" onClick={() => onNavigate('home')}>
            Back to Home
          </HMButton>
        </div>
      </div>
    </div>
  );
}