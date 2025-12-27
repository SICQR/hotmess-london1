/**
 * HOTMESS OS — PULSE BOUNTIES ENGINE
 * 
 * Automated XP reward generation system that:
 * - Detects "cold" venues (low scan activity)
 * - Increases XP rewards to drive foot traffic
 * - Sends Telegram notifications to nearby users
 * - Auto-resets bounties after target is met
 */

import { supabase } from './supabase';
import { OSBus } from './os-bus';

interface VenueActivity {
  beacon_id: string;
  title: string;
  lat: number;
  lng: number;
  recent_scans: number;
  historical_average: number;
}

export class PulseBountiesEngine {
  private checkInterval: number = 60 * 60 * 1000; // Check every hour
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Start the bounty engine
   */
  start() {
    if (this.intervalId) {
      console.warn('[PULSE-BOUNTIES] Engine already running');
      return;
    }

    console.log('[PULSE-BOUNTIES] Starting automated bounty engine');
    
    // Run immediately and then on interval
    this.checkAndUpdateBounties();
    this.intervalId = setInterval(() => {
      this.checkAndUpdateBounties();
    }, this.checkInterval);
  }

  /**
   * Stop the bounty engine
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[PULSE-BOUNTIES] Bounty engine stopped');
    }
  }

  /**
   * Main logic: Detect cold venues and boost rewards
   */
  private async checkAndUpdateBounties() {
    console.log('[PULSE-BOUNTIES] Checking venue activity...');

    try {
      // 1. Fetch venue activity for the last 24 hours
      const { data: recentActivity, error: recentError } = await supabase.rpc(
        'get_venue_activity',
        {
          hours_ago: 24,
        }
      );

      if (recentError) {
        console.error('[PULSE-BOUNTIES] Error fetching activity:', recentError);
        return;
      }

      if (!recentActivity || recentActivity.length === 0) {
        console.log('[PULSE-BOUNTIES] No venue data found');
        return;
      }

      // 2. Identify "cold" venues (less than 50% of historical average)
      const coldVenues = recentActivity.filter((venue: VenueActivity) => {
        const threshold = venue.historical_average * 0.5;
        return venue.recent_scans < threshold && venue.historical_average > 10;
      });

      console.log(`[PULSE-BOUNTIES] Found ${coldVenues.length} cold venues`);

      // 3. Boost XP for cold venues
      for (const venue of coldVenues) {
        await this.activateBounty(venue);
      }

      // 4. Reset bounties for venues that are now "hot"
      const hotVenues = recentActivity.filter((venue: VenueActivity) => {
        return venue.recent_scans >= venue.historical_average * 1.2;
      });

      for (const venue of hotVenues) {
        await this.deactivateBounty(venue.beacon_id);
      }
    } catch (error) {
      console.error('[PULSE-BOUNTIES] Unexpected error:', error);
    }
  }

  /**
   * Activate a bounty at a venue (increase XP multiplier)
   */
  private async activateBounty(venue: VenueActivity) {
    const newMultiplier = 5.0; // 5X XP reward

    const { error } = await supabase
      .from('beacons')
      .update({
        bounty_multiplier: newMultiplier,
        xp_reward: 500, // Base reward of 500 XP
      })
      .eq('id', venue.beacon_id);

    if (error) {
      console.error('[PULSE-BOUNTIES] Error activating bounty:', error);
      return;
    }

    console.log(`[PULSE-BOUNTIES] ✓ Bounty activated at ${venue.title} (${newMultiplier}x)`);

    // Emit OS event
    OSBus.emit({
      type: 'BEACON_SPAWNED',
      beaconId: venue.beacon_id,
      type: 'reward',
      lat: venue.lat,
      lng: venue.lng,
    });

    // TODO: Send Telegram notification to nearby users
    // await this.notifyNearbyUsers(venue);
  }

  /**
   * Deactivate a bounty (reset to normal multiplier)
   */
  private async deactivateBounty(beaconId: string) {
    const { error } = await supabase
      .from('beacons')
      .update({
        bounty_multiplier: 1.0,
        xp_reward: 100, // Standard reward
      })
      .eq('id', beaconId);

    if (error) {
      console.error('[PULSE-BOUNTIES] Error deactivating bounty:', error);
      return;
    }

    console.log(`[PULSE-BOUNTIES] ✓ Bounty deactivated at ${beaconId}`);
  }

  /**
   * Send Telegram notification to users within 2km
   * (requires Telegram bot and user location data)
   */
  private async notifyNearbyUsers(venue: VenueActivity) {
    // TODO: Implement Telegram notification
    // 1. Query users within 2km radius using PostGIS
    // 2. Send message via Telegram bot API
    console.log(`[PULSE-BOUNTIES] TODO: Notify users near ${venue.title}`);
  }
}

// SQL function to support bounty engine (add to migrations)
export const VENUE_ACTIVITY_SQL = `
-- Function to get venue activity stats
CREATE OR REPLACE FUNCTION get_venue_activity(hours_ago INTEGER DEFAULT 24)
RETURNS TABLE (
  beacon_id UUID,
  title TEXT,
  lat NUMERIC,
  lng NUMERIC,
  recent_scans BIGINT,
  historical_average NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as beacon_id,
    b.title,
    b.lat,
    b.lng,
    COUNT(DISTINCT bs.id) FILTER (WHERE bs.scanned_at > NOW() - (hours_ago || ' hours')::INTERVAL) as recent_scans,
    COALESCE(
      (SELECT AVG(daily_scans) 
       FROM (
         SELECT COUNT(*) as daily_scans
         FROM beacon_scans bs2
         WHERE bs2.beacon_id = b.id
         AND bs2.scanned_at > NOW() - interval '30 days'
         GROUP BY DATE(bs2.scanned_at)
       ) daily_counts
      ), 
      0
    ) as historical_average
  FROM beacons b
  LEFT JOIN beacon_scans bs ON bs.beacon_id = b.id
  WHERE b.active = true
  AND b.type IN ('checkin', 'event', 'venue')
  GROUP BY b.id, b.title, b.lat, b.lng;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Singleton instance
export const pulseBountiesEngine = new PulseBountiesEngine();
