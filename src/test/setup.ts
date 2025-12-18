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
  SUPABASE_URL: 'https://test-project.supabase.test',
  SUPABASE_ANON_KEY: 'test-anon-key-not-real',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_not_a_real_key',
  SHOPIFY_DOMAIN: 'test-store.myshopify.test',
  SHOPIFY_STOREFRONT_TOKEN: 'test-storefront-token',
}));
