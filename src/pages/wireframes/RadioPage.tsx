/**
 * RADIO PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { useState } from 'react';
import { Play, Pause, Volume2, Radio } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMRadioShowCard } from '../../components/library/HMCard';
import { HMSlider } from '../../components/library/HMSlider';
import { RadioWaveform } from '../../components/RadioWaveform';

interface RadioPageProps {
  onNavigate: (page: string) => void;
}

export function RadioPage({ onNavigate }: RadioPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  return (
    <div className="min-h-screen">
      {/* Now Playing Hero */}
      <section className="px-6 py-16 md:py-24 lg:py-32 text-center border-b border-hot/30">
        <div className="max-w-4xl mx-auto">
          {/* Live Indicator */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-hot/20 border border-hot">
            <div className="w-3 h-3 bg-hot rounded-full beacon-flare" />
            <span className="text-sm uppercase tracking-wider text-hot">Live Now</span>
          </div>

          <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wider">
            Nightbody Mixes
          </h1>
          <p className="mb-2 text-lg text-gray-400">with Nic Denton</p>
          <p className="mb-12 text-gray-500 italic">
            Bass-heavy, sweat-soaked beats for the men who move.
          </p>

          {/* Waveform */}
          <div className="mb-8">
            <RadioWaveform isPlaying={isPlaying} />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <HMButton
              variant="primary"
              size="lg"
              icon={isPlaying ? <Pause size={24} /> : <Play size={24} />}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Pause' : 'Listen Live'}
            </HMButton>
          </div>

          {/* Volume Control */}
          <div className="max-w-md mx-auto">
            <HMSlider
              label="Volume"
              min={0}
              max={100}
              value={volume}
              onChange={setVolume}
              unit="%"
            />
          </div>
        </div>
      </section>

      {/* Show Schedule */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl text-hot uppercase tracking-wider">
            Show Schedule
          </h2>

          <div className="space-y-4">
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
            <HMRadioShowCard
              name="Deep Cuts"
              host="Various Artists"
              time="Wednesdays, 8PM-10PM"
              live={false}
              description="Underground sounds. No rules. Pure heat."
            />
            <HMRadioShowCard
              name="Morning Mess"
              host="DJ Sweat"
              time="Saturdays, 9AM-12PM"
              live={false}
              description="Recovery vibes. Coffee. Brotherhood."
            />
          </div>
        </div>
      </section>

      {/* About Radio */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <Radio size={64} className="mx-auto mb-6 text-hot" />
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            24/7 Community Radio
          </h3>
          <p className="mb-8 text-gray-300 leading-relaxed">
            HOTMESS Radio runs 24/7. Mixes, care shows, and live sets from the brotherhood. 
            Stay loud. Stay held. No algorithm. Just heat.
          </p>
          <HMButton variant="secondary" onClick={() => onNavigate('care')}>
            Hand N Hand Care Shows
          </HMButton>
        </div>
      </section>

      {/* Past Shows / Archive */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="mb-8 text-2xl text-hot uppercase tracking-wider">
            Recent Shows
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all cursor-pointer"
              >
                <div className="mb-3 text-xs text-gray-500">Dec {i}, 2024</div>
                <h4 className="mb-2 text-white">Nightbody Mixes #{i}</h4>
                <p className="text-sm text-gray-400">with Nic Denton</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <HMButton variant="tertiary">View Full Archive</HMButton>
          </div>
        </div>
      </section>
    </div>
  );
}
