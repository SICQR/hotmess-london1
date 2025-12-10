// BeaconSheets.tsx
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

import {
  Activity,
  BadgeInfo,
  Bookmark,
  HeartHandshake,
  LocateFixed,
  Lock,
  MapPin,
  Play,
  QrCode,
  Share2,
  ShieldAlert,
  Ticket as TicketIcon,
  Users,
  ShoppingBag,
} from "lucide-react";

import type {
  BeaconType,
  RequirementChip,
  BeaconTypeConfig,
  GateContext,
  UrgencyTier,
} from "../lib/beaconTypes";
import {
  BEACON_TYPE_CONFIG,
  getUrgencyTier,
  urgencyUI,
  getMissingRequirements,
  requirementChipLabel,
  getBeaconPresentation,
} from "../lib/beaconTypes";

export type Beacon = {
  id: string;
  type: BeaconType;
  title: string;
  description?: string;
  expiresAtMs: number;
  isSponsored?: boolean;
  underlyingType?: BeaconType; // if isSponsored, preserve real type
  gpsRequired?: boolean; // optional override per beacon instance
  premiumOverride?: boolean; // optional override per beacon instance
  routeOverride?: string; // optional override for CTA route
};

type TrackFn = (event: string, props?: Record<string, unknown>) => void;

const ICONS = {
  QrCode,
  MapPin,
  Users,
  Ticket: TicketIcon,
  ShoppingBag,
  Play,
  HeartHandshake,
  Activity,
  BadgeInfo,
  Lock,
  LocateFixed,
  ShieldAlert,
  Share2,
  Bookmark,
} as const;

function formatRemaining(expiresAtMs: number, nowMs: number) {
  const delta = Math.max(0, expiresAtMs - nowMs);
  const totalSec = Math.floor(delta / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function buildRequirements(beacon: Beacon, base: BeaconTypeConfig): RequirementChip[] {
  // Start with type-level requirements
  let req = [...base.requirements];

  // Instance overrides (optional)
  if (beacon.gpsRequired && !req.includes("GPS")) req.push("GPS");
  if (beacon.premiumOverride && !req.includes("PREMIUM")) req.push("PREMIUM");

  return req;
}

function GateStepOrder(): RequirementChip[] {
  // The sacred order; keeps UX consistent and "premium-feeling"
  return ["AGE_18", "CONSENT", "PREMIUM", "GPS"];
}

function GateStepTitle(step: RequirementChip) {
  switch (step) {
    case "AGE_18":
      return "Confirm 18+";
    case "CONSENT":
      return "Consent check";
    case "PREMIUM":
      return "Premium access";
    case "GPS":
      return "Verify proximity";
  }
}

function GateStepDescription(step: RequirementChip) {
  switch (step) {
    case "AGE_18":
      return "Confirm you're 18+ to proceed.";
    case "CONSENT":
      return "Consent is mandatory. No pressure, no entitlement.";
    case "PREMIUM":
      return "Premium unlocks this action.";
    case "GPS":
      return "Verify you're nearby to unlock this beacon.";
  }
}

export function BeaconActionSheet(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  beacon: Beacon;
  ctx: GateContext;
  onUpdateCtx: (patch: Partial<GateContext>) => void;

  // Actions
  onSave: (beaconId: string) => void;
  onShare: (beaconId: string) => void;
  onReport: (beaconId: string) => void;
  onOpenCare: () => void;

  // Navigation
  onNavigate: (route: string) => void;

  // Premium
  onUpgradePremium: () => void;

  // Location services [Assumption]
  requestLocationPermission: () => Promise<boolean>;
  verifyProximity: (beacon: Beacon) => Promise<boolean>;

  track?: TrackFn;
}) {
  const { beacon, ctx, onUpdateCtx, track } = props;

  const presentation = getBeaconPresentation({
    type: beacon.type,
    isSponsored: beacon.isSponsored,
    underlyingType: beacon.underlyingType,
  });

  const base = BEACON_TYPE_CONFIG[presentation.type];
  const requirements = buildRequirements(beacon, base);

  const missing = getMissingRequirements(requirements, ctx);
  const nowMs = Date.now();
  const tier: UrgencyTier = getUrgencyTier({ nowMs, expiresAtMs: beacon.expiresAtMs });
  const ui = urgencyUI(tier);

  const Icon = ICONS[presentation.icon];

  const primaryRoute = beacon.routeOverride ?? base.defaultCTA.route;
  const primaryLabel = base.defaultCTA.label;

  const [gateOpen, setGateOpen] = React.useState(false);

  function tryProceed() {
    track?.("action_attempted", { beaconId: beacon.id, type: beacon.type, missing });
    if (tier === "EXPIRED") return;
    if (missing.length > 0) {
      setGateOpen(true);
      track?.("gate_opened", { beaconId: beacon.id, type: beacon.type, missing });
      return;
    }
    props.onNavigate(primaryRoute);
    track?.("action_started", { beaconId: beacon.id, route: primaryRoute });
  }

  const expired = tier === "EXPIRED";

  return (
    <>
      <Sheet open={props.open} onOpenChange={props.onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <SheetHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="rounded-full">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {presentation.label}
                  </span>
                </Badge>
                {presentation.sponsoredBadge ? (
                  <Badge variant="secondary" className="rounded-full">
                    SPONSORED
                  </Badge>
                ) : null}
              </div>

              <div className="text-xs tabular-nums opacity-80">
                {expired ? (
                  <span className="font-medium">Expired</span>
                ) : (
                  <span className={ui.pulse ? "animate-pulse font-semibold" : "font-medium"}>
                    Expires in {formatRemaining(beacon.expiresAtMs, nowMs)}
                  </span>
                )}
              </div>
            </div>

            <SheetTitle className="text-lg">{beacon.title}</SheetTitle>
            {beacon.description ? (
              <SheetDescription className="text-sm">{beacon.description}</SheetDescription>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-2">
              {requirements.map((r) => (
                <Badge key={r} variant="outline" className="rounded-full">
                  {requirementChipLabel(r)}
                </Badge>
              ))}
            </div>

            <Separator className="my-2" />
          </SheetHeader>

          {expired ? (
            <Alert>
              <AlertDescription>
                This beacon has burned out. Your scan stays in <span className="font-medium">My Layer</span>.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="mt-4 space-y-3">
            <Button
              className="w-full rounded-2xl"
              size="lg"
              onClick={tryProceed}
              disabled={expired}
            >
              {missing.length > 0 ? (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Continue
                </span>
              ) : (
                primaryLabel
              )}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => props.onSave(beacon.id)}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => props.onShare(beacon.id)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between text-sm">
              <button
                className="opacity-80 hover:opacity-100 underline underline-offset-4"
                onClick={props.onOpenCare}
              >
                Care
              </button>

              <button
                className="flex items-center gap-2 opacity-80 hover:opacity-100 underline underline-offset-4"
                onClick={() => props.onReport(beacon.id)}
              >
                <ShieldAlert className="h-4 w-4" />
                Report
              </button>
            </div>

            <div className="text-xs opacity-70">
              Rules + Safety are always available. Consent-first. No pressure.
            </div>
          </div>

          <SheetFooter className="mt-4" />
        </SheetContent>
      </Sheet>

      <BeaconGateSheet
        open={gateOpen}
        onOpenChange={setGateOpen}
        beacon={beacon}
        requirements={requirements}
        missing={missing}
        ctx={ctx}
        onUpdateCtx={onUpdateCtx}
        onUpgradePremium={props.onUpgradePremium}
        requestLocationPermission={props.requestLocationPermission}
        verifyProximity={props.verifyProximity}
        track={track}
        onDone={() => {
          // re-attempt when gates complete
          setGateOpen(false);
          tryProceed();
        }}
        onOpenCare={props.onOpenCare}
        onReport={props.onReport}
      />
    </>
  );
}

export function BeaconGateSheet(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  beacon: Beacon;
  requirements: RequirementChip[];
  missing: RequirementChip[];
  ctx: GateContext;
  onUpdateCtx: (patch: Partial<GateContext>) => void;

  onUpgradePremium: () => void;

  // Location services [Assumption]
  requestLocationPermission: () => Promise<boolean>;
  verifyProximity: (beacon: Beacon) => Promise<boolean>;

  onDone: () => void;
  onOpenCare: () => void;
  onReport: (beaconId: string) => void;

  track?: TrackFn;
}) {
  const { requirements, ctx, onUpdateCtx, track } = props;

  const ordered = GateStepOrder().filter((s) => requirements.includes(s));
  const trulyMissing = getMissingRequirements(requirements, ctx);

  const activeStep = ordered.find((s) => trulyMissing.includes(s)) ?? null;

  const [consentA, setConsentA] = React.useState(Boolean(ctx.hasConsentConfirmed));
  const [consentB, setConsentB] = React.useState(Boolean(ctx.hasConsentConfirmed));
  const consentOk = consentA && consentB;

  async function handleCompleteStep(step: RequirementChip) {
    track?.("gate_step_attempted", { beaconId: props.beacon.id, step });

    if (step === "AGE_18") {
      onUpdateCtx({ hasAgeConfirmed: true });
      track?.("gate_step_completed", { beaconId: props.beacon.id, step });
      return;
    }

    if (step === "CONSENT") {
      if (!consentOk) return;
      onUpdateCtx({ hasConsentConfirmed: true });
      track?.("gate_step_completed", { beaconId: props.beacon.id, step });
      return;
    }

    if (step === "PREMIUM") {
      props.onUpgradePremium();
      // You'll likely return with ctx.isPremium true after checkout.
      // Keep sheet open; user can retry.
      return;
    }

    if (step === "GPS") {
      const allowed = await props.requestLocationPermission();
      onUpdateCtx({ locationAllowed: allowed });
      if (!allowed) return;

      const verified = await props.verifyProximity(props.beacon);
      onUpdateCtx({ gpsVerified: verified });
      if (verified) track?.("gate_step_completed", { beaconId: props.beacon.id, step });
      return;
    }
  }

  const allGood = getMissingRequirements(requirements, ctx).length === 0;

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-lg">Before you continue</SheetTitle>
          <SheetDescription className="text-sm">
            Quick checks to keep things clean, safe, and consent-first.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {ordered.map((step) => {
            const isMissing = trulyMissing.includes(step);
            const isActive = activeStep === step;

            return (
              <div
                key={step}
                className={[
                  "rounded-2xl border p-4",
                  isActive ? "border-opacity-100" : "border-opacity-40 opacity-90",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold">{GateStepTitle(step)}</div>
                    <div className="text-sm opacity-80">{GateStepDescription(step)}</div>
                  </div>

                  <Badge className="rounded-full" variant={isMissing ? "secondary" : "outline"}>
                    {isMissing ? "Required" : "Done"}
                  </Badge>
                </div>

                {step === "CONSENT" && isMissing ? (
                  <div className="mt-3 space-y-3">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox checked={consentA} onCheckedChange={(v) => setConsentA(Boolean(v))} />
                      <span>Consent is required and I can stop anytime.</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox checked={consentB} onCheckedChange={(v) => setConsentB(Boolean(v))} />
                      <span>I won't harass, pressure, or pursue anyone who isn't opting in.</span>
                    </label>
                  </div>
                ) : null}

                {step === "GPS" && isMissing ? (
                  <div className="mt-3 text-xs opacity-75">
                    Location is used only to verify proximity when required.
                  </div>
                ) : null}

                <div className="mt-4">
                  <Button
                    className="w-full rounded-2xl"
                    variant={isActive ? "default" : "secondary"}
                    disabled={!isMissing || (step === "CONSENT" && !consentOk)}
                    onClick={() => handleCompleteStep(step)}
                  >
                    {step === "AGE_18" ? (
                      "Confirm 18+"
                    ) : step === "CONSENT" ? (
                      "Confirm consent"
                    ) : step === "PREMIUM" ? (
                      "Go Premium"
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <LocateFixed className="h-4 w-4" />
                        Verify nearby
                      </span>
                    )}
                  </Button>

                  {step === "GPS" && isMissing && ctx.locationAllowed && !ctx.gpsVerified ? (
                    <div className="mt-2 text-xs opacity-80">
                      Not close enough yet (or couldn't verify). Try moving nearer and retry.
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          <Separator />

          <div className="space-y-3">
            <Button
              className="w-full rounded-2xl"
              size="lg"
              disabled={!allGood}
              onClick={props.onDone}
            >
              Continue
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                className="opacity-80 hover:opacity-100 underline underline-offset-4"
                onClick={props.onOpenCare}
              >
                Care
              </button>

              <button
                className="flex items-center gap-2 opacity-80 hover:opacity-100 underline underline-offset-4"
                onClick={() => props.onReport(props.beacon.id)}
              >
                <ShieldAlert className="h-4 w-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
