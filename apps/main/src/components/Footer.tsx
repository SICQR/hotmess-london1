import { RouteId } from '../lib/routes';

interface FooterProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const trustLinks: { label: string; route: RouteId }[] = [
    { label: 'Legal', route: 'legal' },
    { label: 'Privacy Hub', route: 'dataPrivacy' },
    { label: 'Accessibility', route: 'accessibility' },
    { label: 'Abuse Reporting', route: 'abuseReporting' },
    { label: 'DMCA', route: 'dmca' },
    { label: 'Sponsorship', route: 'affiliate' },
  ];

  const quickLinks: { label: string; route: RouteId }[] = [
    { label: 'About', route: 'about' },
    { label: 'Press', route: 'pressRoom' },
    { label: 'Care', route: 'care' },
    { label: 'Affiliate', route: 'affiliate' },
  ];

  return (
    <footer className="bg-black border-t border-white/10 lg:ml-80">
      <div className="px-6 lg:px-12 py-12">
        {/* Aftercare notice */}
        <div className="bg-hot/10 border border-hot/30 p-6 mb-8">
          <p className="text-white/80 leading-relaxed" style={{ fontSize: '14px' }}>
            <strong className="text-hot">Aftercare:</strong> Information and support options—not medical advice. 
            If you're in immediate danger, contact local emergency services (UK: 999).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Trust Rail */}
          <div>
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '14px' }}>
              Trust & Safety
            </h3>
            <div className="space-y-2">
              {trustLinks.map(link => (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className="block text-white/60 hover:text-hot transition-colors"
                  style={{ fontWeight: 700, fontSize: '14px' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '14px' }}>
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map(link => (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className="block text-white/60 hover:text-hot transition-colors"
                  style={{ fontWeight: 700, fontSize: '14px' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '14px' }}>
              Support
            </h3>
            <div className="space-y-3">
              <a href="mailto:hello@hotmesslondon.com" className="block text-white/60 hover:text-hot transition-colors" style={{ fontSize: '14px' }}>
                hello@hotmesslondon.com
              </a>
              <button
                onClick={() => onNavigate('care')}
                className="block text-hot hover:text-white transition-colors"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                Hand N Hand (Care)
              </button>
              <button
                onClick={() => onNavigate('dataPrivacy')}
                className="block text-white/60 hover:text-hot transition-colors"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                Privacy Hub
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/40" style={{ fontSize: '14px' }}>
            © 2025 HOTMESS LONDON. 18+ only.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('legalTerms')}
              className="text-white/40 hover:text-hot transition-colors"
              style={{ fontSize: '14px' }}
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('legalPrivacy')}
              className="text-white/40 hover:text-hot transition-colors"
              style={{ fontSize: '14px' }}
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('legalCookies')}
              className="text-white/40 hover:text-hot transition-colors"
              style={{ fontSize: '14px' }}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}