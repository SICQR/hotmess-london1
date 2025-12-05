/**
 * NEON FRAME - HOTMESS Signature QR Frame
 * Hot pink neon glow with outer halo
 */

interface NeonFrameProps {
  size?: number;
  children?: React.ReactNode;
}

export function NeonFrame({ size = 600, children }: NeonFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="qr-frame qr-frame-neon"
    >
      <defs>
        {/* Neon glow filter */}
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="600" height="600" fill="#000000" />

      {/* Outer halo */}
      <circle
        cx="300"
        cy="300"
        r="280"
        fill="none"
        stroke="#FF1744"
        strokeWidth="2"
        opacity="0.2"
        filter="url(#neon-glow)"
      />

      {/* Main neon ring */}
      <circle
        cx="300"
        cy="300"
        r="250"
        fill="none"
        stroke="#FF1744"
        strokeWidth="8"
        filter="url(#neon-glow)"
      />

      {/* Inner bright ring */}
      <circle
        cx="300"
        cy="300"
        r="245"
        fill="none"
        stroke="#FF1744"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* QR content area */}
      <foreignObject x="150" y="150" width="300" height="300">
        {children}
      </foreignObject>
    </svg>
  );
}
