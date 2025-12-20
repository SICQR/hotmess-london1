import React, { useEffect, useRef } from "react";

/**
 * Safe PlacePicker wrapper to prevent HMR duplicate registration errors
 * 
 * This component handles Google Maps Extended Component Library custom elements
 * safely to avoid "already been used with this registry" errors during development.
 */
export const SafePlacePicker = React.forwardRef<any, {
  placeholder?: string;
  onGmpxPlacechange?: (e: any) => void;
}>((props, ref) => {
  const elRef = useRef<any>(null);
  const [isReady, setIsReady] = React.useState(false);
  
  useEffect(() => {
    // Forward ref to parent
    if (ref) {
      if (typeof ref === 'function') {
        ref(elRef.current);
      } else {
        (ref as any).current = elRef.current;
      }
    }
  }, [ref]);
  
  useEffect(() => {
    // Check if custom element is already registered
    if (typeof customElements !== 'undefined') {
      if (customElements.get('gmpx-place-picker')) {
        // Already registered, ready to use
        setIsReady(true);
      } else {
        // Not registered yet, import the library
        import("@googlemaps/extended-component-library/react")
          .then(() => {
            setIsReady(true);
          })
          .catch((err) => {
            console.warn('PlacePicker component not available:', err);
            setIsReady(true); // Still set ready to show fallback
          });
      }
    }
  }, []);
  
  if (!isReady) {
    // Loading state
    return (
      <input 
        type="text" 
        placeholder={props.placeholder || "Loading..."}
        disabled
        className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/50 outline-none cursor-wait"
      />
    );
  }
  
  // Use the custom element directly
  return React.createElement('gmpx-place-picker', {
    ref: elRef,
    placeholder: props.placeholder || "ENTER ADDRESS / VENUE",
    onGmpxPlacechange: props.onGmpxPlacechange as any,
  });
});

SafePlacePicker.displayName = 'SafePlacePicker';
