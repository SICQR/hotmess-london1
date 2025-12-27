export type OSEvent =
  | { type: 'XP_EARNED'; amount: number; reason: string }
  | { type: 'TRACK_BPM_CHANGE'; bpm: number }
  | { type: 'PULSE_CLICK'; beaconId: string };

const EVENT_NAME = 'hotmess-os';

type OSBusEvent = CustomEvent<OSEvent>;

export const OSBus = {
  emit: (event: OSEvent) => {
    window.dispatchEvent(new CustomEvent<OSEvent>(EVENT_NAME, { detail: event }));
  },

  subscribe: (callback: (event: OSEvent) => void) => {
    const handler = (e: Event) => callback((e as OSBusEvent).detail);
    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  },
};
