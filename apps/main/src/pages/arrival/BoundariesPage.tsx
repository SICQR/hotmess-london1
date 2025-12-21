/**
 * BOUNDARIES PAGE - Boundaries Notice
 * Canonical arrival experience
 */

import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface BoundariesPageProps {
  onNavigate: (route: RouteId) => void;
}

export function BoundariesPage({ onNavigate }: BoundariesPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl">
        <h2 
          className="mb-8" 
          style={{ 
            fontWeight: 900, 
            fontSize: '48px',
            color: '#ff1694'
          }}
        >
          {ARRIVAL_COPY.boundariesHeading}
        </h2>
        
        <div className="space-y-6 mb-12">
          <p 
            style={{ 
              fontWeight: 600, 
              fontSize: '20px',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody1}
          </p>
          <p 
            style={{ 
              fontWeight: 600, 
              fontSize: '20px',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody2}
          </p>
          <p 
            style={{ 
              fontWeight: 600, 
              fontSize: '20px',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody3}
          </p>
          
          <div className="my-8 h-px bg-white/20" />
          
          <p 
            style={{ 
              fontWeight: 700, 
              fontSize: '20px',
              color: '#ff1694',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody4}
          </p>
          <p 
            style={{ 
              fontWeight: 700, 
              fontSize: '20px',
              color: '#ff1694',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody5}
          </p>
          
          <div className="my-8 h-px bg-white/20" />
          
          <p 
            style={{ 
              fontWeight: 600, 
              fontSize: '20px',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.5'
            }}
          >
            {ARRIVAL_COPY.boundariesBody6}
          </p>
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
          Understood
        </button>
      </div>
    </div>
  );
}
