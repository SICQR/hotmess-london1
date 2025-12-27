/**
 * HOTMESS OS BUS — Event Dispatcher
 * 
 * Syncs state across the entire OS:
 * - BPM changes from Radio → Globe building vibrations
 * - XP awards → HUD animations
 * - Beacon interactions → Analytics
 * - Night King events → Globe + Social layer
 */

export type OSEvent =
  // XP & Rewards
  | { type: 'XP_EARNED'; amount: number; reason: string; userId?: string }
  | { type: 'LEVEL_UP'; newLevel: number; userId: string }
  
  // Radio & Audio
  | { type: 'TRACK_BPM_CHANGE'; bpm: number; trackId?: string }
  | { type: 'RADIO_PLAY'; trackId: string }
  | { type: 'RADIO_PAUSE' }
  | { type: 'AUDIO_DROP_SPAWNED'; beaconId: string; trackId: string; bpm: number }
  
  // Beacons & Globe
  | { type: 'PULSE_CLICK'; beaconId: string }
  | { type: 'BEACON_SCANNED'; beaconId: string; userId: string; xpAwarded: number }
  | { type: 'BEACON_SPAWNED'; beaconId: string; type: string; lat: number; lng: number }
  
  // Night King System
  | { type: 'KING_CROWNED'; venueId: string; userId: string; username: string }
  | { type: 'KING_DETHRONED'; venueId: string; formerKingId: string; newKingId: string }
  | { type: 'WAR_STARTED'; venueId: string; challengerId: string; defenderId: string }
  | { type: 'WAR_ENDED'; venueId: string; winnerId: string }
  | { type: 'KING_TAX_COLLECTED'; kingId: string; amount: number; venueId: string }
  
  // Commerce
  | { type: 'PURCHASE_COMPLETE'; orderId: string; userId: string; amount: number }
  | { type: 'SONIC_KEY_BOUGHT'; trackId: string; userId: string; beaconSpawned: boolean }
  
  // Social & Care
  | { type: 'RIGHT_NOW_POSTED'; postId: string; userId: string; type: string }
  | { type: 'TELEGRAM_CONNECT'; sessionToken: string; userIdA: string; userIdB: string }
  | { type: 'CARE_ALERT_TRIGGERED'; userId: string; beaconId: string }
  
  // UI Events
  | { type: 'UI_SHAKE'; intensity: 'light' | 'medium' | 'heavy' }
  | { type: 'NOTIFICATION_SHOW'; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' };

const EVENT_NAME = 'hotmess-os';

type OSBusEvent = CustomEvent<OSEvent>;

export const OSBus = {
  /**
   * Emit an event to all subscribers
   */
  emit: (event: OSEvent) => {
    if (typeof window === 'undefined') return; // SSR safety
    
    window.dispatchEvent(new CustomEvent<OSEvent>(EVENT_NAME, { detail: event }));
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('[OS-BUS]', event.type, event);
    }
  },

  /**
   * Subscribe to all OS events
   */
  subscribe: (callback: (event: OSEvent) => void) => {
    if (typeof window === 'undefined') return () => {}; // SSR safety
    
    const handler = (e: Event) => callback((e as OSBusEvent).detail);
    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  },
  
  /**
   * Subscribe to specific event types only
   */
  subscribeToType: <T extends OSEvent['type']>(
    eventType: T,
    callback: (event: Extract<OSEvent, { type: T }>) => void
  ) => {
    if (typeof window === 'undefined') return () => {}; // SSR safety
    
    const handler = (e: Event) => {
      const event = (e as OSBusEvent).detail;
      if (event.type === eventType) {
        callback(event as Extract<OSEvent, { type: T }>);
      }
    };
    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  },
};
