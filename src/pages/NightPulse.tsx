/**
 * NIGHT PULSE - Global Heat Map
 * 3D globe visualization of HOTMESS beacon activity worldwide
 */

import { useState } from 'react';
import { RouteId } from '../lib/routes';
import LiveGlobe3D from '../components/LiveGlobe3D';
import type { Beacon } from '../components/LiveGlobe3D';
import { GLOBAL_MICROCOPY } from '../constants/copy';
import { ArrowLeft, Clock, TrendingUp, MapPin, Users, Zap } from 'lucide-react';
import type { NightPulseCity } from '../types/night-pulse';

// 31 Gay nightlife venues worldwide with intensity for heat map
const NIGHT_PULSE_VENUES: Beacon[] = [
  // LONDON (10 venues)
  { id: "heaven-london", title: "Heaven", kind: "event", lat: 51.5081, lng: -0.1206, city: "LONDON", intensity: 0.95, ts: Date.now() },
  { id: "rvt-london", title: "Royal Vauxhall Tavern", kind: "event", lat: 51.4862, lng: -0.1235, city: "LONDON", intensity: 0.75, ts: Date.now() },
  { id: "glory-london", title: "The Glory", kind: "event", lat: 51.5392, lng: -0.0559, city: "LONDON", intensity: 0.65, ts: Date.now() },
  { id: "dalston-london", title: "Dalston Superstore", kind: "event", lat: 51.5466, lng: -0.0750, city: "LONDON", intensity: 0.70, ts: Date.now() },
  { id: "eagle-london", title: "Eagle London", kind: "event", lat: 51.4848, lng: -0.1208, city: "LONDON", intensity: 0.55, ts: Date.now() },
  { id: "xxl-london", title: "XXL London", kind: "event", lat: 51.5145, lng: -0.1270, city: "LONDON", intensity: 0.40, ts: Date.now() },
  { id: "hmd-london", title: "Horse Meat Disco @ QEII", kind: "event", lat: 51.5074, lng: -0.0272, city: "LONDON", intensity: 0.85, ts: Date.now() },
  { id: "circa-london", title: "Circa", kind: "event", lat: 51.4837, lng: -0.1149, city: "LONDON", intensity: 0.50, ts: Date.now() },
  { id: "yard-london", title: "The Yard", kind: "event", lat: 51.5124, lng: -0.1319, city: "LONDON", intensity: 0.80, ts: Date.now() },
  { id: "gay-london", title: "G-A-Y Bar", kind: "event", lat: 51.5101, lng: -0.1340, city: "LONDON", intensity: 0.75, ts: Date.now() },

  // BERLIN (5 venues)
  { id: "berghain", title: "Berghain", kind: "event", lat: 52.5108, lng: 13.4427, city: "BERLIN", intensity: 1.0, sponsored: true, ts: Date.now() },
  { id: "schwuz", title: "SchwuZ", kind: "event", lat: 52.4889, lng: 13.4294, city: "BERLIN", intensity: 0.65, ts: Date.now() },
  { id: "lab-berlin", title: "Laboratory", kind: "event", lat: 52.5026, lng: 13.4125, city: "BERLIN", intensity: 0.55, ts: Date.now() },
  { id: "ficken", title: "Ficken 3000", kind: "event", lat: 52.5244, lng: 13.4105, city: "BERLIN", intensity: 0.45, ts: Date.now() },
  { id: "monster", title: "Monster Ronson's", kind: "event", lat: 52.4965, lng: 13.4205, city: "BERLIN", intensity: 0.35, ts: Date.now() },

  // NEW YORK (5 venues)
  { id: "eagle-nyc", title: "The Eagle NYC", kind: "event", lat: 40.7484, lng: -73.9857, city: "NEW YORK", intensity: 0.90, ts: Date.now() },
  { id: "phoenix-nyc", title: "Phoenix Bar", kind: "event", lat: 40.7338, lng: -73.9973, city: "NEW YORK", intensity: 0.70, ts: Date.now() },
  { id: "therapy-nyc", title: "Therapy NYC", kind: "event", lat: 40.7625, lng: -73.9918, city: "NEW YORK", intensity: 0.65, ts: Date.now() },
  { id: "industry-nyc", title: "Industry Bar", kind: "event", lat: 40.7427, lng: -74.0070, city: "NEW YORK", intensity: 0.60, ts: Date.now() },
  { id: "ritz-nyc", title: "The Ritz", kind: "event", lat: 40.7442, lng: -73.9878, city: "NEW YORK", intensity: 0.50, ts: Date.now() },

  // SAN FRANCISCO (3 venues)
  { id: "eagle-sf", title: "The Eagle SF", kind: "event", lat: 37.7749, lng: -122.4115, city: "SAN FRANCISCO", intensity: 0.85, ts: Date.now() },
  { id: "powerhouse", title: "Powerhouse Bar", kind: "event", lat: 37.7633, lng: -122.4147, city: "SAN FRANCISCO", intensity: 0.65, ts: Date.now() },
  { id: "stud", title: "The Stud", kind: "event", lat: 37.7585, lng: -122.4105, city: "SAN FRANCISCO", intensity: 0.60, ts: Date.now() },

  // LOS ANGELES (1 venue)
  { id: "abbey", title: "The Abbey", kind: "event", lat: 34.0901, lng: -118.3617, city: "LOS ANGELES", intensity: 0.90, sponsored: true, ts: Date.now() },

  // AMSTERDAM (2 venues)
  { id: "church", title: "Church", kind: "event", lat: 52.3676, lng: 4.8945, city: "AMSTERDAM", intensity: 0.80, ts: Date.now() },
  { id: "prik", title: "Prik", kind: "event", lat: 52.3702, lng: 4.8952, city: "AMSTERDAM", intensity: 0.70, ts: Date.now() },

  // SYDNEY (2 venues)
  { id: "arq", title: "ARQ Sydney", kind: "event", lat: -33.8688, lng: 151.2093, city: "SYDNEY", intensity: 0.95, ts: Date.now() },
  { id: "imperial", title: "Imperial Erskineville", kind: "event", lat: -33.9013, lng: 151.1847, city: "SYDNEY", intensity: 0.75, ts: Date.now() },

  // PARIS (2 venues)
  { id: "depot", title: "Le Depot", kind: "event", lat: 48.8606, lng: 2.3522, city: "PARIS", intensity: 0.90, ts: Date.now() },
  { id: "cud", title: "CUD Bar", kind: "event", lat: 48.8584, lng: 2.3470, city: "PARIS", intensity: 0.65, ts: Date.now() },

  // BARCELONA (1 venue)
  { id: "metro", title: "Metro Disco", kind: "event", lat: 41.3851, lng: 2.1734, city: "BARCELONA", intensity: 0.85, ts: Date.now() },
];

// Helper to get country from city
function getCountryFromCity(city?: string): string {
  const cityToCountry: Record<string, string> = {
    'LONDON': 'UK',
    'BERLIN': 'DE',
    'NEW YORK': 'US',
    'SAN FRANCISCO': 'US',
    'LOS ANGELES': 'US',
    'AMSTERDAM': 'NL',
    'SYDNEY': 'AU',
    'PARIS': 'FR',
    'BARCELONA': 'ES',
  };
  return cityToCountry[city || ''] || 'Unknown';
}

interface NightPulseProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function NightPulse({ onNavigate }: NightPulseProps) {
  const [selectedCity, setSelectedCity] = useState<NightPulseCity | null>(null);

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
          <LiveGlobe3D
            className="w-full h-full"
            layers={{
              pins: true,      // Show venue markers
              heat: true,      // 🔥 PINK PULSING HEAT MAP
              trails: false,   // Optional connection trails
              cities: true,    // City labels
            }}
            beacons={NIGHT_PULSE_VENUES}
            onBeaconClick={(beacon) => {
              // Convert beacon to city format for existing panel
              setSelectedCity({
                city_id: beacon.city || beacon.id,
                city_name: beacon.city || beacon.title || 'Unknown',
                country_code: getCountryFromCity(beacon.city),
                latitude: beacon.lat,
                longitude: beacon.lng,
                active_beacons: null,
                scans_last_hour: Math.floor((beacon.intensity || 0.5) * 100),
                heat_intensity: (beacon.intensity || 0.5) * 100,
                last_activity_at: new Date().toISOString(),
              });
            }}
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