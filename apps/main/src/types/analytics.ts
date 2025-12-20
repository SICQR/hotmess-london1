/**
 * Analytics Type Definitions
 * Defines types for analytics events, tracking, and monitoring
 */

/**
 * Metadata value types - restricted set of primitives for analytics
 */
export type AnalyticsMetadataValue = string | number | boolean | null | undefined;

/**
 * Metadata object for analytics events
 */
export type AnalyticsMetadata = Record<string, AnalyticsMetadataValue>;

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: AnalyticsMetadata;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * User properties for analytics
 */
export interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  xpLevel?: number;
  isPremium?: boolean;
}

/**
 * Analytics event data (before enrichment)
 */
export interface AnalyticsEventData {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: AnalyticsMetadata;
  timestamp?: number;
}

/**
 * Commerce tracking data
 */
export interface CommerceEventData {
  productId?: string;
  productName?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  category?: string;
  cartId?: string;
  orderId?: string;
  [key: string]: AnalyticsMetadataValue;
}

/**
 * XP/Rewards tracking data
 */
export interface XPEventData {
  xpAmount?: number;
  level?: number;
  rewardId?: string;
  source?: string;
  [key: string]: AnalyticsMetadataValue;
}

/**
 * Error context for error tracking
 */
export interface ErrorContext {
  type?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  [key: string]: AnalyticsMetadataValue;
}
