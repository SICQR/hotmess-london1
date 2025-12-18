/**
 * ADMIN DIAGNOSTICS PAGE
 * Database health check and migration status
 */

import { useState, useEffect } from 'react';
import { checkNightPulseSchema, type NightPulseSchemaHealth } from '../utils/db-health-check';

export function AdminDiagnostics() {
  const [health, setHealth] = useState<NightPulseSchemaHealth | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkNightPulseSchema()
      .then(result => {
        setHealth(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error checking schema health:', err);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff1694] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ fontWeight: 700, fontSize: '16px' }}>Loading diagnostics...</p>
        </div>
      </div>
    );
  }
  
  if (!health) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontWeight: 700, fontSize: '16px', color: '#ff1694' }}>
            ❌ Failed to load diagnostics
          </p>
        </div>
      </div>
    );
  }
  
  const allHealthy = Object.values(health).every(v => v);
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#ff1694' }}>
          Database Health Check
        </h1>
        <p className="text-white/60 mb-8" style={{ fontSize: '14px' }}>
          Night Pulse Schema Validation
        </p>
        
        <div className="space-y-4 mb-8">
          <StatusRow 
            label="night_pulse_realtime (materialized view)" 
            status={health.materialized_view}
            description="Real-time aggregated city data for Night Pulse globe"
          />
          <StatusRow 
            label="cities table" 
            status={health.cities_table}
            description="City reference data with coordinates"
          />
          <StatusRow 
            label="night_pulse_events table" 
            status={health.events_table}
            description="Real-time event stream for incremental updates"
          />
          <StatusRow 
            label="beacons.city column" 
            status={health.beacons_has_city}
            description="City association on beacons for fallback aggregation"
          />
        </div>
        
        {allHealthy ? (
          <div className="p-6 bg-green-900/20 border border-green-500 rounded">
            <h2 className="font-bold mb-2" style={{ color: '#00ff00' }}>
              ✅ All Systems Operational
            </h2>
            <p className="text-sm text-white/80">
              Night Pulse schema is fully deployed and healthy.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-yellow-900/20 border border-yellow-500 rounded">
            <h2 className="font-bold mb-2" style={{ color: '#ffeb3b' }}>
              ⚠️ Migration Required
            </h2>
            <p className="text-sm mb-4 text-white/80">
              Some Night Pulse schema components are missing. The globe will use fallback mode.
            </p>
            <p className="text-sm mb-2 text-white/60">
              Run the night_pulse_realtime migration:
            </p>
            <code className="block bg-black p-4 rounded text-xs text-[#00ff00] font-mono border border-white/10">
              supabase db push
            </code>
            <p className="text-xs mt-4 text-white/40">
              Note: The globe will continue to work using fallback aggregation from the beacons table.
            </p>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded">
          <h3 className="font-bold mb-2 text-sm" style={{ color: '#ff1694' }}>
            About Fallback Mode
          </h3>
          <p className="text-xs text-white/60 mb-2">
            When the materialized view is missing, Night Pulse falls back to aggregating beacon data directly.
          </p>
          <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
            <li>Fallback provides basic city-level visualization</li>
            <li>Real-time incremental updates are not available in fallback mode</li>
            <li>Privacy filters (hiding counts &lt;5) are still applied</li>
            <li>Performance may be slower with many beacons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface StatusRowProps {
  label: string;
  status: boolean;
  description?: string;
}

function StatusRow({ label, status, description }: StatusRowProps) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium" style={{ fontSize: '14px' }}>{label}</span>
        <span className={status ? 'text-green-500' : 'text-red-500'} style={{ fontWeight: 700, fontSize: '14px' }}>
          {status ? '✅ OK' : '❌ Missing'}
        </span>
      </div>
      {description && (
        <p className="text-xs text-white/40">{description}</p>
      )}
    </div>
  );
}
