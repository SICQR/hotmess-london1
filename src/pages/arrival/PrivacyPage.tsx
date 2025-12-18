/**
 * PRIVACY PAGE - Privacy Position
 * Canonical arrival experience
 */

import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface PrivacyPageProps {
  onNavigate: (route: RouteId) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl">
        <h2 
          className="mb-8" 
          style={{ 
            fontWeight: 900, 
            fontSize: '48px',
            color: '#ffffff'
          }}
        >
          {ARRIVAL_COPY.privacyHeading}
        </h2>
        
        <div className="space-y-6 mb-12">
          <p 
            style={{ 
              fontWeight: 600, 
              fontSize: '18px',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: '1.6'
            }}
          >
            {ARRIVAL_COPY.privacyBody1}
          </p>
          
          <p 
            style={{ 
              fontWeight: 400, 
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.6'
            }}
          >
            {ARRIVAL_COPY.privacyBody2}
          </p>
          
          <p 
            style={{ 
              fontWeight: 400, 
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.6'
            }}
          >
            {ARRIVAL_COPY.privacyBody3}
          </p>
          
          <p 
            style={{ 
              fontWeight: 400, 
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.6'
            }}
          >
            {ARRIVAL_COPY.privacyBody4}
          </p>
        </div>
        
        <div className="flex gap-6 mb-12 p-6 border border-white/20 bg-white/5">
          <a
            href="/legal/privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('legalPrivacy');
            }}
            className="text-[#ff1694] hover:text-[#ff1694]/80 underline"
            style={{ 
              fontWeight: 600, 
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            {ARRIVAL_COPY.privacyLinks.policy}
          </a>
          <a
            href="/data-privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dataPrivacy');
            }}
            className="text-[#ff1694] hover:text-[#ff1694]/80 underline"
            style={{ 
              fontWeight: 600, 
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            {ARRIVAL_COPY.privacyLinks.hub}
          </a>
        </div>
        
        <button
          onClick={() => onNavigate('nightPulse')}
          className="px-12 py-4 bg-[#ff1694] text-white hover:bg-[#ff1694]/80 transition-colors"
          style={{ 
            fontWeight: 900, 
            fontSize: '18px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          Enter the system
        </button>
      </div>
    </div>
  );
}
