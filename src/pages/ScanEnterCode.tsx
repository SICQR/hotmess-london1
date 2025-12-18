/**
 * HOTMESS LONDON — Scan / Enter Code
 * Paste code + camera QR scanning with BarcodeDetector API
 * Routes to canonical /l/:code for all beacons
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scan, ArrowRight, X, Camera, AlertCircle } from 'lucide-react';

interface ScanEnterCodeProps {
  onNavigate: (page: string, params?: any) => void;
}

type ScanState =
  | { mode: 'idle' }
  | { mode: 'starting' }
  | { mode: 'scanning' }
  | { mode: 'unsupported' }
  | { mode: 'error'; message: string };

function cleanCode(raw: string): string {
  // Keep it forgiving: strip spaces, uppercase, keep URL-safe chars only
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9_-]/g, '');
}

export function ScanEnterCode({ onNavigate }: ScanEnterCodeProps) {
  const [code, setCode] = useState('');
  const [state, setState] = useState<ScanState>({ mode: 'idle' });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);

  const canUseCamera =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  const canDetectQR =
    typeof window !== 'undefined' &&
    // BarcodeDetector exists in Chromium-based browsers; supports QR in most builds
    !!(window as any).BarcodeDetector;

  function goToCode(c: string) {
    const cleaned = cleanCode(c);
    if (!cleaned) return;
    
    // Route to canonical /l/:code shortlink
    window.location.href = `/l/${encodeURIComponent(cleaned)}`;
  }

  function stopCamera() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setState({ mode: 'idle' });
  }

  async function startCamera() {
    if (!canUseCamera) {
      setState({ mode: 'error', message: 'Camera not available in this browser.' });
      return;
    }
    if (!canDetectQR) {
      setState({ mode: 'unsupported' });
      return;
    }

    setState({ mode: 'starting' });

    try {
      const BarcodeDetector = (window as any).BarcodeDetector;
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      detectorRef.current = detector;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error('Video element missing.');

      video.srcObject = stream;
      video.playsInline = true;
      await video.play();

      setState({ mode: 'scanning' });

      // Offscreen canvas for frame grabs
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas not supported.');

      const scanLoop = async () => {
        if (!videoRef.current || !detectorRef.current) return;

        const v = videoRef.current;
        if (v.readyState >= 2) {
          const w = v.videoWidth || 0;
          const h = v.videoHeight || 0;

          if (w > 0 && h > 0) {
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(v, 0, 0, w, h);

            try {
              const barcodes = await detectorRef.current.detect(canvas);
              if (Array.isArray(barcodes) && barcodes.length) {
                const val = String(barcodes[0].rawValue || '');
                // Accept full URL or just code
                const maybe = val.trim();
                const m = maybe.match(/\/l\/([A-Za-z0-9_-]+)/);
                const extracted = m?.[1] || maybe;

                stopCamera();
                goToCode(extracted);
                return;
              }
            } catch {
              // ignore single-frame detect errors
            }
          }
        }

        rafRef.current = requestAnimationFrame(scanLoop);
      };

      rafRef.current = requestAnimationFrame(scanLoop);
    } catch (e: any) {
      stopCamera();
      setState({ mode: 'error', message: e?.message || "Couldn't start camera." });
    }
  }

  useEffect(() => {
    return () => stopCamera();
     
  }, []);

  const cleaned = cleanCode(code);
  const isScanning = state.mode === 'scanning' || state.mode === 'starting';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Scan size={48} className="text-hot" />
          </div>
          <h1
            className="text-white uppercase tracking-[-0.02em] leading-none mb-4"
            style={{ fontWeight: 900, fontSize: '48px' }}
          >
            SCAN / ENTER CODE
          </h1>
          <p className="text-white/60 max-w-2xl mb-2" style={{ fontSize: '16px' }}>
            Got a QR? Scan it. Got a code? Paste it.
          </p>
          <p className="text-white/40" style={{ fontSize: '12px' }}>
            18+ only • Consent-first • Scans resolve through /l/:code
          </p>
        </motion.header>

        <div className="space-y-6">
          {/* Enter Code Section */}
          <motion.section
            className="bg-white/5 border border-white/10 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-hot uppercase tracking-widest mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
              Enter Code
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToCode(code);
                }}
                placeholder="Enter code (e.g. ABCD1234)"
                className="flex-1 bg-black border border-white/20 px-6 py-4 text-white placeholder:text-white/30 uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '16px' }}
                aria-label="Beacon code"
                autoFocus
              />
              <button
                onClick={() => goToCode(code)}
                disabled={!cleaned}
                className="bg-hot hover:bg-white text-white hover:text-black px-8 py-4 uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                <span>Open Beacon</span>
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="text-white/40 mt-4" style={{ fontSize: '11px' }}>
              Tip: Codes are case-insensitive. We strip spaces automatically.
            </div>
          </motion.section>

          {/* Camera Scan Section */}
          <motion.section
            className="bg-white/5 border border-white/10 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-hot uppercase tracking-widest mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
                  Camera Scan
                </div>
                <p className="text-white/60" style={{ fontSize: '14px' }}>
                  Point at a QR code. We'll route you to the beacon.
                </p>
              </div>

              {isScanning ? (
                <button
                  onClick={stopCamera}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap"
                  style={{ fontWeight: 700, fontSize: '12px' }}
                >
                  <X size={16} />
                  Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={!canUseCamera}
                  className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  style={{ fontWeight: 700, fontSize: '12px' }}
                  title={!canUseCamera ? 'Camera not available' : ''}
                >
                  <Camera size={16} />
                  Scan with Camera
                </button>
              )}
            </div>

            {/* Error States */}
            {state.mode === 'unsupported' && (
              <div className="bg-yellow-950/30 border border-yellow-500/30 text-yellow-200 p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div style={{ fontSize: '12px' }}>
                  Your browser doesn't support QR detection. Try Chrome/Edge or paste the code above instead.
                </div>
              </div>
            )}

            {state.mode === 'error' && (
              <div className="bg-red-950/30 border border-red-500/30 text-red-200 p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div style={{ fontSize: '12px' }}>{state.message}</div>
              </div>
            )}

            {/* Video Preview */}
            <div className="bg-black border border-white/20 overflow-hidden relative">
              <div className="aspect-video w-full relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  aria-label="Camera preview for QR scanning"
                />

                {/* Overlay when not scanning */}
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-white/90 backdrop-blur border border-black/10 p-6 text-center max-w-sm">
                      <Camera size={48} className="text-black/40 mx-auto mb-3" />
                      <div className="text-black uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '12px' }}>
                        Camera Preview
                      </div>
                      <div className="text-black/60" style={{ fontSize: '11px' }}>
                        Tap "Scan with Camera" to start
                      </div>
                    </div>
                  </div>
                )}

                {/* Scanning indicator */}
                {state.mode === 'scanning' && (
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-hot/90 backdrop-blur text-white px-4 py-2 uppercase tracking-wider text-center animate-pulse">
                      <span style={{ fontWeight: 700, fontSize: '11px' }}>Scanning for QR codes...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-white/40 mt-4" style={{ fontSize: '11px' }}>
              If your camera permission is blocked, enable it in browser settings and try again.
            </div>
          </motion.section>

          {/* Quick Links */}
          <motion.section
            className="bg-white/5 border border-white/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-white/40 uppercase tracking-widest mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
              Quick Links
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('beaconsGlobe')}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-hot text-white uppercase tracking-wider transition-all"
                style={{ fontWeight: 700, fontSize: '11px' }}
              >
                Beacons
              </button>
              <button
                onClick={() => onNavigate('tickets')}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-hot text-white uppercase tracking-wider transition-all"
                style={{ fontWeight: 700, fontSize: '11px' }}
              >
                Tickets
              </button>
              <button
                onClick={() => onNavigate('recordsReleases')}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-hot text-white uppercase tracking-wider transition-all"
                style={{ fontWeight: 700, fontSize: '11px' }}
              >
                Records
              </button>
              <button
                onClick={() => onNavigate('radio')}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-hot text-white uppercase tracking-wider transition-all"
                style={{ fontWeight: 700, fontSize: '11px' }}
              >
                Radio
              </button>
              <button
                onClick={() => onNavigate('care')}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-hot text-white uppercase tracking-wider transition-all"
                style={{ fontWeight: 700, fontSize: '11px' }}
              >
                Care
              </button>
            </div>
          </motion.section>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-white/60 hover:text-hot uppercase tracking-wider transition-colors"
              style={{ fontWeight: 700, fontSize: '12px' }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
