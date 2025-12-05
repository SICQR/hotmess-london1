/**
 * Three.js Singleton Module
 * 
 * This module ensures only ONE instance of Three.js is imported across the entire app.
 * Prevents "Multiple instances of Three.js being imported" warnings.
 * 
 * Usage:
 * import * as THREE from '../lib/three-singleton';
 * import { CSS2DRenderer, CSS2DObject } from '../lib/three-singleton';
 */

// Export the main Three.js namespace
export * from 'three';

// Export commonly used addons
export { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Re-export default if needed
import * as THREE from 'three';
export default THREE;
