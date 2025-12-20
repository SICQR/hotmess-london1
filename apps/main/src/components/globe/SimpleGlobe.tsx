/**
 * SIMPLE GLOBE - 2D Canvas Fallback
 * Visual globe representation with heat map
 */

import { useEffect, useRef, useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface BeaconHeatData {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    scans: number;
    city: string;
    country: string;
    beaconId: string;
  };
}

interface CityStats {
  city: string;
  country: string;
  scans: number;
  listeners: number;
  coordinates: [number, number];
}

interface SimpleGlobeProps {
  onCityClick?: (city: CityStats) => void;
  timeWindow?: 'tonight' | 'weekend' | 'month';
}

export function SimpleGlobe({ onCityClick, timeWindow = 'tonight' }: SimpleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatData, setHeatData] = useState<BeaconHeatData[]>([]);
  const [rotation, setRotation] = useState(0);
  const [selectedCity, setSelectedCity] = useState<CityStats | null>(null);

  useEffect(() => {
    loadHeatData();
  }, [timeWindow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = (i * 123.456) % width;
        const y = (i * 789.012) % height;
        const size = (i % 3) * 0.5 + 0.5;
        ctx.fillRect(x, y, size, size);
      }

      // Draw atmospheric glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.3);
      glowGradient.addColorStop(0, 'rgba(255, 22, 148, 0.3)');
      glowGradient.addColorStop(0.5, 'rgba(255, 22, 148, 0.1)');
      glowGradient.addColorStop(1, 'rgba(255, 22, 148, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Earth sphere
      const earthGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1, centerX, centerY, radius);
      earthGradient.addColorStop(0, '#1a1a1a');
      earthGradient.addColorStop(0.7, '#0a0a0a');
      earthGradient.addColorStop(1, '#000000');
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const y = centerY + (lat / 90) * radius * 0.8;
        const latRadius = radius * Math.cos((lat * Math.PI) / 180);
        ctx.ellipse(centerX, y, latRadius, latRadius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        const angle = ((lng + rotation) * Math.PI) / 180;
        const x1 = centerX + radius * Math.sin(angle);
        const x2 = centerX - radius * Math.sin(angle);
        ctx.moveTo(x1, centerY - radius);
        ctx.quadraticCurveTo(centerX, centerY, x2, centerY + radius);
        ctx.stroke();
      }

      // Draw heat markers
      heatData.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const { scans, city } = feature.properties;

        // Project to 2D
        const adjustedLng = lng + rotation;
        const visible = Math.cos((adjustedLng * Math.PI) / 180) > -0.3;

        if (visible) {
          const x = centerX + (adjustedLng / 180) * radius * Math.cos((lat * Math.PI) / 180);
          const y = centerY - (lat / 90) * radius;

          // Determine color
          let color = '#ffeb3b';
          if (scans > 100) color = '#ffffff';
          else if (scans > 50) color = '#ff1694';
          else if (scans > 10) color = '#ff9800';

          // Draw glow layers
          const size = 3 + (scans / 100) * 8;

          // Outer glow
          const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          outerGlow.addColorStop(0, color + '40');
          outerGlow.addColorStop(1, color + '00');
          ctx.fillStyle = outerGlow;
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Middle glow
          const middleGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
          middleGlow.addColorStop(0, '#ff1694' + '80');
          middleGlow.addColorStop(1, '#ff1694' + '00');
          ctx.fillStyle = middleGlow;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Core
          const pulse = Math.sin(Date.now() * 0.003 + scans) * 0.3 + 0.7;
          ctx.fillStyle = color;
          ctx.globalAlpha = pulse;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      setRotation((prev) => prev + 0.1);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [heatData, rotation]);

  const loadHeatData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/heat/heat?window=${timeWindow}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (!response.ok) {
        console.log('📍 Using mock heat data');
        setHeatData([
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-0.1276, 51.5074] },
            properties: { scans: 150, city: 'London', country: 'UK', beaconId: 'mock-1' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-74.0060, 40.7128] },
            properties: { scans: 200, city: 'New York', country: 'USA', beaconId: 'mock-2' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [2.3522, 48.8566] },
            properties: { scans: 85, city: 'Paris', country: 'France', beaconId: 'mock-3' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [139.6917, 35.6895] },
            properties: { scans: 120, city: 'Tokyo', country: 'Japan', beaconId: 'mock-4' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [151.2093, -33.8688] },
            properties: { scans: 95, city: 'Sydney', country: 'Australia', beaconId: 'mock-5' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-43.1729, -22.9068] },
            properties: { scans: 65, city: 'Rio de Janeiro', country: 'Brazil', beaconId: 'mock-6' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [13.4050, 52.5200] },
            properties: { scans: 110, city: 'Berlin', country: 'Germany', beaconId: 'mock-7' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [37.6173, 55.7558] },
            properties: { scans: 75, city: 'Moscow', country: 'Russia', beaconId: 'mock-8' }
          },
        ]);
        return;
      }

      const data = await response.json();
      setHeatData(data.features || []);
    } catch (error) {
      console.error('Error loading heat data:', error);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="max-w-full max-h-full"
      />
      
      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 bg-black/80 border border-white/10 backdrop-blur-md p-4 max-w-xs">
        <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
          NIGHT PULSE
        </p>
        <p className="text-white mb-1" style={{ fontWeight: 900, fontSize: '20px' }}>
          {heatData.length} ACTIVE ZONES
        </p>
        <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
          {timeWindow === 'tonight' ? 'Tonight' : timeWindow === 'weekend' ? 'This Weekend' : 'Last 30 Days'}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 bg-black/80 border border-white/10 backdrop-blur-md p-3">
        <p className="text-white/40 text-center mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          AUTO-ROTATING
        </p>
        <p className="text-white/60 text-center" style={{ fontWeight: 400, fontSize: '10px' }}>
          Live heat visualization
        </p>
      </div>
    </div>
  );
}
