# @hotmess/cross-promotions

Intelligence engine for cross-feature promotions across the HOTMESS platform.

## Overview

The cross-promotion engine analyzes user context (current feature, location, activity history, time of day) and determines the best promotions to show for other HOTMESS features.

## Usage

```typescript
import { crossPromotionEngine, UserContext } from '@hotmess/cross-promotions';

const context: UserContext = {
  currentFeature: 'beacon',
  location: { lat: 51.5074, lng: -0.1278 },
  profile: {
    id: 'user123',
    xpLevel: 5,
    membershipTier: 'member',
    interests: ['music', 'nightlife'],
    lastActive: new Date(),
  },
  recentActivity: [
    { type: 'beacon-scan', featureId: 'beacon', timestamp: new Date() }
  ],
  timeOfDay: 'night',
  dayOfWeek: 'Friday',
};

// Get single promotion
const promotion = await crossPromotionEngine.getPromotion(context);

// Get multiple promotions
const promotions = await crossPromotionEngine.getPromotions(context, 3);
```

## Built-in Rules

1. **Beacon Scanner → Music** - Promotes RAW Convict Records to active beacon scanners
2. **Radio Listener → Beacons** - Promotes beacon scanning to radio listeners at night
3. **High XP → Shop** - Promotes shop to users with high XP levels
4. **Care Reminder** - Periodic reminders to visit Hand N Hand care resources
5. **Venue Visitor → Tickets** - Promotes ticket sales to frequent venue visitors

## Custom Rules

You can add custom promotion rules:

```typescript
import { crossPromotionEngine, PromotionRule } from '@hotmess/cross-promotions';

const customRule: PromotionRule = {
  id: 'custom-rule',
  name: 'Custom Promotion',
  condition: (context) => context.profile.xpLevel > 10,
  createPromotion: (context) => ({
    id: crypto.randomUUID(),
    type: 'banner',
    targetFeature: 'tickets',
    creative: {
      title: 'VIP Access Available',
      description: 'Your XP unlocks exclusive events',
      cta: 'See Events',
    },
    link: '/tickets/vip',
    relevanceScore: 0.95,
    priority: 5,
  }),
  weight: 15,
};

crossPromotionEngine.addRule(customRule);
```

## Activity Tracking

Track user activities to feed the promotion engine:

```typescript
import { trackActivity, trackFeatureNavigation } from '@hotmess/cross-promotions';

// Track any activity
trackActivity({
  type: 'purchase',
  featureId: 'shop',
  timestamp: new Date(),
  metadata: { amount: 50 },
});

// Track feature navigation
trackFeatureNavigation('beacon', 'music');
```
