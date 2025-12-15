/**
 * SCAN BEACON FAB — Floating Action Button
 * Quick access to beacon scanning from anywhere
 */

import { QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RouteId } from '../lib/routes';

interface ScanBeaconFABProps {
  onNavigate: (route: RouteId) => void;
  currentRoute: RouteId;
}

// Routes where FAB should be hidden
const HIDDEN_ROUTES: RouteId[] = [
  'scan',
  'beaconScan',
  'beaconScanResult',
  'login',
  'register',
  'welcome',
  'earth',
  'beaconsEarth3d',
  'qrLogin',
  'qrApprove',
];

export function ScanBeaconFAB({ onNavigate, currentRoute }: ScanBeaconFABProps) {
  const shouldShow = !HIDDEN_ROUTES.includes(currentRoute);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('scan')}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-hotmess-red to-hotmess-purple shadow-2xl flex items-center justify-center group hover:shadow-hotmess-red/50 transition-shadow lg:bottom-8 lg:right-8 lg:w-20 lg:h-20"
          aria-label="Scan Beacon"
          title="Scan Beacon"
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-hotmess-red opacity-30"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />

          {/* Icon */}
          <QrCode 
            className="size-8 lg:size-10 text-white group-hover:scale-110 transition-transform relative z-10" 
            strokeWidth={2.5}
          />

          {/* Tooltip on desktop */}
          <div className="hidden lg:block absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black border border-hotmess-red px-4 py-2 rounded whitespace-nowrap">
              <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '12px' }}>
                Scan Beacon
              </span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full right-6 -mt-px">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-hotmess-red" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
