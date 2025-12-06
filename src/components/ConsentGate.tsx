'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Lock, AlertCircle } from 'lucide-react';
import { LocationConsentModal } from '@/components/LocationConsentModal';
import { useLocationConsent } from '@/hooks/useLocationConsent';

interface ConsentGateProps {
  children: ReactNode;
  feature: string; // Feature name (e.g., "Beacons", "Discovery Grid", "Heat Map")
  requiredMode?: 'approximate' | 'precise'; // Minimum consent level required
  fallback?: ReactNode; // Custom fallback UI
  bypassCheck?: boolean; // For admin/testing
}

export function ConsentGate({
  children,
  feature,
  requiredMode = 'approximate',
  fallback,
  bypassCheck = false
}: ConsentGateProps) {
  const locationConsent = useLocationConsent();
  const [showModal, setShowModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!locationConsent.loading) {
      setHasChecked(true);
    }
  }, [locationConsent.loading]);

  // Loading state
  if (!hasChecked || locationConsent.loading) {
    return (
      <div className="min-h-[400px] bg-black flex items-center justify-center">
        <div className="text-white/60" style={{ fontWeight: 400 }}>
          Checking permissions...
        </div>
      </div>
    );
  }

  // Bypass for admins/testing
  if (bypassCheck) {
    return <>{children}</>;
  }

  // Check if user has required consent level
  const hasRequiredConsent = 
    locationConsent.mode === 'precise' || 
    (requiredMode === 'approximate' && locationConsent.mode === 'approximate');

  // If consent granted and meets requirements, show content
  if (hasRequiredConsent) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default consent required UI
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-white/5 border-2 border-[#FF0080]/20 max-w-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#FF0080]/10 border-2 border-[#FF0080] flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#FF0080]" />
            </div>
          </div>
          <CardTitle className="text-center uppercase tracking-tight" style={{ fontWeight: 900, fontSize: '2rem' }}>
            LOCATION CONSENT REQUIRED
          </CardTitle>
          <CardDescription className="text-center text-white/60" style={{ fontWeight: 400, fontSize: '1rem' }}>
            {feature} requires location access to work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-white/80 mb-2" style={{ fontWeight: 400 }}>
                  <strong style={{ fontWeight: 700 }}>Current Status:</strong> Location mode is set to <strong className="text-orange-400">{locationConsent.mode.toUpperCase()}</strong>
                </div>
                <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                  This feature requires <strong className="text-[#FF0080]">{requiredMode.toUpperCase()}</strong> location mode to function.
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="space-y-3">
            <div className="text-sm uppercase tracking-tight text-white/80" style={{ fontWeight: 700 }}>
              WHAT YOU'LL GET WITH LOCATION ACCESS:
            </div>
            {feature === 'Beacons' && (
              <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Create hookup beacons at your current location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>See nearby beacons on the 3D globe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Get notifications when new beacons appear near you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Earn XP for scanning beacons in the wild</span>
                </li>
              </ul>
            )}
            {feature === 'Discovery Grid' && (
              <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>See users and events near your location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Filter by distance (500m, 1km, 5km)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Connect with nearby queer community members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Discover local events happening tonight</span>
                </li>
              </ul>
            )}
            {feature === 'Heat Map' && (
              <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>See real-time activity density across London</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Find popular venues and hotspots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Track nightlife patterns by day and time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Discover where the community is gathering</span>
                </li>
              </ul>
            )}
            {!['Beacons', 'Discovery Grid', 'Heat Map'].includes(feature) && (
              <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Location-based features and content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Nearby events and users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0080]">•</span>
                  <span>Real-time community discovery</span>
                </li>
              </ul>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/70" style={{ fontWeight: 400 }}>
                <strong style={{ fontWeight: 700 }}>Privacy First:</strong> Choose Approximate mode for city-level location (better privacy) or Precise mode for GPS coordinates (more features). Change anytime in Settings.
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
              style={{ fontWeight: 800 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Enable Location Access
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              Go Back
            </Button>
          </div>

          {/* Learn More */}
          <div className="text-center">
            <a
              href="/privacy"
              className="text-sm text-white/40 hover:text-white transition-colors"
              style={{ fontWeight: 400 }}
            >
              Learn more about privacy and data protection →
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Location Consent Modal */}
      <LocationConsentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConsent={(mode) => {
          locationConsent.updateMode(mode);
          setShowModal(false);
        }}
        currentMode={locationConsent.mode}
        feature={feature}
      />
    </div>
  );
}
