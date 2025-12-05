// app/beacons/page.tsx
// HOTMESS Beacons - Marketing one-pager

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Scan,
  Zap,
  Clock,
  Heart,
  Users,
  Ticket,
  Package,
  Radio,
  HeartHandshake,
  CheckCircle,
  Shield,
  Eye,
  BellRing,
} from "lucide-react";

export default function BeaconsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-16">
      {/* Hero */}
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          HOTMESS BEACONS
        </h1>
        <p className="text-xl opacity-90">
          Scan the city. Unlock the moment.
        </p>
        <p className="max-w-2xl mx-auto opacity-80">
          Beacons turn real-world heat into clean, consent-first actions — from
          check-ins and drops to tickets, live radio, and care. Every beacon
          runs on a short burn (3 / 6 / 9 hours). No stale links. No spam loops.
        </p>

        {/* CTA Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/map">
              <MapPin className="h-5 w-5 mr-2" />
              Open the Map
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-2xl">
            <Link href="/scan">
              <Scan className="h-5 w-5 mr-2" />
              Scan a Beacon
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <Link href="/premium">
              <Zap className="h-5 w-5 mr-2" />
              Go Premium
            </Link>
          </Button>
        </div>

        {/* Microcopy */}
        <div className="text-sm opacity-70 space-y-1 pt-2">
          <p>18+ men-only. Consent-first by design.</p>
          <p>Save a beacon to get a heads-up before it expires.</p>
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Scan className="h-6 w-6 opacity-80" />
              <h3 className="text-xl font-semibold">Scan → Reveal</h3>
            </div>
            <p className="opacity-80">
              Scan any beacon QR and you'll see the full details instantly: what
              it is, what it unlocks, and how long it's live.
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 opacity-80" />
              <h3 className="text-xl font-semibold">Pick One Action</h3>
            </div>
            <p className="opacity-80">
              Beacons are colour-coded by type. Tap one clear call-to-action
              (plus Save / Care / Report).
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 opacity-80" />
              <h3 className="text-xl font-semibold">XP, Not Pressure</h3>
            </div>
            <p className="opacity-80">
              You earn XP for exploring. Extra XP comes from meaningful actions
              (check-in, join a live show, complete a verified ticket flow).
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 opacity-80" />
              <h3 className="text-xl font-semibold">Short Burn Windows</h3>
            </div>
            <p className="opacity-80">
              Every beacon expires on purpose (3/6/9h). Fresh moments only.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Beacon Types */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Beacon Types</h2>
        <p className="text-center opacity-80">Colour-coded by purpose</p>

        <div className="space-y-4">
          {/* Check-In */}
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold">Check-In</h3>
              <span className="text-sm opacity-70">(Green)</span>
            </div>
            <p className="opacity-80">
              "I'm here." Venue pulse, attendance XP, and a clean breadcrumb in
              your history.
            </p>
          </div>

          {/* Connect */}
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-semibold">Looking to Connect</h3>
              <span className="text-sm opacity-70">(Red)</span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                Premium
              </span>
            </div>
            <p className="opacity-80">
              Mutual opt-in only. No unsolicited contact. Chat unlocks only when
              both say yes.
            </p>
          </div>

          {/* Tickets */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Ticket className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">Selling a Ticket</h3>
              <span className="text-sm opacity-70">(Orange)</span>
            </div>
            <p className="opacity-80">
              Listings, proof upload (optional/recommended), buyer–seller thread,
              and moderation.
            </p>
          </div>

          {/* Product Drop */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold">Product Drop</h3>
              <span className="text-sm opacity-70">(Purple)</span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                Premium early access optional
              </span>
            </div>
            <p className="opacity-80">
              Timed unlocks, claim links, and limited releases that actually stay
              limited.
            </p>
          </div>

          {/* Content Release */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold">Content Release</h3>
              <span className="text-sm opacity-70">(Blue)</span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                Premium optional
              </span>
            </div>
            <p className="opacity-80">
              Unlock audio/video/articles, behind-the-scenes, member-only cuts.
            </p>
          </div>

          {/* Radio */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Radio className="h-6 w-6 text-cyan-500" />
              <h3 className="text-xl font-semibold">Live Radio (In-House)</h3>
              <span className="text-sm opacity-70">(Cyan)</span>
            </div>
            <p className="opacity-80">
              On-air beacons with show notes, reminders, and "tune in now"
              actions.
            </p>
          </div>

          {/* Care */}
          <div className="rounded-2xl border p-6 space-y-2">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Care Beacon</h3>
              <span className="text-sm opacity-70">(White)</span>
            </div>
            <p className="opacity-80">
              Fast access to Hand N Hand info, grounding prompts, and safer
              choices.
            </p>
          </div>

          {/* Care Disclaimer */}
          <div className="text-sm opacity-70 px-6">
            <p>
              <strong>Care disclaimer:</strong> Care and aftercare content is
              information/services only and not medical advice. If you need
              urgent help, use local emergency services.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Map Layers */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">
          Map Layers: Control, Not Clutter
        </h2>
        <p className="text-center opacity-80">Toggle what you want</p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-4 text-center space-y-2">
            <MapPin className="h-6 w-6 mx-auto opacity-80" />
            <p className="font-semibold">Pins</p>
            <p className="text-sm opacity-70">Live beacons</p>
          </div>

          <div className="rounded-2xl border p-4 text-center space-y-2">
            <Zap className="h-6 w-6 mx-auto opacity-80" />
            <p className="font-semibold">Heat</p>
            <p className="text-sm opacity-70">Activity zones</p>
          </div>

          <div className="rounded-2xl border p-4 text-center space-y-2">
            <MapPin className="h-6 w-6 mx-auto opacity-80" />
            <p className="font-semibold">Trails</p>
            <p className="text-sm opacity-70">Movement paths</p>
          </div>

          <div className="rounded-2xl border p-4 text-center space-y-2">
            <MapPin className="h-6 w-6 mx-auto opacity-80" />
            <p className="font-semibold">Cities</p>
            <p className="text-sm opacity-70">City boundaries</p>
          </div>

          <div className="rounded-2xl border p-4 text-center space-y-2">
            <BellRing className="h-6 w-6 mx-auto opacity-80" />
            <p className="font-semibold">My Layer</p>
            <p className="text-sm opacity-70">Saved + history</p>
          </div>
        </div>

        <p className="text-center text-sm opacity-70 pt-2">
          Your map, your rules. Nothing forces itself on you.
        </p>
      </section>

      <Separator />

      {/* Why It Slaps */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Why It Slaps</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">For You</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>• Clarity on scan — no bait and switch</li>
              <li>• Consent-first flows</li>
              <li>• Short windows keep it fresh</li>
              <li>• XP rewards exploration without pressure</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">For HOTMESS</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>• IRL → digital growth loop</li>
              <li>• Trackable, measurable, repeatable</li>
              <li>• Campaigns by city, by venue, by night</li>
              <li>• Safer ops with reporting + moderation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">For Partners</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>• Sponsorship disclosures baked in</li>
              <li>• Real metrics: scans, saves, conversions</li>
              <li>• Retention tracking</li>
            </ul>
          </div>
        </div>
      </section>

      <Separator />

      {/* Safety + Privacy */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">
          Safety + Privacy
        </h2>
        <p className="text-center opacity-80">Plain English</p>

        <div className="rounded-2xl border p-6 space-y-3 opacity-90">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 mt-1" />
            <div className="space-y-2">
              <p>• 18+ men-only access.</p>
              <p>• Connect is mutual opt-in. Tickets are moderated.</p>
              <p>
                • You can report, block, and mute threads in one tap.
              </p>
              <p>
                • Data is purpose-limited and deletable via the{" "}
                <Link href="/data-privacy-hub" className="underline underline-offset-4">
                  Data & Privacy Hub
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">FAQ</h2>

        <div className="space-y-4">
          <div className="rounded-2xl border p-6 space-y-2">
            <h3 className="font-semibold">Do I have to be premium?</h3>
            <p className="opacity-80">
              No. Many beacons are free. Premium unlocks higher-risk /
              higher-value actions like Connect and early drops.
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-2">
            <h3 className="font-semibold">
              Can someone message me from a scan?
            </h3>
            <p className="opacity-80">
              No. Connect only unlocks chat after mutual opt-in.
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-2">
            <h3 className="font-semibold">What happens when a beacon expires?</h3>
            <p className="opacity-80">
              It burns out. You can still view your own history, but actions
              close.
            </p>
          </div>

          <div className="rounded-2xl border p-6 space-y-2">
            <h3 className="font-semibold">Is proof required for tickets?</h3>
            <p className="opacity-80">
              Sometimes. Some ticket beacons require proof; others recommend it.
              Either way, reporting is one tap.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Footer Links */}
      <section className="space-y-4">
        <h3 className="font-semibold text-center">Explore HOTMESS</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <Link href="/map" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Map
          </Link>
          <Link href="/shop" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Shop
          </Link>
          <Link href="/hnh-mess" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            HNH MESS
          </Link>
          <Link href="/radio" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Radio
          </Link>
          <Link href="/records" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Records
          </Link>
          <Link href="/affiliate" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Affiliate
          </Link>
          <Link href="/care/hand-n-hand" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Care: Hand N Hand
          </Link>
          <Link href="/community" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Community
          </Link>
          <Link href="/about" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            About
          </Link>
          <Link href="/press" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Press Room
          </Link>
          <Link href="/accessibility" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Accessibility
          </Link>
          <Link href="/data-privacy-hub" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Data & Privacy Hub
          </Link>
          <Link href="/legal/privacy" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Privacy
          </Link>
          <Link href="/legal/terms" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Terms
          </Link>
          <Link href="/legal/age-verification" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Age Verification
          </Link>
          <Link href="/legal/sponsorship" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Sponsorship
          </Link>
          <Link href="/legal/ugc-moderation" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            UGC/Moderation
          </Link>
          <Link href="/legal/abuse-reporting" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Abuse Reporting
          </Link>
          <Link href="/legal/dmca" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            DMCA
          </Link>
          <Link href="/creators" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Creator Onboarding
          </Link>
          <Link href="/partners" className="underline underline-offset-4 opacity-80 hover:opacity-100">
            Partner Integrations
          </Link>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-12" />
    </main>
  );
}
