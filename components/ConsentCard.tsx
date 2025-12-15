/**
 * Consent Card Component
 * Used for external embeds, explicit content, cookies
 */

import { ExternalLink, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ConsentCardProps {
  title: string;
  body: string;
  onAccept: () => void;
  onDecline: () => void;
  acceptLabel?: string;
  declineLabel?: string;
  showLinks?: boolean;
  variant?: 'default' | 'explicit';
}

export function ConsentCard({
  title,
  body,
  onAccept,
  onDecline,
  acceptLabel = "I'm good",
  declineLabel = "Not today",
  showLinks = false,
  variant = 'default',
}: ConsentCardProps) {
  return (
    <motion.div
      className="bg-hotmess-gray-900 border-2 border-hotmess-red p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Icon */}
      <div className="mb-6">
        <AlertCircle size={40} className="text-hotmess-red" />
      </div>

      {/* Title */}
      <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '20px' }}>
        {title}
      </h3>

      {/* Body */}
      <p className="text-white/80 mb-8" style={{ fontWeight: 400, fontSize: '14px', lineHeight: '1.6' }}>
        {body}
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={onAccept}
          className="bg-hotmess-red text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          style={{ fontWeight: 900 }}
        >
          {acceptLabel}
        </button>
        <button
          onClick={onDecline}
          className="bg-black border-2 border-white text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          style={{ fontWeight: 900 }}
        >
          {declineLabel}
        </button>
      </div>

      {/* Links */}
      {showLinks && (
        <div className="flex flex-wrap gap-4 text-white/60">
          <a
            href="/legal/cookies"
            className="uppercase tracking-wider hover:text-hotmess-red transition-colors inline-flex items-center gap-1"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            Cookie settings
            <ExternalLink size={12} />
          </a>
          <a
            href="/data-privacy"
            className="uppercase tracking-wider hover:text-hotmess-red transition-colors inline-flex items-center gap-1"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            Privacy Hub
            <ExternalLink size={12} />
          </a>
          {variant === 'explicit' && (
            <>
              <a
                href="/care"
                className="uppercase tracking-wider hover:text-hotmess-red transition-colors inline-flex items-center gap-1"
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                Care
                <ExternalLink size={12} />
              </a>
              <a
                href="/legal"
                className="uppercase tracking-wider hover:text-hotmess-red transition-colors inline-flex items-center gap-1"
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                Rules
                <ExternalLink size={12} />
              </a>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
