/**
 * HOTMESS LONDON - Analytics & Event Tracking
 * Unified analytics layer for tracking user behavior and performance
 */

// Analytics event types
export type AnalyticsEvent = 
  // User actions
  | 'page_view'
  | 'button_click'
  | 'navigation'
  | 'search'
  | 'filter_applied'
  
  // Commerce
  | 'product_viewed'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_started'
  | 'purchase_completed'
  
  // Social
  | 'beacon_scanned'
  | 'connect_message_sent'
  | 'profile_viewed'
  | 'user_followed'
  
  // Radio
  | 'radio_play'
  | 'radio_pause'
  | 'radio_skip'
  
  // XP & Rewards
  | 'xp_earned'
  | 'level_up'
  | 'reward_claimed'
  | 'drop_viewed'
  
  // Admin
  | 'admin_action'
  | 'moderation_action'
  | 'user_banned'
  
  // Errors
  | 'error_occurred'
  | 'api_error';

interface AnalyticsEventData {
  event: AnalyticsEvent;
  category?:  string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp?:  number;
}

interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  xpLevel?: number;
  isPremium?: boolean;
}

class Analytics {
  private enabled: boolean = false;
  private debug: boolean = false;
  private userId:  string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Enable analytics in production only
    if (typeof window !== 'undefined') {
      this.enabled = process.env.NODE_ENV === 'production';
      this.debug = process.env.NODE_ENV === 'development';
    }
  }

  /**
   * Initialize analytics with user data
   */
  init(userProps?: UserProperties) {
    if (userProps?. userId) {
      this.userId = userProps.userId;
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] 📊 Analytics initialized', { sessionId: this.sessionId });
    }

    // Set user properties if using analytics provider
    this.setUserProperties(userProps);
  }

  /**
   * Track a custom event
   */
  track(eventData: AnalyticsEventData) {
    const event = {
      ... eventData,
      timestamp: eventData.timestamp || Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator. userAgent : undefined,
    };

    // Debug mode - only log important events to reduce noise
    if (import.meta.env.DEV) {
      const importantEvents = ['page_view', 'purchase_completed', 'error_occurred', 'api_error'];
      if (importantEvents.includes(event.event)) {
        console.log('[Analytics] 📊 Event:', event.event);
      }
    }

    // Production mode - send to analytics provider
    if (this.enabled) {
      this.sendToProvider(event);
    }

    // Also send to internal logging endpoint
    this.sendToInternalLog(event);
  }

  /**
   * Track page view
   */
  pageView(pagePath: string, pageTitle?: string) {
    this.track({
      event: 'page_view',
      category: 'navigation',
      label: pageTitle || pagePath,
      metadata: {
        path: pagePath,
        title:  pageTitle,
        referrer: typeof document !== 'undefined' ? document. referrer : undefined,
      },
    });
  }

  /**
   * Track user action
   */
  action(action: string, category: string, value?: number, metadata?: Record<string, any>) {
    this.track({
      event: 'button_click',
      category,
      label: action,
      value,
      metadata,
    });
  }

  /**
   * Track commerce event
   */
  commerce(event: 'product_viewed' | 'add_to_cart' | 'purchase_completed', data: {
    productId?:  string;
    productName?: string;
    price?: number;
    currency?: string;
    quantity?: number;
    orderId?: string;
    revenue?: number;
  }) {
    this.track({
      event,
      category:  'commerce',
      value: data.price || data.revenue,
      metadata: data,
    });
  }

  /**
   * Track XP event
   */
  xp(event: 'xp_earned' | 'level_up' | 'reward_claimed', data: {
    xpAmount?: number;
    newLevel?: number;
    rewardId?: string;
    action?: string;
  }) {
    this.track({
      event,
      category: 'gamification',
      value: data. xpAmount || data.newLevel,
      metadata: data,
    });
  }

  /**
   * Track error
   */
  error(error: Error | string, context?: Record<string, any>) {
    const errorData = typeof error === 'string' 
      ? { message: error }
      : { message: error.message, stack: error.stack };

    this.track({
      event: 'error_occurred',
      category: 'error',
      label: errorData.message,
      metadata: {
        ...errorData,
        ... context,
      },
    });

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error('[Analytics] ❌ Error tracked:', typeof error === 'string' ? error : error.message);
    }
  }

  /**
   * Track API error
   */
  apiError(endpoint: string, statusCode: number, errorMessage: string) {
    this.track({
      event: 'api_error',
      category: 'api',
      label: endpoint,
      value: statusCode,
      metadata: {
        endpoint,
        statusCode,
        error: errorMessage,
      },
    });
  }

  /**
   * Track performance metric
   */
  performance(metric: string, value: number, metadata?: Record<string, any>) {
    this.track({
      event: 'button_click',
      category: 'performance',
      label: metric,
      value,
      metadata,
    });
  }

  /**
   * Set user properties
   */
  private setUserProperties(props?: UserProperties) {
    if (!props) return;

    // Send to analytics provider
    if (this.enabled && typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('set', 'user_properties', {
          user_id: props.userId,
          role: props.role,
          xp_level: props.xpLevel,
          is_premium: props. isPremium,
        });
      }
    }
  }

  /**
   * Send to analytics provider (GA4, PostHog, etc.)
   */
  private sendToProvider(event:  any) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // PostHog (if using)
    if ((window as any).posthog) {
      (window as any).posthog. capture(event.event, {
        category: event.category,
        label: event.label,
        value: event.value,
        ... event.metadata,
      });
    }
  }

  /**
   * Send to internal logging endpoint
   */
  private async sendToInternalLog(event: any) {
    // Don't send in development
    if (! this.enabled) return;

    try {
      // Send to backend for storage/analysis
      const baseUrl = import.meta.env. VITE_SUPABASE_FUNCTIONS_URL || '';
      await fetch(`${baseUrl}/api/analytics/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (err) {
      // Silently fail - don't break user experience
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Failed to send analytics to backend:', err);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackPageView = (path: string, title?: string) => analytics.pageView(path, title);
export const trackAction = (action:  string, category: string, value?:  number, metadata?: Record<string, any>) => 
  analytics.action(action, category, value, metadata);
export const trackCommerce = (event: 'product_viewed' | 'add_to_cart' | 'purchase_completed', data: any) => 
  analytics.commerce(event, data);
export const trackXP = (event: 'xp_earned' | 'level_up' | 'reward_claimed', data: any) => 
  analytics.xp(event, data);
export const trackError = (error: Error | string, context?: Record<string, any>) => 
  analytics.error(error, context);
