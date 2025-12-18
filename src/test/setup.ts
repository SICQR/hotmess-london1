import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.mock('../lib/env', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-key',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  SHOPIFY_DOMAIN: 'test.myshopify.com',
  SHOPIFY_STOREFRONT_TOKEN: 'test-token',
}));
