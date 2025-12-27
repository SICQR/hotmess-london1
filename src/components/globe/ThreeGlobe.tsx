/**
 * NIGHT PULSE GLOBE - Pure Three.js implementation
 * Google Earth-style globe with full controls
 * Gay male nightlife venues worldwide
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface VenueData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  city: string;
  country: string;
  scans: number;
  venueName: string;
  venueType: string;
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

interface ThreeGlobeProps {
  onCityClick?: (city: CityStats) => void;
  timeWindow?: 'tonight' | 'weekend' | 'month';
}

export function ThreeGlobeComponent({ onCityClick, timeWindow = 'tonight' }: ThreeGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [heatData, setHeatData] = useState<VenueData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityStats | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  // Gay nightlife venues worldwide
  const GAY_VENUES: VenueData[] = [
    // LONDON
    { lat: 51.5074, lng: -0.1276, size: 1.2, color: '#ffffff', city: 'London', country: 'UK', scans: 450, venueName: 'Heaven Nightclub', venueType: 'Nightclub' },
    { lat: 51.5155, lng: -0.1340, size: 1.0, color: '#ff1694', city: 'London', country: 'UK', scans: 380, venueName: 'G-A-Y Bar Soho', venueType: 'Bar' },
    { lat: 51.5287, lng: -0.0873, size: 0.9, color: '#ff1694', city: 'London', country: 'UK', scans: 320, venueName: 'The Glory', venueType: 'Performance Venue' },
    
    // NEW YORK
    { lat: 40.7295, lng: -73.9969, size: 1.5, color: '#ffffff', city: 'New York', country: 'USA', scans: 520, venueName: 'Stonewall Inn', venueType: 'Historic Bar' },
    { lat: 40.7337, lng: -73.9918, size: 1.3, color: '#ffffff', city: 'New York', country: 'USA', scans: 480, venueName: 'The Phoenix', venueType: 'Nightclub' },
    { lat: 40.7614, lng: -73.9857, size: 1.1, color: '#ff1694', city: 'New York', country: 'USA', scans: 415, venueName: "Hell's Kitchen", venueType: 'Bar' },
    
    // BERLIN
    { lat: 52.5200, lng: 13.4050, size: 1.6, color: '#ffffff', city: 'Berlin', country: 'Germany', scans: 580, venueName: 'Berghain', venueType: 'Techno Club' },
    { lat: 52.5145, lng: 13.4110, size: 1.3, color: '#ffffff', city: 'Berlin', country: 'Germany', scans: 495, venueName: 'Lab.oratory', venueType: 'Cruise Club' },
    { lat: 52.5126, lng: 13.4199, size: 1.2, color: '#ff1694', city: 'Berlin', country: 'Germany', scans: 460, venueName: 'KitKatClub', venueType: 'Sex Club' },
    
    // PARIS
    { lat: 48.8566, lng: 2.3522, size: 1.0, color: '#ff1694', city: 'Paris', country: 'France', scans: 390, venueName: 'Le Marais District', venueType: 'Gay Quarter' },
    { lat: 48.8606, lng: 2.3470, size: 0.9, color: '#ff6b00', city: 'Paris', country: 'France', scans: 345, venueName: 'Raidd Bar', venueType: 'Bar' },
    
    // AMSTERDAM
    { lat: 52.3676, lng: 4.8952, size: 1.2, color: '#ff1694', city: 'Amsterdam', country: 'Netherlands', scans: 440, venueName: 'Reguliersdwarsstraat', venueType: 'Gay Street' },
    { lat: 52.3758, lng: 4.8889, size: 1.0, color: '#ff1694', city: 'Amsterdam', country: 'Netherlands', scans: 395, venueName: 'Church Amsterdam', venueType: 'Nightclub' },
    
    // SAN FRANCISCO
    { lat: 37.7749, lng: -122.4194, size: 1.4, color: '#ffffff', city: 'San Francisco', country: 'USA', scans: 510, venueName: 'The Castro', venueType: 'Gay Neighborhood' },
    { lat: 37.7604, lng: -122.4335, size: 1.2, color: '#ff1694', city: 'San Francisco', country: 'USA', scans: 455, venueName: 'Oasis', venueType: 'Nightclub' },
    
    // BARCELONA
    { lat: 41.3851, lng: 2.1734, size: 1.1, color: '#ff1694', city: 'Barcelona', country: 'Spain', scans: 420, venueName: 'Gaixample District', venueType: 'Gay Quarter' },
    { lat: 41.3874, lng: 2.1686, size: 0.95, color: '#ff6b00', city: 'Barcelona', country: 'Spain', scans: 375, venueName: 'Metro Disco', venueType: 'Nightclub' },
    
    // SYDNEY
    { lat: -33.8688, lng: 151.2093, size: 1.3, color: '#ff1694', city: 'Sydney', country: 'Australia', scans: 470, venueName: 'ARQ Sydney', venueType: 'Nightclub' },
    { lat: -33.8850, lng: 151.2225, size: 1.1, color: '#ff1694', city: 'Sydney', country: 'Australia', scans: 405, venueName: 'Oxford Street', venueType: 'Gay District' },
    
    // TOKYO
    { lat: 35.6895, lng: 139.7024, size: 1.0, color: '#ff6b00', city: 'Tokyo', country: 'Japan', scans: 365, venueName: 'Shinjuku Ni-chōme', venueType: 'Gay District' },
    { lat: 35.6920, lng: 139.7065, size: 0.85, color: '#ff6b00', city: 'Tokyo', country: 'Japan', scans: 330, venueName: 'Arty Farty', venueType: 'Bar' },
    
    // TEL AVIV
    { lat: 32.0853, lng: 34.7818, size: 1.1, color: '#ff1694', city: 'Tel Aviv', country: 'Israel', scans: 410, venueName: 'Lima Lima Bar', venueType: 'Bar' },
    { lat: 32.0668, lng: 34.7698, size: 0.95, color: '#ff6b00', city: 'Tel Aviv', country: 'Israel', scans: 375, venueName: 'Shpagat', venueType: 'Nightclub' },
    
    // MADRID
    { lat: 40.4168, lng: -3.7038, size: 1.05, color: '#ff1694', city: 'Madrid', country: 'Spain', scans: 400, venueName: 'Chueca District', venueType: 'Gay Neighborhood' },
    
    // TORONTO
    { lat: 43.6532, lng: -79.3832, size: 1.0, color: '#ff6b00', city: 'Toronto', country: 'Canada', scans: 385, venueName: 'Church-Wellesley Village', venueType: 'Gay Village' },
    
    // MEXICO CITY
    { lat: 19.4326, lng: -99.1332, size: 0.9, color: '#ff6b00', city: 'Mexico City', country: 'Mexico', scans: 355, venueName: 'Zona Rosa', venueType: 'Gay District' },
    
    // SAO PAULO
    { lat: -23.5505, lng: -46.6333, size: 1.0, color: '#ff6b00', city: 'São Paulo', country: 'Brazil', scans: 390, venueName: 'Rua Augusta', venueType: 'Gay Street' },
    
    // BANGKOK
    { lat: 13.7563, lng: 100.5018, size: 0.85, color: '#ff9800', city: 'Bangkok', country: 'Thailand', scans: 340, venueName: 'Silom Soi 4', venueType: 'Gay Street' },
    
    // CAPE TOWN
    { lat: -33.9249, lng: 18.4241, size: 0.8, color: '#ff9800', city: 'Cape Town', country: 'South Africa', scans: 325, venueName: 'De Waterkant', venueType: 'Gay District' },
    
    // MIAMI
    { lat: 25.7907, lng: -80.1340, size: 1.15, color: '#ff1694', city: 'Miami', country: 'USA', scans: 430, venueName: 'South Beach', venueType: 'Gay Beach Area' },
    
    // LOS ANGELES
    { lat: 34.0901, lng: -118.3617, size: 1.2, color: '#ff1694', city: 'Los Angeles', country: 'USA', scans: 445, venueName: 'West Hollywood', venueType: 'Gay City' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('🌍 Initializing pure Three.js globe:', width, 'x', height);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    console.log('✅ Renderer created and appended');

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.0;

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      emissive: 0x0a0a0a,
      shininess: 10,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    console.log('✅ Earth sphere added');

    // Atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.4 },
        p: { value: 6.5 },
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
          gl_FragColor = vec4(glow, intensity * 0.7);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xff1694, 0.5);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices: number[] = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    console.log('✅ Stars added');

    // Convert lat/lng to 3D position
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    };

    // Add venue markers
    const markerMeshes: Array<{ mesh: THREE.Mesh; venue: VenueData }> = [];
    
    GAY_VENUES.forEach((venue) => {
      const position = latLngToVector3(venue.lat, venue.lng, 1.02);

      // Outer glow
      const outerSize = 0.02 + (venue.scans / 500) * 0.04;
      const outerGeometry = new THREE.SphereGeometry(outerSize * 3, 16, 16);
      const outerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.15,
      });
      const outer = new THREE.Mesh(outerGeometry, outerMaterial);
      outer.position.copy(position);
      scene.add(outer);

      // Middle glow
      const middleGeometry = new THREE.SphereGeometry(outerSize * 2, 16, 16);
      const middleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff1694,
        transparent: true,
        opacity: 0.3,
      });
      const middle = new THREE.Mesh(middleGeometry, middleMaterial);
      middle.position.copy(position);
      scene.add(middle);

      // Core marker
      const coreGeometry = new THREE.SphereGeometry(outerSize, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(venue.color),
        transparent: true,
        opacity: 1,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.copy(position);
      core.userData = { venue };
      scene.add(core);

      markerMeshes.push({ mesh: core, venue });

      // Store for animation
      (core as any).outerMesh = outer;
      (core as any).middleMesh = middle;
    });

    console.log(`✅ Added ${GAY_VENUES.length} venue markers`);
    setHeatData(GAY_VENUES);

    // Click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(markerMeshes.map(m => m.mesh));
      
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const venue = clickedMesh.userData.venue as VenueData;
        
        const cityStats: CityStats = {
          city: venue.city,
          country: venue.country,
          scans: venue.scans,
          listeners: Math.floor(venue.scans * 0.3),
          coordinates: [venue.lng, venue.lat],
          venueName: venue.venueName,
          venueType: venue.venueType,
        };
        
        console.log('🎯 Clicked venue:', venue.venueName);
        setSelectedCity(cityStats);
        if (onCityClick) {
          onCityClick(cityStats);
        }
      }
    };

    renderer.domElement.addEventListener('click', onCanvasClick);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      controls.update();

      // Update zoom level
      const distance = camera.position.length();
      setZoomLevel(Math.round((1 - (distance - 1.5) / (10 - 1.5)) * 100));

      // Slow auto-rotation
      earth.rotation.y += 0.001;
      glow.rotation.y += 0.001;

      // Animate markers
      markerMeshes.forEach(({ mesh }, index) => {
        const pulse = Math.sin(Date.now() * 0.002 + index) * 0.3 + 1;
        mesh.scale.set(pulse, pulse, pulse);
        
        if ((mesh as any).outerMesh) {
          (mesh as any).outerMesh.scale.set(pulse * 0.8, pulse * 0.8, pulse * 0.8);
        }
        if ((mesh as any).middleMesh) {
          (mesh as any).middleMesh.scale.set(pulse * 0.9, pulse * 0.9, pulse * 0.9);
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);
    console.log('✅ Animation started');

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up globe');
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
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
          <p>• <strong>Hover marker</strong> - Quick info</p>
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