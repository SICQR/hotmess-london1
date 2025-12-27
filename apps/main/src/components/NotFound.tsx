/**
 * HOTMESS 404 Not Found Component
 * Shows when a resource doesn't exist (event, beacon, room, etc.)
 */

import { motion } from 'motion/react';
import { XCircle, Home, ArrowLeft } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface NotFoundProps {
  resourceType: 'Event' | 'Beacon' | 'Room' | 'Product' | 'User' | 'Ticket' | 'Page';
  onNavigate: (route: RouteId) => void;
  message?: string;
}

export function NotFound({ resourceType, onNavigate, message }: NotFoundProps) {
  const defaultMessage = `This ${resourceType.toLowerCase()} doesn't exist or has been removed.`;
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Error Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <XCircle className="w-24 h-24 text-[#ff1694] mx-auto mb-8" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl uppercase text-white mb-4 tracking-tighter" style={{ fontWeight: 900 }}>
          {resourceType}<br />Not Found
        </h1>

        {/* Description */}
        <p className="text-white/60 mb-10 text-lg">
          {message || defaultMessage}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white uppercase tracking-wider hover:bg-white/20 transition-colors"
            style={{ fontWeight: 900 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <button
              onClick={() => onNavigate('home')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ff1694] text-white uppercase tracking-wider hover:bg-[#ff1694]/90 transition-colors"
            style={{ fontWeight: 900 }}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Help Text */}
        <p className="text-white/40 text-sm mt-8">
          Error 404 · {resourceType} not found
        </p>
      </motion.div>
    </div>
  );
}
