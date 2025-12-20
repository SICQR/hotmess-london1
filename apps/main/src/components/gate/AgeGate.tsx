/**
 * AGE GATE — 18+ Entry Popup Modal
 * Clean, bold, direct.
 */

import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import ageGateHero from 'figma:asset/cf53a755c3b46e98c5dbed6574ed2961b24bc5cc.png';

interface AgeGateProps {
  colorMode?: 'dark' | 'chrome' | 'redroom';
  copyVariant?: 'brutalist' | 'care-kink' | 'survivor' | 'daddy-coded' | 'legal';
  layoutMode?: 'standard' | 'beacon';
  heroImage?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  showSplash?: boolean;
  enableBeaconScan?: boolean;
}

export function AgeGate({
  onEnter,
  onLeave,
}: AgeGateProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black">
      {/* Full-screen hero image - contain to show all text */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={ageGateHero}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content overlay - bottom corner, minimal footprint */}
      <div className="relative z-10 w-full px-6 pb-8 md:pb-12">
        <div className="max-w-[500px] mx-auto">
          {/* Compact rules + CTA card */}
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Headline */}
            <div className="mb-4">
              <h2 className="text-white tracking-[-0.02em] uppercase" style={{ fontWeight: 900, fontSize: '28px', lineHeight: 1.1 }}>
                MEN ONLY. 18+.
              </h2>
              <p className="text-white/70 mt-2" style={{ fontSize: '14px', lineHeight: 1.3 }}>
                If that's you — enter. If not — bounce.
              </p>
            </div>

            {/* Compact rules */}
            <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full size-[4px] flex-shrink-0" />
                <p className="text-[13px] text-white/80">You must be 18+</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full size-[4px] flex-shrink-0" />
                <p className="text-[13px] text-white/80">You must be a man</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full size-[4px] flex-shrink-0" />
                <p className="text-[13px] text-white/80">You must consent</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full size-[4px] flex-shrink-0" />
                <p className="text-[13px] text-white/80">You must enter willingly</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              {/* Enter Button */}
              <button
                onClick={onEnter}
                className="bg-white h-[64px] w-full rounded-xl flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                <p className="text-black uppercase tracking-wider" style={{ fontWeight: 800, fontSize: '20px' }}>
                  ENTER
                </p>
              </button>

              {/* Leave Button */}
              <button
                onClick={onLeave}
                className="h-[48px] w-full flex items-center justify-center hover:text-white/70 transition-colors"
              >
                <p className="text-[13px] text-white/50 uppercase tracking-wider">
                  LEAVE
                </p>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] leading-[1.5] text-white/40">
                Men-only. 18+. Consent required. Aftercare = info + community, not medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute top-6 right-6 z-10">
        <p className="text-[11px] text-white/20 uppercase tracking-widest drop-shadow-[0px_2px_8px_rgba(0,0,0,0.8)]">
          HOTMESS LONDON
        </p>
      </div>
    </div>
  );
}