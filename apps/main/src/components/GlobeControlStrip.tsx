import React, { useState } from 'react';

import type { GlobeLayers } from './LiveGlobe3D';

type Props = {
  mode: 'hotmess' | 'satellite';
  layers: GlobeLayers;
  wetterWatch: string;
  beaconCount: number;
  onToggleMode: () => void;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onOpenLiveFeed: () => void;
  submitHref: string;
};

function Pill({
  active,
  label,
  kbd,
  onClick,
}: {
  active: boolean;
  label: string;
  kbd?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] tracking-[.22em] uppercase',
        'transition select-none',
        active
          ? 'border-white/60 bg-white text-black shadow-hard'
          : 'border-white/25 bg-black/70 text-white/85 hover:border-white/45 hover:text-white',
      ].join(' ')}
    >
      <span>{label}</span>
      {kbd ? (
        <span
          className={[
            'ml-1 rounded-full border px-2 py-[2px] text-[10px] tracking-[.18em]',
            active ? 'border-black/25 text-black/80' : 'border-white/20 text-white/60',
          ].join(' ')}
        >
          {kbd}
        </span>
      ) : null}
    </button>
  );
}

export function GlobeControlStrip({
  mode,
  layers,
  wetterWatch,
  beaconCount,
  onToggleMode,
  onToggleLayer,
  onOpenLiveFeed,
  submitHref,
}: Props) {
  const [layersOpen, setLayersOpen] = useState(true);

  const liveLabel = beaconCount > 0 ? `LIVE • ${beaconCount} BEACON${beaconCount === 1 ? '' : 'S'}` : 'LIVE • NO BEACONS';

  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-2 sm:left-4 sm:top-4">
        <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/65 px-4 py-3 shadow-hard backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] tracking-[.28em] uppercase text-white/90">Nightlife Control</div>
              <div className="mt-1 text-[11px] tracking-[.22em] uppercase text-white/70">
                LIVE BEACONS • TAP A PIN • TAP A CITY
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-hot shadow-glow" />
                <span className="text-[11px] tracking-[.22em] uppercase text-white/80">{liveLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenLiveFeed}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] tracking-[.22em] uppercase text-white/85 hover:border-white/45 hover:bg-white/10"
              >
                Open Live Feed
              </button>
              <button
                type="button"
                onClick={() => setLayersOpen((v) => !v)}
                className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-[11px] tracking-[.22em] uppercase text-white/75 hover:border-white/35 hover:text-white"
              >
                Toggle Layers
              </button>
              <a
                className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-center text-[11px] tracking-[.22em] uppercase text-white/75 hover:border-white/35 hover:text-white"
                href={submitHref}
              >
                Submit a Beacon
              </a>
            </div>
          </div>

          {layersOpen ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill active={layers.pins} label="Pins" kbd="1" onClick={() => onToggleLayer('pins')} />
                <Pill active={layers.heat} label="Heat" kbd="2" onClick={() => onToggleLayer('heat')} />
                <Pill active={layers.trails} label="Trails" kbd="3" onClick={() => onToggleLayer('trails')} />
                <Pill active={layers.cities} label="Cities" kbd="4" onClick={() => onToggleLayer('cities')} />
              </div>

              <div className="mt-2 text-[11px] text-white/55">
                Pins = clickable. Heat = density. Trails = last 12 hops. Cities = labels by zoom.
              </div>
            </>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-[10px] tracking-[.22em] uppercase text-white/55">18+ • Consent-first</div>

            <button
              type="button"
              onClick={onToggleMode}
              className={[
                'rounded-full border px-3 py-2 text-[11px] tracking-[.22em] uppercase',
                'transition',
                mode === 'satellite'
                  ? 'border-white/60 bg-white text-black'
                  : 'border-white/20 bg-black/40 text-white/80 hover:border-white/45 hover:text-white',
              ].join(' ')}
              aria-label="Toggle globe mode"
              title="Press M"
            >
              {mode === 'satellite' ? 'Satellite' : 'Hotmess'} <span className="ml-2 text-[10px] opacity-70">M</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 sm:bottom-4 sm:left-4">
        <div className="pointer-events-auto max-w-[560px] rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-[12px] text-white/80 shadow-hard backdrop-blur">
          <div className="text-[11px] tracking-[.22em] uppercase text-white/55">Wetter Watch</div>
          <div className="mt-1 leading-snug">{wetterWatch}</div>
        </div>
      </div>
    </>
  );
}
