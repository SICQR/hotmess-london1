/**
 * SYSTEM PAGE - System Definition
 * Canonical arrival experience
 */

import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface SystemPageProps {
  onNavigate: (route: RouteId) => void;
}

export function SystemPage({ onNavigate }: SystemPageProps) {
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
          {ARRIVAL_COPY.systemHeading}
        </h2>
        
        <p 
          className="mb-6" 
          style={{ 
            fontWeight: 400, 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.6'
          }}
        >
          {ARRIVAL_COPY.systemBody1}
        </p>
        
        <p 
          className="mb-4" 
          style={{ 
            fontWeight: 600, 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)'
          }}
        >
          {ARRIVAL_COPY.systemBody2}
        </p>
        
        <ul className="mb-8 ml-6">
          {ARRIVAL_COPY.systemCoordinates.map((item, i) => (
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
          className="mb-2" 
          style={{ 
            fontWeight: 600, 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)'
          }}
        >
          {ARRIVAL_COPY.systemBody3}<br />
          {ARRIVAL_COPY.systemBody4}<br />
          {ARRIVAL_COPY.systemBody5}
        </p>
        
        <button
          onClick={() => onNavigate('nightPulse')}
          className="mt-12 px-12 py-4 bg-[#ff1694] text-white hover:bg-[#ff1694]/80 transition-colors"
          style={{ 
            fontWeight: 900, 
            fontSize: '18px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          Show me
        </button>
      </div>
    </div>
  );
}
