/**
 * HOTMESS QR STYLE SYSTEM
 * Generates styled SVG QR codes with brand aesthetics
 * Uses qrcode-generator library (Deno-compatible)
 */

import qrcode from 'npm:qrcode-generator@1.4.4';

export type QrStyleName = 'raw' | 'hotmess' | 'chrome' | 'stealth';

export interface QrStyleOptions {
  size: number;
  style: QrStyleName;
}

export interface QrModuleData {
  data: Uint8Array;
  size: number;
}

/**
 * Generate QR matrix from data string
 */
export function generateQrMatrix(data: string): QrModuleData {
  // Create QR code with error correction level M (medium)
  const qr = qrcode(0, 'M');
  qr.addData(data);
  qr.make();
  
  const moduleCount = qr.getModuleCount();
  const modules = new Uint8Array(moduleCount * moduleCount);
  
  let index = 0;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      modules[index++] = qr.isDark(row, col) ? 1 : 0;
    }
  }
  
  return {
    data: modules,
    size: moduleCount,
  };
}

/**
 * Renders a styled SVG QR code from module data
 */
export function renderStyledQrSvg(
  modules: QrModuleData,
  opts: QrStyleOptions
): string {
  const { size, style } = opts;
  const count = modules.size;
  const cellSize = size / count;

  switch (style) {
    case 'raw':
      return renderRawSvg(modules.data, count, cellSize, size);
    case 'hotmess':
      return renderHotmessSvg(modules.data, count, cellSize, size);
    case 'chrome':
      return renderChromeSvg(modules.data, count, cellSize, size);
    case 'stealth':
      return renderStealthSvg(modules.data, count, cellSize, size);
    default:
      return renderRawSvg(modules.data, count, cellSize, size);
  }
}

/**
 * RAW - High-contrast, print-safe (for dark backrooms, stickers)
 */
function renderRawSvg(
  data: Uint8Array,
  count: number,
  cell: number,
  size: number
): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`
        );
      }
      index++;
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <rect width="${size}" height="${size}" fill="#ffffff" />
  <g fill="#000000">
    ${rects.join('\n    ')}
  </g>
</svg>`;
}

/**
 * HOTMESS - Neon, softened corners, logo in middle
 */
function renderHotmessSvg(
  data: Uint8Array,
  count: number,
  cell: number,
  size: number
): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        const rx = cell * 0.25;
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" rx="${rx}" ry="${rx}" />`
        );
      }
      index++;
    }
  }

  const logoSize = size * 0.22;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
  <defs>
    <radialGradient id="hotmessGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#ff3366" />
      <stop offset="40%" stop-color="#ffcc00" />
      <stop offset="100%" stop-color="#101010" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#000000" />
  <rect width="${size}" height="${size}" fill="url(#hotmessGlow)" opacity="0.85" />
  <g fill="#111111" opacity="0.4">
    ${rects.join('\n    ')}
  </g>
  <g fill="#f5f5f5">
    ${rects.join('\n    ')}
  </g>
  <!-- Center logo block -->
  <rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="${
    logoSize * 0.08
  }" fill="#000000" opacity="0.85" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="${logoSize * 0.33}" font-weight="900" letter-spacing="0.16em" fill="#ff1694">
    HOT
  </text>
  <text x="50%" y="${logoY + logoSize * 0.78}" text-anchor="middle"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="${logoSize * 0.3}" font-weight="700" letter-spacing="0.21em" fill="#ffffff">
    MESS
  </text>
</svg>`;
}

/**
 * CHROME - RAW CONVICT style: monochrome, gritty, chrome frame
 */
function renderChromeSvg(
  data: Uint8Array,
  count: number,
  cell: number,
  size: number
): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`
        );
      }
      index++;
    }
  }

  const frame = size * 0.04;
  const innerSize = size - frame * 3;
  const scale = innerSize / size;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f5" />
      <stop offset="35%" stop-color="#b4b4b4" />
      <stop offset="65%" stop-color="#303030" />
      <stop offset="100%" stop-color="#f5f5f5" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#050505" />
  <rect x="${frame}" y="${frame}" width="${size - 2 * frame}" height="${
    size - 2 * frame
  }" fill="url(#chromeMetal)" rx="${frame * 0.5}" />
  <g transform="translate(${frame * 1.5}, ${frame * 1.5}) scale(${scale})">
    <g fill="#000000">
      ${rects.join('\n      ')}
    </g>
  </g>
</svg>`;
}

/**
 * STEALTH - Low-contrast but scannable (discreet codes for hook-ups)
 */
function renderStealthSvg(
  data: Uint8Array,
  count: number,
  cell: number,
  size: number
): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`
        );
      }
      index++;
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <rect width="${size}" height="${size}" fill="#050505" />
  <g fill="#f0f0f0" opacity="0.85">
    ${rects.join('\n    ')}
  </g>
</svg>`;
}