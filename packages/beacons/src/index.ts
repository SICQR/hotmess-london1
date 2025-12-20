/**
 * @hotmess/beacons
 * Beacon system SDK for HOTMESS platform
 * Supports 6 beacon types: Venue, Event, Hook-up, Drop, Pop-up, Private
 */

// Export BeaconType from beacon-system (more complete)
export type { BeaconType, XPSource, Beacon, BeaconScan, BeaconRoute } from './beacon-system';
export { getXPSourceForBeacon, routeBeacon, BEACON_TYPE_META } from './beacon-system';

// Export other types from beaconTypes
export type { 
  AccentToken, 
  RequirementChip, 
  NotifyCategory, 
  BeaconTypeConfig 
} from './beaconTypes';
export { BEACON_TYPE_CONFIG } from './beaconTypes';

