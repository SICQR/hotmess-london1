/**
 * Beacon QR Scanner Interface
 * Simulates camera/QR scanning with visual feedback
 */

import { useState, useEffect } from 'react';
import { QrCode, Camera, X } from 'lucide-react';
import { XPParticles } from './XPParticles';

interface BeaconScannerProps {
  onScanSuccess: (beaconId: string, xp: number) => void;
  onClose: () => void;
}

export function BeaconScanner({ onScanSuccess, onClose }: BeaconScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedData, setScannedData] = useState<{ beaconId: string; xp: number } | null>(null);

  useEffect(() => {
    // Auto-start scanning
    setScanning(true);

    // Simulate successful scan after 2 seconds
    const timer = setTimeout(() => {
      const mockBeacon = {
        beaconId: 'BEACON-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        xp: Math.floor(Math.random() * 40) + 20, // 20-60 XP
      };
      
      setScannedData(mockBeacon);
      setScanning(false);
      setScanSuccess(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    if (scannedData) {
      onScanSuccess(scannedData.beaconId, scannedData.xp);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-gray-900 hover:bg-gray-800 transition-colors rounded-full"
        aria-label="Close scanner"
      >
        <X size={24} />
      </button>

      {/* Scanner Interface */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Camera viewport simulation */}
        <div className="relative w-full max-w-md aspect-square">
          {/* Scanning reticle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`relative w-64 h-64 border-4 transition-all duration-300 ${
              scanning 
                ? 'border-hot animate-pulse' 
                : scanSuccess 
                ? 'border-green-500' 
                : 'border-gray-600'
            }`}>
              {/* Corner markers */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-hot" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-hot" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-hot" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-hot" />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {scanning ? (
                  <QrCode className="text-hot animate-pulse" size={64} />
                ) : scanSuccess ? (
                  <div className="text-green-500" style={{ fontSize: '64px' }}>✓</div>
                ) : (
                  <Camera className="text-gray-600" size={64} />
                )}
              </div>

              {/* Scanning line */}
              {scanning && (
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-hot to-transparent"
                  style={{
                    animation: 'scan-line 2s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          </div>

          {/* Status text */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-gray-400" style={{ fontSize: '20px' }}>
              {scanning && "Scanning..."}
              {scanSuccess && "Beacon detected!"}
            </p>
          </div>
        </div>

        {/* XP Burst Animation */}
        {scanSuccess && scannedData && (
          <XPParticles amount={scannedData.xp} onComplete={handleComplete} />
        )}
      </div>

      {/* Scan line animation */}
      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}