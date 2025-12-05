/**
 * BEACON QR CODE COMPONENT
 * Generates downloadable QR codes for beacons
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer } from 'lucide-react';
import { generateBeaconQRData } from '../lib/beacon-system';

interface BeaconQRCodeProps {
  code: string;
  beaconName?: string;
  size?: number;
  showDownload?: boolean;
  showPrint?: boolean;
}

export function BeaconQRCode({ 
  code, 
  beaconName, 
  size = 256, 
  showDownload = true,
  showPrint = true 
}: BeaconQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQR();
  }, [code, size]);

  async function generateQR() {
    if (!canvasRef.current) return;

    const qrData = generateBeaconQRData(code);
    
    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // High error correction
      });

      // Also generate data URL for downloading
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: size * 4, // Higher resolution for print
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  }

  function downloadQR() {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `beacon-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function printQR() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beacon QR Code - ${code}</title>
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: white;
            }
            .print-container {
              text-align: center;
              padding: 40px;
            }
            .qr-code {
              margin: 20px auto;
              border: 4px solid #000;
              padding: 20px;
              display: inline-block;
            }
            .beacon-info {
              margin-top: 20px;
            }
            .beacon-code {
              font-size: 32px;
              font-weight: 900;
              font-family: 'Courier New', monospace;
              margin: 10px 0;
            }
            .beacon-name {
              font-size: 24px;
              font-weight: 700;
              margin: 10px 0;
            }
            .scan-text {
              font-size: 18px;
              color: #666;
              margin-top: 20px;
            }
            .branding {
              margin-top: 30px;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="qr-code">
              <img src="${qrDataUrl}" alt="QR Code" style="width: 400px; height: 400px;" />
            </div>
            <div class="beacon-info">
              ${beaconName ? `<div class="beacon-name">${beaconName}</div>` : ''}
              <div class="beacon-code">${code}</div>
              <div class="scan-text">SCAN TO ACCESS</div>
            </div>
            <div class="branding">HOTMESS LONDON</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-4">
      {/* QR Code Canvas */}
      <div className="bg-white p-6 rounded-lg inline-block">
        <canvas ref={canvasRef} />
      </div>

      {/* Code Display */}
      <div className="text-center">
        <div className="text-[12px] text-white/40 uppercase tracking-wider mb-1">
          Beacon Code
        </div>
        <div className="text-[20px] font-mono font-bold text-white">
          {code}
        </div>
      </div>

      {/* Actions */}
      {(showDownload || showPrint) && (
        <div className="flex gap-3">
          {showDownload && (
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-hotmess-red rounded-lg transition-all group"
            >
              <Download className="size-4 text-white/60 group-hover:text-hotmess-red transition-colors" />
              <span className="text-[13px] font-bold text-white/80 group-hover:text-white uppercase tracking-wider">
                Download PNG
              </span>
            </button>
          )}
          
          {showPrint && (
            <button
              onClick={printQR}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-hotmess-blue rounded-lg transition-all group"
            >
              <Printer className="size-4 text-white/60 group-hover:text-hotmess-blue transition-colors" />
              <span className="text-[13px] font-bold text-white/80 group-hover:text-white uppercase tracking-wider">
                Print
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
