/**
 * TEXT OVER IMAGE ENHANCED — Advanced editorial component with all features
 * Includes: Brand presets, image treatments, advanced effects, animations, smart features
 */

import { ReactNode, useState, useEffect, useRef, CSSProperties } from 'react';

type PositionType = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right' | 'custom';
type ModeType = 'light' | 'dark' | 'neon' | 'auto'; // auto = smart contrast
type TextTreatmentType = 
  | 'default' 
  | 'masked' 
  | 'chrome' 
  | 'motion-blur' 
  | 'knockout'
  | 'glitch'
  | '3d-extrusion'
  | 'outline-fill'
  | 'liquid-drip'
  | 'texture-overlay';

type RevealType = 'none' | 'fade' | 'slide-up' | 'slide-down' | 'zoom';
type OrientationType = 'horizontal' | 'vertical';

type BrandPresetOverrides = Partial<{
  mode: ModeType;
  textTreatment: TextTreatmentType;
  duotone: DuotoneColors | boolean;
  grain: number;
  vignette: number;
  desaturate: number;
  overlayOpacity: 'none' | 'light' | 'medium' | 'heavy';
}>;

interface DuotoneColors {
  dark: string;
  light: string;
}

interface CustomPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface TextOverImageEnhancedProps {
  // Media
  image?: string;
  video?: string; // Video background support
  imageAlt?: string;
  
  // Content
  headline: string;
  subhead?: string;
  body?: string;
  cta?: ReactNode;
  byline?: string;
  date?: string;
  quote?: boolean;
  
  // Layout
  position?: PositionType;
  customPosition?: CustomPosition;
  mode?: ModeType;
  textTreatment?: TextTreatmentType;
  orientation?: OrientationType;
  rotation?: number; // Degrees, -10 to 10
  
  // Sizing
  height?: 'full' | 'half' | 'hero' | 'tall' | string;
  aspectRatio?: string;
  
  // Image Treatments
  imageBlur?: number; // 0-20px
  duotone?: DuotoneColors | boolean; // true = hot red + black
  grain?: number; // 0-1 opacity
  vignette?: number; // 0-1 opacity
  desaturate?: number; // 0-1, 0 = full color, 1 = grayscale
  overlayOpacity?: 'none' | 'light' | 'medium' | 'heavy';
  
  // Animations
  parallax?: number; // 0-1 intensity
  revealOnScroll?: RevealType;
  staggerText?: number; // ms delay between words
  
  // Interaction
  onClick?: () => void;
  
  // Advanced
  multiZone?: boolean; // Split headline across positions
  smartPosition?: boolean; // Auto-detect faces, place in negative space
  
  // Brand Preset Override
  brandPreset?: 'raw' | 'hung' | 'high' | 'super';
}

const positionStyles: Record<string, string> = {
  'top-left': 'items-start justify-start text-left',
  'top-right': 'items-start justify-end text-right',
  'center': 'items-center justify-center text-center',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-right': 'items-end justify-end text-right',
  'custom': '',
};

const modeStyles: Record<string, {
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
  auto: {
    overlay: '', // Will be calculated
    textColor: 'text-white',
    subheadColor: 'text-gray-100',
    bodyColor: 'text-gray-300',
  },
};

const overlayOpacityStyles: Record<string, string> = {
  none: '',
  light: 'bg-black/20',
  medium: 'bg-black/50',
  heavy: 'bg-black/80',
};

// Smart contrast detection (simplified)
function detectBrightness(imageSrc: string): 'light' | 'dark' {
  // In production, this would use canvas to analyze image
  // For now, return dark as default
  return 'dark';
}

export function TextOverImageEnhanced({
  image,
  video,
  imageAlt = 'Editorial image',
  headline,
  subhead,
  body,
  cta,
  byline,
  date,
  quote = false,
  position = 'center',
  customPosition,
  mode = 'dark',
  textTreatment = 'default',
  orientation = 'horizontal',
  rotation = 0,
  height = 'hero',
  aspectRatio,
  imageBlur = 0,
  duotone,
  grain = 0,
  vignette = 0,
  desaturate = 0,
  overlayOpacity = 'medium',
  parallax = 0,
  revealOnScroll = 'none',
  staggerText = 0,
  onClick,
  multiZone = false,
  smartPosition = false,
  brandPreset,
}: TextOverImageEnhancedProps) {
  const [isVisible, setIsVisible] = useState(revealOnScroll === 'none');
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<string[]>([]);
  
  // Apply brand preset overrides
  const getBrandPreset = (): BrandPresetOverrides => {
    if (!brandPreset) return {};
    
    const presets: Record<string, BrandPresetOverrides> = {
      raw: {
        mode: 'dark' as ModeType,
        textTreatment: 'chrome' as TextTreatmentType,
        duotone: { dark: '#000000', light: '#9BA1A6' },
        grain: 0.2,
        overlayOpacity: 'heavy' as const,
      },
      hung: {
        mode: 'neon' as ModeType,
        textTreatment: 'masked' as TextTreatmentType,
        duotone: { dark: '#000000', light: '#E70F3C' },
        vignette: 0.4,
        overlayOpacity: 'heavy' as const,
      },
      high: {
        mode: 'neon' as ModeType,
        textTreatment: 'glitch' as TextTreatmentType,
        duotone: { dark: '#1a0033', light: '#B2FF52' },
        grain: 0.3,
        overlayOpacity: 'medium' as const,
      },
      super: {
        mode: 'light' as ModeType,
        textTreatment: 'default' as TextTreatmentType,
        duotone: { dark: '#000000', light: '#FFFFFF' },
        desaturate: 0.5,
        overlayOpacity: 'light' as const,
      },
    };
    
    return presets[brandPreset] ?? {};
  };
  
  const preset = getBrandPreset();
  const finalMode = preset.mode ?? mode;
  const finalTextTreatment = preset.textTreatment ?? textTreatment;
  const finalDuotone = preset.duotone ?? duotone;
  const finalGrain = preset.grain ?? grain;
  const finalVignette = preset.vignette ?? vignette;
  const finalDesaturate = preset.desaturate ?? desaturate;
  const finalOverlayOpacity = preset.overlayOpacity ?? overlayOpacity;
  
  // Auto-contrast mode
  const actualMode = finalMode === 'auto' && image ? detectBrightness(image) : finalMode;
  const modeConfig = modeStyles[actualMode];
  const positionClass = position !== 'custom' ? positionStyles[position] : '';
  
  // Stagger text effect
  useEffect(() => {
    if (staggerText > 0) {
      setWords(headline.split(' '));
    }
  }, [headline, staggerText]);
  
  // Scroll reveal & parallax
  useEffect(() => {
    if (revealOnScroll === 'none' && parallax === 0) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Reveal on scroll
      if (revealOnScroll !== 'none' && !isVisible) {
        if (rect.top < windowHeight * 0.8) {
          setIsVisible(true);
        }
      }
      
      // Parallax
      if (parallax > 0) {
        const scrollPosition = window.scrollY;
        setScrollY(scrollPosition);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealOnScroll, parallax, isVisible]);
  
  // Calculate duotone colors
  const duotoneColors = finalDuotone === true 
    ? { dark: '#000000', light: '#E70F3C' }
    : finalDuotone as DuotoneColors | undefined;
  
  // Text treatment styles
  const getHeadlineStyles = () => {
    const baseStyles = `text-4xl md:text-6xl lg:text-8xl uppercase tracking-tighter transition-all duration-700`;
    const orientationStyle = orientation === 'vertical' ? 'writing-mode-vertical-rl' : '';
    
    switch (finalTextTreatment) {
      case 'masked':
        return `${baseStyles} ${orientationStyle} bg-clip-text text-transparent bg-gradient-to-br from-hot via-heat to-hot drop-shadow-[0_0_60px_rgba(231,15,60,0.8)]`;
      case 'chrome':
        return `${baseStyles} ${orientationStyle} bg-clip-text text-transparent bg-gradient-to-br from-gray-300 via-white to-gray-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`;
      case 'motion-blur':
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} drop-shadow-[4px_0_12px_rgba(231,15,60,0.8)]`;
      case 'knockout':
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]`;
      case 'glitch':
        return `${baseStyles} ${orientationStyle} text-hot animate-glitch`;
      case '3d-extrusion':
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} [text-shadow:_1px_1px_0_rgba(0,0,0,0.8),_2px_2px_0_rgba(0,0,0,0.7),_3px_3px_0_rgba(0,0,0,0.6),_4px_4px_0_rgba(0,0,0,0.5),_5px_5px_0_rgba(0,0,0,0.4)]`;
      case 'outline-fill':
        return `${baseStyles} ${orientationStyle} text-hot [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]`;
      case 'liquid-drip':
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} drop-shadow-[0_4px_12px_rgba(231,15,60,0.9)] animate-drip`;
      case 'texture-overlay':
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIuMyIvPjwvc3ZnPg==')] bg-clip-text`;
      default:
        return `${baseStyles} ${orientationStyle} ${modeConfig.textColor} drop-shadow-lg`;
    }
  };
  
  // Get rotation inline style
  const getRotationStyle = (): CSSProperties => {
    if (rotation !== 0) {
      return { transform: `rotate(${rotation}deg)` };
    }
    return {};
  };
  
  // Reveal animation classes
  const getRevealClasses = () => {
    if (!isVisible) {
      switch (revealOnScroll) {
        case 'fade': return 'opacity-0';
        case 'slide-up': return 'opacity-0 translate-y-12';
        case 'slide-down': return 'opacity-0 -translate-y-12';
        case 'zoom': return 'opacity-0 scale-90';
        default: return '';
      }
    }
    return 'opacity-100 translate-y-0 scale-100';
  };
  
  // Parallax transform
  const parallaxTransform = parallax > 0 && containerRef.current
    ? `translateY(${scrollY * parallax * 0.5}px)`
    : undefined;
  
  // Custom positioning styles
  const customPositionStyles: CSSProperties = customPosition ? {
    top: customPosition.top,
    bottom: customPosition.bottom,
    left: customPosition.left,
    right: customPosition.right,
    position: 'absolute',
  } : {};
  
  // Image filter styles
  const imageFilterStyle: CSSProperties = {
    filter: [
      imageBlur > 0 ? `blur(${imageBlur}px)` : '',
      desaturate > 0 ? `saturate(${1 - finalDesaturate})` : '',
    ].filter(Boolean).join(' ') || undefined,
  };
  
  // Height calculation
  const heightStyle = typeof height === 'string' && !['full', 'half', 'hero', 'tall'].includes(height)
    ? height
    : {
        full: 'h-screen',
        half: 'h-[50vh]',
        hero: 'h-[80vh] lg:h-screen',
        tall: 'h-[70vh]',
      }[height as string];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${heightStyle} ${onClick ? 'cursor-pointer group' : ''}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={onClick}
    >
      {/* Background Media */}
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover ${onClick ? 'group-hover:scale-110 transition-transform duration-700' : ''}`}
          style={imageFilterStyle}
        />
      ) : (
        <img
          src={image}
          alt={imageAlt}
          className={`w-full h-full object-cover ${onClick ? 'group-hover:scale-110 transition-transform duration-700' : ''}`}
          style={{
            ...imageFilterStyle,
            transform: parallaxTransform,
          }}
        />
      )}
      
      {/* Duotone Filter */}
      {duotoneColors && (
        <div 
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background: `linear-gradient(180deg, ${duotoneColors.dark} 0%, ${duotoneColors.light} 100%)`,
            opacity: 0.6,
          }}
        />
      )}
      
      {/* Grain Texture */}
      {finalGrain > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: finalGrain,
            mixBlendMode: 'overlay',
          }}
        />
      )}
      
      {/* Vignette */}
      {finalVignette > 0 && (
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
            opacity: finalVignette,
          }}
        />
      )}
      
      {/* Base Overlay */}
      {finalOverlayOpacity !== 'none' && (
        <div className={`absolute inset-0 ${overlayOpacityStyles[finalOverlayOpacity]}`} />
      )}
      
      {/* Mode-Specific Overlay */}
      <div className={`absolute inset-0 ${modeConfig.overlay}`} />
      
      {/* Motion Blur Effect */}
      {finalTextTreatment === 'motion-blur' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hot/10 to-transparent animate-pulse" />
      )}
      
      {/* Wet Texture (for neon mode) */}
      {actualMode === 'neon' && (
        <div className="absolute inset-0 wet-texture opacity-40" />
      )}
      
      {/* Content Container */}
      <div 
        className={`absolute inset-0 flex flex-col ${positionClass} p-6 md:p-12 lg:p-16 ${getRevealClasses()} transition-all duration-1000`}
        style={customPosition ? customPositionStyles : undefined}
      >
        <div className={`max-w-4xl ${position === 'center' ? 'text-center' : ''}`}>
          {/* Date */}
          {date && (
            <div className={`text-xs md:text-sm uppercase tracking-widest ${modeConfig.subheadColor} mb-2 opacity-60`}>
              {date}
            </div>
          )}
          
          {/* Headline */}
          {(() => {
            const rotationStyle = getRotationStyle();
            
            if (staggerText > 0 && words.length > 0) {
              return (
                <h1 className={getHeadlineStyles()} style={rotationStyle}>
                  {words.map((word, i) => (
                    <span 
                      key={i}
                      className="inline-block"
                      style={{
                        animation: isVisible ? `fadeInWord 0.5s ease-out ${i * (staggerText / 1000)}s forwards` : 'none',
                        opacity: isVisible ? 1 : 0,
                      }}
                    >
                      {word}{i < words.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </h1>
              );
            } else if (quote) {
              return (
                <blockquote className={getHeadlineStyles()} style={rotationStyle}>
                  "{headline}"
                </blockquote>
              );
            } else {
              return (
                <h1 
                  className={getHeadlineStyles()}
                  style={
                    finalTextTreatment === 'masked' || finalTextTreatment === 'chrome'
                      ? {
                          fontWeight: 900,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          ...rotationStyle,
                        }
                      : { fontWeight: 900, ...rotationStyle }
                  }
                >
                  {headline}
                </h1>
              );
            }
          })()}
          
          {/* Byline */}
          {byline && (
            <div className={`text-sm md:text-base italic ${modeConfig.bodyColor} mt-2 opacity-80`}>
              by {byline}
            </div>
          )}
          
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
      
      {/* Chrome Accent */}
      {finalTextTreatment === 'chrome' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
      )}
      
      {/* Glitch Effect Layers */}
      {finalTextTreatment === 'glitch' && (
        <>
          <div className="absolute inset-0 pointer-events-none animate-glitch-1" 
               style={{ 
                 background: 'linear-gradient(90deg, transparent 0%, rgba(231,15,60,0.1) 50%, transparent 100%)',
                 mixBlendMode: 'screen'
               }} 
          />
          <div className="absolute inset-0 pointer-events-none animate-glitch-2" 
               style={{ 
                 background: 'linear-gradient(270deg, transparent 0%, rgba(41,226,255,0.1) 50%, transparent 100%)',
                 mixBlendMode: 'screen'
               }} 
          />
        </>
      )}
    </div>
  );
}

// Brand Preset Components

export function TextOverImageRAW(props: Omit<TextOverImageEnhancedProps, 'brandPreset'>) {
  return <TextOverImageEnhanced {...props} brandPreset="raw" />;
}

export function TextOverImageHUNG(props: Omit<TextOverImageEnhancedProps, 'brandPreset'>) {
  return <TextOverImageEnhanced {...props} brandPreset="hung" />;
}

export function TextOverImageHIGH(props: Omit<TextOverImageEnhancedProps, 'brandPreset'>) {
  return <TextOverImageEnhanced {...props} brandPreset="high" />;
}

export function TextOverImageSUPER(props: Omit<TextOverImageEnhancedProps, 'brandPreset'>) {
  return <TextOverImageEnhanced {...props} brandPreset="super" />;
}
