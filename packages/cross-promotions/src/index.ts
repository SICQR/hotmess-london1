/**
 * @hotmess/cross-promotions
 * Intelligence engine for cross-feature promotions
 * The magic that connects all HOTMESS features
 */

export type FeatureType = 'beacon' | 'music' | 'market' | 'telegram' | 'radio' | 'tickets' | 'shop' | 'care';

export interface UserProfile {
  id: string;
  xpLevel: number;
  membershipTier: 'free' | 'member' | 'plus' | 'pro';
  interests: string[];
  lastActive: Date;
}

export interface Activity {
  type: string;
  featureId: FeatureType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserContext {
  currentFeature: FeatureType;
  location: { lat: number; lng: number };
  profile: UserProfile;
  recentActivity: Activity[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
}

export interface Promotion {
  id: string;
  type: 'banner' | 'card' | 'notification' | 'modal';
  targetFeature: FeatureType;
  creative: {
    title: string;
    description: string;
    image?: string;
    cta: string;
  };
  link: string;
  relevanceScore: number;
  priority: number;
}

export interface PromotionRule {
  id: string;
  name: string;
  condition: (context: UserContext) => boolean;
  createPromotion: (context: UserContext) => Promotion;
  weight: number;
}

/**
 * Cross-Promotion Intelligence Engine
 * Analyzes user context and determines the best cross-feature promotions
 */
export class CrossPromotionEngine {
  private rules: PromotionRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialize built-in promotion rules
   */
  private initializeRules(): void {
    // Rule: Promote RAW Convict Records to beacon scanners
    this.rules.push({
      id: 'beacon-to-music',
      name: 'Beacon Scanner → Music',
      condition: (context) => {
        return context.currentFeature === 'beacon' && 
               context.recentActivity.filter(a => a.type === 'beacon-scan').length >= 3;
      },
      createPromotion: (context) => ({
        id: crypto.randomUUID(),
        type: 'card',
        targetFeature: 'music',
        creative: {
          title: 'The night has a soundtrack',
          description: 'RAW Convict Records — music from the underground',
          cta: 'Explore Music',
        },
        link: '/music',
        relevanceScore: 0.85,
        priority: 2,
      }),
      weight: 10,
    });

    // Rule: Promote beacons to radio listeners
    this.rules.push({
      id: 'radio-to-beacon',
      name: 'Radio Listener → Beacons',
      condition: (context) => {
        return context.currentFeature === 'radio' && context.timeOfDay === 'night';
      },
      createPromotion: (context) => ({
        id: crypto.randomUUID(),
        type: 'banner',
        targetFeature: 'beacon',
        creative: {
          title: 'The night is alive',
          description: 'Active beacons near you — scan for XP',
          cta: 'Scan Beacons',
        },
        link: '/beacons',
        relevanceScore: 0.9,
        priority: 3,
      }),
      weight: 15,
    });

    // Rule: Promote shop to high XP users
    this.rules.push({
      id: 'xp-to-shop',
      name: 'High XP → Shop',
      condition: (context) => {
        return context.profile.xpLevel >= 5;
      },
      createPromotion: (context) => ({
        id: crypto.randomUUID(),
        type: 'card',
        targetFeature: 'shop',
        creative: {
          title: 'Earned the right to flex',
          description: 'RAW collection — clothes that sweat before you do',
          cta: 'Shop Now',
        },
        link: '/shop',
        relevanceScore: 0.75,
        priority: 1,
      }),
      weight: 8,
    });

    // Rule: Promote Hand N Hand care to all users periodically
    this.rules.push({
      id: 'care-reminder',
      name: 'Care Reminder',
      condition: (context) => {
        const lastCareVisit = context.recentActivity.find(a => a.featureId === 'care');
        if (!lastCareVisit) return true;
        const daysSince = (Date.now() - lastCareVisit.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince > 7;
      },
      createPromotion: (context) => ({
        id: crypto.randomUUID(),
        type: 'notification',
        targetFeature: 'care',
        creative: {
          title: 'Check in, mate',
          description: 'Hand N Hand — the only place to land',
          cta: 'Visit Care',
        },
        link: '/care',
        relevanceScore: 0.95,
        priority: 10,
      }),
      weight: 20,
    });

    // Rule: Promote tickets to frequent venue visitors
    this.rules.push({
      id: 'venue-to-tickets',
      name: 'Venue Visitor → Tickets',
      condition: (context) => {
        const venueVisits = context.recentActivity.filter(
          a => a.type === 'beacon-scan' && a.metadata?.beaconType === 'venue'
        );
        return venueVisits.length >= 2;
      },
      createPromotion: (context) => ({
        id: crypto.randomUUID(),
        type: 'card',
        targetFeature: 'tickets',
        creative: {
          title: 'Never miss the heat',
          description: 'Get tickets to the best events',
          cta: 'Browse Events',
        },
        link: '/tickets',
        relevanceScore: 0.88,
        priority: 2,
      }),
      weight: 12,
    });
  }

  /**
   * Get the most relevant promotion for the current user context
   */
  async getPromotion(context: UserContext): Promise<Promotion | null> {
    const eligibleRules = this.rules.filter(rule => rule.condition(context));
    
    if (eligibleRules.length === 0) {
      return null;
    }

    // Weight-based selection
    const totalWeight = eligibleRules.reduce((sum, rule) => sum + rule.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const rule of eligibleRules) {
      random -= rule.weight;
      if (random <= 0) {
        return rule.createPromotion(context);
      }
    }

    // Fallback to first eligible rule
    return eligibleRules[0].createPromotion(context);
  }

  /**
   * Get multiple promotions for the current context
   */
  async getPromotions(context: UserContext, limit: number = 3): Promise<Promotion[]> {
    const eligibleRules = this.rules.filter(rule => rule.condition(context));
    
    return eligibleRules
      .slice(0, limit)
      .map(rule => rule.createPromotion(context))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Add a custom promotion rule
   */
  addRule(rule: PromotionRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a promotion rule by ID
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  /**
   * Get all registered rules
   */
  getRules(): PromotionRule[] {
    return [...this.rules];
  }
}

/**
 * Global cross-promotion engine instance
 */
export const crossPromotionEngine = new CrossPromotionEngine();

/**
 * Track user activity for cross-promotion intelligence
 */
export function trackActivity(activity: Activity): void {
  // This would typically push to a queue/database
  // For now, it's a placeholder
  console.log('[Cross-Promotion] Activity tracked:', activity);
}

/**
 * Track feature navigation
 */
export function trackFeatureNavigation(from: FeatureType, to: FeatureType): void {
  trackActivity({
    type: 'feature-navigation',
    featureId: to,
    timestamp: new Date(),
    metadata: { from, to },
  });
}
