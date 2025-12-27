import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Save } from 'lucide-react';

interface LocationPickerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (data: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  mode: 'add' | 'edit';
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-api-loader': any;
      'gmp-map': any;
      'gmp-advanced-marker': any;
      'gmpx-place-picker': any;
    }
  }
}

export function LocationPickerOverlay({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
  mode,
}: LocationPickerOverlayProps) {
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(initialLocation || null);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const placePickerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initMap = async () => {
      // Wait for web components to be defined
      await customElements.whenDefined('gmp-map');
      await customElements.whenDefined('gmpx-place-picker');
      await customElements.whenDefined('gmp-advanced-marker');

      const map = mapRef.current;
      const marker = markerRef.current;
      const placePicker = placePickerRef.current;

      if (!map || !marker || !placePicker) return;

      const win = window as any;
      if (win.google?.maps?.InfoWindow) {
        infoWindowRef.current = new win.google.maps.InfoWindow();
      }

      // Configure map
      map.innerMap?.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: 'roadmap',
      });

      // Set initial location if editing
      if (initialLocation) {
        map.center = { lat: initialLocation.lat, lng: initialLocation.lng };
        map.zoom = 17;
        marker.position = { lat: initialLocation.lat, lng: initialLocation.lng };
        
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(
            `<div style="color: #000; padding: 4px;">
              <strong>${initialLocation.name}</strong><br>
              <span style="font-size: 12px;">${initialLocation.address}</span>
            </div>`
          );
          infoWindowRef.current.open(map.innerMap, marker);
        }
      }

      // Listen for place selection
      placePicker.addEventListener('gmpx-placechange', () => {
        const place = placePicker.value;

        if (!place.location) {
          alert("No location details available for: '" + place.name + "'");
          if (infoWindowRef.current) infoWindowRef.current.close();
          marker.position = null;
          return;
        }

        // Update map view
        if (place.viewport) {
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }

        // Update marker
        marker.position = place.location;

        // Store selected place
        const locationData = {
          name: place.displayName || place.name || 'Unknown Location',
          address: place.formattedAddress || '',
          lat: place.location.lat,
          lng: place.location.lng,
        };
        setSelectedPlace(locationData);

        // Show info window
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(
            `<div style="color: #000; padding: 4px;">
              <strong>${locationData.name}</strong><br>
              <span style="font-size: 12px;">${locationData.address}</span>
            </div>`
          );
          infoWindowRef.current.open(map.innerMap, marker);
        }
      });
    };

    // Delay to ensure DOM is ready
    setTimeout(initMap, 100);
  }, [isOpen, initialLocation]);

  const handleSave = () => {
    if (selectedPlace) {
      onLocationSelect(selectedPlace);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl h-[80vh] bg-[--hm-ink] border border-[--hm-line] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black/90 border-b border-[--hm-line]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[--hm-live]" />
            <h2 className="uppercase tracking-[0.28em] text-sm">
              {mode === 'add' ? 'Add Location' : 'Edit Location'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Maps Web Components */}
        <div className="w-full h-full">
          {/* Load Google Maps Extended Component Library */}
          {isOpen && (
            <>
              <script
                type="module"
                src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
              />
            </>
          )}
          
          <gmpx-api-loader
            key="AIzaSyB640iZu-aL4-yddVr5zAWuVAq2Mfk9q7w"
            solution-channel="GMP_HOTMESS_location_picker_v1"
          />
          <gmp-map
            ref={mapRef}
            center="51.5074,-0.1278"
            zoom="13"
            map-id="HOTMESS_MAP_ID"
            style={{ width: '100%', height: '100%' }}
          >
            <div slot="control-block-start-inline-start" style={{ padding: '80px 20px 20px 20px' }}>
              <gmpx-place-picker
                ref={placePickerRef}
                placeholder="Search for a location..."
                style={{
                  width: '400px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <gmp-advanced-marker ref={markerRef} />
          </gmp-map>
        </div>

        {/* Footer - Save Button */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black/90 border-t border-[--hm-line]">
          <div className="text-xs text-[--hm-text-dim] uppercase tracking-[0.24em]">
            {selectedPlace ? (
              <>
                <span className="text-[--hm-live]">●</span> {selectedPlace.name}
              </>
            ) : (
              'Search and select a location'
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!selectedPlace}
            className="flex items-center gap-2 px-6 py-3 bg-[--hm-live] text-white uppercase tracking-[0.28em] text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff3366] transition-colors"
          >
            <Save className="w-4 h-4" />
            {mode === 'add' ? 'Add to Globe' : 'Update Location'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}