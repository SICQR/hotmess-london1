/**
 * XP Particle burst animation
 * Triggered on beacon scan success
 */

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface XPParticlesProps {
  amount: number;
  onComplete?: () => void;
}

export function XPParticles({ amount, onComplete }: XPParticlesProps) {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; x: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.3,
      x: (Math.random() - 0.5) * 200,
    }));
    
    setParticles(newParticles);

    // Cleanup
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Center burst */}
      <div className="relative">
        <div className="text-hot glow-intense powder-burst" style={{ fontSize: '64px' }}>
          +{amount}
        </div>
        
        {/* Particle sprites */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 xp-spark"
            style={{
              animationDelay: `${particle.delay}s`,
              transform: `translateX(${particle.x}px)`,
            }}
          >
            <Zap className="text-hot" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
