import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNightPulseRealtime } from '../hooks/useNightPulseRealtime';
import type { NightPulseCity } from '../types/night-pulse';
import { OSBus } from '../lib/os-bus';

type NightPulseState = {
  cities: NightPulseCity[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date;
  refresh: () => Promise<void>;
  bpm: number;
};

const NightPulseContext = createContext<NightPulseState | null>(null);

export function NightPulseProvider({ children }: { children: ReactNode }) {
  const state = useNightPulseRealtime();
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    return OSBus.subscribe((event) => {
      if (event.type === 'TRACK_BPM_CHANGE') setBpm(event.bpm);
    });
  }, []);

  return (
    <NightPulseContext.Provider value={{ ...state, bpm }}>
      {children}
    </NightPulseContext.Provider>
  );
}

export function useNightPulse() {
  const ctx = useContext(NightPulseContext);
  if (!ctx) throw new Error('useNightPulse must be used within NightPulseProvider');
  return ctx;
}
