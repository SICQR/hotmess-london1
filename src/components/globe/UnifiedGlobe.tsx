/**
 * UNIFIED GLOBE COMPONENT
 * Single globe visualization for beacons, night pulse, heat maps, tickets, and cities
 * Replaces: NightPulseGlobe, NightPulseGlobeRealtime, ThreeGlobe, LiveGlobe3D
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { NightPulseCity } from '../../types/night-pulse';

// ============================================================================
// TYPES
// ============================================================================

export interface BeaconMarker {
  id: string;
  title?: string;
  lat: number;
  lng: number;
  city?: string;
  kind?: 'drop' | 'event' | 'product' | 'sponsor' | 'checkin' | 'ticket' | 'other';
  intensity?: number; // 0-1
  sponsored?: boolean;
  scans?: number;
}

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

export interface TicketLocation {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  eventName?: string;
}

export interface CityMarker {
  name: string;
  lat: number;
  lng: number;
  tier?: 1 | 2 | 3;
  active?: boolean;
  sponsored?: boolean;
}

export interface TrailData {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  timestamp?: number;
}

export interface CityStats {
  city: string;
  country: string;
  scans: number;
  listeners: number;
  coordinates: [number, number];
  venueName?: string;
  venueType?: string;
}

export interface UnifiedGlobeProps {
  // Layer data
  beacons?: BeaconMarker[];
  heatData?: HeatPoint[];
  tickets?: TicketLocation[];
  cities?: CityMarker[];
  trails?: TrailData[];
  
  // Night pulse cities (alternate to individual markers)
  nightPulseCities?: NightPulseCity[];
  
  // Layer visibility (defaults to true if data provided)
  showBeacons?: boolean;
  showHeat?: boolean;
  showTickets?: boolean;
  showCities?: boolean;
  showTrails?: boolean;
  
  // Interactions
  onMarkerClick?: (marker: BeaconMarker | TicketLocation) => void;
  onCityClick?: (city: CityStats | NightPulseCity) => void;
  
  // View settings
  mode3d?: boolean;
  initialPosition?: { lat: number; lng: number; zoom: number };
  
  // Realtime updates
  realtimeEnabled?: boolean;
  timeWindow?: 'live' | '10m' | '1h' | '24h' | 'tonight' | 'weekend' | 'month';
  
  // Styling
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UnifiedGlobe({
  beacons = [],
  heatData = [],
  tickets = [],
  cities = [],
  trails = [],
  nightPulseCities = [],
  showBeacons = true,
  showHeat = true,
  showTickets = true,
  showCities = true,
  showTrails = true,
  onMarkerClick,
  onCityClick,
  mode3d = true,
  initialPosition,
  realtimeEnabled = false,
  timeWindow = 'live',
  className = '',
}: UnifiedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const heatGroupRef = useRef<THREE.Group | null>(null);
  const trailsGroupRef = useRef<THREE.Group | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  const getMarkerColor = (intensity: number = 0.5, sponsored: boolean = false) => {
    if (sponsored) return new THREE.Color(0xffffff);
    if (intensity > 0.8) return new THREE.Color(0xffffff); // White - mega hotspots
    if (intensity > 0.6) return new THREE.Color(0xff1694); // Hot pink - major venues
    if (intensity > 0.4) return new THREE.Color(0xff6b00); // Orange - popular spots
    if (intensity > 0.2) return new THREE.Color(0xff9800); // Light orange
    return new THREE.Color(0xffeb3b); // Yellow
  };

  const getMarkerSize = (intensity: number = 0.5, baseSize: number = 0.015) => {
    return baseSize + (intensity * 0.02);
  };

  // ============================================================================
  // INITIALIZE SCENE
  // ============================================================================

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    console.log('🌍 Initializing UnifiedGlobe:', width, 'x', height);

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, initialPosition?.zoom || 4.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const starVertices: number[] = [];
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

    // Layer groups
    const markersGroup = new THREE.Group();
    const heatGroup = new THREE.Group();
    const trailsGroup = new THREE.Group();
    scene.add(markersGroup, heatGroup, trailsGroup);
    markersGroupRef.current = markersGroup;
    heatGroupRef.current = heatGroup;
    trailsGroupRef.current = trailsGroup;

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMarker: THREE.Mesh | null = null;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        markersGroup.children.filter(c => c.userData.clickable)
      );

      if (intersects.length > 0) {
        const marker = intersects[0].object as THREE.Mesh;
        if (hoveredMarker !== marker) {
          if (hoveredMarker) {
            hoveredMarker.scale.set(1, 1, 1);
          }
          hoveredMarker = marker;
          marker.scale.set(1.5, 1.5, 1.5);
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMarker) {
          hoveredMarker.scale.set(1, 1, 1);
          hoveredMarker = null;
        }
        container.style.cursor = 'grab';
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        markersGroup.children.filter(c => c.userData.clickable)
      );

      if (intersects.length > 0) {
        const marker = intersects[0].object;
        const markerData = marker.userData.markerData;
        
        if (markerData) {
          if (marker.userData.type === 'city' && onCityClick) {
            onCityClick(markerData);
          } else if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        }
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onMouseClick);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      controls.update();

      // Update zoom level
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      setZoomLevel(Math.round((1 - (distance - 1.5) / (20 - 1.5)) * 100));

      // Slow rotation when not interacting
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
    setLoading(false);

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
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onMouseClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      nightLightsGeometry.dispose();
      nightLightsMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [initialPosition]);

  // ============================================================================
  // UPDATE MARKERS
  // ============================================================================

  useEffect(() => {
    if (!markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;

    // Clear existing markers
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }

    // Add beacons
    if (showBeacons && beacons.length > 0) {
      beacons.forEach((beacon) => {
        const position = latLngToVector3(beacon.lat, beacon.lng, 1.02);
        const intensity = beacon.intensity ?? (beacon.scans ? beacon.scans / 500 : 0.5);
        const color = getMarkerColor(intensity, beacon.sponsored);
        const size = getMarkerSize(intensity);

        // Outer glow
        const outerGeometry = new THREE.SphereGeometry(size * 4, 16, 16);
        const outerMaterial = new THREE.MeshBasicMaterial({
          color: beacon.sponsored ? 0xffffff : 0x00d9ff,
          transparent: true,
          opacity: 0.1,
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

        // Core marker
        const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 1,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.copy(position);
        core.userData = {
          clickable: true,
          type: 'beacon',
          markerData: beacon,
        };
        markersGroup.add(core);

        // Pulse animation
        (core as any).animate = () => {
          const scale = 1 + Math.sin(Date.now() * 0.002 + (beacon.scans || 0)) * 0.3;
          core.scale.set(scale, scale, scale);
          outer.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
        };
      });
    }

    // Add night pulse cities
    if (showCities && nightPulseCities.length > 0) {
      nightPulseCities.forEach((city) => {
        const position = latLngToVector3(city.latitude, city.longitude, 1.02);
        const intensity = city.heat_intensity / 100;
        const color = getMarkerColor(intensity);
        const size = getMarkerSize(intensity);

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

        // Core marker
        const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 1,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.copy(position);
        core.userData = {
          clickable: true,
          type: 'city',
          markerData: city,
        };
        markersGroup.add(core);

        // Pulse animation
        (core as any).animate = () => {
          const baseSpeed = 0.002;
          const speed = isRecent ? baseSpeed * 2 : baseSpeed;
          const scale = 1 + Math.sin(Date.now() * speed + city.heat_intensity) * (isRecent ? 0.5 : 0.3);
          core.scale.set(scale, scale, scale);
          outer.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
        };
      });
    }

    // Add tickets
    if (showTickets && tickets.length > 0) {
      tickets.forEach((ticket) => {
        const position = latLngToVector3(ticket.lat, ticket.lng, 1.02);
        const size = 0.02;

        // Ticket marker (use different color)
        const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: 0x00bcd4, // Cyan for tickets
          transparent: true,
          opacity: 1,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.copy(position);
        core.userData = {
          clickable: true,
          type: 'ticket',
          markerData: ticket,
        };
        markersGroup.add(core);

        // Pulse animation
        (core as any).animate = () => {
          const scale = 1 + Math.sin(Date.now() * 0.002) * 0.3;
          core.scale.set(scale, scale, scale);
        };
      });
    }

    console.log(`✨ Updated globe with ${markersGroup.children.length} markers`);
  }, [beacons, nightPulseCities, tickets, showBeacons, showCities, showTickets]);

  // ============================================================================
  // UPDATE HEAT MAP
  // ============================================================================

  useEffect(() => {
    if (!heatGroupRef.current) return;

    const heatGroup = heatGroupRef.current;

    // Clear existing heat
    while (heatGroup.children.length > 0) {
      heatGroup.remove(heatGroup.children[0]);
    }

    if (!showHeat || heatData.length === 0) return;

    // Add heat sprites
    heatData.forEach((point) => {
      const position = latLngToVector3(point.lat, point.lng, 1.002);

      // Create sprite for heat smudge
      const spriteMaterial = new THREE.SpriteMaterial({
        color: new THREE.Color(0xff1694),
        transparent: true,
        opacity: 0.08 + point.intensity * 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      const scale = 0.35 + point.intensity * 0.65;
      sprite.scale.set(scale, scale, 1);
      heatGroup.add(sprite);
    });

    console.log(`✨ Updated heat map with ${heatGroup.children.length} points`);
  }, [heatData, showHeat]);

  // ============================================================================
  // UPDATE TRAILS
  // ============================================================================

  useEffect(() => {
    if (!trailsGroupRef.current) return;

    const trailsGroup = trailsGroupRef.current;

    // Clear existing trails
    while (trailsGroup.children.length > 0) {
      const child = trailsGroup.children[0];
      if ((child as THREE.Line).geometry) {
        ((child as THREE.Line).geometry as THREE.BufferGeometry).dispose();
      }
      trailsGroup.remove(child);
    }

    if (!showTrails || trails.length === 0) return;

    // Add trail lines
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.18,
    });

    trails.forEach((trail) => {
      // Simple straight line (could be enhanced with great circle arcs)
      const fromPos = latLngToVector3(trail.from.lat, trail.from.lng, 1.01);
      const toPos = latLngToVector3(trail.to.lat, trail.to.lng, 1.01);

      const geometry = new THREE.BufferGeometry().setFromPoints([fromPos, toPos]);
      const line = new THREE.Line(geometry, trailMaterial);
      trailsGroup.add(line);
    });

    console.log(`✨ Updated trails with ${trailsGroup.children.length} connections`);
  }, [trails, showTrails]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`relative w-full h-full bg-black ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff1694] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              LOADING GLOBE...
            </p>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-black/90 border border-white/10 backdrop-blur-md p-3 max-w-xs">
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

      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 bg-black/90 border border-white/10 backdrop-blur-md p-3 max-w-xs">
        <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
          🎮 CONTROLS
        </p>
        <div className="space-y-1 text-white/50" style={{ fontWeight: 400, fontSize: '10px' }}>
          <p>• <strong>Drag</strong> - Rotate globe</p>
          <p>• <strong>Scroll</strong> - Zoom in/out</p>
          <p>• <strong>Right-click + Drag</strong> - Pan</p>
          <p>• <strong>Click marker</strong> - View details</p>
        </div>
      </div>
    </div>
  );
}
