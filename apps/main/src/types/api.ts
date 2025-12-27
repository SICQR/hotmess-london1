/**
 * API Type Definitions
 * Defines types for API requests, responses, and errors
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * API error interface
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * RPC function result
 */
export interface RpcResult<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * City data from API
 */
export interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  active: boolean;
  event_count: number;
}

/**
 * Shopify GraphQL variables (recursive type for nested objects/arrays)
 */
export type ShopifyVariables = Record<string, ShopifyVariableValue>;

export type ShopifyVariablePrimitive = string | number | boolean | null;
export type ShopifyVariableValue = ShopifyVariablePrimitive | ShopifyVariableObject | ShopifyVariableValue[];
export interface ShopifyVariableObject {
  [key: string]: ShopifyVariableValue;
}

/**
 * Generic API fetch options
 */
export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Notification metadata
 */
export interface NotificationMetadata {
  type?: string;
  link?: string;
  image_url?: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Search result metadata
 */
export interface SearchMetadata {
  score?: number;
  highlights?: string[];
  [key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * User profile metadata
 */
export interface UserProfileMetadata {
  theme?: string;
  notifications_enabled?: boolean;
  [key: string]: string | number | boolean | null | undefined;
}
