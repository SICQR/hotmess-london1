import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface CookieBannerProps {
  onNavigate: (route: RouteId) => void;
}

export function CookieBanner({ onNavigate }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const CONSENT_KEY = 'hotmess_cookie_consent';

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!hasConsent) {
      // Show banner after 1 second delay
      timer = setTimeout(() => setIsVisible(true), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      external: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      external: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleClose = () => {
    // Treat close as essential only
    handleEssentialOnly();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative bg-black border-2 border-hotmess-red shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-hotmess-gray-400 hover:text-white transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 pr-12">
                {/* Title */}
                <div className="mb-4">
                  <h2 className="text-white mb-2">Quick heads-up</h2>
                  <div className="h-0.5 w-16 bg-hotmess-red" />
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6">
                  <p className="text-hotmess-gray-300 max-w-2xl">
                    We use cookies to keep things running smooth — essential stuff like remembering you're 18+, 
                    plus optional analytics to make HOTMESS better. We don't sell your data. Ever.
                  </p>
                  
                  <p className="text-hotmess-gray-400 text-sm max-w-2xl">
                    <strong className="text-hotmess-gray-300">Essential cookies:</strong> Age verification, consent tracking, cart persistence<br />
                    <strong className="text-hotmess-gray-300">Optional cookies:</strong> Analytics (anonymous), embedded media (SoundCloud)
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-hotmess-red text-white hover:bg-hotmess-red/80 transition-colors uppercase tracking-wider"
                  >
                    Accept All
                  </button>
                  
                  <button
                    onClick={handleEssentialOnly}
                    className="px-6 py-3 bg-transparent border-2 border-hotmess-gray-600 text-white hover:border-hotmess-gray-400 transition-colors uppercase tracking-wider"
                  >
                    Essential Only
                  </button>

                  <button
                    onClick={() => onNavigate('legalCookies')}
                    className="px-6 py-3 text-hotmess-gray-400 hover:text-white transition-colors uppercase tracking-wider text-sm"
                  >
                    Cookie Policy
                  </button>
                </div>

                {/* Legal note */}
                <p className="text-hotmess-gray-500 text-xs mt-4 max-w-2xl">
                  By continuing without choosing, you're agreeing to essential cookies only. 
                  You can change your preferences anytime in{' '}
                  <button
                    onClick={() => onNavigate('legalCookies')}
                    className="underline hover:text-hotmess-gray-400 transition-colors"
                  >
                    Cookie Settings
                  </button>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
