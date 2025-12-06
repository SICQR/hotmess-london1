/**
 * RCR Widget Component
 * Displays current release across Radio/Shop/Community pages
 */

import { motion } from 'motion/react';
import { Play, ShoppingBag, ExternalLink, Disc3 } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RCRWidgetProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
  variant?: 'radio' | 'shop' | 'community';
}

const currentRelease = {
  slug: 'hotmess',
  title: 'HOTMESS',
  tagline: 'RCR DROP ACTIVE.',
  coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
};

export function RCRWidget({ onNavigate, variant = 'radio' }: RCRWidgetProps) {
  const config = {
    radio: {
      header: 'RCR PICK',
      subhead: 'HOTMESS. TURN IT UP.',
    },
    shop: {
      header: 'SOUNDTRACK',
      subhead: 'HOTMESS WHILE YOU SHOP.',
    },
    community: {
      header: 'CURRENT THREAD',
      subhead: 'HOTMESS IS LIVE. SAY SOMETHING USEFUL.',
    },
  };

  const { header, subhead } = config[variant];

  return (
    <motion.div
      className="bg-hotmess-gray-900 border-l-4 border-hotmess-red overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Disc3 size={16} className="text-hotmess-red" />
            <h3 className="text-hotmess-red uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '11px' }}>
              {header}
            </h3>
          </div>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            {subhead}
          </p>
        </div>

        {/* Content */}
        <div className="flex gap-4 mb-4">
          {/* Cover */}
          <div className="w-24 h-24 flex-shrink-0 bg-black overflow-hidden">
            <ImageWithFallback
              src={currentRelease.coverUrl}
              alt={currentRelease.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 900, fontSize: '18px' }}>
              {currentRelease.title}
            </h4>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              {currentRelease.tagline}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('recordsRelease', { slug: currentRelease.slug })}
            className="bg-hotmess-red text-white px-4 py-2 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs flex items-center gap-2"
            style={{ fontWeight: 900 }}
          >
            <Play size={14} fill="white" />
            Play
          </button>
          
          {variant === 'radio' && (
            <>
              <button
                onClick={() => onNavigate('recordsRelease', { slug: currentRelease.slug })}
                className="bg-black border border-hotmess-red text-hotmess-red px-4 py-2 uppercase tracking-wider hover:bg-hotmess-red hover:text-white transition-all text-xs"
                style={{ fontWeight: 900 }}
              >
                Cuts
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-black border border-white text-white px-4 py-2 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs flex items-center gap-2"
                style={{ fontWeight: 900 }}
              >
                <ShoppingBag size={14} />
                Shop
              </button>
            </>
          )}

          {variant === 'shop' && (
            <button
              onClick={() => onNavigate('recordsRelease', { slug: currentRelease.slug })}
              className="bg-black border border-white text-white px-4 py-2 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs"
              style={{ fontWeight: 900 }}
            >
              View release
            </button>
          )}

          {variant === 'community' && (
            <>
              <button
                onClick={() => onNavigate('communityPost', { id: 'hotmess-release' })}
                className="bg-black border border-white text-white px-4 py-2 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs"
                style={{ fontWeight: 900 }}
              >
                Open thread
              </button>
              <button
                onClick={() => onNavigate('legal')}
                className="bg-black border border-white text-white px-4 py-2 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs"
                style={{ fontWeight: 900 }}
              >
                Read rules
              </button>
            </>
          )}
        </div>

        {/* Link to RCR Hub */}
        <button
          onClick={() => onNavigate('records')}
          className="mt-4 text-white/60 hover:text-hotmess-red transition-colors uppercase tracking-wider inline-flex items-center gap-1"
          style={{ fontWeight: 700, fontSize: '11px' }}
        >
          More RCR
          <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  );
}
