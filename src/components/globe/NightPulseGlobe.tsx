/**
 * NIGHT PULSE GLOBE
 * Google Earth Pro-style 3D globe with full zoom, rotate, pan controls
 * Gay male nightlife venues and beacon heat visualization
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface BeaconHeatData {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    scans: number;
    city: string;
    country: string;
    beaconId: string;
    venueName?: string;
    venueType?: string;
  };
}

interface CityStats {
  city: string;
  country: string;
  scans: number;
  listeners: number;
  coordinates: [number, number];
  venueName?: string;
  venueType?: string;
}

interface NightPulseGlobeProps {
  onCityClick?: (city: CityStats) => void;
  timeWindow?: 'tonight' | 'weekend' | 'month';
}

export function NightPulseGlobe({ onCityClick, timeWindow = 'tonight' }: NightPulseGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [heatData, setHeatData] = useState<BeaconHeatData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityStats | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  // Gay nightlife mock data - major global cities
  const GAY_NIGHTLIFE_VENUES: BeaconHeatData[] = [
    // LONDON
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.1276, 51.5074] }, properties: { scans: 350, city: 'London', country: 'UK', beaconId: 'heaven-london', venueName: 'Heaven Nightclub', venueType: 'Nightclub' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.1340, 51.5155] }, properties: { scans: 280, city: 'London', country: 'UK', beaconId: 'gbar-soho', venueName: 'G-A-Y Bar Soho', venueType: 'Bar' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.0873, 51.5287] }, properties: { scans: 220, city: 'London', country: 'UK', beaconId: 'the-glory', venueName: 'The Glory', venueType: 'Performance Venue' }},
    
    // NEW YORK
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-73.9969, 40.7295] }, properties: { scans: 420, city: 'New York', country: 'USA', beaconId: 'stonewall', venueName: 'Stonewall Inn', venueType: 'Historic Bar' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-73.9918, 40.7337] }, properties: { scans: 380, city: 'New York', country: 'USA', beaconId: 'phoenix-nyc', venueName: 'The Phoenix', venueType: 'Nightclub' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-73.9857, 40.7614] }, properties: { scans: 315, city: 'New York', country: 'USA', beaconId: 'hells-kitchen', venueName: "Hell's Kitchen", venueType: 'Bar' }},
    
    // PARIS
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }, properties: { scans: 290, city: 'Paris', country: 'France', beaconId: 'le-marais', venueName: 'Le Marais District', venueType: 'Gay Quarter' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3470, 48.8606] }, properties: { scans: 245, city: 'Paris', country: 'France', beaconId: 'raidd-bar', venueName: 'Raidd Bar', venueType: 'Bar' }},
    
    // BERLIN
    { type: 'Feature', geometry: { type: 'Point', coordinates: [13.4050, 52.5200] }, properties: { scans: 480, city: 'Berlin', country: 'Germany', beaconId: 'berghain', venueName: 'Berghain', venueType: 'Techno Club' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [13.4110, 52.5145] }, properties: { scans: 395, city: 'Berlin', country: 'Germany', beaconId: 'lab-oratory', venueName: 'Lab.oratory', venueType: 'Cruise Club' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [13.4199, 52.5126] }, properties: { scans: 360, city: 'Berlin', country: 'Germany', beaconId: 'kitkat', venueName: 'KitKatClub', venueType: 'Sex Club' }},
    
    // AMSTERDAM
    { type: 'Feature', geometry: { type: 'Point', coordinates: [4.8952, 52.3676] }, properties: { scans: 340, city: 'Amsterdam', country: 'Netherlands', beaconId: 'reguliersdwarsstraat', venueName: 'Reguliersdwarsstraat', venueType: 'Gay Street' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [4.8889, 52.3758] }, properties: { scans: 295, city: 'Amsterdam', country: 'Netherlands', beaconId: 'church-ams', venueName: 'Church Amsterdam', venueType: 'Nightclub' }},
    
    // SAN FRANCISCO
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] }, properties: { scans: 410, city: 'San Francisco', country: 'USA', beaconId: 'castro', venueName: 'The Castro', venueType: 'Gay Neighborhood' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4335, 37.7604] }, properties: { scans: 355, city: 'San Francisco', country: 'USA', beaconId: 'oasis-sf', venueName: 'Oasis', venueType: 'Nightclub' }},
    
    // BARCELONA
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.1734, 41.3851] }, properties: { scans: 320, city: 'Barcelona', country: 'Spain', beaconId: 'eixample', venueName: 'Gaixample District', venueType: 'Gay Quarter' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.1686, 41.3874] }, properties: { scans: 275, city: 'Barcelona', country: 'Spain', beaconId: 'metro-disco', venueName: 'Metro Disco', venueType: 'Nightclub' }},
    
    // SYDNEY
    { type: 'Feature', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] }, properties: { scans: 370, city: 'Sydney', country: 'Australia', beaconId: 'arq-sydney', venueName: 'ARQ Sydney', venueType: 'Nightclub' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [151.2225, -33.8850] }, properties: { scans: 305, city: 'Sydney', country: 'Australia', beaconId: 'oxford-street', venueName: 'Oxford Street', venueType: 'Gay District' }},
    
    // TOKYO
    { type: 'Feature', geometry: { type: 'Point', coordinates: [139.7024, 35.6895] }, properties: { scans: 265, city: 'Tokyo', country: 'Japan', beaconId: 'shinjuku-nichome', venueName: 'Shinjuku Ni-chōme', venueType: 'Gay District' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [139.7065, 35.6920] }, properties: { scans: 230, city: 'Tokyo', country: 'Japan', beaconId: 'arty-farty', venueName: 'Arty Farty', venueType: 'Bar' }},
    
    // TEL AVIV
    { type: 'Feature', geometry: { type: 'Point', coordinates: [34.7818, 32.0853] }, properties: { scans: 310, city: 'Tel Aviv', country: 'Israel', beaconId: 'lima-lima', venueName: 'Lima Lima Bar', venueType: 'Bar' }},
    { type: 'Feature', geometry: { type: 'Point', coordinates: [34.7698, 32.0668] }, properties: { scans: 275, city: 'Tel Aviv', country: 'Israel', beaconId: 'shpagat', venueName: 'Shpagat', venueType: 'Nightclub' }},
    
    // MADRID
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-3.7038, 40.4168] }, properties: { scans: 300, city: 'Madrid', country: 'Spain', beaconId: 'chueca', venueName: 'Chueca District', venueType: 'Gay Neighborhood' }},
    
    // TORONTO
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-79.3832, 43.6532] }, properties: { scans: 285, city: 'Toronto', country: 'Canada', beaconId: 'church-wellesley', venueName: 'Church-Wellesley Village', venueType: 'Gay Village' }},
    
    // MEXICO CITY
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-99.1332, 19.4326] }, properties: { scans: 255, city: 'Mexico City', country: 'Mexico', beaconId: 'zona-rosa', venueName: 'Zona Rosa', venueType: 'Gay District' }},
    
    // SAO PAULO
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-46.6333, -23.5505] }, properties: { scans: 290, city: 'São Paulo', country: 'Brazil', beaconId: 'augusta', venueName: 'Rua Augusta', venueType: 'Gay Street' }},
    
    // BANGKOK
    { type: 'Feature', geometry: { type: 'Point', coordinates: [100.5018, 13.7563] }, properties: { scans: 240, city: 'Bangkok', country: 'Thailand', beaconId: 'silom', venueName: 'Silom Soi 4', venueType: 'Gay Street' }},
    
    // CAPE TOWN
    { type: 'Feature', geometry: { type: 'Point', coordinates: [18.4241, -33.9249] }, properties: { scans: 225, city: 'Cape Town', country: 'South Africa', beaconId: 'de-waterkant', venueName: 'De Waterkant', venueType: 'Gay District' }},
    
    // MIAMI
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-80.1340, 25.7907] }, properties: { scans: 330, city: 'Miami', country: 'USA', beaconId: 'south-beach', venueName: 'South Beach', venueType: 'Gay Beach Area' }},
    
    // LOS ANGELES
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-118.3617, 34.0901] }, properties: { scans: 345, city: 'Los Angeles', country: 'USA', beaconId: 'weho', venueName: 'West Hollywood', venueType: 'Gay City' }},
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('🌍 Initializing globe with dimensions:', width, 'x', height);

    // Scene setup
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

    // Orbit Controls - Google Earth style
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 1.5; // Close zoom
    controls.maxDistance = 20; // Far zoom
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controlsRef.current = controls;

    // Earth sphere with realistic shading
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

    // Add city lights texture effect
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

    // Markers group
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMarker: THREE.Mesh | null = null;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children.filter(c => c.userData.clickable));

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
      const intersects = raycaster.intersectObjects(markersGroup.children.filter(c => c.userData.clickable));

      if (intersects.length > 0) {
        const marker = intersects[0].object;
        const { city, country, scans, venueName, venueType, coordinates } = marker.userData;
        
        const cityStats: CityStats = {
          city,
          country,
          scans,
          listeners: Math.floor(scans * 0.3),
          coordinates,
          venueName,
          venueType,
        };
        
        setSelectedCity(cityStats);
        if (onCityClick) {
          onCityClick(cityStats);
        }

        // Zoom to marker
        const [lng, lat] = coordinates;
        const position = latLngToVector3(lat, lng, 1);
        const targetPosition = position.clone().multiplyScalar(2.5);
        
        // Animate camera
        const startPos = camera.position.clone();
        const duration = 1000;
        const startTime = Date.now();
        
        const animateZoom = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          camera.position.lerpVectors(startPos, targetPosition, eased);
          camera.lookAt(0, 0, 0);
          
          if (progress < 1) {
            requestAnimationFrame(animateZoom);
          }
        };
        animateZoom();
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onMouseClick);

    // Convert lat/lng to 3D position
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    };

    // Add markers function
    const addMarkers = (data: BeaconHeatData[]) => {
      // Clear existing
      while (markersGroup.children.length > 0) {
        markersGroup.remove(markersGroup.children[0]);
      }

      data.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const { scans, city, country, venueName, venueType } = feature.properties;

        const position = latLngToVector3(lat, lng, 1.02);

        // Color based on activity
        let color = new THREE.Color(0xffeb3b); // Yellow
        if (scans > 400) color = new THREE.Color(0xffffff); // White - mega hotspots
        else if (scans > 300) color = new THREE.Color(0xff1694); // Hot pink - major venues
        else if (scans > 200) color = new THREE.Color(0xff6b00); // Orange - popular spots
        else if (scans > 100) color = new THREE.Color(0xff9800); // Light orange

        const size = 0.008 + (scans / 500) * 0.03;

        // Outer glow
        const outerGeometry = new THREE.SphereGeometry(size * 4, 16, 16);
        const outerMaterial = new THREE.MeshBasicMaterial({
          color: 0x00d9ff,
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
          city,
          country,
          scans,
          venueName,
          venueType,
          coordinates: [lng, lat],
          clickable: true,
        };
        markersGroup.add(core);

        // Pulse animation
        (core as any).animate = () => {
          const scale = 1 + Math.sin(Date.now() * 0.002 + scans) * 0.3;
          core.scale.set(scale, scale, scale);
          outer.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
        };
      });

      console.log(`✨ Added ${data.length} venue markers to globe`);
    };

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Update zoom level for UI
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

    // Add initial data
    addMarkers(GAY_NIGHTLIFE_VENUES);
    setHeatData(GAY_NIGHTLIFE_VENUES);

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
    };
  }, []);

  // Load real heat data
  useEffect(() => {
    loadHeatData();
  }, [timeWindow]);

  const loadHeatData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/heat/heat?window=${timeWindow}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Heat data loaded from API:', data);
        // Merge with gay nightlife venues
        const mergedData = [...GAY_NIGHTLIFE_VENUES, ...(data.features || [])];
        setHeatData(mergedData);
        
        // Update markers
        if (markersGroupRef.current && sceneRef.current) {
          // Re-add markers logic would go here
        }
      }
    } catch (error) {
      console.error('Error loading heat data:', error);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff1694] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              LOADING GLOBAL NETWORK...
            </p>
          </div>
        </div>
      )}

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 bg-black/90 border border-[#ff1694]/30 backdrop-blur-md p-4 max-w-xs">
        <p className="text-[#ff1694] uppercase mb-2" style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em' }}>
          🌍 NIGHT PULSE GLOBAL
        </p>
        <p className="text-white mb-1" style={{ fontWeight: 900, fontSize: '24px' }}>
          {heatData.length} VENUES
        </p>
        <p className="text-white/60" style={{ fontWeight: 400, fontSize: '11px' }}>
          Gay male nightlife hotspots
        </p>
        <div className="mt-3 pt-3 border-t border-white/10">
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
          <p>• <strong>Click marker</strong> - Venue details</p>
        </div>
      </div>

      {/* Selected City Info */}
      {selectedCity && (
        <div className="absolute top-4 right-4 bg-gradient-to-br from-black via-black/95 to-[#ff1694]/20 border-2 border-[#ff1694] p-6 min-w-[320px] shadow-[0_0_40px_rgba(255,22,148,0.6)] backdrop-blur-xl">
          <button
            onClick={() => setSelectedCity(null)}
            className="absolute top-2 right-2 text-white/40 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
          
          {selectedCity.venueName && (
            <div className="mb-3">
              <div style={{ fontWeight: 900, fontSize: '20px', color: '#ff1694', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                {selectedCity.venueName}
              </div>
              <div style={{ fontWeight: 600, fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {selectedCity.venueType}
              </div>
            </div>
          )}
          
          <div style={{ fontWeight: 900, fontSize: '24px', marginBottom: '4px', color: '#ffffff', textTransform: 'uppercase' }}>
            {selectedCity.city}
          </div>
          <div style={{ fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase' }}>
            {selectedCity.country}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[rgba(255,22,148,0.1)] border-l-4 border-[#ff1694]">
              <div style={{ fontWeight: 700, fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                SCANS
              </div>
              <div style={{ fontWeight: 900, fontSize: '28px', color: '#ff1694' }}>
                {selectedCity.scans}
              </div>
            </div>
            <div className="p-3 bg-white/5 border-l-4 border-white/20">
              <div style={{ fontWeight: 700, fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ACTIVE
              </div>
              <div style={{ fontWeight: 900, fontSize: '28px', color: '#ffffff' }}>
                {selectedCity.listeners}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}