/**
 * HOTMESS LONDON - Shopify Utilities
 * Shared utilities for Shopify integration
 */

/**
 * Error thrown when Shopify is not configured
 */
export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super('SHOPIFY_NOT_CONFIGURED');
    this.name = 'ShopifyNotConfiguredError';
  }
}
