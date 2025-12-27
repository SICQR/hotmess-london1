import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Beacon, City } from './LiveGlobe3D';

export type DrawerSelection =
  | null
  | { type: 'live'; meta: { wetterWatch: string } }
  | { type: 'beacon'; beacon: Beacon; meta: { timeAgo: string; primaryHref: string } }
  | { type: 'city'; city: City; meta: { beaconCount: number; filterHref: string } };

type Routes = {
  shop: string;
  radio: string;
  records: string;
  care: string;
  community: string;
  affiliate: string;
  sponsorshipDisclosures: string;
  dataPrivacyHub?: string;
  submitBeacon: string;
};

type Props = {
  open: boolean;
  selection: DrawerSelection;
  onClose: () => void;
  routes: Routes;
};

function kindLabel(kind?: Beacon['kind']) {
  if (!kind) return 'BEACON';
  if (kind === 'drop') return 'DROP';
  if (kind === 'event') return 'EVENT';
  if (kind === 'product') return 'PRODUCT';
  if (kind === 'sponsor') return 'SPONSOR';
  if (kind === 'checkin') return 'CHECK-IN';
  return 'BEACON';
}

function primaryCtaLabel(sel: Extract<DrawerSelection, { type: 'beacon' }>) {
  const k = sel.beacon.kind;
  if (k === 'drop' || k === 'product') return 'Shop this';
  if (k === 'event') return 'Open community';
  if (k === 'sponsor') return 'Partner / sponsor';
  return 'Open live feed';
}

function usePortalReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function GlobeDrawer({ open, selection, onClose, routes }: Props) {
  const portalReady = usePortalReady();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const content = useMemo(() => {
    if (!selection) return null;

    if (selection.type === 'live') {
      return (
        <>
          <Header title="LIVE FEED" subtitle="Latest pings across the globe." onClose={onClose} />

          <Section title="WETTER WATCH">
            <p className="text-white/80">{selection.meta.wetterWatch}</p>
          </Section>

          <Section title="MOVE">
            <ActionRow>
              <a className={btnPrimary()} href={routes.community}>
                Open Community
              </a>
              <a className={btnGhost()} href={routes.submitBeacon}>
                Submit a Beacon
              </a>
            </ActionRow>
          </Section>

          <Section title="ALWAYS ON">
            <ActionRow>
              <a className={btnGhost()} href={routes.radio}>
                Listen (Radio)
              </a>
              <a className={btnGhost()} href={routes.care}>
                Aftercare (Care)
              </a>
              <a className={btnGhost()} href={routes.affiliate}>
                Partner (Affiliate)
              </a>
            </ActionRow>
          </Section>

          <Footer />
        </>
      );
    }

    if (selection.type === 'city') {
      const c = selection.city;
      return (
        <>
          <Header
            title={c.name}
            subtitle={[
              c.active ? 'ACTIVE' : 'STANDBY',
              c.sponsored ? 'SPONSORED' : null,
              `${selection.meta.beaconCount} BEACON${selection.meta.beaconCount === 1 ? '' : 'S'}`,
            ]
              .filter(Boolean)
              .join(' • ')}
            onClose={onClose}
          />

          <Section title="CITY ACTIONS">
            <ActionRow>
              <a className={btnPrimary()} href={selection.meta.filterHref}>
                Filter beacons in {c.name}
              </a>
              <a className={btnGhost()} href={routes.submitBeacon}>
                Submit a Beacon
              </a>
            </ActionRow>
          </Section>

          <Section title="POWER LINES">
            <ActionRow>
              <a className={btnGhost()} href={routes.radio}>
                Listen (Radio)
              </a>
              <a className={btnGhost()} href={routes.care}>
                Aftercare (Care)
              </a>
              <a className={btnGhost()} href={routes.affiliate}>
                Become a Partner
              </a>
            </ActionRow>
          </Section>

          <Footer />
        </>
      );
    }

    if (selection.type === 'beacon') {
      const b = selection.beacon;
      return (
        <>
          <Header
            title={b.title ? b.title.toUpperCase() : kindLabel(b.kind)}
            subtitle={[
              kindLabel(b.kind),
              b.city ? b.city.toUpperCase() : null,
              selection.meta.timeAgo,
              b.sponsored ? 'SPONSORED' : null,
            ]
              .filter(Boolean)
              .join(' • ')}
            onClose={onClose}
          />

          <Section title="DETAILS">
            <div className="grid grid-cols-2 gap-3 text-[12px] text-white/80">
              <Info label="ID" value={b.id} />
              <Info label="TYPE" value={kindLabel(b.kind)} />
              <Info label="CITY" value={b.city ? b.city.toUpperCase() : '—'} />
              <Info label="INTENSITY" value={String(Math.round((b.intensity ?? 0.6) * 100)) + '%'} />
            </div>
          </Section>

          <Section title="NEXT MOVE">
            <ActionRow>
              <a className={btnPrimary()} href={selection.meta.primaryHref}>
                {primaryCtaLabel(selection)}
              </a>
              <a className={btnGhost()} href={routes.radio}>
                Listen (Radio)
              </a>
            </ActionRow>

            <ActionRow>
              <a className={btnGhost()} href={routes.care}>
                Aftercare (Care)
              </a>
              <a className={btnGhost()} href={routes.affiliate}>
                Partner (Affiliate)
              </a>
            </ActionRow>
          </Section>

          {b.sponsored ? (
            <Section title="DISCLOSURE">
              <p className="text-[12px] leading-snug text-white/75">
                This beacon is a sponsored placement. Full disclosure lives here:
              </p>
              <a className={btnGhost('mt-2 w-full justify-center')} href={routes.sponsorshipDisclosures}>
                Sponsorship Disclosures
              </a>
            </Section>
          ) : null}

          <Section title="CARE-FIRST">
            <p className="text-[12px] leading-snug text-white/75">
              Consent is continuous. Aftercare is real. If you need a place to land, the Care hub is open.
            </p>
          </Section>

          <Footer />
        </>
      );
    }

    return null;
  }, [selection, onClose, routes]);

  if (!portalReady) return null;

  return createPortal(
    <div className={['fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none'].join(' ')} aria-hidden={!open}>
      <div
        className={['absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0'].join(
          ' '
        )}
        onClick={onClose}
      />

      <aside
        className={[
          'absolute right-0 top-0 h-full w-[92vw] max-w-[420px] border-l border-white/10 bg-black',
          'shadow-hard transition-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-5">{content}</div>
        </div>
      </aside>
    </div>,
    document.body
  );
}

function Header({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] tracking-[.24em] uppercase text-white/90">{title}</div>
          <div className="mt-2 text-[11px] tracking-[.22em] uppercase text-white/55">{subtitle}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] tracking-[.22em] uppercase text-white/80 hover:border-white/35 hover:bg-white/10"
        >
          Close <span className="ml-2 opacity-70">Esc</span>
        </button>
      </div>
      <div className="mt-4 h-px w-full bg-white/10" />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] tracking-[.22em] uppercase text-white/55">{title}</div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">{children}</div>
    </div>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 flex flex-col gap-2">{children}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      <div className="text-[10px] tracking-[.22em] uppercase text-white/50">{label}</div>
      <div className="mt-1 text-[12px] tracking-[.06em] text-white/85">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="text-[11px] tracking-[.22em] uppercase text-white/55">Closing Affirmation</div>
      <div className="mt-2 text-[12px] text-white/80">Hand N Hand is the only place to land.</div>
    </div>
  );
}

function btnPrimary(extra = '') {
  return [
    'inline-flex items-center justify-center rounded-2xl px-4 py-3',
    'text-[11px] tracking-[.22em] uppercase',
    'bg-white text-black border border-white/70',
    'hover:bg-white/90 transition',
    extra,
  ].join(' ');
}

function btnGhost(extra = '') {
  return [
    'inline-flex items-center justify-center rounded-2xl px-4 py-3',
    'text-[11px] tracking-[.22em] uppercase',
    'bg-black/30 text-white/85 border border-white/15',
    'hover:border-white/35 hover:bg-white/5 transition',
    extra,
  ].join(' ');
}
