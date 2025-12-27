/// <reference types="@types/google.maps" />
// Minimal ambient typings for Google Maps JS API usage in this Vite app.
// Keeps TypeScript happy without requiring the full @types/google.maps package.

declare const google: any;

declare namespace google {
  namespace maps {
    namespace visualization {
      type HeatmapLayer = any;
    }

    namespace places {
      type Autocomplete = any;
    }

    type Map = any;
    type Marker = any;
    type InfoWindow = any;
    type LatLng = any;

    const MapTypeControlStyle: any;
    const ControlPosition: any;
    const SymbolPath: any;
    const Animation: any;
  }
}
