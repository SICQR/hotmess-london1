'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { CheckCircle2, AlertTriangle, HeartHandshake, Shield } from 'lucide-react';

export default function RightNowOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/right-now';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [gender, setGender] = useState<'male' | ''>('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('UK');
  const [dataConsent, setDataConsent] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [menOnlyConsent, setMenOnlyConsent] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (gender !== 'male') {
      setError('RIGHT NOW is exclusively for men. We have other resources at /care and /about.');
      return;
    }

    if (!dob) {
      setError('Date of birth is required to verify you\'re 18+.');
      return;
    }

    // Calculate age
    const birthDate = new Date(dob);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 18) {
      setError('You must be 18 or older to use RIGHT NOW.');
      return;
    }

    if (!city) {
      setError('City is required for location-based features.');
      return;
    }

    if (!dataConsent || !ageConsent || !menOnlyConsent) {
      setError('You must accept all terms to continue.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          gender,
          dob,
          city,
          country,
          has_onboarded_right_now: true,
          age_verified: true,
          men_only_consent: true,
          behaviour_consent: true,
          location_consent: true,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        throw updateError;
      }

      // Redirect to original destination
      router.push(next);
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_120%,rgba(255,23,68,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.9))]" />
      </div>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight uppercase">
            Welcome to RIGHT NOW
          </h1>
          <p className="mt-2 text-sm tracking-[0.2em] uppercase text-white/60">
            Men-only • 18+ • Consent-first nightlife OS
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 w-16 rounded-full ${
                i <= step ? 'bg-hotmess-red' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Gender */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-black/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">Who is this for?</h2>
              <p className="mb-6 text-sm text-white/70">
                RIGHT NOW is built exclusively for men in queer nightlife. If that&apos;s not
                you, we have care resources and information at{' '}
                <a href="/care" className="underline decoration-hotmess-red/60">
                  HOTMESS CARE
                </a>
                , but the hookup and nightlife features won&apos;t be accessible.
              </p>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 p-4 transition hover:border-white">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value as 'male')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">I&apos;m a man (18+)</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 p-4 opacity-50">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    disabled
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    I&apos;m not a man (you can access /care and /about, but not RIGHT NOW)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!gender}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-90 disabled:opacity-30"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-black/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">Age verification</h2>
              <p className="mb-6 text-sm text-white/70">
                You must be 18 or older to use RIGHT NOW. We store your date of birth to
                verify age, not for marketing.
              </p>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]}
                className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 outline-none focus:border-white"
              />

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  If you&apos;re under 18, you can&apos;t proceed. HOTMESS is designed for
                  adults in nightlife and we take this seriously.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!dob}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-90 disabled:opacity-30"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-black/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">Where are you based?</h2>
              <p className="mb-6 text-sm text-white/70">
                We use city-level location to show you RIGHT NOW posts and events in your
                area. We never store exact addresses or door numbers — only coarse grids for
                heat maps.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/60">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London, Manchester, Berlin"
                    className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/60">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 outline-none focus:border-white"
                  >
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-200">
                <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Your location is binned to ~100m grids for privacy. You can change this
                  or delete all data at{' '}
                  <a href="/legal/data-privacy" className="underline">
                    Data & Privacy Hub
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!city}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-90 disabled:opacity-30"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Consent */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-black/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">Final checks</h2>
              <p className="mb-6 text-sm text-white/70">
                HOTMESS is consent-first. Read these carefully and confirm.
              </p>

              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={ageConsent}
                    onChange={(e) => setAgeConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm">
                    I confirm I am a man over 18 and I&apos;m not posting for anyone who
                    isn&apos;t.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={menOnlyConsent}
                    onChange={(e) => setMenOnlyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm">
                    I understand HOTMESS is men-only queer nightlife. We keep it consensual,
                    pressure-free, and within the law.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={dataConsent}
                    onChange={(e) => setDataConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm">
                    I&apos;ve read the{' '}
                    <a
                      href="/legal/data-privacy"
                      target="_blank"
                      className="underline decoration-hotmess-red/60"
                    >
                      Data & Privacy Policy
                    </a>{' '}
                    and understand I can download or delete my data anytime.
                  </span>
                </label>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-lg bg-white/5 p-3">
                <HeartHandshake className="mt-0.5 h-4 w-4 flex-shrink-0 text-hotmess-red" />
                <p className="text-xs text-white/70">
                  <strong className="text-white">Aftercare on HOTMESS:</strong> Information,
                  support, and services — never medical or clinical advice. If something
                  feels off, head straight to{' '}
                  <a href="/care" className="underline decoration-hotmess-red/60">
                    Hand N Hand
                  </a>
                  .
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={loading}
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-white disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!dataConsent || !ageConsent || !menOnlyConsent || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-hotmess-red px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:opacity-30"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Enter HOTMESS
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
