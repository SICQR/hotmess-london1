import { RouteId } from '../lib/routes';
import { ArrowLeft, Link } from 'lucide-react';

interface LegalAffiliatesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalAffiliates({ onNavigate }: LegalAffiliatesProps) {
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
          <Link size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Affiliate Disclosure</h1>
        </div>
        <p className="text-zinc-400 mb-12">Transparency about our affiliate relationships</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl uppercase mb-4">What Are Affiliates?</h2>
            <p className="text-zinc-300 leading-relaxed">
              HOTMESS LONDON participates in affiliate marketing programs. This means we may earn 
              commissions when you purchase products or services through our links.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Our Standards</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We only promote products and services we believe benefit our community. 
              Affiliate relationships never compromise our editorial integrity.
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>We only recommend what we genuinely endorse</li>
              <li>Affiliate links are clearly disclosed</li>
              <li>Our reviews and opinions remain honest and unbiased</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Commission Disclosure</h2>
            <p className="text-zinc-300 leading-relaxed">
              When you make a purchase through our affiliate links, we may receive a small commission 
              at no additional cost to you. This helps support our platform and community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Your Choice</h2>
            <p className="text-zinc-300 leading-relaxed">
              You're never obligated to use our affiliate links. You can always go directly to any 
              provider's website. We appreciate your support when you do choose to use our links.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
