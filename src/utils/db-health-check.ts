/**
 * DATABASE HEALTH CHECK UTILITY
 * Validates Night Pulse schema components exist
 */

import { createClient } from './supabase/client';

export interface NightPulseSchemaHealth {
  materialized_view: boolean;
  cities_table: boolean;
  events_table: boolean;
  beacons_has_city: boolean;
}

/**
 * Check if all required Night Pulse schema components exist
 * Used to provide helpful diagnostics when migrations haven't been run
 */
export async function checkNightPulseSchema(): Promise<NightPulseSchemaHealth> {
  const supabase = createClient();
  
  const checks: NightPulseSchemaHealth = {
    materialized_view: false,
    cities_table: false,
    events_table: false,
    beacons_has_city: false,
  };
  
  // Check materialized view
  const { error: viewError } = await supabase
    .from('night_pulse_realtime')
    .select('city_id')
    .limit(1);
  checks.materialized_view = !viewError;
  
  // Check cities table
  const { error: citiesError } = await supabase
    .from('cities')
    .select('id')
    .limit(1);
  checks.cities_table = !citiesError;
  
  // Check events table
  const { error: eventsError } = await supabase
    .from('night_pulse_events')
    .select('id')
    .limit(1);
  checks.events_table = !eventsError;
  
  // Check beacons has city column
  const { error: beaconsError } = await supabase
    .from('beacons')
    .select('city')
    .limit(1);
  checks.beacons_has_city = !beaconsError;
  
  return checks;
}
