import { HeartHandshake, BookOpen } from 'lucide-react';

export default function NotEligiblePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.9))]" />
      </div>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-24">
        <div className="rounded-2xl border border-white/15 bg-black/80 p-8 text-center">
          <h1 className="text-3xl font-black uppercase">Not Eligible for RIGHT NOW</h1>
          
          <p className="mt-4 text-white/70">
            RIGHT NOW and other hookup features are exclusively for men over 18 in queer
            nightlife. This is a core part of how HOTMESS works.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="/care"
              className="flex items-center justify-center gap-3 rounded-xl border border-white/20 p-4 transition hover:border-white"
            >
              <HeartHandshake className="h-6 w-6 text-hotmess-red" />
              <div className="text-left">
                <div className="text-sm font-semibold">Hand N Hand Care</div>
                <div className="text-xs text-white/60">
                  Resources, support, and safety information for everyone
                </div>
              </div>
            </a>

            <a
              href="/about"
              className="flex items-center justify-center gap-3 rounded-xl border border-white/20 p-4 transition hover:border-white"
            >
              <BookOpen className="h-6 w-6" />
              <div className="text-left">
                <div className="text-sm font-semibold">About HOTMESS</div>
                <div className="text-xs text-white/60">
                  Learn more about what we build and why
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
