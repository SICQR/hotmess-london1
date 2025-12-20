/**
 * HOME PAGE - First Load (Public, No Gate)
 * Canonical arrival experience
 */

import { ARRIVAL_COPY } from '../../constants/copy';
import { RouteId } from '../../lib/routes';

interface HomePageProps {
  onNavigate: (route: RouteId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#ff1694]/5 to-black" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h1 
          className="mb-6" 
          style={{ 
            fontWeight: 900, 
            fontSize: '64px', 
            letterSpacing: '0.05em',
            color: '#ffffff'
          }}
        >
          HOTMESS
        </h1>
        
        <p 
          className="mb-4" 
          style={{ 
            fontWeight: 700, 
            fontSize: '24px',
            color: '#ff1694'
          }}
        >
          {ARRIVAL_COPY.homeTagline}
        </p>
        
        <p 
          className="mb-8" 
          style={{ 
            fontWeight: 400, 
            fontSize: '16px',
            color: 'rgba(255,255,255,0.7)'
          }}
        >
          {ARRIVAL_COPY.homeSubline}
        </p>
        
        <div 
          className="mb-12 py-4 px-6 border border-white/20 bg-white/5 backdrop-blur-sm"
          style={{ 
            fontWeight: 400, 
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          {ARRIVAL_COPY.homeLiveIndicators}
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
          Enter
        </button>
      </div>
      
      {/* Footer */}
      <footer 
        className="absolute bottom-8 text-center"
        style={{ 
          fontWeight: 400, 
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em'
        }}
      >
        {ARRIVAL_COPY.homeFooter}
      </footer>
    </div>
  );
}
