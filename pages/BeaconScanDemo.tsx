/**
 * BEACON OS DEMO - Beacon Scan Page
 * Uses the new reusable hook/shell/renderer pattern
 * Connected to demo backend on localhost:3001
 */

import { useBeaconScanDemo } from '../hooks/useBeaconScanDemo';
import { BeaconScanShell } from '../src/components/BeaconScanShell';
import { BeaconDemoNav } from '../components/BeaconDemoNav';

interface BeaconScanDemoProps {
  code?: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
  routeParams?: Record<string, string>;
}

export function BeaconScanDemo({ code, onNavigate, routeParams }: BeaconScanDemoProps) {
  if (!code) {
    return (
      <div className="min-h-screen bg-black text-white">
        <BeaconDemoNav currentRoute="beaconScanDemo" onNavigate={onNavigate} />
        <div className="h-[80px]" />
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-2">
              ERROR
            </p>
            <p className="text-lg font-semibold mb-2">No beacon code provided.</p>
            <button
              onClick={() => onNavigate('beaconsDemoHome')}
              className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-sm transition"
            >
              ← Back to Demos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract query params like lat, lng, mode from routeParams
  const queryParams: Record<string, string> = {};
  if (routeParams?.lat) queryParams.lat = routeParams.lat;
  if (routeParams?.lng) queryParams.lng = routeParams.lng;
  if (routeParams?.mode) queryParams.mode = routeParams.mode;

  const { data, error, loading } = useBeaconScanDemo({ 
    endpoint: `/l/${code}`,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined
  });

  return (
    <div className="min-h-screen bg-black">
      <BeaconDemoNav currentRoute="beaconScanDemo" onNavigate={onNavigate} />
      <div className="h-16" />
      
      <BeaconScanShell
        state={{ data, error, loading }}
        titlePrefix="HOTMESS BEACON"
      />
      
      {/* Back button */}
      {!loading && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => onNavigate('beaconsDemoHome')}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-full text-sm transition border border-neutral-800"
          >
            ← Back to Demos
          </button>
        </div>
      )}
    </div>
  );
}