/**
 * CARE POSITION PAGE
 * Canonical arrival experience
 */

import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface CarePositionPageProps {
  onNavigate: (route: RouteId) => void;
}

export function CarePositionPage({ onNavigate }: CarePositionPageProps) {
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
          {ARRIVAL_COPY.careHeading}
        </h2>
        
        <p 
          className="mb-8" 
          style={{ 
            fontWeight: 400, 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.6'
          }}
        >
          {ARRIVAL_COPY.careBody1}
        </p>
        
        <p 
          className="mb-4" 
          style={{ 
            fontWeight: 600, 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)'
          }}
        >
          {ARRIVAL_COPY.careBody2}
        </p>
        
        <ul className="mb-8 ml-6">
          {ARRIVAL_COPY.careDoNotProvide.map((item, i) => (
            <li 
              key={i}
              style={{ 
                fontWeight: 400, 
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.8'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        
        <p 
          className="mb-12 p-6 border-l-4 border-[#ff1694] bg-[#ff1694]/10" 
          style={{ 
            fontWeight: 700, 
            fontSize: '16px',
            color: '#ff1694',
            lineHeight: '1.6'
          }}
        >
          {ARRIVAL_COPY.careEmergency}
        </p>
        
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
          Continue
        </button>
      </div>
    </div>
  );
}
