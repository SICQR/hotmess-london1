/**
 * ENTER PAGE - Eligibility Gate
 * Canonical arrival experience
 */

import { useState } from 'react';
import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface EnterPageProps {
  onNavigate: (route: RouteId) => void;
}

export function EnterPage({ onNavigate }: EnterPageProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#ff1694]/10 to-black" />
      
      <div className="relative z-10 max-w-lg">
        <div className="bg-black/90 border-2 border-white/20 p-8 backdrop-blur-xl">
          <h2 
            className="mb-6" 
            style={{ 
              fontWeight: 900, 
              fontSize: '32px',
              color: '#ffffff'
            }}
          >
            {ARRIVAL_COPY.gateHeading}
          </h2>
          
          <p 
            className="mb-4" 
            style={{ 
              fontWeight: 400, 
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.6'
            }}
          >
            {ARRIVAL_COPY.gateBody1}<br />
            {ARRIVAL_COPY.gateBody2}
          </p>
          
          <p 
            className="mb-8" 
            style={{ 
              fontWeight: 600, 
              fontSize: '16px',
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {ARRIVAL_COPY.gateBody3}
          </p>
          
          <label className="flex items-start gap-3 mb-8 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 bg-white/10 border-2 border-white/30 checked:bg-[#ff1694] checked:border-[#ff1694] cursor-pointer"
            />
            <span 
              className="flex-1"
              style={{ 
                fontWeight: 500, 
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)'
              }}
            >
              {ARRIVAL_COPY.gateConfirm}
            </span>
          </label>
          
          <div className="flex gap-4 mb-4">
            <button
              disabled={!confirmed}
              onClick={() => onNavigate('nightPulse')}
              className="flex-1 px-6 py-3 bg-[#ff1694] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff1694]/80 transition-colors"
              style={{ 
                fontWeight: 900, 
                fontSize: '16px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              {ARRIVAL_COPY.gateContinue}
            </button>
            
            <button
              onClick={() => window.location.href = 'https://google.com'}
              className="flex-1 px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
              style={{ 
                fontWeight: 700, 
                fontSize: '16px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              {ARRIVAL_COPY.gateLeave}
            </button>
          </div>
          
          <p 
            className="text-center"
            style={{ 
              fontWeight: 400, 
              fontSize: '10px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            {ARRIVAL_COPY.gateEnforced}
          </p>
        </div>
      </div>
    </div>
  );
}
