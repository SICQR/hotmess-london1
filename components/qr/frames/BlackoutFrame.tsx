/**
 * BLACKOUT FRAME - RAW CONVICT Style
 * Matte black with glossy inner border
 */

interface BlackoutFrameProps {
  size?: number;
  children?: React.ReactNode;
  showLogo?: boolean;
}

export function BlackoutFrame({ size = 600, children, showLogo = false }: BlackoutFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="qr-frame qr-frame-blackout"
    >
      <defs>
        {/* Glossy gradient */}
        <linearGradient id="glossy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Matte black background */}
      <rect width="600" height="600" fill="#0a0a0a" />

      {/* Outer frame */}
      <rect
        x="40"
        y="40"
        width="520"
        height="520"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="3"
      />

      {/* Inner glossy border */}
      <rect
        x="120"
        y="120"
        width="360"
        height="360"
        fill="none"
        stroke="url(#glossy-gradient)"
        strokeWidth="4"
      />

      {/* QR content area */}
      <foreignObject x="150" y="150" width="300" height="300">
        {children}
      </foreignObject>

      {/* Optional RC logo at bottom */}
      {showLogo && (
        <text
          x="300"
          y="540"
          textAnchor="middle"
          fill="#FFFFFF"
          fillOpacity="0.6"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="2"
        >
          RAW CONVICT
        </text>
      )}
    </svg>
  );
}
