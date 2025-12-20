import { RouteId } from '../lib/routes';
import { ArrowLeft, Eye } from 'lucide-react';

interface LegalAccessibilityProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalAccessibility({ onNavigate }: LegalAccessibilityProps) {
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
          <Eye size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Accessibility Statement</h1>
        </div>
        <p className="text-zinc-400 mb-12">Our commitment to accessibility</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl uppercase mb-4">Our Commitment</h2>
            <p className="text-zinc-300 leading-relaxed">
              HOTMESS LONDON is committed to ensuring digital accessibility for all users, 
              including those with disabilities. We are continually improving the user experience 
              and applying relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Standards</h2>
            <p className="text-zinc-300 leading-relaxed">
              We aim to conform to WCAG 2.1 Level AA standards. This includes:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mt-4">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>Sufficient color contrast</li>
              <li>Alternative text for images</li>
              <li>Clear focus indicators</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Feedback</h2>
            <p className="text-zinc-300 leading-relaxed">
              We welcome your feedback on the accessibility of HOTMESS LONDON. 
              If you encounter accessibility barriers, please let us know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Ongoing Improvements</h2>
            <p className="text-zinc-300 leading-relaxed">
              Accessibility is an ongoing effort. We regularly audit our platform and make improvements 
              to ensure everyone can access our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
