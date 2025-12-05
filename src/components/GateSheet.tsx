/**
 * GATE SHEET
 * Handles all beacon requirement gates:
 * - Premium tier upsell
 * - Location/GPS verification
 * - Age confirmation (18+)
 * - Consent confirmation
 */

import React from 'react';
import { X, Lock, LocateFixed, ShieldAlert, Crown } from 'lucide-react';
import { RequirementChip, requirementChipLabel } from '../lib/beaconTypes';
import { RouteId } from '../lib/routes';

interface GateSheetProps {
  missingRequirements: RequirementChip[];
  onClose: () => void;
  onNavigate: (route: RouteId) => void;
  onRequestLocation: () => Promise<void>;
  onConfirmAge: () => void;
  onConfirmConsent: () => void;
}

export function GateSheet({
  missingRequirements,
  onClose,
  onNavigate,
  onRequestLocation,
  onConfirmAge,
  onConfirmConsent,
}: GateSheetProps) {
  const [isRequestingLocation, setIsRequestingLocation] = React.useState(false);

  const handleLocationRequest = async () => {
    setIsRequestingLocation(true);
    try {
      await onRequestLocation();
    } finally {
      setIsRequestingLocation(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl m-4 rounded-3xl border border-white/20 bg-black shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="text-xs tracking-[0.32em] uppercase text-white/70">
            REQUIREMENTS
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 p-2 hover:border-white/35 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="text-center py-4">
            <div className="mb-4" style={{ fontSize: '64px' }}>🚫</div>
            <div className="uppercase tracking-tight" style={{ fontSize: '24px', fontWeight: 900 }}>
              ACCESS REQUIRED
            </div>
            <div className="mt-2 text-white/60" style={{ fontSize: '14px' }}>
              Complete these requirements to proceed
            </div>
          </div>

          <div className="space-y-3">
            {missingRequirements.map((req) => {
              switch (req) {
                case 'PREMIUM':
                  return (
                    <GateCard
                      key={req}
                      icon={<Crown size={24} />}
                      title="Premium Required"
                      description="This beacon requires a premium subscription to access"
                      actionLabel="Upgrade to Premium"
                      onAction={() => onNavigate('shop')}
                      accentColor="rgba(255, 215, 0, 1)"
                    />
                  );

                case 'GPS':
                  return (
                    <GateCard
                      key={req}
                      icon={<LocateFixed size={24} />}
                      title="Location Verification"
                      description="You must be within range to scan this beacon"
                      actionLabel={isRequestingLocation ? 'Checking...' : 'Enable Location'}
                      onAction={handleLocationRequest}
                      disabled={isRequestingLocation}
                      accentColor="rgba(33, 150, 243, 1)"
                    />
                  );

                case 'AGE_18':
                  return (
                    <GateCard
                      key={req}
                      icon={<ShieldAlert size={24} />}
                      title="Age Confirmation"
                      description="You must confirm you are 18+ to access this content"
                      actionLabel="I am 18 or older"
                      onAction={onConfirmAge}
                      accentColor="rgba(255, 255, 255, 0.85)"
                    />
                  );

                case 'CONSENT':
                  return (
                    <GateCard
                      key={req}
                      icon={<Lock size={24} />}
                      title="Consent Required"
                      description="Review and accept the terms for this beacon type"
                      actionLabel="Review & Accept"
                      onAction={onConfirmConsent}
                      accentColor="rgba(156, 39, 176, 1)"
                    />
                  );
              }
            })}
          </div>

          <div className="pt-4 text-xs text-white/40 text-center leading-relaxed">
            HOTMESS uses permission gates to protect both you and our community.
            No data is shared without your explicit consent.
          </div>
        </div>
      </div>
    </div>
  );
}

interface GateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  accentColor: string;
}

function GateCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  disabled,
  accentColor,
}: GateCardProps) {
  return (
    <div
      className="rounded-2xl border bg-white/5 p-6 space-y-4"
      style={{ borderColor: `${accentColor}20` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="rounded-full p-3 flex-shrink-0"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{title}</div>
          <div className="mt-1 text-white/70" style={{ fontSize: '14px' }}>{description}</div>
        </div>
      </div>

      <button
        onClick={onAction}
        disabled={disabled}
        className="w-full rounded-full px-6 py-3 tracking-wider uppercase text-black transition-all disabled:opacity-50"
        style={{
          backgroundColor: accentColor,
          boxShadow: disabled ? 'none' : `0 0 20px ${accentColor}40`,
          fontWeight: 700,
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
