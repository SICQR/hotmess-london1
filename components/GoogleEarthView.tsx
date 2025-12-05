import { useEffect, useRef, useState, useCallback } from 'react';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_ZOOM, DEFAULT_TILT, DEFAULT_HEADING } from '../config/google-maps';

// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}

export interface CustomLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
  createdAt: string;
  color?: string;
}

export interface Beacon {
  id: string;
  code: string;
  title: string;
  kind: 'drop' | 'event' | 'venue' | 'sponsor' | 'secret';
  lat: number;
  lng: number;
  city?: string;
  active: boolean;
  scans?: number;
  intensity?: number;
}

interface GoogleEarthViewProps {
  locations: CustomLocation[];
  showLocations: boolean;
  selectedLocationId?: string | null;
  onLocationClick?: (location: CustomLocation) => void;
  // Beacon layer props
  beacons?: Beacon[];
  showBeacons?: boolean;
  showHeatmap?: boolean;
  onBeaconClick?: (beacon: Beacon) => void;
}

// Global flag to track if Google Maps is loading
let isGoogleMapsLoading = false;
let googleMapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  // If already loaded, return immediately
  if (typeof google !== 'undefined' && google.maps) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (isGoogleMapsLoading && googleMapsLoadPromise) {
    return googleMapsLoadPromise;
  }

  // Check if script already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    return new Promise((resolve) => {
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
    });
  }

  // Create new loading promise
  isGoogleMapsLoading = true;
  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry,visualization&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isGoogleMapsLoading = false;
      resolve();
    };
    
    script.onerror = () => {
      isGoogleMapsLoading = false;
      googleMapsLoadPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };
    
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

export function GoogleEarthView({ 
  locations, 
  showLocations, 
  selectedLocationId,
  onLocationClick,
  beacons = [],
  showBeacons = false,
  showHeatmap = false,
  onBeaconClick,
}: GoogleEarthViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locationMarkers, setLocationMarkers] = useState<google.maps.Marker[]>([]);
  const [beaconMarkers, setBeaconMarkers] = useState<google.maps.Marker[]>([]);
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        // Load Google Maps script
        await loadGoogleMapsScript();

        if (!isMounted || !mapRef.current) return;

        // Ensure google.maps is fully available
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        // Create the map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_ZOOM,
          tilt: DEFAULT_TILT,
          heading: DEFAULT_HEADING,
          mapTypeId: 'satellite',
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle?.DROPDOWN_MENU || 1,
            position: google.maps.ControlPosition?.TOP_LEFT || 1,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition?.RIGHT_TOP || 3,
          },
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition?.RIGHT_TOP || 3,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition?.RIGHT_CENTER || 5,
          },
          rotateControl: true,
          rotateControlOptions: {
            position: google.maps.ControlPosition?.RIGHT_CENTER || 5,
          },
          scaleControl: true,
          gestureHandling: 'greedy',
          // Dark mode styles
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#ff1744' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#ff1744' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#ff1744' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#1a1a1a' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#1a1a1a' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#0a0a0a' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#2a2a2a' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#1a1a1a' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#000814' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#3a86ff' }],
            },
          ],
        });

        if (isMounted) {
          setMap(mapInstance);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        if (isMounted) {
          setError('Failed to load Google Maps');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update location markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    locationMarkers.forEach(marker => marker.setMap(null));

    if (!showLocations) {
      setLocationMarkers([]);
      return;
    }

    // Create new markers
    const newMarkers = locations.map(location => {
      const isSelected = selectedLocationId === location.id;
      
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 8,
          fillColor: location.color || '#FF1744',
          fillOpacity: isSelected ? 1 : 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: isSelected ? 3 : 2,
        },
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        zIndex: 1000,
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #000; font-family: system-ui, sans-serif; padding: 8px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${location.name}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${location.address}</div>
            ${location.notes ? `<div style="font-size: 11px; color: #999; margin-top: 8px;">${location.notes}</div>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      return marker;
    });

    setLocationMarkers(newMarkers);
  }, [map, locations, showLocations, selectedLocationId, onLocationClick]);

  // Update beacon markers when beacons change
  useEffect(() => {
    if (!map) return;

    // Clear existing beacon markers
    beaconMarkers.forEach(marker => marker.setMap(null));

    if (!showBeacons) {
      setBeaconMarkers([]);
      return;
    }

    // Create new beacon markers
    const newMarkers = beacons.map(beacon => {
      // Beacon icon based on kind and status
      const getBeaconIcon = () => {
        let fillColor = '#FF1744'; // Default HOTMESS red
        let scale = 10;
        
        switch (beacon.kind) {
          case 'event':
            fillColor = '#FF1744';
            scale = 14;
            break;
          case 'drop':
            fillColor = '#FF6B9D';
            scale = 12;
            break;
          case 'venue':
            fillColor = '#FFD600';
            scale = 10;
            break;
          case 'sponsor':
            fillColor = '#FFFFFF';
            scale = 12;
            break;
          case 'secret':
            fillColor = '#D500F9';
            scale = 11;
            break;
        }

        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: scale,
          fillColor: fillColor,
          fillOpacity: beacon.active ? 1 : 0.5,
          strokeColor: '#000000',
          strokeWeight: 2,
        };
      };

      const marker = new google.maps.Marker({
        position: { lat: beacon.lat, lng: beacon.lng },
        map: map,
        title: beacon.title,
        icon: getBeaconIcon(),
        zIndex: beacon.kind === 'event' ? 2000 : 1500,
      });

      // Beacon info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #000; font-family: system-ui, sans-serif; padding: 12px; min-width: 200px;">
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">
              ${beacon.title}
            </div>
            <div style="display: inline-block; padding: 4px 8px; background: #FF1744; color: white; font-size: 10px; font-weight: 700; border-radius: 4px; margin-bottom: 8px; letter-spacing: 0.1em;">
              ${beacon.kind.toUpperCase()}
            </div>
            ${beacon.city ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📍 ${beacon.city}</div>` : ''}
            ${beacon.scans ? `<div style="font-size: 12px; color: #999;">⚡ ${beacon.scans} scans</div>` : ''}
            <div style="font-size: 10px; color: #999; margin-top: 8px; font-family: monospace;">
              /l/${beacon.code}
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onBeaconClick) {
          onBeaconClick(beacon);
        }
      });

      // Add pulse animation for active events
      if (beacon.active && beacon.kind === 'event') {
        let scale = 14;
        let growing = true;
        const pulse = setInterval(() => {
          if (growing) {
            scale += 0.5;
            if (scale >= 18) growing = false;
          } else {
            scale -= 0.5;
            if (scale <= 14) growing = true;
          }
          marker.setIcon({
            ...getBeaconIcon(),
            scale: scale,
          });
        }, 100);

        // Store interval ID for cleanup
        (marker as any)._pulseInterval = pulse;
      }

      return marker;
    });

    setBeaconMarkers(newMarkers);

    // Cleanup pulse animations
    return () => {
      newMarkers.forEach(marker => {
        if ((marker as any)._pulseInterval) {
          clearInterval((marker as any)._pulseInterval);
        }
      });
    };
  }, [map, beacons, showBeacons, onBeaconClick]);

  // Update heatmap layer
  useEffect(() => {
    if (!map) return;

    // Remove existing heatmap
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }

    if (!showHeatmap || beacons.length === 0) {
      setHeatmapLayer(null);
      return;
    }

    // Create heatmap data points
    const heatmapData = beacons.map(beacon => {
      const weight = beacon.intensity || (beacon.scans ? Math.min(beacon.scans / 100, 1) : 0.5);
      return {
        location: new google.maps.LatLng(beacon.lat, beacon.lng),
        weight: weight,
      };
    });

    // Create heatmap layer
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 40,
      opacity: 0.7,
      gradient: [
        'rgba(0, 0, 0, 0)',
        'rgba(255, 23, 68, 0.3)',
        'rgba(255, 23, 68, 0.5)',
        'rgba(255, 23, 68, 0.7)',
        'rgba(255, 23, 68, 0.9)',
        'rgba(255, 107, 157, 1)',
      ],
    });

    setHeatmapLayer(heatmap);
  }, [map, beacons, showHeatmap]);

  // Center on selected location
  useEffect(() => {
    if (!map || !selectedLocationId) return;

    const location = locations.find(loc => loc.id === selectedLocationId);
    if (!location) return;

    map.panTo({ lat: location.lat, lng: location.lng });
    map.setZoom(16);
    map.setTilt(45);
  }, [map, selectedLocationId, locations]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-hotmess-red tracking-tight uppercase mb-2" style={{ fontSize: '24px', fontWeight: 900 }}>
            ERROR
          </div>
          <div className="text-white/60 tracking-[0.24em] uppercase" style={{ fontSize: '12px' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="text-hotmess-red tracking-tight uppercase mb-2" style={{ fontSize: '24px', fontWeight: 900 }}>
              LOADING EARTH
            </div>
            <div className="text-white/60 tracking-[0.24em] uppercase" style={{ fontSize: '12px' }}>
              Initializing Google Earth Engine...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}