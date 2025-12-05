// app/legal/page.tsx
// Legal hub

export const metadata = {
  title: "Legal | HOTMESS",
  description: "Terms, privacy, and policies",
};

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">Legal</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          TERMS & POLICIES
        </h1>
        <div className="text-sm opacity-80">Keep it clean. Keep it legal.</div>
      </header>

      <div className="space-y-4">
        <a href="/legal/terms" className="block rounded-3xl border p-6 hover:border-hot transition-colors">
          <div className="font-bold mb-2">Terms of Service</div>
          <div className="text-sm opacity-80">
            Rules of the road. Read before using HOTMESS.
          </div>
        </a>

        <a href="/legal/privacy" className="block rounded-3xl border p-6 hover:border-hot transition-colors">
          <div className="font-bold mb-2">Privacy Policy</div>
          <div className="text-sm opacity-80">
            How we handle your data. Transparency first.
          </div>
        </a>

        <a href="/legal/cookies" className="block rounded-3xl border p-6 hover:border-hot transition-colors">
          <div className="font-bold mb-2">Cookie Policy</div>
          <div className="text-sm opacity-80">
            What cookies we use and why.
          </div>
        </a>

        <a href="/data-privacy" className="block rounded-3xl border p-6 hover:border-hot transition-colors">
          <div className="font-bold mb-2">Data Privacy</div>
          <div className="text-sm opacity-80">
            GDPR compliance, data rights, and export tools.
          </div>
        </a>

        <a href="/abuse-reporting" className="block rounded-3xl border p-6 hover:border-hot transition-colors">
          <div className="font-bold mb-2">Abuse Reporting</div>
          <div className="text-sm opacity-80">
            Report violations. Zero tolerance for harm.
          </div>
        </a>
      </div>

      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 space-y-2">
        <div className="font-bold">Questions?</div>
        <div className="text-sm opacity-90">
          Email legal@hotmess.london for inquiries.
        </div>
      </div>
    </main>
  );
}
