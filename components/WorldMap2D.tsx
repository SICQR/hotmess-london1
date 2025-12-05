import { motion } from 'motion/react';
import { MapPin, Zap } from 'lucide-react';

interface MapBeacon {
  id: string;
  code: string;
  title?: string;
  lat: number;
  lng: number;
  xp?: number;
  sponsored?: boolean;
}

interface WorldMap2DProps {
  beacons: MapBeacon[];
  onBeaconClick?: (id: string) => void;
  selectedId?: string | null;
  showHeat?: boolean;
  heatBins?: Array<{
    west: number;
    south: number;
    east: number;
    north: number;
    count: number;
  }>;
}

// Convert lat/lng to SVG coordinates (simple equirectangular projection)
// SVG viewBox: 0 0 1000 500 (2:1 aspect ratio for world map)
function latLngToXY(lat: number, lng: number) {
  // Longitude: -180 to 180 → 0 to 1000
  const x = ((lng + 180) / 360) * 1000;
  
  // Latitude: 90 to -90 → 0 to 500
  const y = ((90 - lat) / 180) * 500;
  
  return { x, y };
}

export function WorldMap2D({ beacons, onBeaconClick, selectedId, showHeat = false, heatBins = [] }: WorldMap2DProps) {
  console.log('🗺️ WorldMap2D rendering:', { beaconCount: beacons.length, showHeat, heatBinCount: heatBins.length });
  
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ maxHeight: '80vh', minHeight: '400px' }}
      >
        {/* Background */}
        <rect width="1000" height="500" fill="#000000" />
        
        {/* Grid lines */}
        <g opacity="0.15" stroke="#FF1744" strokeWidth="0.5">
          {/* Longitude lines (vertical) */}
          {Array.from({ length: 36 }).map((_, i) => {
            const x = (i / 36) * 1000;
            return <line key={`lon-${i}`} x1={x} y1="0" x2={x} y2="500" />;
          })}
          {/* Latitude lines (horizontal) */}
          {Array.from({ length: 18 }).map((_, i) => {
            const y = (i / 18) * 500;
            return <line key={`lat-${i}`} x1="0" y1={y} x2="1000" y2={y} />;
          })}
        </g>
        
        {/* Equator (thicker) */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#FF1744" strokeWidth="1" opacity="0.3" />
        
        {/* Prime Meridian (thicker) */}
        <line x1="500" y1="0" x2="500" y2="500" stroke="#FF1744" strokeWidth="1" opacity="0.3" />
        
        {/* Simplified continents outline (very basic) */}
        <g opacity="0.08" fill="none" stroke="#FFFFFF" strokeWidth="1">
          {/* Europe */}
          <ellipse cx="520" cy="180" rx="60" ry="40" />
          {/* Africa */}
          <ellipse cx="540" cy="280" rx="50" ry="80" />
          {/* Asia */}
          <ellipse cx="680" cy="200" rx="120" ry="70" />
          {/* North America */}
          <ellipse cx="220" cy="180" rx="90" ry="60" />
          {/* South America */}
          <ellipse cx="280" cy="320" rx="40" ry="70" />
          {/* Australia */}
          <ellipse cx="780" cy="340" rx="50" ry="30" />
        </g>
        
        {/* Heat bins */}
        {showHeat && heatBins.map((bin, index) => {
          const nw = latLngToXY(bin.north, bin.west);
          const se = latLngToXY(bin.south, bin.east);
          const width = se.x - nw.x;
          const height = se.y - nw.y;
          const intensity = Math.min(bin.count / 50, 1); // Scale 0-1
          
          return (
            <rect
              key={`heat-${index}`}
              x={nw.x}
              y={nw.y}
              width={width}
              height={height}
              fill="#FF1744"
              opacity={intensity * 0.4}
            />
          );
        })}
        
        {/* Beacon pins */}
        {beacons.map((beacon) => {
          const { x, y } = latLngToXY(beacon.lat, beacon.lng);
          const isSelected = selectedId === beacon.id;
          
          return (
            <g
              key={beacon.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => onBeaconClick?.(beacon.id)}
              className="cursor-pointer"
              style={{ pointerEvents: 'all' }}
            >
              {/* Pulse ring */}
              {isSelected && (
                <motion.circle
                  r="8"
                  fill="none"
                  stroke="#FF1744"
                  strokeWidth="2"
                  initial={{ r: 8, opacity: 0.8 }}
                  animate={{ r: 20, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Pin background glow */}
              <circle
                r="6"
                fill="#FF1744"
                opacity="0.3"
                filter="blur(4px)"
              />
              
              {/* Pin dot */}
              <circle
                r={isSelected ? 5 : 3.5}
                fill={beacon.sponsored ? '#FFFFFF' : '#FF1744'}
                stroke={isSelected ? '#FFFFFF' : 'none'}
                strokeWidth="1.5"
              />
              
              {/* XP indicator */}
              {(beacon.xp ?? 0) > 0 && (
                <text
                  y="-8"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="bold"
                  style={{ userSelect: 'none' }}
                >
                  {beacon.xp}
                </text>
              )}
            </g>
          );
        })}
        
        {/* City labels (major cities) */}
        <g fill="#FFFFFF" opacity="0.4" fontSize="7" fontWeight="500">
          <text x={latLngToXY(51.5074, -0.1278).x} y={latLngToXY(51.5074, -0.1278).y - 12} textAnchor="middle">LONDON</text>
          <text x={latLngToXY(40.7128, -74.0060).x} y={latLngToXY(40.7128, -74.0060).y - 12} textAnchor="middle">NYC</text>
          <text x={latLngToXY(52.5200, 13.4050).x} y={latLngToXY(52.5200, 13.4050).y - 12} textAnchor="middle">BERLIN</text>
          <text x={latLngToXY(35.6762, 139.6503).x} y={latLngToXY(35.6762, 139.6503).y - 12} textAnchor="middle">TOKYO</text>
          <text x={latLngToXY(-33.8688, 151.2093).x} y={latLngToXY(-33.8688, 151.2093).y + 18} textAnchor="middle">SYDNEY</text>
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/90 border border-white/15 rounded-xl p-3 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-hot" />
          <span className="text-white/80 tracking-wider uppercase">Active Beacon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-white/80 tracking-wider uppercase">Sponsored</span>
        </div>
      </div>
    </div>
  );
}