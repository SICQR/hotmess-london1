// src/components/LiveGlobe3D.tsx
// HOTMESS NIGHTLIFE CONTROL GLOBE — End-to-end
// FORCE RELOAD v2 - Updated to use three-singleton (fixes multiple instance warning)
// Layers: PINS / HEAT / TRAILS / CITIES (real Three.js objects, toggled live)
// Includes: CSS2D city labels attached to globe, beacon pins with glow + pulse,
// heat smudges, great-circle trails, raycast click handlers.
//
// Install deps:
//   npm i three
//
// Usage (from your BeaconsGlobeEnhanced page):
//   <LiveGlobe3D
//     className="w-full h-full"
//     layers={layers}
//     beacons={beacons}
//     onBeaconClick={(b) => openDrawer(b)}
//     onCityClick={(c) => flyTo(c)}
//   />

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "../lib/three-singleton";
import { CSS2DRenderer, CSS2DObject } from "../lib/three-singleton";

// ✅ VERIFY BUILD: If you see this timestamp in browser console, you have the NEW build
console.log("🌍 ✅ LiveGlobe3D v2.0 LOADED | Build:", new Date().toISOString(), "| Using three-singleton (Single Three.js instance)");

export type City = {
  name: string;
  lat: number;
  lng: number;
  tier: 1 | 2 | 3;
  active?: boolean;
  sponsored?: boolean;
};

export type Beacon = {
  id: string;
  title?: string;
  kind?: "drop" | "event" | "product" | "sponsor" | "checkin" | "other";
  lat: number;
  lng: number;
  city?: string;
  sponsored?: boolean;
  intensity?: number; // 0..1 (optional)
  ts?: number; // epoch ms (optional)
};

export type GlobeLayers = {
  pins: boolean;
  heat: boolean;
  trails: boolean;
  cities: boolean;
};

type Props = {
  className?: string;

  /** Layer toggles from your UI pills */
  layers?: GlobeLayers;

  /** Use your backend feed here. Empty array is valid. */
  beacons?: Beacon[];

  /** Optional: pass your own cities list; if omitted, defaults are used */
  cities?: City[];

  /** Optional: a real equirectangular satellite texture URL */
  satelliteTextureUrl?: string;

  /** Optional: localStorage consent key for external tiles */
  consentKey?: string;

  /** Beacon click (raycast on 3D pins) */
  onBeaconClick?: (beacon: Beacon) => void;

  /** City click (CSS2D label click) */
  onCityClick?: (city: City) => void;
};

const DEFAULT_LAYERS: GlobeLayers = {
  pins: true,
  heat: false,
  trails: false,
  cities: true,
};

const DEFAULT_CITIES: City[] = [
  { name: "LONDON", lat: 51.5074, lng: -0.1278, tier: 1, active: true },
  { name: "BERLIN", lat: 52.52, lng: 13.405, tier: 1 },
  { name: "PARIS", lat: 48.8566, lng: 2.3522, tier: 1 },
  { name: "AMSTERDAM", lat: 52.3676, lng: 4.9041, tier: 1 },
  { name: "MADRID", lat: 40.4168, lng: -3.7038, tier: 1 },
  { name: "ROME", lat: 41.9028, lng: 12.4964, tier: 1 },
  { name: "NEW YORK", lat: 40.7128, lng: -74.006, tier: 1 },
  { name: "LOS ANGELES", lat: 34.0522, lng: -118.2437, tier: 1 },
  { name: "MIAMI", lat: 25.7617, lng: -80.1918, tier: 1 },
  { name: "TORONTO", lat: 43.6532, lng: -79.3832, tier: 1 },
  { name: "SÃO PAULO", lat: -23.5505, lng: -46.6333, tier: 1 },
  { name: "CAPE TOWN", lat: -33.9249, lng: 18.4241, tier: 1 },
  { name: "DUBAI", lat: 25.2048, lng: 55.2708, tier: 1 },
  { name: "TEL AVIV", lat: 32.0853, lng: 34.7818, tier: 1 },
  { name: "TOKYO", lat: 35.6762, lng: 139.6503, tier: 1 },
  { name: "SEOUL", lat: 37.5665, lng: 126.978, tier: 1 },
  { name: "HONG KONG", lat: 22.3193, lng: 114.1694, tier: 1 },
  { name: "BANGKOK", lat: 13.7563, lng: 100.5018, tier: 1 },
  { name: "SINGAPORE", lat: 1.3521, lng: 103.8198, tier: 1 },
  { name: "SYDNEY", lat: -33.8688, lng: 151.2093, tier: 1 },

  { name: "MANCHESTER", lat: 53.4808, lng: -2.2426, tier: 2 },
  { name: "GLASGOW", lat: 55.8642, lng: -4.2518, tier: 2 },
  { name: "DUBLIN", lat: 53.3498, lng: -6.2603, tier: 2 },
  { name: "COPENHAGEN", lat: 55.6761, lng: 12.5683, tier: 2 },
  { name: "STOCKHOLM", lat: 59.3293, lng: 18.0686, tier: 2 },
  { name: "VIENNA", lat: 48.2082, lng: 16.3738, tier: 2 },
  { name: "PRAGUE", lat: 50.0755, lng: 14.4378, tier: 2 },
  { name: "WARSAW", lat: 52.2297, lng: 21.0122, tier: 2 },
  { name: "ATHENS", lat: 37.9838, lng: 23.7275, tier: 2 },
  { name: "ISTANBUL", lat: 41.0082, lng: 28.9784, tier: 2 },
  { name: "SAN FRANCISCO", lat: 37.7749, lng: -122.4194, tier: 2 },
  { name: "LAS VEGAS", lat: 36.1699, lng: -115.1398, tier: 2 },
  { name: "WASHINGTON DC", lat: 38.9072, lng: -77.0369, tier: 2 },
  { name: "ATLANTA", lat: 33.749, lng: -84.388, tier: 2 },
  { name: "VANCOUVER", lat: 49.2827, lng: -123.1207, tier: 2 },
  { name: "BOGOTÁ", lat: 4.711, lng: -74.0721, tier: 2 },
  { name: "SANTIAGO", lat: -33.4489, lng: -70.6693, tier: 2 },
  { name: "LIMA", lat: -12.0464, lng: -77.0428, tier: 2 },
  { name: "BEIJING", lat: 39.9042, lng: 116.4074, tier: 2 },
  { name: "SHANGHAI", lat: 31.2304, lng: 121.4737, tier: 2 },
  { name: "TAIPEI", lat: 25.033, lng: 121.5654, tier: 2 },
  { name: "MANILA", lat: 14.5995, lng: 120.9842, tier: 2 },
  { name: "KUALA LUMPUR", lat: 3.139, lng: 101.6869, tier: 2 },
  { name: "JAKARTA", lat: -6.2088, lng: 106.8456, tier: 2 },
  { name: "MUMBAI", lat: 19.076, lng: 72.8777, tier: 2 },
  { name: "DELHI", lat: 28.6139, lng: 77.209, tier: 2 },
  { name: "BRISBANE", lat: -27.4698, lng: 153.0251, tier: 2 },
  { name: "AUCKLAND", lat: -36.8485, lng: 174.7633, tier: 2 },
];

function injectStylesOnce(id: string, css: string) {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

const HOTMESS_CSS = `
:root{
  --hm-ink:#050505;
  --hm-line:rgba(255,255,255,.22);
  --hm-line-strong:rgba(255,255,255,.45);
  --hm-text:rgba(255,255,255,.92);
  --hm-text-dim:rgba(255,255,255,.68);
  --hm-live:#ff1744;
}
/* CSS2D City labels */
.hm-city-stamp{position:relative;will-change:transform,opacity;user-select:none;}
.hm-city-pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:6px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.30);
  background:rgba(0,0,0,.86);
  box-shadow:0 10px 30px rgba(0,0,0,.45);
}
.hm-city-dot{width:6px;height:6px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:0 0 0 1px rgba(0,0,0,.65) inset;}
.hm-city-name{color:rgba(255,255,255,.92);font-size:10px;letter-spacing:.28em;text-transform:uppercase;line-height:1;white-space:nowrap;}
.hm-city-pill--active{border-color:rgba(255,23,68,.55);}
.hm-city-dot--active{background:var(--hm-live);box-shadow:0 0 18px rgba(255,23,68,.65);}
.hm-city-badges{display:flex;gap:6px;margin-top:6px;padding-left:14px;}
.hm-badge{
  display:inline-flex;align-items:center;
  padding:3px 7px;border-radius:999px;
  font-size:8px;letter-spacing:.24em;text-transform:uppercase;
  border:1px solid rgba(255,255,255,.38);
  background:rgba(0,0,0,.75);
  color:rgba(255,255,255,.92);
}
.hm-badge--active{background:var(--hm-live);border-color:rgba(255,255,255,.65);box-shadow:0 0 18px rgba(255,23,68,.55);}
.hm-badge--sponsored{background:#fff;border-color:#fff;color:#000;}
`;

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function getCitiesByZoom(cameraZ: number, cities: City[]) {
  // tuned for radius ~1.35 + camera z [2.1..5.6]
  if (cameraZ > 3.5) return cities.filter((c) => c.tier === 1);
  if (cameraZ > 2.5) return cities.filter((c) => c.tier <= 2);
  return cities;
}

function makeProceduralSatelliteTexture(size = 1024) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = Math.random();
    const v = 18 + n * 55;
    d[i] = v * 0.9;
    d[i + 1] = v * 1.05;
    d[i + 2] = v * 1.1;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const blobs = 95;
  for (let i = 0; i < blobs; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 18 + Math.random() * 110;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(70,85,70,0.55)");
    grd.addColorStop(0.6, "rgba(35,45,35,0.30)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * canvas.height + (Math.random() - 0.5) * 20;
    ctx.fillStyle = "white";
    ctx.fillRect(0, y, canvas.width, 8 + Math.random() * 12);
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// Simple radial glow texture for sprites (beacon glow + heat smudges)
function makeRadialSpriteTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grd.addColorStop(0.6, "rgba(255,255,255,0.15)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Great-circle arc points between two lat/lngs
function greatCircleArc(a: { lat: number; lng: number }, b: { lat: number; lng: number }, radius: number, segments = 64) {
  const va = latLngToVector3(a.lat, a.lng, 1).normalize();
  const vb = latLngToVector3(b.lat, b.lng, 1).normalize();
  const omega = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1));
  const sinOmega = Math.sin(omega);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const s1 = sinOmega === 0 ? 1 - t : Math.sin((1 - t) * omega) / sinOmega;
    const s2 = sinOmega === 0 ? t : Math.sin(t * omega) / sinOmega;
    const v = new THREE.Vector3().copy(va).multiplyScalar(s1).add(new THREE.Vector3().copy(vb).multiplyScalar(s2)).normalize();
    // Lift: more distance -> higher arc
    const lift = 0.05 + 0.20 * (omega / Math.PI);
    pts.push(v.multiplyScalar(radius * (1 + lift * Math.sin(Math.PI * t))));
  }
  return pts;
}

export default function LiveGlobe3D({
  className,
  layers,
  beacons,
  cities,
  satelliteTextureUrl,
  consentKey = "hotmess_external_tiles_ok",
  onBeaconClick,
  onCityClick,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // DEBUG: Log when component renders
  console.log("🌍 LiveGlobe3D RENDER called", { layers, beaconsCount: beacons?.length, citiesCount: cities?.length });

  const layersResolved = useMemo(() => ({ ...DEFAULT_LAYERS, ...(layers ?? {}) }), [layers]);
  const citiesResolved = useMemo(() => cities ?? DEFAULT_CITIES, [cities]);
  const beaconsResolved = useMemo<Beacon[]>(
    () =>
      beacons ??
      [
        // fallback demo pins (remove when live)
        { id: "b1", title: "HOTMESS", kind: "event", lat: 51.5074, lng: -0.1278, city: "LONDON", intensity: 1, ts: Date.now() },
        { id: "b2", title: "DROP", kind: "drop", lat: 52.52, lng: 13.405, city: "BERLIN", intensity: 0.6, ts: Date.now() - 1000 * 60 * 25 },
        { id: "b3", title: "SPONSORED", kind: "sponsor", lat: 40.7128, lng: -74.006, city: "NEW YORK", sponsored: true, intensity: 0.8, ts: Date.now() - 1000 * 60 * 90 },
      ],
    [beacons]
  );

  // Mode (kept)
  const [mode, setMode] = useState<"hotmess" | "satellite">("hotmess");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => injectStylesOnce("hotmess-globe-css2d", HOTMESS_CSS), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Scene / Camera / Renderers ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505");

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.inset = "0";
    labelRenderer.domElement.style.pointerEvents = "none"; // allow canvas drag
    mount.appendChild(labelRenderer.domElement);

    // --- Resize ---
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(6, 8, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-10, 2, -10);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, 0.18);
    fill.position.set(0, -6, 8);
    scene.add(fill);

    // --- Globe root ---
    const globe = new THREE.Group();
    scene.add(globe);

    const globeRadius = 1.35;

    // Materials (HOTMESS + SAT)
    const oceanHotmessMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a4a7a"), // Deep ocean blue
      roughness: 0.85,
      metalness: 0.08,
    });

    const satelliteFallback = makeProceduralSatelliteTexture(1024);
    let satelliteDispose: THREE.Texture | null = satelliteFallback;

    const satelliteMat = new THREE.MeshStandardMaterial({
      map: satelliteFallback,
      color: new THREE.Color("#3b3b3b"), // ink-wash
      roughness: 0.95,
      metalness: 0.0,
    });

    if (satelliteTextureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        satelliteTextureUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          satelliteMat.map = tex;
          satelliteMat.needsUpdate = true;
          if (satelliteDispose) {
            satelliteDispose.dispose();
            satelliteDispose = null;
          }
        },
        undefined,
        () => {
          // keep fallback
        }
      );
    }

    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphere = new THREE.Mesh(sphereGeo, oceanHotmessMat);
    globe.add(sphere);

    // Grid
    const gridGroup = new THREE.Group();
    globe.add(gridGroup);
    const gridMat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.12,
    });

    const ringCount = 18;
    for (let i = 1; i < ringCount; i++) {
      const lat = -80 + (160 * i) / ringCount;
      const r = globeRadius * Math.cos((lat * Math.PI) / 180);
      const y = globeRadius * Math.sin((lat * Math.PI) / 180);
      const pts = new Array(128).fill(0).map((_, idx) => {
        const t = (idx / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r);
      });
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      gridGroup.add(new THREE.LineLoop(geo, gridMat));
    }

    const lonCount = 24;
    for (let i = 0; i < lonCount; i++) {
      const lng = (i / lonCount) * Math.PI * 2;
      const pts = new Array(128).fill(0).map((_, idx) => {
        const t = (idx / 127) * Math.PI - Math.PI / 2;
        return new THREE.Vector3(
          Math.cos(t) * Math.cos(lng) * globeRadius,
          Math.sin(t) * globeRadius,
          Math.cos(t) * Math.sin(lng) * globeRadius
        );
      });
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      gridGroup.add(new THREE.Line(geo, gridMat));
    }

    // --- LAYERS GROUPS (real toggles) ---
    const layerRoot = new THREE.Group();
    globe.add(layerRoot);

    const pinsGroup = new THREE.Group();
    const heatGroup = new THREE.Group();
    const trailsGroup = new THREE.Group();
    layerRoot.add(pinsGroup, heatGroup, trailsGroup);

    // helper: apply layer toggles
    const applyLayers = (l: GlobeLayers) => {
      pinsGroup.visible = !!l.pins;
      heatGroup.visible = !!l.heat;
      trailsGroup.visible = !!l.trails;
    };

    // helper: apply mode (material swap)
    const applyMode = (m: "hotmess" | "satellite") => {
      sphere.material = m === "satellite" ? satelliteMat : oceanHotmessMat;
      gridMat.opacity = m === "satellite" ? 0.08 : 0.12;
      rim.intensity = m === "satellite" ? 0.62 : 0.55;
      (sphere.material as THREE.Material).needsUpdate = true;
      gridMat.needsUpdate = true;
    };
    applyMode(modeRef.current);
    applyLayers(layersResolved);

    // --- CITY CSS2D Labels ---
    const tmp = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const cityLabels: Array<{ city: City; obj: CSS2DObject; el: HTMLDivElement }> = [];

    const makeCityEl = (city: City) => {
      const el = document.createElement("div");
      el.className = "hm-city-stamp";
      el.dataset.tier = String(city.tier);
      el.style.pointerEvents = "auto"; // clickable
      el.style.cursor = "pointer";

      const active = !!city.active;
      const sponsored = !!city.sponsored;

      el.innerHTML = `
        <div class="hm-city-pill ${active ? "hm-city-pill--active" : ""}">
          <span class="hm-city-dot ${active ? "hm-city-dot--active" : ""}"></span>
          <span class="hm-city-name">${city.name}</span>
        </div>
        <div class="hm-city-badges" style="display:${active || sponsored ? "flex" : "none"}">
          ${active ? `<span class="hm-badge hm-badge--active">ACTIVE</span>` : ""}
          ${sponsored ? `<span class="hm-badge hm-badge--sponsored">SPONSORED</span>` : ""}
        </div>
      `;

      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        onCityClick?.(city);
      });

      return el;
    };

    // Note: CSS2DRenderer root is pointer-events none, but individual els are auto.
    for (const city of citiesResolved) {
      const el = makeCityEl(city);
      const obj = new CSS2DObject(el);
      obj.position.copy(latLngToVector3(city.lat, city.lng, globeRadius * 1.02));
      globe.add(obj);
      cityLabels.push({ city, obj, el });
    }

    // --- Beacon PINS (3D) ---
    // We build pins as individual meshes for click mapping; you can upgrade to InstancedMesh later.
    const beaconPinGeo = new THREE.SphereGeometry(0.015, 16, 16);

    const beaconPinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.55,
      metalness: 0.15,
      emissive: new THREE.Color("#111111"),
      emissiveIntensity: 0.25,
    });

    const beaconPinActiveMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.35,
      metalness: 0.15,
      emissive: new THREE.Color("#ff1744"),
      emissiveIntensity: 0.85,
    });

    const glowTex = makeRadialSpriteTexture(128);

    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: new THREE.Color("#ff1744"),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sponsoredGlowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: new THREE.Color("#ffffff"),
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // store mapping for click
    const beaconMeshes: Array<{ beacon: Beacon; mesh: THREE.Object3D }> = [];

    const rebuildPins = (list: Beacon[]) => {
      // clear
      while (pinsGroup.children.length) {
        const child = pinsGroup.children.pop()!;
        child.traverse((o) => {
          const m = (o as any).material as THREE.Material | undefined;
          const g = (o as any).geometry as THREE.BufferGeometry | undefined;
          if (g) g.dispose?.();
          if (m) m.dispose?.();
        });
      }
      beaconMeshes.length = 0;

      for (const b of list) {
        const intensity = THREE.MathUtils.clamp(b.intensity ?? 0.6, 0.05, 1);
        const isHot = intensity > 0.75 || b.kind === "event" || b.kind === "drop";

        const p = latLngToVector3(b.lat, b.lng, globeRadius * 1.01);

        const root = new THREE.Group();
        root.position.copy(p);

        // orient outward
        root.lookAt(new THREE.Vector3(0, 0, 0));
        root.rotateX(Math.PI); // outward

        // pin head
        const pin = new THREE.Mesh(beaconPinGeo, isHot ? beaconPinActiveMat : beaconPinMat);
        pin.position.set(0, 0, 0);
        root.add(pin);

        // glow sprite
        const sprite = new THREE.Sprite(b.sponsored ? sponsoredGlowMat : glowMat);
        const s = 0.22 + intensity * 0.25;
        sprite.scale.set(s, s, 1);
        sprite.position.set(0, 0, 0);
        root.add(sprite);

        // subtle "tower" for depth (optional, still brutal)
        const towerGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.09 + intensity * 0.22, 10);
        const towerMat = new THREE.MeshBasicMaterial({
          color: b.sponsored ? 0xffffff : 0xff1744,
          transparent: true,
          opacity: b.sponsored ? 0.22 : 0.18,
          depthWrite: false,
        });
        const tower = new THREE.Mesh(towerGeo, towerMat);
        tower.position.set(0, 0.05 + intensity * 0.06, 0);
        root.add(tower);

        // tag mesh for raycasting
        (root as any).userData = { type: "beacon", beaconId: b.id };
        (pin as any).userData = { type: "beacon", beaconId: b.id };
        (sprite as any).userData = { type: "beacon", beaconId: b.id };
        (tower as any).userData = { type: "beacon", beaconId: b.id };

        pinsGroup.add(root);
        beaconMeshes.push({ beacon: b, mesh: root });
      }
    };

    rebuildPins(beaconsResolved);

    // --- HEAT (ink smudge sprites on globe surface) ---
    const heatTex = makeRadialSpriteTexture(128);

    const rebuildHeat = (list: Beacon[]) => {
      while (heatGroup.children.length) {
        const c = heatGroup.children.pop()!;
        if ((c as any).material?.map) ((c as any).material.map as THREE.Texture).dispose?.();
        (c as any).material?.dispose?.();
      }

      for (const b of list) {
        const intensity = THREE.MathUtils.clamp(b.intensity ?? 0.5, 0.05, 1);
        const p = latLngToVector3(b.lat, b.lng, globeRadius * 1.002);

        const smudge = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: heatTex,
            color: new THREE.Color("#ff1744"),
            transparent: true,
            opacity: 0.08 + intensity * 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );

        smudge.position.copy(p);
        // scale: subtle and layered
        const s = 0.35 + intensity * 0.65;
        smudge.scale.set(s, s, 1);
        heatGroup.add(smudge);
      }
    };

    rebuildHeat(beaconsResolved);

    // --- TRAILS (great-circle arcs between recent beacons) ---
    const trailMat = new THREE.LineBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.18,
    });

    const rebuildTrails = (list: Beacon[]) => {
      while (trailsGroup.children.length) {
        const c = trailsGroup.children.pop()!;
        const g = (c as any).geometry as THREE.BufferGeometry | undefined;
        if (g) g.dispose?.();
      }

      // Sort by time if present; otherwise keep original
      const sorted = [...list].sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
      if (sorted.length < 2) return;

      // last N points to connect
      const last = sorted.slice(Math.max(0, sorted.length - 12));

      for (let i = 0; i < last.length - 1; i++) {
        const a = last[i];
        const b = last[i + 1];
        const pts = greatCircleArc(a, b, globeRadius * 1.01, 72);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, trailMat);
        trailsGroup.add(line);
      }
    };

    rebuildTrails(beaconsResolved);

    // Apply initial layer visibility
    applyLayers(layersResolved);
    // city label layer is handled in render loop (so we can still cull by hemisphere/tier)
    // but we also enforce the on/off toggle by forcing display none
    const cityLayerOnRef = { current: layersResolved.cities };

    // --- Interaction: drag rotate + inertia, wheel zoom ---
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const rotSpeed = 0.004;
      globe.rotation.y += dx * rotSpeed;
      globe.rotation.x += dy * rotSpeed;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x, -0.9, 0.9);

      velX = dx * rotSpeed * 0.35;
      velY = dy * rotSpeed * 0.35;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + delta * 0.18, 2.1, 5.6);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // --- Raycast clicking on beacon pins ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      // don't click while dragging
      if (Math.abs(velX) > 0.001 || Math.abs(velY) > 0.001) return;
      if (!layersResolved.pins) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.set(x, y);

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(pinsGroup.children, true);
      if (!intersects.length) return;

      const hit = intersects[0].object;
      const bid = (hit as any).userData?.beaconId;
      if (!bid) return;

      const b = beaconsResolved.find((bb) => bb.id === bid);
      if (!b) return;

      onBeaconClick?.(b);
    };

    renderer.domElement.addEventListener("click", onClick);

    // --- Animation loop: label culling + pulses ---
    let raf = 0;
    const t0 = performance.now();

    function animate() {
      raf = requestAnimationFrame(animate);

      // inertia
      if (!isDragging) {
        globe.rotation.y += velX;
        globe.rotation.x += velY;
        velX *= 0.93;
        velY *= 0.93;
      }

      // pulse beacon glows
      const t = (performance.now() - t0) / 1000;
      for (const child of pinsGroup.children) {
        // find sprite child
        for (const c of (child as THREE.Group).children) {
          if (c.type === "Sprite") {
            const spr = c as THREE.Sprite;
            const base = 0.35;
            spr.material.opacity = base + 0.18 * (0.5 + 0.5 * Math.sin(t * 2.1));
          }
        }
      }

      // city label hemisphere + zoom tiers
      camDir.copy(camera.position).normalize();
      const visibleCities = getCitiesByZoom(camera.position.z, citiesResolved);
      const dist = camera.position.length();
      const scale = THREE.MathUtils.clamp(4.8 / dist, 0.78, 1.12);

      const layerCitiesOn = layersResolved.cities ?? true;
      cityLayerOnRef.current = layerCitiesOn;

      for (const { obj, el, city } of cityLabels) {
        if (!cityLayerOnRef.current) {
          el.style.display = "none";
          continue;
        }

        obj.getWorldPosition(tmp);
        const front = tmp.normalize().dot(camDir) > 0.25; // Increased threshold to hide labels earlier
        const tierAllowed = visibleCities.includes(city);
        const shouldShow = front && tierAllowed;

        el.style.display = shouldShow ? "block" : "none";
        if (shouldShow) {
          el.style.transform = `translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = modeRef.current === "satellite" ? "0.85" : "1";
        }
      }

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();

      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("click", onClick);

      mount.removeChild(renderer.domElement);
      mount.removeChild(labelRenderer.domElement);

      sphereGeo.dispose();
      oceanHotmessMat.dispose();
      satelliteMat.dispose();
      if (satelliteDispose) satelliteDispose.dispose();

      gridGroup.traverse((o) => {
        const line = o as THREE.Line;
        if (line.geometry) line.geometry.dispose();
      });
      gridMat.dispose();

      // pins resources
      beaconPinGeo.dispose();
      beaconPinMat.dispose();
      beaconPinActiveMat.dispose();
      glowTex.dispose();
      (glowMat.map as THREE.Texture | null)?.dispose?.();
      glowMat.dispose?.();
      (sponsoredGlowMat.map as THREE.Texture | null)?.dispose?.();
      sponsoredGlowMat.dispose?.();

      // heat resources
      heatTex.dispose();
      trailMat.dispose();

      renderer.dispose();
    };
  }, [
    // Re-run setup if these change; this guarantees correctness for toggles/data.
    JSON.stringify(layersResolved),
    JSON.stringify(beaconsResolved),
    JSON.stringify(citiesResolved),
    satelliteTextureUrl,
    consentKey,
    onBeaconClick,
    onCityClick,
  ]);

  return (
    <div className={className ?? ""} style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#050505",
          overflow: "hidden",
          position: "relative",
        }}
      />
    </div>
  );
}