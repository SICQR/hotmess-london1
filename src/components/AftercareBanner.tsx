import { Heart } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface AftercareBannerProps {
  onNavigate: (route: RouteId) => void;
}

export function AftercareBanner({ onNavigate }: AftercareBannerProps) {
  return (
    <div className="bg-hot/10 border border-hot/30 p-6 flex items-start gap-4">
      <Heart size={24} className="text-hot flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h3 className="text-hot uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>
          Aftercare Notice
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          Aftercare here means information and support options—not medical advice. If you're in immediate danger, contact local emergency services.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <button
            onClick={() => onNavigate('care')}
            className="text-hot hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700 }}
          >
            Care Resources
          </button>
          <button
            onClick={() => onNavigate('legalCareDisclaimer')}
            className="text-white/60 hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700 }}
          >
            Disclaimer
          </button>
        </div>
      </div>
    </div>
  );
}
