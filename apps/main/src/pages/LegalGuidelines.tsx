import { RouteId } from '../lib/routes';
import { ArrowLeft, FileText } from 'lucide-react';

interface LegalGuidelinesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalGuidelines({ onNavigate }: LegalGuidelinesProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        BACK
      </button>

      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Community Guidelines</h1>
        </div>
        <p className="text-zinc-400 mb-12">Last updated: December 2, 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl uppercase mb-4">Respect & Consent</h2>
            <p className="text-zinc-300 leading-relaxed">
              All interactions on HOTMESS LONDON must be consensual and respectful. 
              No means no. Always ask before engaging.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Safety First</h2>
            <p className="text-zinc-300 leading-relaxed">
              We prioritize community safety. Report any behavior that makes you feel unsafe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Prohibited Content</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Harassment, bullying, or hate speech</li>
              <li>Non-consensual content or images</li>
              <li>Minors (18+ only)</li>
              <li>Illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Enforcement</h2>
            <p className="text-zinc-300 leading-relaxed">
              Violations may result in content removal, account suspension, or permanent ban.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
