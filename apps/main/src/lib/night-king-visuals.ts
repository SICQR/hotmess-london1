/**
 * NIGHT KING GLOBE EXTENSIONS
 * 
 * Visual enhancements for UnifiedGlobe to display Night King territorial data:
 * - Golden pulsing beacons for crowned venues
 * - Gold ring auras around king-owned venues
 * - Avatar overlays showing the current king
 * - War indicators (red pulsing) for active conflicts
 * - Building vibration sync with Radio BPM
 */

import * as THREE from 'three';
import type { BeaconWithKing } from '../store/useHotmessStore';

export interface NightKingVisuals {
  hasKing: boolean;
  kingUserId?: string;
  kingUsername?: string;
  kingAvatarUrl?: string;
  isUnderAttack: boolean;
  bountyMultiplier: number;
}

/**
 * Create a golden king beacon with pulsing aura
 */
export function createKingBeacon(
  position: THREE.Vector3,
  visuals: NightKingVisuals
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(position);

  // Base beacon (golden sphere)
  const beaconGeometry = new THREE.SphereGeometry(0.04, 16, 16);
  const beaconMaterial = new THREE.MeshBasicMaterial({
    color: visuals.hasKing ? 0xffd700 : 0xff1493, // Gold or Hot Pink
    transparent: false,
  });
  const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
  group.add(beacon);

  // Golden aura ring (only for kings)
  if (visuals.hasKing) {
    const ringGeometry = new THREE.RingGeometry(0.08, 0.12, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2; // Horizontal
    group.add(ring);

    // Add pulsing animation data
    (group as any).userData = {
      isKing: true,
      pulsePhase: Math.random() * Math.PI * 2,
      animateKingPulse: true,
    };
  }

  // War indicator (red pulsing sphere)
  if (visuals.isUnderAttack) {
    const warGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const warMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.7,
    });
    const warIndicator = new THREE.Mesh(warGeometry, warMaterial);
    group.add(warIndicator);

    (group as any).userData = {
      ...(group as any).userData,
      isUnderWar: true,
      warPhase: 0,
    };
  }

  // Multiplier indicator (floating text sprite)
  if (visuals.bountyMultiplier > 1) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 128;
      canvas.height = 64;
      context.fillStyle = visuals.isUnderAttack ? '#ff0000' : '#ffd700';
      context.font = 'bold 32px monospace';
      context.textAlign = 'center';
      context.fillText(`${visuals.bountyMultiplier}X`, 64, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.2, 0.1, 1);
      sprite.position.y = 0.15; // Above beacon
      group.add(sprite);
    }
  }

  return group;
}

/**
 * Animate king beacons (pulsing glow effect)
 */
export function animateKingBeacons(
  markersGroup: THREE.Group,
  deltaTime: number
): void {
  markersGroup.children.forEach((marker) => {
    const userData = (marker as any).userData;

    // Animate king pulse
    if (userData?.animateKingPulse) {
      userData.pulsePhase += deltaTime * 2;
      const pulseScale = 1 + Math.sin(userData.pulsePhase) * 0.2;
      marker.scale.set(pulseScale, pulseScale, pulseScale);

      // Pulse the ring opacity
      const ring = marker.children.find(
        (child) => child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry
      );
      if (ring && (ring as THREE.Mesh).material) {
        const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.4 + Math.sin(userData.pulsePhase) * 0.2;
      }
    }

    // Animate war indicator
    if (userData?.isUnderWar) {
      userData.warPhase += deltaTime * 4;
      const warScale = 1 + Math.sin(userData.warPhase) * 0.3;
      
      // Find the war indicator sphere (largest red sphere)
      const warIndicator = marker.children.find((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          return mat.color.getHex() === 0xff0000;
        }
        return false;
      });

      if (warIndicator) {
        warIndicator.scale.set(warScale, warScale, warScale);
        const material = (warIndicator as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.5 + Math.sin(userData.warPhase) * 0.2;
      }
    }
  });
}

/**
 * Sync building heights with Radio BPM
 */
export function syncBuildingsWithBPM(
  scene: THREE.Scene,
  bpm: number,
  time: number
): void {
  // Find all building meshes (assumes they're named or tagged)
  scene.traverse((object) => {
    if (object.userData.isBuilding) {
      const mesh = object as THREE.Mesh;
      const basePulse = Math.sin(time * (bpm / 60) * 2 * Math.PI);
      const scaleMultiplier = 1 + basePulse * 0.1; // 10% height variation
      mesh.scale.y = scaleMultiplier;
    }
  });
}

/**
 * Convert beacon data to night king visuals
 */
export function getKingVisuals(beacon: BeaconWithKing): NightKingVisuals {
  return {
    hasKing: !!beacon.kingData,
    kingUserId: beacon.kingData?.userId,
    kingUsername: beacon.kingData?.username,
    kingAvatarUrl: beacon.kingData?.avatarUrl,
    isUnderAttack: false, // TODO: Check active wars
    bountyMultiplier: beacon.bountyMultiplier || 1.0,
  };
}

/**
 * Create a CSS2D label for king info (requires CSS2DRenderer)
 * This would be added as an HTML overlay
 */
export function createKingLabel(visuals: NightKingVisuals): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'king-label';
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  `;

  if (visuals.hasKing && visuals.kingAvatarUrl) {
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ffd700;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      background-image: url(${visuals.kingAvatarUrl});
      background-size: cover;
      background-position: center;
    `;
    container.appendChild(avatar);

    const label = document.createElement('span');
    label.textContent = 'NIGHT KING';
    label.style.cssText = `
      font-size: 8px;
      background: #ffd700;
      color: black;
      font-weight: 900;
      padding: 2px 4px;
      text-transform: uppercase;
      margin-top: 4px;
      font-family: monospace;
    `;
    container.appendChild(label);
  }

  return container;
}

/**
 * Color palette for different beacon states
 */
export const KING_COLORS = {
  gold: 0xffd700, // King-owned venue
  hotPink: 0xff1493, // Standard beacon
  red: 0xff0000, // Under attack
  white: 0xffffff, // Neutral
  silver: 0xc0c0c0, // Former king
};
