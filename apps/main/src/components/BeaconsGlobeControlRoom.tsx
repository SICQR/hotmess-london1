import React, { useCallback, useEffect, useMemo, useState } from 'react';

import LiveGlobe3D, { type Beacon, type City, type GlobeLayers } from './LiveGlobe3D';
import { GlobeControlStrip } from './GlobeControlStrip';
import { GlobeDrawer, type DrawerSelection } from './GlobeDrawer';
import { SatelliteConsentModal } from './SatelliteConsentModal';

const ROUTES = {
  shop: '/shop',
  shopRaw: '/shop/raw',
  shopHung: '/shop/hung',
  shopHigh: '/shop/high',
  shopSuper: '/shop/super',
  radio: '/radio',
  records: '/records',
  care: '/care',
  community: '/community',
  affiliate: '/affiliate',
  sponsorshipDisclosures: '/sponsorship-disclosures',
  dataPrivacyHub: '/data-privacy-hub',
  submitBeacon: '/community#submit',
} as const;

function safeHasConsent(key: string) {
  try {
    const v = localStorage.getItem(key);
    return v === '1' || v === 'true' || v === 'yes';
  } catch {
    return false;
  }
}

function safeSetConsent(key: string) {
  try {
    localStorage.setItem(key, '1');
  } catch {
    // ignore
  }
}

function pickShopRouteForBeacon(b: Beacon) {
  if (b.kind === 'drop') return ROUTES.shopSuper;
  if (b.kind === 'product') return ROUTES.shopRaw;
  return ROUTES.shop;
}

function formatTimeAgo(ts?: number) {
  if (!ts) return 'JUST IN';
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s AGO`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h AGO`;
  const d = Math.floor(h / 24);
  return `${d}d AGO`;
}

function computeWetterWatch(beacons: Beacon[]) {
  if (!beacons.length) return 'Wetter Watch: quiet sky — stay ready.';
  const byCity = new Map<string, number>();
  for (const b of beacons) {
    const city = (b.city || 'UNKNOWN').toUpperCase();
    const score = Math.max(0.05, Math.min(1, b.intensity ?? 0.5));
    byCity.set(city, (byCity.get(city) ?? 0) + score);
  }
  let topCity = '';
  let top = -1;
  for (const [c, v] of byCity) {
    if (v > top) {
      top = v;
      topCity = c;
    }
  }
  return `Wetter Watch: ${topCity} is heating up — keep it respectful, keep it hot.`;
}

type Props = {
  className?: string;
  beacons?: Beacon[];
  cities?: City[];
  satelliteTextureUrl?: string;
  consentKey?: string;
};

export default function BeaconsGlobeControlRoom({
  className,
  beacons,
  cities,
  satelliteTextureUrl,
  consentKey = 'hotmess_external_tiles_ok',
}: Props) {
  const [layers, setLayers] = useState<GlobeLayers>({
    pins: true,
    heat: false,
    trails: false,
    cities: true,
  });

  const [mode, setMode] = useState<'hotmess' | 'satellite'>('hotmess');
  const [consentOpen, setConsentOpen] = useState(false);

  const [selection, setSelection] = useState<DrawerSelection>(null);

  const beaconsResolved = useMemo(() => beacons ?? [], [beacons]);
  // IMPORTANT: if `cities` is omitted, let LiveGlobe3D fall back to its built-in defaults.
  const citiesResolved = useMemo(() => cities, [cities]);

  const wetterWatch = useMemo(() => computeWetterWatch(beaconsResolved), [beaconsResolved]);

  const requestModeToggle = useCallback(() => {
    setMode((prev) => {
      if (prev === 'hotmess') {
        if (safeHasConsent(consentKey)) return 'satellite';
        setConsentOpen(true);
        return 'hotmess';
      }
      return 'hotmess';
    });
  }, [consentKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelection(null);
      if (e.key === '1') setLayers((p) => ({ ...p, pins: !p.pins }));
      if (e.key === '2') setLayers((p) => ({ ...p, heat: !p.heat }));
      if (e.key === '3') setLayers((p) => ({ ...p, trails: !p.trails }));
      if (e.key === '4') setLayers((p) => ({ ...p, cities: !p.cities }));
      if (e.key.toLowerCase() === 'm') requestModeToggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestModeToggle]);

  const onAcceptSatellite = useCallback(() => {
    safeSetConsent(consentKey);
    setConsentOpen(false);
    setMode('satellite');
  }, [consentKey]);

  const onDeclineSatellite = useCallback(() => {
    setConsentOpen(false);
    setMode('hotmess');
  }, []);

  const openBeacon = useCallback(
    (b: Beacon) => {
      setSelection({
        type: 'beacon',
        beacon: b,
        meta: {
          timeAgo: formatTimeAgo(b.ts),
          primaryHref:
            b.kind === 'drop' || b.kind === 'product'
              ? pickShopRouteForBeacon(b)
              : b.kind === 'sponsor'
                ? ROUTES.affiliate
                : b.kind === 'event'
                  ? ROUTES.community
                  : ROUTES.community,
        },
      });
    },
    []
  );

  const openCity = useCallback(
    (c: City) => {
      setSelection({
        type: 'city',
        city: c,
        meta: {
          beaconCount: beaconsResolved.filter((b) => (b.city || '').toUpperCase() === c.name.toUpperCase()).length,
          filterHref: `${ROUTES.community}?city=${encodeURIComponent(c.name)}`,
        },
      });
    },
    [beaconsResolved]
  );

  return (
    <div className={className ?? 'relative w-full h-full'}>
      <LiveGlobe3D
        className="w-full h-full"
        layers={layers}
        beacons={beaconsResolved}
        cities={citiesResolved}
        mode={mode}
        satelliteTextureUrl={satelliteTextureUrl}
        consentKey={consentKey}
        onBeaconClick={openBeacon}
        onCityClick={openCity}
      />

      <GlobeControlStrip
        mode={mode}
        layers={layers}
        wetterWatch={wetterWatch}
        beaconCount={beaconsResolved.length}
        onToggleMode={requestModeToggle}
        onToggleLayer={(key) => setLayers((p) => ({ ...p, [key]: !p[key] }))}
        onOpenLiveFeed={() => setSelection({ type: 'live', meta: { wetterWatch } })}
        submitHref={ROUTES.submitBeacon}
      />

      <GlobeDrawer open={!!selection} selection={selection} onClose={() => setSelection(null)} routes={ROUTES} />

      <SatelliteConsentModal
        open={consentOpen}
        onAccept={onAcceptSatellite}
        onDecline={onDeclineSatellite}
        dataHubHref={ROUTES.dataPrivacyHub}
      />
    </div>
  );
}
