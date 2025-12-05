// app/care/page.tsx
// Hand N Hand care resources

export const metadata = {
  title: "Care | HOTMESS",
  description: "Hand N Hand care resources",
};

export default function CarePage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">Care</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          HAND N HAND
        </h1>
        <div className="text-sm opacity-80">Care resources. We look out for each other.</div>
      </header>

      <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6 space-y-2">
        <div className="font-bold text-green-400">💚 CARE FIRST</div>
        <div className="text-sm opacity-90">
          Mental health, sexual health, harm reduction. Resources you can trust.
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border p-6">
          <div className="font-bold mb-2">Sexual Health</div>
          <div className="text-sm opacity-80">
            PrEP, testing, STI info. Know your status. Stay safe.
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <div className="font-bold mb-2">Mental Health</div>
          <div className="text-sm opacity-80">
            Crisis lines, support groups, therapy resources. You're not alone.
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <div className="font-bold mb-2">Harm Reduction</div>
          <div className="text-sm opacity-80">
            Safer use info, testing services, naloxone access. Stay informed.
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 space-y-2">
        <div className="font-bold">Emergency Resources</div>
        <div className="text-sm opacity-90 space-y-1">
          <div>🆘 <strong>Emergency:</strong> 999</div>
          <div>🧠 <strong>Mental Health Crisis:</strong> 116 123 (Samaritans)</div>
          <div>💊 <strong>Sexual Health:</strong> 56 Dean Street</div>
        </div>
      </div>
    </main>
  );
}
