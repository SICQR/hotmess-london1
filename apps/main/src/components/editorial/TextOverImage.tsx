/**
 * TEXT OVER IMAGE — Comprehensive editorial text-over-image component
 * Supports multiple positions, modes, and special text effects
 * Mobile-first responsive design
 */

import { ReactNode } from 'react';

type PositionType = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
type ModeType = 'light' | 'dark' | 'neon';
type TextTreatmentType = 'masked' | 'chrome' | 'motion-blur' | 'knockout' | 'default';

interface TextOverImageProps {
  // Image
  image: string;
  imageAlt?: string;
  
  // Content
  headline: string;
  subhead?: string;
  body?: string;
  cta?: ReactNode;
  
  // Layout
  position?: PositionType;
  mode?: ModeType;
  textTreatment?: TextTreatmentType;
  
  // Sizing
  height?: 'full' | 'half' | 'hero' | 'tall';
  aspectRatio?: string;
  
  // Styling
  overlayOpacity?: 'none' | 'light' | 'medium' | 'heavy';
  
  // Interaction
  onClick?: () => void;
}

const positionStyles: Record<PositionType, string> = {
  'top-left': 'items-start justify-start text-left',
  'top-right': 'items-start justify-end text-right',
  'center': 'items-center justify-center text-center',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-right': 'items-end justify-end text-right',
};

const modeStyles: Record<ModeType, {
  overlay: string;
  textColor: string;
  subheadColor: string;
  bodyColor: string;
}> = {
  light: {
    overlay: 'bg-gradient-to-b from-white/30 via-white/20 to-white/40',
    textColor: 'text-black',
    subheadColor: 'text-gray-900',
    bodyColor: 'text-gray-800',
  },
  dark: {
    overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/70',
    textColor: 'text-white',
    subheadColor: 'text-gray-100',
    bodyColor: 'text-gray-300',
  },
  neon: {
    overlay: 'bg-gradient-to-b from-black/70 via-hot/20 to-black/80',
    textColor: 'text-hot',
    subheadColor: 'text-heat',
    bodyColor: 'text-gray-200',
  },
};

const heightStyles: Record<string, string> = {
  full: 'h-screen',
  half: 'h-[50vh]',
  hero: 'h-[80vh] lg:h-screen',
  tall: 'h-[70vh]',
};

const overlayOpacityStyles: Record<string, string> = {
  none: '',
  light: 'bg-black/20',
  medium: 'bg-black/50',
  heavy: 'bg-black/80',
};

export function TextOverImage({
  image,
  imageAlt = 'Editorial image',
  headline,
  subhead,
  body,
  cta,
  position = 'center',
  mode = 'dark',
  textTreatment = 'default',
  height = 'hero',
  aspectRatio,
  overlayOpacity = 'medium',
  onClick,
}: TextOverImageProps) {
  const modeConfig = modeStyles[mode];
  const positionClass = positionStyles[position];
  const heightClass = heightStyles[height];
  
  // Text treatment styles
  const getHeadlineStyles = () => {
    const baseStyles = `text-4xl md:text-6xl lg:text-8xl uppercase tracking-tighter`;
    
    switch (textTreatment) {
      case 'masked':
        return `${baseStyles} bg-clip-text text-transparent bg-gradient-to-br from-hot via-heat to-hot drop-shadow-[0_0_60px_rgba(231,15,60,0.8)]`;
      case 'chrome':
        return `${baseStyles} bg-clip-text text-transparent bg-gradient-to-br from-gray-300 via-white to-gray-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`;
      case 'motion-blur':
        return `${baseStyles} ${modeConfig.textColor} drop-shadow-[4px_0_12px_rgba(231,15,60,0.8)]`;
      case 'knockout':
        return `${baseStyles} ${modeConfig.textColor} [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]`;
      default:
        return `${baseStyles} ${modeConfig.textColor} drop-shadow-lg`;
    }
  };

  return (
    <div 
      className={`relative w-full overflow-hidden ${heightClass} ${onClick ? 'cursor-pointer group' : ''}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={imageAlt}
        className={`w-full h-full object-cover ${onClick ? 'group-hover:scale-110 transition-transform duration-700' : ''}`}
      />
      
      {/* Base Overlay */}
      {overlayOpacity !== 'none' && (
        <div className={`absolute inset-0 ${overlayOpacityStyles[overlayOpacity]}`} />
      )}
      
      {/* Mode-Specific Overlay */}
      <div className={`absolute inset-0 ${modeConfig.overlay}`} />
      
      {/* Motion Blur Effect (if enabled) */}
      {textTreatment === 'motion-blur' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hot/10 to-transparent animate-pulse" />
      )}
      
      {/* Wet Texture (for neon mode) */}
      {mode === 'neon' && (
        <div className="absolute inset-0 wet-texture opacity-40" />
      )}
      
      {/* Content Container */}
      <div className={`absolute inset-0 flex flex-col ${positionClass} p-6 md:p-12 lg:p-16`}>
        <div className={`max-w-4xl ${position === 'center' ? 'text-center' : ''}`}>
          {/* Headline */}
          <h1 
            className={getHeadlineStyles()}
            style={
              textTreatment === 'masked' || textTreatment === 'chrome'
                ? {
                    fontWeight: 900,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : { fontWeight: 900 }
            }
          >
            {headline}
          </h1>
          
          {/* Subhead */}
          {subhead && (
            <h2 className={`text-xl md:text-2xl lg:text-3xl ${modeConfig.subheadColor} uppercase tracking-wider mt-4 md:mt-6 drop-shadow-md`}>
              {subhead}
            </h2>
          )}
          
          {/* Body */}
          {body && (
            <p className={`text-base md:text-lg lg:text-xl ${modeConfig.bodyColor} leading-relaxed mt-4 md:mt-6 max-w-2xl ${position === 'center' ? 'mx-auto' : ''}`}>
              {body}
            </p>
          )}
          
          {/* CTA */}
          {cta && (
            <div className={`mt-6 md:mt-8 ${position === 'center' ? 'flex justify-center' : ''}`}>
              {cta}
            </div>
          )}
        </div>
      </div>
      
      {/* Chrome Accent (for chrome treatment) */}
      {textTreatment === 'chrome' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
      )}
    </div>
  );
}

// Pre-configured variants for common use cases

export function TextOverImageHeroPortrait(props: Omit<TextOverImageProps, 'height' | 'aspectRatio'>) {
  return <TextOverImage {...props} height="hero" />;
}

export function TextOverImageMacroTexture(props: Omit<TextOverImageProps, 'height' | 'aspectRatio'>) {
  return <TextOverImage {...props} height="tall" />;
}

export function TextOverImageScenic(props: Omit<TextOverImageProps, 'height' | 'aspectRatio'>) {
  return <TextOverImage {...props} height="full" />;
}
