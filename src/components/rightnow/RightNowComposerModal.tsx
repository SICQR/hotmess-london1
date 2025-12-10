'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import {
  RightNowComposer,
  RightNowDraftPayload,
  RightNowEntitlements,
  MembershipTier,
  XpTier,
} from './RightNowComposer';

interface RightNowComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  membership?: MembershipTier;
  xpTier?: XpTier;
  onPostCreated?: () => void;
}

function computeEntitlements(
  membership: MembershipTier,
  xpTier: XpTier,
): RightNowEntitlements {
  if (membership === 'icon') {
    return {
      membership,
      xpTier,
      maxPostLength: 600,
      maxRadiusKm: 25,
      dailyPostLimit: 20,
      canAttachMedia: true,
      canBoost: true,
    };
  }

  if (membership === 'hnh') {
    return {
      membership,
      xpTier,
      maxPostLength: 400,
      maxRadiusKm: 15,
      dailyPostLimit: 10,
      canAttachMedia: true,
      canBoost: false,
    };
  }

  if (membership === 'vendor' || membership === 'sponsor') {
    return {
      membership,
      xpTier,
      maxPostLength: 500,
      maxRadiusKm: 20,
      dailyPostLimit: 30,
      canAttachMedia: true,
      canBoost: true,
    };
  }

  // FREE tier
  return {
    membership,
    xpTier,
    maxPostLength: 200,
    maxRadiusKm: 5,
    dailyPostLimit: 3,
    canAttachMedia: false,
    canBoost: false,
  };
}

export function RightNowComposerModal({
  isOpen,
  onClose,
  apiBase,
  city,
  country,
  lat,
  lng,
  membership = 'free',
  xpTier = 'fresh',
  onPostCreated,
}: RightNowComposerModalProps) {
  const entitlements = useMemo(
    () => computeEntitlements(membership, xpTier),
    [membership, xpTier],
  );

  async function handleSubmit(payload: RightNowDraftPayload) {
    // Call your existing RIGHT NOW create endpoint
    const res = await fetch(`${apiBase}/right-now-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    // Close modal and refresh feed
    onClose();
    if (onPostCreated) {
      onPostCreated();
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="hm-panel relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Composer */}
            <RightNowComposer
              apiBase={apiBase}
              defaultCity={city}
              defaultCountry={country}
              lat={lat}
              lng={lng}
              entitlements={entitlements}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
