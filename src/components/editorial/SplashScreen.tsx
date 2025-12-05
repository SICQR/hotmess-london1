/**
 * SPLASH SCREEN — Cinematic intro for HOTMESS LONDON
 * 5 visual variants with animated entrance
 */

import { useState, useEffect } from 'react';
import { HMButton } from '../library/HMButton';

type SplashVariant = 'chrome' | 'vapor' | 'portrait' | 'redroom' | 'whiteout';

interface SplashScreenProps {
  variant?: SplashVariant;
  onEnter: () => void;
  isAgeGate?: boolean;
}

const variantConfig = {
  chrome: {
    name: 'Wet Black Chrome',
    bgImage: 'https://images.unsplash.com/photo-1708689995034-7343f2e699b1?q=80&w=2000',
    overlay: 'bg-gradient-to-b from-black via-black/60 to-black',
    accentGradient: 'from-steel via-gray-400 to-steel',
    textColor: 'text-white',
    logoGlow: 'drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]',
  },
  vapor: {
    name: 'Neon Vapor Haze',
    bgImage: 'https://images.unsplash.com/photo-1759171052839-b089561eb740?q=80&w=2000',
    overlay: 'bg-gradient-to-b from-hot/40 via-purple-900/60 to-black',
    accentGradient: 'from-neon-lime via-cyan-static to-hot',
    textColor: 'text-neon-lime',
    logoGlow: 'drop-shadow-[0_0_60px_rgba(178,255,82,0.8)]',
  },
  portrait: {
    name: 'Spotlight Portrait',
    bgImage: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=2000',
    overlay: 'bg-gradient-to-b from-black/80 via-black/50 to-black',
    accentGradient: 'from-hot via-heat to-hot',
    textColor: 'text-hot',
    logoGlow: 'drop-shadow-[0_0_60px_rgba(231,15,60,0.8)]',
  },
  redroom: {
    name: 'Red-Room Sweat Fog',
    bgImage: 'https://images.unsplash.com/photo-1574622731854-f06af7345d28?q=80&w=2000',
    overlay: 'bg-gradient-to-b from-hot/60 via-red-900/70 to-black',
    accentGradient: 'from-hot via-heat to-hot',
    textColor: 'text-hot',
    logoGlow: 'drop-shadow-[0_0_80px_rgba(231,15,60,1)]',
  },
  whiteout: {
    name: 'White-Out Minimal Luxury',
    bgImage: 'https://images.unsplash.com/photo-1739616194227-0c4a98642c83?q=80&w=2000',
    overlay: 'bg-gradient-to-b from-white via-gray-100 to-white',
    accentGradient: 'from-black via-gray-800 to-black',
    textColor: 'text-black',
    logoGlow: 'drop-shadow-[0_0_40px_rgba(0,0,0,0.3)]',
  },
};

export function SplashScreen({ 
  variant = 'chrome', 
  onEnter,
  isAgeGate = false 
}: SplashScreenProps) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [subheadVisible, setSubheadVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);

  const config = variantConfig[variant];

  useEffect(() => {
    // Staggered animation entrance
    const logoTimer = setTimeout(() => setLogoVisible(true), 300);
    const subheadTimer = setTimeout(() => setSubheadVisible(true), 1200);
    const buttonTimer = setTimeout(() => setButtonVisible(true), 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(subheadTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Press and hold logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pressing) {
      interval = setInterval(() => {
        setPressProgress((prev) => {
          if (prev >= 100) {
            onEnter();
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else {
      setPressProgress(0);
    }
    return () => clearInterval(interval);
  }, [pressing, onEnter]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Image with Heat Ripple */}
      <div className="absolute inset-0">
        <img
          src={config.bgImage}
          alt="HOTMESS Splash"
          className="w-full h-full object-cover animate-[scale_20s_ease-in-out_infinite]"
          style={{
            animation: 'heat-ripple 6s ease-in-out infinite',
          }}
        />
        <div className={`absolute inset-0 ${config.overlay} backdrop-blur-sm`} />
      </div>

      {/* Animated Heat Ripple Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-radial from-hot/40 via-transparent to-transparent animate-pulse"
          style={{
            animation: 'heat-wave 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo with Brutalist Thud Animation */}
        <div
          className={`
            transition-all duration-1000
            ${logoVisible 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-150 translate-y-12'
            }
          `}
          style={{
            animation: logoVisible ? 'brutalist-thud 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          }}
        >
          <h1
            className={`
              text-[80px] md:text-[140px] lg:text-[200px]
              leading-none tracking-tighter
              bg-clip-text text-transparent
              bg-gradient-to-br ${config.accentGradient}
              ${config.logoGlow}
              mb-8
            `}
            style={{
              fontWeight: 900,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HOTMESS
          </h1>
          <div className={`h-1 w-32 mx-auto bg-gradient-to-r ${config.accentGradient}`} />
        </div>

        {/* Subhead Fade-In */}
        <div
          className={`
            mt-12 mb-16 max-w-2xl
            transition-all duration-1000 delay-700
            ${subheadVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
          `}
        >
          <p className={`text-lg md:text-xl lg:text-2xl ${config.textColor} tracking-wide`}>
            A men-only queer ecosystem built for the bold.
          </p>
          
          {isAgeGate && (
            <p className="mt-4 text-sm text-gray-400 uppercase tracking-wider">
              You must be 18+ to enter
            </p>
          )}
        </div>

        {/* Press + Hold to Enter */}
        <div
          className={`
            transition-all duration-1000 delay-1000
            ${buttonVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
            }
          `}
        >
          <div className="relative inline-block">
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.accentGradient} transition-all duration-100`}
                style={{ width: `${pressProgress}%` }}
              />
            </div>

            <button
              onMouseDown={() => setPressing(true)}
              onMouseUp={() => setPressing(false)}
              onMouseLeave={() => setPressing(false)}
              onTouchStart={() => setPressing(true)}
              onTouchEnd={() => setPressing(false)}
              className={`
                px-12 py-6 
                text-xl uppercase tracking-wider
                border-2 ${config.textColor === 'text-black' ? 'border-black' : 'border-white'}
                ${config.textColor}
                hover:bg-white/10
                active:scale-95
                transition-all duration-200
                ${pressing ? 'scale-95 bg-white/20' : ''}
              `}
            >
              {pressing ? 'Hold...' : 'Press + Hold to Enter'}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 uppercase tracking-wider">
            {isAgeGate ? 'By entering, you confirm you are 18+' : 'Hold to continue'}
          </p>
        </div>
      </div>

      {/* Chrome Gradient Accent Lines */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.accentGradient} opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${config.accentGradient} opacity-60`} />

      {/* Variant Indicator (for demo purposes) */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 uppercase tracking-wider">
        {config.name}
      </div>

      <style>{`
        @keyframes brutalist-thud {
          0% {
            transform: scale(1.5) translateY(50px);
            opacity: 0;
          }
          60% {
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes heat-ripple {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes heat-wave {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}

// Export all 5 variants
export function ChromeSplash({ onEnter, isAgeGate }: Omit<SplashScreenProps, 'variant'>) {
  return <SplashScreen variant="chrome" onEnter={onEnter} isAgeGate={isAgeGate} />;
}

export function VaporSplash({ onEnter, isAgeGate }: Omit<SplashScreenProps, 'variant'>) {
  return <SplashScreen variant="vapor" onEnter={onEnter} isAgeGate={isAgeGate} />;
}

export function PortraitSplash({ onEnter, isAgeGate }: Omit<SplashScreenProps, 'variant'>) {
  return <SplashScreen variant="portrait" onEnter={onEnter} isAgeGate={isAgeGate} />;
}

export function RedRoomSplash({ onEnter, isAgeGate }: Omit<SplashScreenProps, 'variant'>) {
  return <SplashScreen variant="redroom" onEnter={onEnter} isAgeGate={isAgeGate} />;
}

export function WhiteoutSplash({ onEnter, isAgeGate }: Omit<SplashScreenProps, 'variant'>) {
  return <SplashScreen variant="whiteout" onEnter={onEnter} isAgeGate={isAgeGate} />;
}
