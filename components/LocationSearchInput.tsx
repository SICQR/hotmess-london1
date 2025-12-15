import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface LocationResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationSearchInputProps {
  onLocationSelect: (result: LocationResult) => void;
  placeholder?: string;
}

export function LocationSearchInput({ onLocationSelect, placeholder = 'Search for a location...' }: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Check if Google Maps is already loaded
    const checkGoogleMaps = () => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // If already loaded, return
    if (checkGoogleMaps()) {
      return;
    }

    // Otherwise, wait for it to load (it's being loaded by GoogleEarthView)
    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocomplete) return;

    const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      types: ['establishment', 'geocode'],
    });

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const result: LocationResult = {
        placeId: place.place_id || '',
        name: place.name || '',
        address: place.formatted_address || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      onLocationSelect(result);
      setInputValue('');
    });

    setAutocomplete(autocompleteInstance);
  }, [isLoaded, autocomplete, onLocationSelect]);

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-red z-10 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/60 border-2 border-white/15 rounded-xl text-white pl-11 pr-11 py-3 focus:outline-none focus:border-hotmess-red transition-colors text-sm placeholder:text-white/30"
        disabled={!isLoaded}
      />

      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {!isLoaded && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">
          Loading...
        </div>
      )}
    </div>
  );
}
