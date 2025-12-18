/**
 * NIGHT PULSE GLOBE - REAL-TIME VERSION
 * Integrates real-time Supabase data with 3D globe visualization
 * Shows aggregate city-level activity with privacy filtering
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNightPulseRealtime } from '../../hooks/useNightPulseRealtime';
import { GLOBAL_MICROCOPY } from '../../constants/copy';
import type { NightPulseCity } from '../../types/night-pulse';

interface NightPulseGlobeRealtimeProps {
  onCityClick?: (city: NightPulseCity) => void;
}

export function NightPulseGlobeRealtime({ onCityClick }: NightPulseGlobeRealtimeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  
  const [selectedCity, setSelectedCity] = useState<NightPulseCity | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  
  // Real-time data hook
  const { cities, loading, error, lastUpdate } = useNightPulseRealtime();

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Wait for container to have dimensions (using a small timeout)
    const initializeGlobe = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      console.log('🌍 Initializing Night Pulse globe:', width, 'x', height);
      
      // Don't initialize if container has no dimensions
      if (width === 0 || height === 0) {
        console.warn('⚠️ Container has no dimensions, retrying...');
        setTimeout(initializeGlobe, 100);
        return;
      }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 20;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controlsRef.current = controls;

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0a0a,
      emissive: 0x111111,
      emissiveIntensity: 0.3,
      shininess: 5,
      transparent: true,
      opacity: 1,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    // Night lights overlay
    const nightLightsGeometry = new THREE.SphereGeometry(1.01, 128, 128);
    const nightLightsMaterial = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.3,
    });
    const nightLights = new THREE.Mesh(nightLightsGeometry, nightLightsMaterial);
    scene.add(nightLights);

    // Atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.3 },
        p: { value: 6.0 },
        glowColor: { value: new THREE.Color(0xff1694) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.8);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xff1694, 0.5, 100);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Markers group
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      // Update zoom level
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      setZoomLevel(Math.round((1 - (distance - 1.5) / (20 - 1.5)) * 100));

      // Slow rotation
      if (!controls.enabled || Math.abs(controls.getAzimuthalAngle()) < 0.01) {
        earth.rotation.y += 0.0005;
        nightLights.rotation.y += 0.0005;
      }

      // Animate markers
      markersGroup.children.forEach((child) => {
        if ((child as any).animate) {
          (child as any).animate();
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    }; // End of initializeGlobe function
    
    // Start initialization
    initializeGlobe();
  }, []);

  // Update markers when cities data changes
  useEffect(() => {
    if (!markersGroupRef.current || cities.length === 0) return;

    console.log('🔄 Updating Night Pulse markers:', cities.length, 'cities');
    updateMarkers(cities);
  }, [cities]);

  // Convert lat/lng to 3D position
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  // Update markers on globe
  const updateMarkers = (cityData: NightPulseCity[]) => {
    if (!markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    
    // Clear existing markers
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }

    cityData.forEach((city) => {
      const position = latLngToVector3(city.latitude, city.longitude, 1.02);

      // Color based on heat intensity
      let color = new THREE.Color(0xffeb3b); // Yellow
      if (city.heat_intensity > 80) color = new THREE.Color(0xffffff); // White - mega hot
      else if (city.heat_intensity > 60) color = new THREE.Color(0xff1694); // Hot pink
      else if (city.heat_intensity > 40) color = new THREE.Color(0xff6b00); // Orange
      else if (city.heat_intensity > 20) color = new THREE.Color(0xff9800); // Light orange

      const size = 0.008 + (city.heat_intensity / 100) * 0.03;

      // Check if activity is recent (within 5 minutes)
      const isRecent = Date.now() - new Date(city.last_activity_at).getTime() < 300000;

      // Outer glow
      const outerGeometry = new THREE.SphereGeometry(size * 4, 16, 16);
      const outerMaterial = new THREE.MeshBasicMaterial({
        color: isRecent ? 0x00d9ff : 0xff1694,
        transparent: true,
        opacity: isRecent ? 0.2 : 0.1,
      });
      const outer = new THREE.Mesh(outerGeometry, outerMaterial);
      outer.position.copy(position);
      markersGroup.add(outer);

      // Middle beam
      const beamGeometry = new THREE.SphereGeometry(size * 2.5, 16, 16);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff1694,
        transparent: true,
        opacity: 0.25,
      });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.copy(position);
      markersGroup.add(beam);

      // Core
      const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.copy(position);
      core.userData = {
        ...city,
        clickable: true,
      };
      markersGroup.add(core);

      // Pulse animation (enhanced for recent activity)
      (core as any).animate = () => {
        const baseSpeed = 0.002;
        const speed = isRecent ? baseSpeed * 2 : baseSpeed;
        const scale = 1 + Math.sin(Date.now() * speed + city.heat_intensity) * (isRecent ? 0.5 : 0.3);
        core.scale.set(scale, scale, scale);
        outer.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
      };
    });

    console.log(`✨ Added ${cityData.length} city markers to globe`);
  };

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff1694] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              LOADING NIGHT PULSE...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500 text-white px-6 py-3 max-w-md">
          <p style={{ fontWeight: 700, fontSize: '12px' }}>
            ⚠️ CONNECTION ERROR
          </p>
          <p style={{ fontWeight: 400, fontSize: '11px', marginTop: '4px' }}>
            {error}
          </p>
        </div>
      )}

      {/* Corner privacy label */}
      <div 
        className="absolute top-4 left-4 bg-black/90 border border-white/20 backdrop-blur-md px-4 py-2"
        style={{ 
          fontWeight: 400, 
          fontSize: '10px',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        {GLOBAL_MICROCOPY.aggregate}
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 bg-black/90 border border-[#ff1694]/30 backdrop-blur-md p-4 max-w-xs">
        <p className="text-[#ff1694] uppercase mb-2" style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em' }}>
          🌍 NIGHT PULSE REAL-TIME
        </p>
        <p className="text-white mb-1" style={{ fontWeight: 900, fontSize: '24px' }}>
          {cities.length} CITIES
        </p>
        <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '11px' }}>
          Live nightlife activity
        </p>
        <div className="text-white/40 mb-3" style={{ fontWeight: 400, fontSize: '9px' }}>
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
        <div className="pt-3 border-t border-white/10">
          <p className="text-white/40 uppercase mb-1" style={{ fontWeight: 700, fontSize: '9px', letterSpacing: '0.05em' }}>
            Zoom Level
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ff1694] transition-all duration-200"
                style={{ width: `${zoomLevel}%` }}
              />
            </div>
            <span className="text-white/60" style={{ fontWeight: 700, fontSize: '10px' }}>
              {zoomLevel}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 bg-black/90 border border-white/10 backdrop-blur-md p-3 max-w-xs">
        <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
          🎮 CONTROLS
        </p>
        <div className="space-y-1 text-white/50" style={{ fontWeight: 400, fontSize: '10px' }}>
          <p>• <strong>Drag</strong> - Rotate globe</p>
          <p>• <strong>Scroll</strong> - Zoom in/out</p>
          <p>• <strong>Right-click + Drag</strong> - Pan</p>
          <p>• <strong>Click marker</strong> - City details</p>
        </div>
      </div>

      {/* Selected City Info */}
      {selectedCity && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-black via-black/95 to-[#ff1694]/20 border-2 border-[#ff1694] p-6 min-w-[320px] shadow-[0_0_40px_rgba(255,22,148,0.6)] backdrop-blur-xl">
          <button
            onClick={() => setSelectedCity(null)}
            className="absolute top-2 right-2 text-white/40 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
          
          <div style={{ fontWeight: 900, fontSize: '24px', marginBottom: '4px', color: '#ffffff', textTransform: 'uppercase' }}>
            {selectedCity.city_name}
          </div>
          <div style={{ fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase' }}>
            {selectedCity.country_code}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[rgba(255,22,148,0.1)] border-l-4 border-[#ff1694]">
              <div style={{ fontWeight: 700, fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {selectedCity.active_beacons !== null ? 'BEACONS' : 'ACTIVITY'}
              </div>
              <div style={{ fontWeight: 900, fontSize: '28px', color: '#ff1694' }}>
                {selectedCity.active_beacons !== null ? selectedCity.active_beacons : 'Yes'}
              </div>
            </div>
            <div className="p-3 bg-white/5 border-l-4 border-white/20">
              <div style={{ fontWeight: 700, fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                SCANS/HR
              </div>
              <div style={{ fontWeight: 900, fontSize: '28px', color: '#ffffff' }}>
                {selectedCity.scans_last_hour}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <p style={{ fontWeight: 400, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {GLOBAL_MICROCOPY.aggregate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
