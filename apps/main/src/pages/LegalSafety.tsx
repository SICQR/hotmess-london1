import { RouteId } from '../lib/routes';
import { ArrowLeft, Shield } from 'lucide-react';

interface LegalSafetyProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalSafety({ onNavigate }: LegalSafetyProps) {
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
          <Shield size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Safety Center</h1>
        </div>
        <p className="text-zinc-400 mb-12">Resources and guidelines for staying safe</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl uppercase mb-4">Personal Safety</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Meet in public places first</li>
              <li>Tell a friend where you're going</li>
              <li>Trust your instincts</li>
              <li>Use protection always</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Online Safety</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Don't share personal info too quickly</li>
              <li>Use platform messaging initially</li>
              <li>Block and report suspicious users</li>
              <li>Verify identities before meeting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Sexual Health</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Get tested regularly. Communicate your status. Use protection. Take PrEP if appropriate.
            </p>
            <p className="text-zinc-400 text-sm">
              HOTMESS provides info, not medical advice. Consult healthcare professionals for your needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Report Issues</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you experience harassment, unsafe behavior, or violations, report them immediately through the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
