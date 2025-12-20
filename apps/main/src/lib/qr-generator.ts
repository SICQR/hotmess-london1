/**
 * QR CODE GENERATOR
 * Generate QR codes for beacon shortlinks using QRCode.js
 */

import QRCode from 'qrcode';

export interface QROptions {
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

// Generate QR code as Data URL (for <img src="">)
export async function generateQRDataURL(
  url: string,
  options: QROptions = {}
): Promise<string> {
  const {
    size = 512,
    darkColor = '#000000',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options;

  try {
    const dataURL = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel,
    });
    
    return dataURL;
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Generate QR code as SVG string
export async function generateQRSVG(
  url: string,
  options: QROptions = {}
): Promise<string> {
  const {
    darkColor = '#000000',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options;

  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel,
    });
    
    return svg;
  } catch (error) {
    console.error('QR SVG generation error:', error);
    throw new Error('Failed to generate QR SVG');
  }
}

// Download QR code as PNG
export async function downloadQRCode(
  url: string,
  filename: string,
  options: QROptions = {}
): Promise<void> {
  const dataURL = await generateQRDataURL(url, options);
  
  // Create download link
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate Telegram post caption
export function generateTelegramCaption(beacon: {
  type: string;
  title: string;
  city?: string;
  endsAt: string;
  code: string;
}): string {
  const typeEmoji = {
    checkin: '📍',
    ticket: '🎟️',
    product: '🛍️',
    drop: '🎁',
    event: '🎉',
    chat: '💬',
    vendor: '🏪',
    reward: '⚡',
    sponsor: '💎',
  }[beacon.type] || '⚡';

  const lines = [
    `${typeEmoji} **${beacon.title.toUpperCase()}**`,
    '',
  ];

  if (beacon.city) {
    lines.push(`📍 ${beacon.city.toUpperCase()}`);
  }

  const timeRemaining = formatTelegramTime(beacon.endsAt);
  if (timeRemaining) {
    lines.push(`⏱️ ${timeRemaining}`);
  }

  lines.push('');
  lines.push(`🔥 Scan to reveal + earn XP`);
  lines.push(`👉 https://hotmess.london/l/${beacon.code}`);
  lines.push('');
  lines.push('#HOTMESS #LDN #NoMercy');

  return lines.join('\n');
}

function formatTelegramTime(endsAt: string): string {
  const now = new Date().getTime();
  const end = new Date(endsAt).getTime();
  const diff = end - now;
  
  if (diff <= 0) return '';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `Ends in ${days}d`;
  }
  if (hours > 0) {
    return `${hours}h left`;
  }
  return 'Ending soon';
}
