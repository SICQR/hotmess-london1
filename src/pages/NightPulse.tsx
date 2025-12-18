/**
 * NIGHT PULSE - Global Heat Map
 * 3D globe visualization of HOTMESS beacon activity worldwide
 */

import { useState } from 'react';
import { RouteId } from '../lib/routes';
import { UnifiedGlobe } from '../components/globe/UnifiedGlobe';
import { useNightPulseRealtime } from '../hooks/useNightPulseRealtime';
import { GLOBAL_MICROCOPY } from '../constants/copy';
import { ArrowLeft, Clock, TrendingUp, MapPin, Users, Zap } from 'lucide-react';
import type { NightPulseCity } from '../types/night-pulse';

interface NightPulseProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function NightPulse({ onNavigate }: NightPulseProps) {
  const [selectedCity, setSelectedCity] = useState<NightPulseCity | null>(null);
  const { cities, loading, error, lastUpdate } = useNightPulseRealtime();

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
                  {GLOBAL_MICROCOPY.noTracking}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Globe Container - FIXED HEIGHT */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <UnifiedGlobe 
            nightPulseCities={cities}
            showBeacons={false}
            showHeat={true}
            showCities={true}
            showTickets={false}
            showTrails={false}
            onCityClick={(city) => {
              if ('city_name' in city) {
                setSelectedCity(city as NightPulseCity);
              }
            }}
            realtimeEnabled={true}
          />
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-20 right-4 bg-black/90 border border-[#ff1694]/30 backdrop-blur-md p-4 max-w-xs z-20">
        <p className="text-[#ff1694] uppercase mb-2" style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em' }}>
          🌍 NIGHT PULSE REAL-TIME
        </p>
        <p className="text-white mb-1" style={{ fontWeight: 900, fontSize: '24px' }}>
          {cities.length} CITIES
        </p>
        <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '11px' }}>
          Live nightlife activity
        </p>
        <div className="text-white/40 mb-3" style={{ fontWeight: 400, fontSize: '9px' }}>
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* City Details Panel */}
      {selectedCity && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 backdrop-blur-lg p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white mb-1" style={{ fontWeight: 900, fontSize: '28px' }}>
                  {selectedCity.city_name}
                </h2>
                <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
                  {selectedCity.country_code}
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
                    {selectedCity.active_beacons !== null ? 'BEACONS' : 'ACTIVITY'}
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
                  {selectedCity.active_beacons !== null ? selectedCity.active_beacons : 'Yes'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#ff1694]" />
                  <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                    SCANS/HOUR
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
                  {selectedCity.scans_last_hour}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#ff1694]" />
                  <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                    HEAT
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
                  {selectedCity.heat_intensity}%
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
            
            <p className="mt-4 text-center text-white/40" style={{ fontWeight: 400, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {GLOBAL_MICROCOPY.aggregate}
            </p>
          </div>
        </div>
      )}


    </div>
  );
}