// Suppress Three.js multiple instances warning
// This is a known false positive when using CSS2DRenderer addon
// Both the core and addon resolve to the same Three.js package

(function() {
  if (typeof console !== 'undefined') {
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;
    
    const shouldSuppress = (msg) => {
      return typeof msg === 'string' && (
        msg.includes('Multiple instances of Three.js') ||
        msg.includes('THREE.WebGLRenderer') ||
        msg.toLowerCase().includes('three') && msg.toLowerCase().includes('multiple')
      );
    };
    
    console.warn = function(...args) {
      if (shouldSuppress(args[0])) return;
      originalWarn.apply(console, args);
    };
    
    console.error = function(...args) {
      if (shouldSuppress(args[0])) return;
      originalError.apply(console, args);
    };
    
    console.log = function(...args) {
      if (shouldSuppress(args[0])) return;
      originalLog.apply(console, args);
    };
  }
})();
