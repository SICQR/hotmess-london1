/**
 * HOTMESS OS — Global State Store (Zustand)
 * 
 * Central store for:
 * - Auth state
 * - XP and Level system
 * - Global HUD state
 * - Radio BPM sync
 * - Night King territorial data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  level: number;
  totalXP: number;
  avatarUrl?: string;
  isAdmin?: boolean;
  membershipTier?: 'free' | 'hnh' | 'vendor' | 'sponsor' | 'icon';
  crownedVenues?: string[]; // IDs of venues where user is Night King
}

export interface NightKingData {
  userId: string;
  username: string;
  avatarUrl?: string;
  weeklyScanCount: number;
  kingSince: string;
}

export interface BeaconWithKing {
  id: string;
  title?: string;
  type: string;
  lat: number;
  lng: number;
  kingData?: NightKingData;
  bountyMultiplier?: number;
  isGolden?: boolean; // Has a crowned Night King
}

interface HotmessState {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  
  // XP System
  xpQueue: Array<{ amount: number; reason: string; timestamp: number }>;
  
  // Radio & BPM
  currentBPM: number;
  isRadioPlaying: boolean;
  currentTrackId?: string;
  
  // Globe State
  selectedBeacon: BeaconWithKing | null;
  hoveredBeacon: string | null;
  globeMode: '2d' | '3d';
  
  // Night King System
  nightKings: Record<string, NightKingData>; // venue_id -> king data
  territorialWars: Array<{
    venueId: string;
    challengerId: string;
    defenderId: string;
    startsAt: string;
    endsAt: string;
  }>;
  
  // HUD
  showXPAnimation: boolean;
  topHUDVisible: boolean;
  navbarExpanded: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  addXP: (amount: number, reason: string) => void;
  clearXPQueue: () => void;
  setBPM: (bpm: number) => void;
  setRadioPlaying: (playing: boolean) => void;
  setSelectedBeacon: (beacon: BeaconWithKing | null) => void;
  setHoveredBeacon: (beaconId: string | null) => void;
  setGlobeMode: (mode: '2d' | '3d') => void;
  updateNightKing: (venueId: string, kingData: NightKingData | null) => void;
  startTerritorialWar: (venueId: string, challengerId: string, defenderId: string) => void;
  toggleTopHUD: () => void;
  toggleNavbar: () => void;
}

export const useHotmessStore = create<HotmessState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      xpQueue: [],
      currentBPM: 128,
      isRadioPlaying: false,
      currentTrackId: undefined,
      selectedBeacon: null,
      hoveredBeacon: null,
      globeMode: '3d',
      nightKings: {},
      territorialWars: [],
      showXPAnimation: false,
      topHUDVisible: true,
      navbarExpanded: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      addXP: (amount, reason) => {
        const queue = get().xpQueue;
        set({
          xpQueue: [...queue, { amount, reason, timestamp: Date.now() }],
          showXPAnimation: true,
        });

        // Auto-clear animation after 3 seconds
        setTimeout(() => {
          set({ showXPAnimation: false });
        }, 3000);
      },

      clearXPQueue: () => set({ xpQueue: [] }),

      setBPM: (bpm) => {
        set({ currentBPM: bpm });
      },

      setRadioPlaying: (playing) => set({ isRadioPlaying: playing }),

      setSelectedBeacon: (beacon) => set({ selectedBeacon: beacon }),

      setHoveredBeacon: (beaconId) => set({ hoveredBeacon: beaconId }),

      setGlobeMode: (mode) => set({ globeMode: mode }),

      updateNightKing: (venueId, kingData) => {
        const kings = { ...get().nightKings };
        if (kingData) {
          kings[venueId] = kingData;
        } else {
          delete kings[venueId];
        }
        set({ nightKings: kings });
      },

      startTerritorialWar: (venueId, challengerId, defenderId) => {
        const wars = [...get().territorialWars];
        const now = new Date();
        const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        wars.push({
          venueId,
          challengerId,
          defenderId,
          startsAt: now.toISOString(),
          endsAt: endsAt.toISOString(),
        });

        set({ territorialWars: wars });
      },

      toggleTopHUD: () => set({ topHUDVisible: !get().topHUDVisible }),

      toggleNavbar: () => set({ navbarExpanded: !get().navbarExpanded }),
    }),
    {
      name: 'hotmess-os-storage',
      partialize: (state) => ({
        user: state.user,
        globeMode: state.globeMode,
        topHUDVisible: state.topHUDVisible,
        // Don't persist real-time state like BPM, beacons, wars
      }),
    }
  )
);
