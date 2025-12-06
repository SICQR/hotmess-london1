/**
 * Performance-optimized lazy loading image component
 * Includes loading skeleton and error fallback
 */

'use client';

import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = '',
  aspectRatio = 'square',
  priority = false,
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <div className={`relative ${aspectClasses[aspectRatio]} ${className} overflow-hidden bg-white/5`}>
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <div className="text-center text-white/40" style={{ fontSize: '12px' }}>
            <div className="mb-2" style={{ fontSize: '24px' }}>🖼️</div>
            Failed to load
          </div>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <ImageWithFallback
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
