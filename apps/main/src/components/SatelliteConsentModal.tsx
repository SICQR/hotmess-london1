import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  dataHubHref: string;
};

function usePortalReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function SatelliteConsentModal({ open, onAccept, onDecline, dataHubHref }: Props) {
  const portalReady = usePortalReady();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDecline();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onDecline]);

  if (!portalReady) return null;

  return createPortal(
    <div className={['fixed inset-0 z-[60]', open ? 'pointer-events-auto' : 'pointer-events-none'].join(' ')}>
      <div
        className={['absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0'].join(
          ' '
        )}
        onClick={onDecline}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={[
            'w-full max-w-[520px] rounded-3xl border border-white/12 bg-black',
            'shadow-hard transition-transform',
            open ? 'scale-100' : 'scale-95',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 sm:p-7">
            <div className="text-[12px] tracking-[.28em] uppercase text-white/60">Consent required</div>
            <div className="mt-2 text-[18px] tracking-[.06em] text-white/92">Satellite view uses external imagery.</div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/75">
              If enabled, HOTMESS may load third-party tiles. You can revoke anytime in the Data &amp; Privacy Hub.
              We don’t sell your data. We do respect your boundaries.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={onAccept}
                className="rounded-2xl border border-white/70 bg-white px-4 py-3 text-[11px] tracking-[.22em] uppercase text-black hover:bg-white/90"
              >
                Enable Satellite
              </button>
              <button
                type="button"
                onClick={onDecline}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[11px] tracking-[.22em] uppercase text-white/85 hover:border-white/35 hover:bg-white/10"
              >
                Not now
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-[11px] tracking-[.18em] uppercase text-white/55">
              <span>18+ • consent-first</span>
              <a className="underline decoration-white/30 hover:decoration-white/60" href={dataHubHref}>
                Data &amp; Privacy Hub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
