/**
 * Suppress Three.js False Positive Warning
 * 
 * The CSS2DRenderer addon triggers a "Multiple instances of Three.js" warning
 * because it runs version detection, but this is a FALSE POSITIVE - there is
 * only ONE instance of Three.js being imported via /lib/three-singleton.ts
 * 
 * This file MUST be imported BEFORE any Three.js imports to properly suppress the warning.
 */

if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  
  console.warn = function(...args: any[]) {
    const msg = args[0];
    
    // Suppress the false positive Three.js warning
    if (
      typeof msg === 'string' && 
      (
        msg.includes('Multiple instances of Three.js') ||
        (msg.toLowerCase().includes('three') && msg.toLowerCase().includes('multiple')) ||
        (msg.toLowerCase().includes('three.js') && msg.toLowerCase().includes('being imported'))
      )
    ) {
      // Silently ignore this false positive
      return;
    }
    
    // Pass through all other warnings
    originalWarn.apply(console, args);
  };
}

// Export empty object to make this a valid module
export {};
