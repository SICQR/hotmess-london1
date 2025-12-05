/**
 * GLOBAL OS PAGE
 * 3D Globe visualization of worldwide HOTMESS intelligence
 */

import React, { useEffect, useState } from 'react';
import type { CityData } from '../types/intel';
import type { RouteId } from '../lib/routes';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import LiveGlobe3D, { type City as GlobeCity } from '../components/LiveGlobe3D';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api`;

interface GlobalOSProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function GlobalOS({ onNavigate }: GlobalOSProps) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [globeCities, setGlobeCities] = useState<GlobeCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeCities: 0,
    liveRooms: 0,
  });

  useEffect(() => {
    loadCities();
    loadStats();
  }, []);

  const loadCities = async () => {
    try {
      const response = await fetch(`${API_BASE}/intel/cities`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      const loadedCities = data.cities || [];
      setCities(loadedCities);
      
      // Convert CityData to GlobeCity format
      const converted: GlobeCity[] = loadedCities.map((city: CityData) => ({
        name: city.name,
        lat: city.coordinates.lat,
        lng: city.coordinates.lng,
        tier: city.active ? (1 as const) : (3 as const),
        active: city.active,
      }));
      setGlobeCities(converted);
    } catch (error) {
      console.error('Failed to load cities:', error);
      // Fallback to default cities
      const defaultCities: CityData[] = [
        {
          id: 'london',
          name: 'London',
          country: 'UK',
          coordinates: {
            lat: 51.5074,
            lng: -0.1278,
            x: -0.05,
            y: 0.51,
            z: 0.86,
          },
          timezone: 'Europe/London',
          active: true,
          event_count: 0,
          last_updated: new Date().toISOString(),
        },
      ];
      setCities(defaultCities);
      setGlobeCities([{
        name: 'London',
        lat: 51.5074,
        lng: -0.1278,
        tier: 1,
        active: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // TODO: Load global stats from API
    setStats({
      totalEvents: 0,
      activeCities: cities.length,
      liveRooms: 0,
    });
  };

  const handleCitySelect = (city: CityData) => {
    onNavigate('cityOS', { city: city.id });
  };

  const handleGlobeCityClick = (globeCity: GlobeCity) => {
    // Find the corresponding CityData
    const city = cities.find(c => c.name === globeCity.name);
    if (city) {
      handleCitySelect(city);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
          Loading globe...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="pointer-events-auto">
              <h1 className="text-3xl font-black tracking-tight">HOTMESS</h1>
              <p className="text-sm text-white/60">Global Nightlife OS</p>
            </div>

            {/* Global stats */}
            <div className="flex gap-4 pointer-events-auto">
              <StatCard label="Active Cities" value={cities.length} />
              <StatCard label="Events Today" value={stats.totalEvents} />
              <StatCard label="Live Rooms" value={stats.liveRooms} />
            </div>
          </div>
        </div>
      </div>

      {/* Globe */}
      <div className="h-screen w-full">
        <LiveGlobe3D
          className="w-full h-full"
          cities={globeCities}
          onCityClick={handleGlobeCityClick}
        />
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* City list */}
            <div className="flex gap-2 pointer-events-auto">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-sm font-bold hover:border-[#ff1694] hover:bg-[#ff1694]/20 transition-all"
                >
                  {city.name}
                  {city.event_count > 0 && (
                    <span className="ml-2 text-xs text-[#ff1694]">
                      {city.event_count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick links */}
            <div className="flex gap-2 pointer-events-auto">
              <QuickLink
                label="Radio"
                onClick={() => onNavigate('radio')}
              />
              <QuickLink
                label="Tickets"
                onClick={() => onNavigate('tickets')}
              />
              <QuickLink
                label="Hookups"
                onClick={() => onNavigate('hookupDashboard')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat card component
 */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 min-w-[120px]">
      <div className="text-xs text-white/60 uppercase">{label}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}

/**
 * Quick link button
 */
function QuickLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-[#ff1694]/20 backdrop-blur-md border border-[#ff1694]/50 rounded-lg text-sm font-bold hover:bg-[#ff1694] transition-all"
    >
      {label}
    </button>
  );
}