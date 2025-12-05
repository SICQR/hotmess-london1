// app/about/page.tsx
// About HOTMESS

export const metadata = {
  title: "About | HOTMESS",
  description: "About HOTMESS LONDON",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">About</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          HOTMESS LONDON
        </h1>
        <div className="text-sm opacity-80">Masculine nightlife OS for queer men 18+</div>
      </header>

      <div className="space-y-6">
        <div className="rounded-3xl border p-6 space-y-4">
          <div className="font-bold text-xl">What is HOTMESS?</div>
          <div className="text-sm opacity-90 space-y-2">
            <p>
              HOTMESS LONDON is a complete masculine nightlife operating system for queer men 18+.
              We combine care-first principles with kink aesthetics to create a platform that's
              bold, honest, and built for the community.
            </p>
            <p>
              From beacon scanning to ticket marketplace, 24/7 radio to care resources — we're
              building the infrastructure for London's queer nightlife.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <div className="font-bold text-xl">Care Dressed as Kink</div>
          <div className="text-sm opacity-90">
            Our design philosophy: masculine, sweaty, bold. But underneath? Care resources,
            harm reduction, mental health support. We look out for each other.
          </div>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <div className="font-bold text-xl">Features</div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>✅ Beacon scanning & QR codes</div>
            <div>✅ Ticket marketplace</div>
            <div>✅ 24/7 live radio</div>
            <div>✅ RAW CONVICT RECORDS</div>
            <div>✅ MessMarket</div>
            <div>✅ Hand N Hand care resources</div>
            <div>✅ Live city heatmap</div>
            <div>✅ Community features</div>
          </div>
        </div>

        <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6 space-y-2">
          <div className="font-bold text-green-400">💚 CARE FIRST</div>
          <div className="text-sm opacity-90">
            Built on principles of consent, transparency, and mutual support.
            Zero tolerance for harassment, discrimination, or harm.
          </div>
        </div>
      </div>
    </main>
  );
}
