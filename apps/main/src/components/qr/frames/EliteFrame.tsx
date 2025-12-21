/**
 * ELITE FRAME - Premium metallic/chrome style
 * Black-purple gradient with chrome ring
 */

interface EliteFrameProps {
  size?: number;
  children?: React.ReactNode;
}

export function EliteFrame({ size = 600, children }: EliteFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="qr-frame qr-frame-elite"
    >
      <defs>
        {/* Chrome gradient */}
        <linearGradient id="chrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="25%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="75%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </linearGradient>

        {/* Background gradient */}
        <radialGradient id="elite-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Purple accent gradient */}
        <linearGradient id="purple-accent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9C27B0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        {/* Metallic shine */}
        <filter id="metallic-shine">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="0" result="offsetblur" />
          <feFlood floodColor="#FFFFFF" floodOpacity="0.5" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gradient background */}
      <rect width="600" height="600" fill="url(#elite-bg)" />

      {/* Purple accent overlay */}
      <rect width="600" height="600" fill="url(#purple-accent)" />

      {/* Outer metallic ring */}
      <circle
        cx="300"
        cy="300"
        r="260"
        fill="none"
        stroke="url(#chrome-gradient)"
        strokeWidth="4"
        filter="url(#metallic-shine)"
      />

      {/* Inner chrome ring */}
      <circle
        cx="300"
        cy="300"
        r="250"
        fill="none"
        stroke="url(#chrome-gradient)"
        strokeWidth="10"
        opacity="0.9"
      />

      {/* Purple glow ring */}
      <circle
        cx="300"
        cy="300"
        r="245"
        fill="none"
        stroke="#9C27B0"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* QR content area */}
      <foreignObject x="150" y="150" width="300" height="300">
        {children}
      </foreignObject>

      {/* Crown icon */}
      <g transform="translate(280, 60)">
        <path
          d="M 20 20 L 15 10 L 10 15 L 5 5 L 0 15 L -5 10 L 0 20 Z"
          fill="url(#chrome-gradient)"
          filter="url(#metallic-shine)"
        />
        <circle cx="5" cy="5" r="2" fill="#FFD700" />
        <circle cx="-5" cy="10" r="2" fill="#FFD700" />
        <circle cx="0" cy="15" r="2" fill="#FFD700" />
      </g>

      {/* ELITE label */}
      <text
        x="300"
        y="540"
        textAnchor="middle"
        fill="url(#chrome-gradient)"
        fontSize="16"
        fontWeight="bold"
        letterSpacing="4"
        filter="url(#metallic-shine)"
      >
        ELITE
      </text>
    </svg>
  );
}
