/**
 * SEED DATA SCRIPT
 * Populates KV store with test beacons for development
 */

import * as kv from './kv_store.tsx';

// Mock beacons for seeding
const MOCK_BEACONS = [
  {
    id: 'beacon-001',
    code: 'GLO-001',
    type: 'checkin',
    status: 'active',
    name: 'The Glory Check-In',
    description: 'Check in at The Glory, East London\'s legendary queer venue',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
    ownerId: 'hotmess-admin',
    ownerType: 'platform',
    targetId: null,
    targetType: null,
    targetUrl: null,
    xpReward: 10,
    xpBonusMultiplier: 1.0,
    scanLimit: null,
    scanCount: 847,
    location: {
      city: 'London',
      venue: 'The Glory',
      address: '281 Kingsland Rd, London E2 8AS',
      lat: 51.5431,
      lng: -0.0759,
    },
    activeFrom: null,
    activeUntil: null,
    requiresMembership: false,
    requiredTier: null,
    ageRestriction: 18,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30'),
  },
  {
    id: 'beacon-002',
    code: 'CONVICT-HOTMESS',
    type: 'music',
    status: 'active',
    name: 'HOTMESS Track - RAW CONVICT',
    description: 'Stream "HOTMESS" by RAW CONVICT on HOTMESS Radio',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ownerId: 'raw-convict',
    ownerType: 'artist',
    targetId: 'hotmess-track',
    targetType: 'release',
    targetUrl: null,
    xpReward: 25,
    xpBonusMultiplier: 2.0,
    scanLimit: null,
    scanCount: 2341,
    location: null,
    activeFrom: null,
    activeUntil: null,
    requiresMembership: false,
    requiredTier: null,
    ageRestriction: 18,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30'),
  },
  {
    id: 'beacon-003',
    code: 'RAW-DROP-001',
    type: 'drop',
    status: 'active',
    name: 'RAW Essentials Drop',
    description: 'Limited edition RAW essentials collection - 500 units only',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    ownerId: 'hotmess-admin',
    ownerType: 'platform',
    targetId: 'raw-essentials',
    targetType: 'drop',
    targetUrl: null,
    xpReward: 25,
    xpBonusMultiplier: 1.0,
    scanLimit: 500,
    scanCount: 287,
    location: null,
    activeFrom: new Date('2025-11-28'),
    activeUntil: new Date('2025-12-15'),
    requiresMembership: false,
    requiredTier: null,
    ageRestriction: 18,
    createdAt: new Date('2025-11-28'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30'),
  },
  {
    id: 'beacon-004',
    code: 'QUEST-FIRST',
    type: 'quest',
    status: 'active',
    name: 'First Night Out Quest',
    description: 'Complete your first night in the HOTMESS ecosystem',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    ownerId: 'hotmess-admin',
    ownerType: 'platform',
    targetId: 'first-night-out',
    targetType: 'quest',
    targetUrl: null,
    xpReward: 30,
    xpBonusMultiplier: 1.0,
    scanLimit: null,
    scanCount: 156,
    location: null,
    activeFrom: null,
    activeUntil: null,
    requiresMembership: false,
    requiredTier: null,
    ageRestriction: 18,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30'),
  },
  {
    id: 'beacon-005',
    code: 'TG-LONDON',
    type: 'scan-to-join',
    status: 'active',
    name: 'London Chat Room',
    description: 'Join the London HOTMESS community on Telegram',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
    ownerId: 'hotmess-admin',
    ownerType: 'platform',
    targetId: null,
    targetType: null,
    targetUrl: 'https://t.me/hotmess_london',
    xpReward: 20,
    xpBonusMultiplier: 1.0,
    scanLimit: null,
    scanCount: 593,
    location: {
      city: 'London',
    },
    activeFrom: null,
    activeUntil: null,
    requiresMembership: false,
    requiredTier: null,
    ageRestriction: 18,
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-11-30'),
    lastScannedAt: new Date('2025-11-30'),
  },
];

export async function seedBeacons() {
  console.log('🌱 Seeding beacons...');
  
  for (const beacon of MOCK_BEACONS) {
    // Store by code (lowercase)
    await kv.set(`beacon:${beacon.code.toLowerCase()}`, beacon);
    
    // Also store by ID for quick lookup
    await kv.set(`beacon:id:${beacon.id}`, beacon);
    
    console.log(`✅ Seeded beacon: ${beacon.code} (${beacon.name})`);
  }
  
  console.log(`🎉 Seeded ${MOCK_BEACONS.length} beacons`);
  return { success: true, count: MOCK_BEACONS.length };
}

// Seed function can be called from server startup or admin endpoint
export default seedBeacons;