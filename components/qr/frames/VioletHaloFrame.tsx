/**
 * VIOLET HALO FRAME - HNH MESS Style  
 * Purple gradient crest with soft halo
 */

interface VioletHaloFrameProps {
  size?: number;
  children?: React.ReactNode;
}

export function VioletHaloFrame({ size = 600, children }: VioletHaloFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="qr-frame qr-frame-violet"
    >
      <defs>
        {/* Violet gradient */}
        <radialGradient id="violet-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#9C27B0" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#7B2FE3" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Soft glow */}
        <filter id="violet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Black background */}
      <rect width="600" height="600" fill="#000000" />

      {/* Violet halo background */}
      <circle
        cx="300"
        cy="300"
        r="280"
        fill="url(#violet-gradient)"
      />

      {/* Soft glow ring */}
      <circle
        cx="300"
        cy="300"
        r="250"
        fill="none"
        stroke="#7B2FE3"
        strokeWidth="6"
        opacity="0.6"
        filter="url(#violet-glow)"
      />

      {/* Inner sharp ring */}
      <circle
        cx="300"
        cy="300"
        r="245"
        fill="none"
        stroke="#9C27B0"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Crest shape at top */}
      <path
        d="M 250 80 Q 300 60, 350 80 L 340 100 Q 300 85, 260 100 Z"
        fill="#7B2FE3"
        opacity="0.4"
      />

      {/* QR content area */}
      <foreignObject x="150" y="150" width="300" height="300">
        {children}
      </foreignObject>

      {/* Aftercare microcopy space */}
      <text
        x="300"
        y="530"
        textAnchor="middle"
        fill="#FFFFFF"
        fillOpacity="0.4"
        fontSize="10"
        letterSpacing="1"
      >
        CARE • SUPPORT • NO JUDGEMENT
      </text>
    </svg>
  );
}
