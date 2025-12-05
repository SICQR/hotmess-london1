/**
 * NIGHT PULSE - Global Heat Map
 * 3D globe visualization of HOTMESS beacon activity worldwide
 */

import { useState } from 'react';
import { RouteId } from '../lib/routes';
import { MapboxGlobe } from '../components/globe/MapboxGlobe';
import { ArrowLeft, Clock, TrendingUp, MapPin, Users, Zap } from 'lucide-react';

interface NightPulseProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface CityStats {
  city: string;
  country: string;
  scans: number;
  listeners: number;
  coordinates: [number, number];
}

export function NightPulse({ onNavigate }: NightPulseProps) {
  const [timeWindow, setTimeWindow] = useState<'tonight' | 'weekend' | 'month'>('tonight');
  const [selectedCity, setSelectedCity] = useState<CityStats | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-md z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '32px', lineHeight: '1' }}>NIGHT PULSE</h1>
                <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                  Global beacon activity in real-time
                </p>
              </div>
            </div>

            {/* Time Window Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeWindow('tonight')}
                className={`px-4 py-2 transition-all ${
                  timeWindow === 'tonight'
                    ? 'bg-[#ff1694] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                <Clock className="w-3 h-3 inline mr-2" />
                TONIGHT
              </button>
              <button
                onClick={() => setTimeWindow('weekend')}
                className={`px-4 py-2 transition-all ${
                  timeWindow === 'weekend'
                    ? 'bg-[#ff1694] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                <TrendingUp className="w-3 h-3 inline mr-2" />
                WEEKEND
              </button>
              <button
                onClick={() => setTimeWindow('month')}
                className={`px-4 py-2 transition-all ${
                  timeWindow === 'month'
                    ? 'bg-[#ff1694] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                <MapPin className="w-3 h-3 inline mr-2" />
                30 DAYS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Globe Container - FIXED HEIGHT */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <MapboxGlobe 
            timeWindow={timeWindow}
            onCityClick={setSelectedCity}
          />
        </div>
      </div>

      {/* City Details Panel */}
      {selectedCity && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 backdrop-blur-lg p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white mb-1" style={{ fontWeight: 900, fontSize: '28px' }}>
                  {selectedCity.city}
                </h2>
                <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
                  {selectedCity.country}
                </p>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-[#ff1694]" />
                  <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                    BEACON SCANS
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
                  {selectedCity.scans}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#ff1694]" />
                  <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                    ACTIVE USERS
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
                  {selectedCity.listeners}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#ff1694]" />
                  <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                    COORDINATES
                  </span>
                </div>
                <p className="text-white/60 font-mono" style={{ fontWeight: 400, fontSize: '12px' }}>
                  {selectedCity.coordinates[1].toFixed(2)}°, {selectedCity.coordinates[0].toFixed(2)}°
                </p>
              </div>

              <button
                onClick={() => onNavigate('beacons')}
                className="bg-[#ff1694] hover:bg-[#ff1694]/80 transition-colors flex items-center justify-center gap-2 rounded-lg"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                <Zap className="w-4 h-4" />
                VIEW BEACONS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-24 left-4 bg-black/80 border border-white/10 backdrop-blur-md p-4 max-w-xs">
        <p className="text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
          HEAT INTENSITY
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#ff1694]" />
            <span className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
              High Activity (100+ scans)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#ff0080]" />
            <span className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
              Medium Activity (10-99 scans)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#e70f3c]" />
            <span className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
              Low Activity (1-9 scans)
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-24 right-4 bg-black/80 border border-white/10 backdrop-blur-md p-4 max-w-xs">
        <p className="text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
          CONTROLS
        </p>
        <ul className="space-y-2 text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
          <li>• <strong>Drag</strong> to rotate globe</li>
          <li>• <strong>Scroll</strong> to zoom in/out</li>
          <li>• <strong>Click</strong> heat zone for details</li>
          <li>• <strong>Switch</strong> time windows above</li>
        </ul>
      </div>
    </div>
  );
}