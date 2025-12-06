/**
 * BEACON QR PANEL
 * Admin component for generating and downloading QR codes
 */

import { useState, useEffect } from 'react';
import { Download, QrCode, Copy, Check } from 'lucide-react';

type QrStyleName = 'raw' | 'hotmess' | 'chrome' | 'stealth';

interface Beacon {
  id: string;
  code: string;
  type: string;
  subtype: string;
  label: string;
}

interface BeaconQrPanelProps {
  beacon: Beacon;
  baseUrl?: string; // e.g., https://your-project.supabase.co/functions/v1/make-server-a670c824
}

const QR_STYLES: { value: QrStyleName; label: string; description: string }[] = [
  { value: 'raw', label: 'RAW', description: 'High-contrast, print-safe (stickers, posters)' },
  { value: 'hotmess', label: 'HOTMESS', description: 'Neon brand style with logo' },
  { value: 'chrome', label: 'CHROME', description: 'RAW CONVICT metallic frame' },
  { value: 'stealth', label: 'STEALTH', description: 'Low-contrast for discreet codes' },
];

export function BeaconQrPanel({ beacon, baseUrl = '' }: BeaconQrPanelProps) {
  const [style, setStyle] = useState<QrStyleName>('hotmess');
  const [size, setSize] = useState(512);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `${baseUrl}/qr/${beacon.code}.svg?style=${style}&size=${size}`;
    setPreviewUrl(url);
  }, [beacon.code, style, size, baseUrl]);

  const handleDownloadPng = () => {
    const url = `${baseUrl}/qr/${beacon.code}.svg?style=${style}&size=${size}`;
    // Download as SVG (PNG conversion would require server-side rendering)
    window.open(url, '_blank');
  };

  const handleDownloadSvg = () => {
    const url = `${baseUrl}/qr/${beacon.code}.svg?style=${style}&size=${size}`;
    window.open(url, '_blank');
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(beacon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 bg-black/40 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-6 h-6 text-[#ff1694]" />
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }} className="text-white uppercase">
            QR Code Generator
          </h3>
          <p style={{ fontSize: '13px', fontWeight: 400 }} className="text-white/40">
            Download QR codes in multiple styles
          </p>
        </div>
      </div>

      {/* Beacon Info */}
      <div className="mb-6 p-4 bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-white/60 uppercase mb-1">
              Beacon Code
            </p>
            <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-white font-mono">
              {beacon.code}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[#ff1694] hover:bg-white/5 transition-all"
          >
            {copied ? (
              <>
                <Check size={16} className="text-[#ff1694]" />
                <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#ff1694]">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy size={16} className="text-white/60" />
                <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-white/60">
                  Copy
                </span>
              </>
            )}
          </button>
        </div>
        <p style={{ fontSize: '13px', fontWeight: 400 }} className="text-white/40 mt-2">
          {beacon.type}/{beacon.subtype} · {beacon.label}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-white uppercase mb-3">
            Preview
          </p>
          <div className="w-full aspect-square border border-white/20 bg-white flex items-center justify-center">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={`QR for ${beacon.label}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Style Selection */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-white uppercase mb-3">
              Style
            </p>
            <div className="space-y-2">
              {QR_STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`w-full text-left p-3 border transition-all ${
                    style === s.value
                      ? 'border-[#ff1694] bg-[#ff1694]/10'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        style={{ fontSize: '14px', fontWeight: 700 }}
                        className={`${style === s.value ? 'text-[#ff1694]' : 'text-white'} uppercase`}
                      >
                        {s.label}
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 400 }} className="text-white/40">
                        {s.description}
                      </p>
                    </div>
                    {style === s.value && (
                      <div className="w-2 h-2 rounded-full bg-[#ff1694]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-white uppercase mb-3">
              Size (pixels)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={256}
                max={2048}
                step={256}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="flex-1"
              />
              <input
                type="number"
                min={256}
                max={2048}
                step={256}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value || '512', 10))}
                className="w-24 bg-white/5 border border-white/10 px-3 py-2 text-white"
                style={{ fontSize: '14px', fontWeight: 400 }}
              />
            </div>
            <p style={{ fontSize: '12px', fontWeight: 400 }} className="text-white/40 mt-2">
              Recommended: 512px (web), 1024px (print), 2048px (large poster)
            </p>
          </div>

          {/* Download Buttons */}
          <div className="pt-4 border-t border-white/10">
            <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-white uppercase mb-3">
              Download
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPng}
                className="flex items-center justify-center gap-2 h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white transition-all"
              >
                <Download size={16} className="text-white" />
                <span style={{ fontSize: '14px', fontWeight: 700 }} className="text-white uppercase">
                  PNG
                </span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#ff1694] to-[#ff0080] hover:from-white hover:to-[#ff1694] hover:text-black text-white transition-all shadow-[0_0_20px_rgba(255,22,148,0.4)] hover:shadow-[0_0_30px_rgba(255,22,148,0.6)]"
              >
                <Download size={16} />
                <span style={{ fontSize: '14px', fontWeight: 700 }} className="uppercase">
                  SVG
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Info */}
      <div className="mt-6 p-4 bg-[#ff1694]/5 border border-[#ff1694]/20">
        <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-white/80 mb-2">
          💡 QR Usage Tips
        </p>
        <ul style={{ fontSize: '12px', fontWeight: 400 }} className="text-white/60 space-y-1">
          <li>• <strong>RAW:</strong> Best for dark venues, printed stickers, high-contrast needed</li>
          <li>• <strong>HOTMESS:</strong> Branded codes for official posters and social media</li>
          <li>• <strong>CHROME:</strong> Editorial/premium events, matches RAW CONVICT aesthetic</li>
          <li>• <strong>STEALTH:</strong> Discreet codes for hook-ups, private invites</li>
        </ul>
      </div>
    </div>
  );
}