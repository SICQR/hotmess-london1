import { RouteId } from '../lib/routes';
import { ArrowLeft, Megaphone } from 'lucide-react';

interface LegalAdvertisingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalAdvertising({ onNavigate }: LegalAdvertisingProps) {
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
          <Megaphone size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Advertising Policy</h1>
        </div>
        <p className="text-zinc-400 mb-12">Guidelines for advertising on HOTMESS LONDON</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl uppercase mb-4">Approved Advertisers</h2>
            <p className="text-zinc-300 leading-relaxed">
              We carefully curate advertisers to ensure they align with our community values. 
              Advertisers must respect our audience and promote safe, consensual experiences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Prohibited Advertising</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Conversion therapy or anti-LGBTQ+ services</li>
              <li>Illegal substances or services</li>
              <li>Misleading or deceptive claims</li>
              <li>Content promoting unsafe practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Transparency</h2>
            <p className="text-zinc-300 leading-relaxed">
              All sponsored content and advertisements are clearly labeled. 
              We maintain editorial independence and don't let advertisers influence our content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl uppercase mb-4">Advertise With Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              Interested in reaching our engaged community of queer men? Contact us about advertising opportunities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
