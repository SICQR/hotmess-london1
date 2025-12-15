/**
 * BEACON OS DEMO - Temporary Navigation Bar
 * Matches HOTMESS LONDON aesthetic: black bg, hot pink (#E70F3C) accents, white text
 * Using exact typography from Figma import (no Tailwind text classes)
 */

interface BeaconDemoNavProps {
  currentRoute?: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function BeaconDemoNav({ currentRoute, onNavigate }: BeaconDemoNavProps) {
  const isHome = currentRoute === 'beaconsDemoHome';
  const isScan = currentRoute === 'beaconScanDemo';
  
  console.log('🔥 BeaconDemoNav rendering:', { currentRoute, isHome, isScan });

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[9999] bg-black border-b-4 border-[#E70F3C]"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-7xl mx-auto px-6 bg-black">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo / Brand - Matches HOTMESS header style */}
          <button
            onClick={() => onNavigate('beaconsDemoHome')}
            className="hover:opacity-80 transition"
          >
            <div className="relative">
              {/* Main title */}
              <p 
                className="text-white uppercase whitespace-pre"
                style={{ 
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: '38px',
                  lineHeight: '38px',
                  letterSpacing: '-1.5289px'
                }}
              >
                HOTMESS
              </p>
              {/* Subtitle with red dot */}
              <div className="flex items-center gap-[8px] mt-[12px]">
                <p 
                  className="text-[rgba(255,255,255,0.5)] uppercase whitespace-pre"
                  style={{ 
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '16px',
                    letterSpacing: '0.6px'
                  }}
                >
                  BEACON DEMO
                </p>
                <div className="bg-[#E70F3C] size-[6px]" />
              </div>
            </div>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {/* Home Link */}
            <button
              onClick={() => onNavigate('beaconsDemoHome')}
              className={`transition ${
                isHome ? 'text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
              }`}
            >
              <span style={{ 
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.6px'
              }} className="uppercase">
                Home
              </span>
            </button>

            {/* Scan Link */}
            <button
              onClick={() => onNavigate('beaconScanDemo', { code: 'DEMO_CHECKIN' })}
              className={`transition ${
                isScan ? 'text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
              }`}
            >
              <span style={{ 
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.6px'
              }} className="uppercase">
                Scan
              </span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />

            {/* Quick Actions */}
            <button
              onClick={() => onNavigate('beaconScanDemo', { code: 'DEMO_CHECKIN', lat: '51.5136', lng: '-0.1357' })}
              className="px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] transition border border-[rgba(255,255,255,0.1)]"
            >
              <span style={{ 
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.6px'
              }} className="text-white uppercase">
                Check-in
              </span>
            </button>

            <button
              onClick={() => onNavigate('beaconScanDemo', { code: 'DEMO_TICKET', mode: 'validate' })}
              className="px-4 py-2 hover:bg-[rgba(231,15,60,0.2)] transition border border-[#E70F3C]"
            >
              <span style={{ 
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.6px'
              }} className="text-[#E70F3C] uppercase">
                Door Scan
              </span>
            </button>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
            <span style={{ 
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: '16px',
              letterSpacing: '0.5px'
            }} className="text-[rgba(255,255,255,0.4)] uppercase">
              :3001
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}