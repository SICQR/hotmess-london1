/**
 * MINIMAL FRAMES - Clean, no-frills QR frames
 * Available in black and white variants
 */

interface MinimalFrameProps {
  size?: number;
  children?: React.ReactNode;
  variant?: 'black' | 'white';
}

export function MinimalFrame({ size = 600, children, variant = 'black' }: MinimalFrameProps) {
  const bgColor = variant === 'white' ? '#FFFFFF' : '#000000';
  const borderColor = variant === 'white' ? '#000000' : '#FFFFFF';
  const textColor = variant === 'white' ? '#000000' : '#FFFFFF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`qr-frame qr-frame-minimal-${variant}`}
    >
      {/* Background */}
      <rect width="600" height="600" fill={bgColor} />

      {/* Clean border */}
      <rect
        x="100"
        y="100"
        width="400"
        height="400"
        fill="none"
        stroke={borderColor}
        strokeWidth="1"
      />

      {/* QR content area */}
      <foreignObject x="150" y="150" width="300" height="300">
        {children}
      </foreignObject>
    </svg>
  );
}
