import { ShieldAlert, Mail } from 'lucide-react';

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.9))]" />
      </div>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-24">
        <div className="rounded-2xl border border-red-500/30 bg-black/80 p-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>

          <h1 className="text-3xl font-black uppercase">Account Restricted</h1>
          
          <p className="mt-4 text-white/70">
            Your account has been temporarily restricted due to behaviour that violates
            HOTMESS community guidelines.
          </p>

          <div className="mt-6 rounded-lg bg-red-500/10 p-4 text-left text-sm text-red-200">
            <p className="mb-2">
              <strong>Common reasons for restrictions:</strong>
            </p>
            <ul className="ml-4 list-disc space-y-1 text-xs">
              <li>Posting content involving minors</li>
              <li>Harassment or hate speech</li>
              <li>Spam or commercial promotion without vendor status</li>
              <li>Sharing location or personal info without consent</li>
              <li>Ignoring repeated community guidelines</li>
            </ul>
          </div>

          <div className="mt-8">
            <a
              href="mailto:support@hotmess.london?subject=Account Restriction Appeal"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              Appeal This Decision
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">
            If you believe this was a mistake, email us with your account details. We review
            all appeals within 48 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
