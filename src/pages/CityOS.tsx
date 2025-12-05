/**
 * CITY OS PAGE
 * Complete intelligence view for a city:
 * - Events tonight
 * - DJ set times
 * - Queer markets/pop-ups
 * - Sex-positive events
 * - Pride calendar
 * - RAW CONVICT drops
 * - TikTok trends
 * - Room vibes
 */

import React, { useEffect, useState } from 'react';
import type { CityIntel, Event, SetTime } from '../types/intel';
import type { RouteId } from '../lib/routes';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { RadioStats } from '../components/RadioStats';
import { LiveListeners } from '../components/LiveListeners';
import { useRadioStatus } from '../hooks/useRadioStatus';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api`;

interface CityOSProps {
  city?: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function CityOS({ city = 'london', onNavigate }: CityOSProps) {

  const [intel, setIntel] = useState<CityIntel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tonight' | 'sets' | 'markets' | 'pride' | 'drops' | 'trends'>('tonight');
  
  // Live radio status
  const { data: radioStatus } = useRadioStatus();

  useEffect(() => {
    loadCityIntel();
  }, [city]);

  const loadCityIntel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/intel/city/${city}/full`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      setIntel(data);
    } catch (error) {
      console.error('Failed to load city intel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#ff1694] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60">Loading {city} intel...</p>
        </div>
      </div>
    );
  }

  if (!intel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white">No intel available for {city}</p>
          <button
            onClick={() => onNavigate('globalOS')}
            className="px-6 py-2 bg-[#ff1694] text-white rounded-lg"
          >
            Back to Globe
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'tonight', label: 'Tonight', count: intel.events.length },
    { id: 'sets', label: 'Set Times', count: intel.set_times.length },
    { id: 'markets', label: 'Markets', count: intel.queer_markets.length },
    { id: 'pride', label: 'Pride', count: intel.pride_events.length },
    { id: 'drops', label: 'Drops', count: intel.releases.length },
    { id: 'trends', label: 'Trends', count: intel.trends ? 1 : 0 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => onNavigate('globalOS')}
                className="text-sm text-white/40 hover:text-white mb-2 flex items-center gap-2"
              >
                ← Back to Globe
              </button>
              <h1 className="text-4xl font-black uppercase tracking-tight">
                {city}
              </h1>
              <p className="text-white/60 mt-1">
                Real-time nightlife intelligence
              </p>
            </div>

            {/* Vibe indicator */}
            {intel.vibe && (
              <div className={`
                px-4 py-2 rounded-full border-2 text-sm font-bold uppercase
                ${intel.vibe.label === 'positive' ? 'bg-green-500/20 border-green-500 text-green-400' : ''}
                ${intel.vibe.label === 'neutral' ? 'bg-gray-500/20 border-gray-500 text-gray-400' : ''}
                ${intel.vibe.label === 'messy' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : ''}
                ${intel.vibe.label === 'unsafe' ? 'bg-red-500/20 border-red-500 text-red-400' : ''}
              `}>
                Vibe: {intel.vibe.label}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-6 py-3 rounded-t-xl font-bold whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-[#ff1694] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 text-xs opacity-75">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Listeners Badge */}
      {radioStatus && radioStatus.listeners > 0 && (
        <LiveListeners listeners={radioStatus.listeners} position="top-right" />
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Radio Pulse Section - Always visible */}
        {radioStatus && (
          <div className="mb-8">
            <RadioStats status={radioStatus} />
          </div>
        )}

        {activeTab === 'tonight' && <TonightTab events={intel.events} />}
        {activeTab === 'sets' && <SetTimesTab setTimes={intel.set_times} />}
        {activeTab === 'markets' && <MarketsTab markets={intel.queer_markets} />}
        {activeTab === 'pride' && <PrideTab events={intel.pride_events} />}
        {activeTab === 'drops' && <DropsTab releases={intel.releases} />}
        {activeTab === 'trends' && <TrendsTab trends={intel.trends} />}
      </div>
    </div>
  );
}

/**
 * Tonight's events tab
 */
function TonightTab({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No events tonight</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#ff1694]/50 transition-all">
          {event.image && (
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
          )}
          <div className="p-6 space-y-3">
            <div className="text-xs text-[#ff1694] font-bold uppercase">{event.category}</div>
            <h3 className="font-bold text-lg">{event.title}</h3>
            <div className="text-sm text-white/60 space-y-1">
              <div>📍 {event.venue}</div>
              <div>🕐 {event.time || 'TBA'}</div>
              {event.price && <div>💷 {event.price}</div>}
            </div>
            {event.ticket_url && (
              <a
                href={event.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-[#ff1694] text-white text-center rounded-lg font-bold hover:bg-[#ff1694]/80 transition-all"
              >
                Get Tickets
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Set times tab
 */
function SetTimesTab({ setTimes }: { setTimes: SetTime[] }) {
  if (setTimes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No set times available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {setTimes.map((set) => (
        <div key={set.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{set.venue}</h3>
            <div className="text-sm text-white/60">{set.date}</div>
          </div>
          <div className="space-y-2">
            {set.lineup.map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <span className="text-[#ff1694] font-mono font-bold">{slot.time}</span>
                <span className="font-bold">{slot.artist}</span>
                {slot.stage && <span className="text-sm text-white/60">{slot.stage}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Markets tab
 */
function MarketsTab({ markets }: { markets: any[] }) {
  if (markets.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No markets or pop-ups scheduled</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {markets.map((market) => (
        <div key={market.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-xs text-[#ff1694] font-bold uppercase mb-2">{market.type}</div>
          <h3 className="text-xl font-bold mb-3">{market.title}</h3>
          <div className="text-sm text-white/60 space-y-1">
            <div>📍 {market.location}</div>
            <div>📅 {market.date}</div>
            {market.time && <div>🕐 {market.time}</div>}
          </div>
          {market.instagram && (
            <a
              href={`https://instagram.com/${market.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-[#ff1694] hover:underline"
            >
              @{market.instagram}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Pride tab
 */
function PrideTab({ events }: { events: any[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No Pride events scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div key={event.id} className="bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10 rounded-xl p-6 border border-white/10">
          <div className="text-xs text-yellow-400 font-bold uppercase mb-2">{event.type}</div>
          <h3 className="text-2xl font-bold mb-3">🏳️‍🌈 {event.name}</h3>
          <div className="text-white/80 space-y-1">
            <div>📍 {event.city}, {event.country}</div>
            <div>📅 {event.date}</div>
          </div>
          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              Learn More →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Drops tab (RAW CONVICT)
 */
function DropsTab({ releases }: { releases: any[] }) {
  if (releases.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No new releases</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((release) => (
        <div key={release.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
          {release.artwork_url && (
            <img src={release.artwork_url} alt={release.title} className="w-full aspect-square object-cover" />
          )}
          <div className="p-6 space-y-3">
            <div className="text-xs text-[#ff1694] font-bold uppercase">RAW CONVICT</div>
            <h3 className="font-bold">{release.title}</h3>
            <p className="text-sm text-white/60">{release.artist}</p>
            <div className="flex gap-2">
              {release.spotify_url && (
                <a href={release.spotify_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 text-center rounded-lg text-sm font-bold hover:bg-green-500/30 transition-all">
                  Spotify
                </a>
              )}
              {release.soundcloud_url && (
                <a href={release.soundcloud_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 bg-orange-500/20 text-orange-400 text-center rounded-lg text-sm font-bold hover:bg-orange-500/30 transition-all">
                  SoundCloud
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Trends tab (TikTok)
 */
function TrendsTab({ trends }: { trends: any }) {
  if (!trends) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">No trend data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10">
        <div className="text-xs text-[#ff1694] font-bold uppercase mb-4">TikTok Culture Report</div>
        <p className="text-lg leading-relaxed text-white/80">{trends.summary}</p>
      </div>

      {trends.hashtags && trends.hashtags.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase mb-3">Trending Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {trends.hashtags.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-[#ff1694]/20 text-[#ff1694] rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
