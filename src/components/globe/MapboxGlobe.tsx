import { useEffect, useRef, useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaG90bWVzcyIsImEiOiJjbWlyeXJhYWMwZm1rM2NxdDZjY2NhdXM5In0.B9T0ACXWOSa1EuShj6dObw';

interface VenueData {
  name: string;
  city: string;
  country: string;
  scans: number;
  coordinates: [number, number];
}

interface Beacon {
  id: string;
  code: string;
  type: string;
  title?: string;
  city?: string;
  lng: number;
  lat: number;
  xp?: number;
  sponsored?: boolean;
}

interface MapboxGlobeProps {
  timeWindow?: 'tonight' | 'weekend' | 'month';
  onCityClick?: (city: any) => void;
  onBeaconClick?: (beaconId: string) => void;
  useLiveData?: boolean; // Enable fetching from Heat API
  beacons?: Beacon[]; // Show beacon pins
  selectedBeaconId?: string | null;
  showHeat?: boolean; // Show city heat map
  showBeacons?: boolean; // Show beacon pins
}

const BEACON_TYPE_COLORS: Record<string, string> = {
  checkin: '#FF1744',
  drop: '#FF10F0',
  event: '#00E5FF',
  product: '#FFD600',
  vendor: '#7C4DFF',
  chat: '#00C853',
  reward: '#FF6E40',
  sponsor: '#FFC107',
  ticket: '#00BCD4',
};

// Static demo data - 31 gay nightlife venues worldwide
const DEMO_VENUES: VenueData[] = [
  { name: "Heaven", city: "London", country: "United Kingdom", scans: 145, coordinates: [-0.1206, 51.5081] },
  { name: "Royal Vauxhall Tavern", city: "London", country: "United Kingdom", scans: 89, coordinates: [-0.1235, 51.4862] },
  { name: "The Glory", city: "London", country: "United Kingdom", scans: 67, coordinates: [-0.0559, 51.5392] },
  { name: "Dalston Superstore", city: "London", country: "United Kingdom", scans: 78, coordinates: [-0.0750, 51.5466] },
  { name: "Eagle London", city: "London", country: "United Kingdom", scans: 52, coordinates: [-0.1208, 51.4848] },
  { name: "XXL London", city: "London", country: "United Kingdom", scans: 34, coordinates: [-0.1270, 51.5145] },
  { name: "Horse Meat Disco @ QEII", city: "London", country: "United Kingdom", scans: 112, coordinates: [-0.0272, 51.5074] },
  { name: "Circa", city: "London", country: "United Kingdom", scans: 41, coordinates: [-0.1149, 51.4837] },
  { name: "The Yard", city: "London", country: "United Kingdom", scans: 93, coordinates: [-0.1319, 51.5124] },
  { name: "G-A-Y Bar", city: "London", country: "United Kingdom", scans: 87, coordinates: [-0.1340, 51.5101] },
  { name: "Berghain", city: "Berlin", country: "Germany", scans: 178, coordinates: [13.4427, 52.5108] },
  { name: "SchwuZ", city: "Berlin", country: "Germany", scans: 64, coordinates: [13.4294, 52.4889] },
  { name: "Laboratory", city: "Berlin", country: "Germany", scans: 48, coordinates: [13.4125, 52.5026] },
  { name: "Ficken 3000", city: "Berlin", country: "Germany", scans: 39, coordinates: [13.4105, 52.5244] },
  { name: "Monster Ronson's", city: "Berlin", country: "Germany", scans: 31, coordinates: [13.4205, 52.4965] },
  { name: "The Eagle NYC", city: "New York", country: "United States", scans: 134, coordinates: [-73.9857, 40.7484] },
  { name: "Phoenix Bar", city: "New York", country: "United States", scans: 76, coordinates: [-73.9973, 40.7338] },
  { name: "Therapy NYC", city: "New York", country: "United States", scans: 69, coordinates: [-73.9918, 40.7625] },
  { name: "Industry Bar", city: "New York", country: "United States", scans: 58, coordinates: [-74.0070, 40.7427] },
  { name: "The Ritz", city: "New York", country: "United States", scans: 43, coordinates: [-73.9878, 40.7442] },
  { name: "The Eagle SF", city: "San Francisco", country: "United States", scans: 102, coordinates: [-122.4115, 37.7749] },
  { name: "Powerhouse Bar", city: "San Francisco", country: "United States", scans: 67, coordinates: [-122.4147, 37.7633] },
  { name: "The Stud", city: "San Francisco", country: "United States", scans: 54, coordinates: [-122.4105, 37.7585] },
  { name: "The Abbey", city: "Los Angeles", country: "United States", scans: 121, coordinates: [-118.3617, 34.0901] },
  { name: "Church", city: "Amsterdam", country: "Netherlands", scans: 98, coordinates: [4.8945, 52.3676] },
  { name: "Prik", city: "Amsterdam", country: "Netherlands", scans: 72, coordinates: [4.8952, 52.3702] },
  { name: "ARQ Sydney", city: "Sydney", country: "Australia", scans: 156, coordinates: [151.2093, -33.8688] },
  { name: "Imperial Erskineville", city: "Sydney", country: "Australia", scans: 81, coordinates: [151.1847, -33.9013] },
  { name: "Le Depot", city: "Paris", country: "France", scans: 143, coordinates: [2.3522, 48.8606] },
  { name: "CUD Bar", city: "Paris", country: "France", scans: 68, coordinates: [2.3470, 48.8584] },
  { name: "Metro Disco", city: "Barcelona", country: "Spain", scans: 109, coordinates: [2.1734, 41.3851] },
];

export function MapboxGlobe({ timeWindow, onCityClick, onBeaconClick, useLiveData = false, beacons, selectedBeaconId, showHeat = true, showBeacons = true }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [venues, setVenues] = useState<VenueData[]>(DEMO_VENUES);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch live data from Heat API
  useEffect(() => {
    if (!useLiveData) return;

    const fetchHeatData = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/heat/heat?window=${timeWindow}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          console.warn('⚠️ Heat API returned non-200 status, using demo data');
          setVenues(DEMO_VENUES);
          setIsLoadingData(false);
          return;
        }

        const data = await response.json();
        
        // Convert GeoJSON features to venue format
        if (data.features && data.features.length > 0) {
          const liveVenues: VenueData[] = data.features.map((feature: any) => ({
            name: feature.properties.city,
            city: feature.properties.city,
            country: feature.properties.country,
            scans: feature.properties.scans,
            coordinates: feature.geometry.coordinates,
          }));
          
          setVenues(liveVenues);
          console.log(`✅ Loaded ${liveVenues.length} live venues from Heat API`);
        } else {
          // Fallback to demo data if no live data
          console.log('ℹ️ No live heat data, using demo venues');
          setVenues(DEMO_VENUES);
        }
      } catch (error) {
        console.warn('⚠️ Error fetching heat data, using demo venues:', error);
        // Fallback to demo data on error
        setVenues(DEMO_VENUES);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchHeatData();
  }, [timeWindow, useLiveData]);

  // Update map data when venues change
  useEffect(() => {
    if (!mapRef.current || !isLoaded || isLoadingData) return;

    try {
      const source = mapRef.current.getSource('venues');
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: venues.map(venue => ({
            type: 'Feature',
            properties: {
              name: venue.name,
              city: venue.city,
              country: venue.country,
              scans: venue.scans,
            },
            geometry: {
              type: 'Point',
              coordinates: venue.coordinates,
            },
          })),
        });
        console.log(`✅ Updated map with ${venues.length} venues`);
      }
    } catch (error) {
      console.error('❌ Error updating map data:', error);
    }
  }, [venues, isLoaded, isLoadingData]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const loadMapbox = async () => {
      try {
        // Use maplibre-gl (open-source alternative to mapbox-gl)
        const maplibregl = await import('maplibre-gl');
        
        // Note: MapLibre doesn't need an access token for self-hosted styles
        // But we can still use Mapbox styles if we provide the token
        (maplibregl as any).default.accessToken = MAPBOX_TOKEN;

        const map = new (maplibregl as any).default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 20],
          zoom: 1.5,
        });

        mapRef.current = map;

        map.on('load', () => {
          console.log('✅ Mapbox loaded');

          // Try to set globe projection
          try {
            map.setProjection('globe');
            console.log('✅ Globe projection set');
          } catch (e) {
            console.warn('⚠️ Globe projection not available:', e);
          }

          // Enable fog with hot pink atmospheric glow
          try {
            map.setFog({
              color: '#ff0080',
              'high-color': '#ff0080',
              'horizon-blend': 0.1,
              'space-color': '#000000',
              'star-intensity': 0.5,
            });
            console.log('✅ Fog enabled');
          } catch (e) {
            console.warn('⚠️ Fog not supported:', e);
          }

          // Add venue data as GeoJSON source
          map.addSource('venues', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: venues.map(venue => ({
                type: 'Feature',
                properties: {
                  name: venue.name,
                  city: venue.city,
                  country: venue.country,
                  scans: venue.scans,
                },
                geometry: {
                  type: 'Point',
                  coordinates: venue.coordinates,
                },
              })),
            },
          });

          // Add glow layer (outer pulse)
          map.addLayer({
            id: 'venue-glow',
            type: 'circle',
            source: 'venues',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1, 15,
                5, 30,
                10, 60,
              ],
              'circle-color': [
                'case',
                ['>=', ['get', 'scans'], 100],
                '#ff1694',
                ['>=', ['get', 'scans'], 10],
                '#ff0080',
                '#e70f3c',
              ],
              'circle-opacity': 0.3,
              'circle-blur': 1.5,
            },
          });

          // Add main marker layer
          map.addLayer({
            id: 'venue-markers',
            type: 'circle',
            source: 'venues',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1, 8,
                5, 20,
                10, 40,
              ],
              'circle-color': [
                'case',
                ['>=', ['get', 'scans'], 100],
                '#ff1694',
                ['>=', ['get', 'scans'], 10],
                '#ff0080',
                '#e70f3c',
              ],
              'circle-opacity': 0.9,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });

          // Add labels
          map.addLayer({
            id: 'venue-labels',
            type: 'symbol',
            source: 'venues',
            layout: {
              'text-field': ['get', 'name'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1, 0,
                3, 10,
                10, 16,
              ],
              'text-offset': [0, -2],
              'text-anchor': 'bottom',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 2,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1, 0,
                3, 1,
              ],
            },
          });

          // Add beacon source (will be updated via useEffect)
          map.addSource('beacons', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          // Add beacon pins
          map.addLayer({
            id: 'beacon-pins',
            type: 'circle',
            source: 'beacons',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1, 4,
                5, 10,
                10, 20,
              ],
              'circle-color': [
                'case',
                ['==', ['get', 'id'], selectedBeaconId || ''],
                '#ffffff',
                ['match', ['get', 'type'],
                  'checkin', '#FF1744',
                  'drop', '#FF10F0',
                  'event', '#00E5FF',
                  'product', '#FFD600',
                  'vendor', '#7C4DFF',
                  'chat', '#00C853',
                  'reward', '#FF6E40',
                  'sponsor', '#FFC107',
                  'ticket', '#00BCD4',
                  '#ff0080'
                ]
              ],
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedBeaconId || ''],
                3,
                1
              ],
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.95,
            },
          });

          console.log('✅ All layers added');

          // Click handler
          map.on('click', 'venue-markers', (e: any) => {
            if (!e.features || !e.features[0]) return;
            const props = e.features[0].properties;
            if (onCityClick && props) {
              onCityClick({
                city: props.city,
                country: props.country,
                scans: props.scans,
                listeners: Math.floor(props.scans * 0.6),
                coordinates: [
                  e.features[0].geometry.coordinates[0],
                  e.features[0].geometry.coordinates[1],
                ],
              });
            }
          });

          // Hover cursor
          map.on('mouseenter', 'venue-markers', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'venue-markers', () => {
            map.getCanvas().style.cursor = '';
          });

          setIsLoaded(true);
        });

        map.on('error', (e: any) => {
          console.error('❌ Mapbox error:', e);
        });
      } catch (error) {
        console.error('❌ Failed to load Mapbox:', error);
      }
    };

    loadMapbox();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onCityClick]);

  // Pulsing animation
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    let phase = 0;
    let animationId: number;
    
    const animateGlow = () => {
      if (!mapRef.current) return;
      
      phase += 0.02;
      const pulseScale = 1 + Math.sin(phase) * 0.3;

      try {
        mapRef.current.setPaintProperty('venue-glow', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          1, 15 * pulseScale,
          5, 30 * pulseScale,
          10, 60 * pulseScale,
        ]);
      } catch (e) {
        // Layer might not be ready yet
      }

      animationId = requestAnimationFrame(animateGlow);
    };

    animationId = requestAnimationFrame(animateGlow);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoaded]);

  // Update beacon data
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !beacons) return;

    try {
      const source = mapRef.current.getSource('beacons');
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: beacons.map(beacon => ({
            type: 'Feature',
            properties: {
              id: beacon.id,
              code: beacon.code,
              type: beacon.type,
              title: beacon.title,
              city: beacon.city,
              xp: beacon.xp,
            },
            geometry: {
              type: 'Point',
              coordinates: [beacon.lng, beacon.lat],
            },
          })),
        });
        console.log(`✅ Updated ${beacons.length} beacon pins`);
      }
    } catch (error) {
      console.error('❌ Error updating beacons:', error);
    }
  }, [beacons, isLoaded]);

  // Control layer visibility based on props
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    try {
      const map = mapRef.current;
      
      // Toggle heat layers (venue markers, glow, labels)
      const heatVisibility = showHeat ? 'visible' : 'none';
      if (map.getLayer('venue-glow')) {
        map.setLayoutProperty('venue-glow', 'visibility', heatVisibility);
      }
      if (map.getLayer('venue-markers')) {
        map.setLayoutProperty('venue-markers', 'visibility', heatVisibility);
      }
      if (map.getLayer('venue-labels')) {
        map.setLayoutProperty('venue-labels', 'visibility', heatVisibility);
      }
      
      // Toggle beacon pins
      const beaconVisibility = showBeacons ? 'visible' : 'none';
      if (map.getLayer('beacon-pins')) {
        map.setLayoutProperty('beacon-pins', 'visibility', beaconVisibility);
      }
      if (map.getLayer('beacon-labels')) {
        map.setLayoutProperty('beacon-labels', 'visibility', beaconVisibility);
      }
      
      console.log(`✅ Layer visibility: heat=${heatVisibility}, beacons=${beaconVisibility}`);
    } catch (error) {
      console.error('❌ Error toggling layer visibility:', error);
    }
  }, [showHeat, showBeacons, isLoaded]);

  // Handle beacon click events
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !onBeaconClick) return;

    const map = mapRef.current;

    const handleClick = (e: any) => {
      if (!e.features || !e.features[0]) return;
      const props = e.features[0].properties;
      if (props && props.id) {
        onBeaconClick(props.id);
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', 'beacon-pins', handleClick);
    map.on('mouseenter', 'beacon-pins', handleMouseEnter);
    map.on('mouseleave', 'beacon-pins', handleMouseLeave);

    return () => {
      map.off('click', 'beacon-pins', handleClick);
      map.off('mouseenter', 'beacon-pins', handleMouseEnter);
      map.off('mouseleave', 'beacon-pins', handleMouseLeave);
    };
  }, [isLoaded, onBeaconClick]);

  // Update selected beacon styling
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    try {
      mapRef.current.setPaintProperty('beacon-pins', 'circle-color', [
        'case',
        ['==', ['get', 'id'], selectedBeaconId || ''],
        '#ffffff',
        ['match', ['get', 'type'],
          'checkin', '#FF1744',
          'drop', '#FF10F0',
          'event', '#00E5FF',
          'product', '#FFD600',
          'vendor', '#7C4DFF',
          'chat', '#00C853',
          'reward', '#FF6E40',
          'sponsor', '#FFC107',
          'ticket', '#00BCD4',
          '#ff0080'
        ]
      ]);

      mapRef.current.setPaintProperty('beacon-pins', 'circle-stroke-width', [
        'case',
        ['==', ['get', 'id'], selectedBeaconId || ''],
        3,
        1
      ]);
    } catch (e) {
      // Style might not be ready yet
    }
  }, [selectedBeaconId, isLoaded]);

  return (
    <>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff1694',
          fontWeight: 900,
          fontSize: '24px',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          LOADING NIGHT PULSE...
        </div>
      )}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          inset: 0
        }} 
      />
    </>
  );
}