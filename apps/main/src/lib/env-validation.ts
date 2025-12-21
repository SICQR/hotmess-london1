import { z } from 'zod';

const envSchema = z.object({
  VITE_SHOPIFY_DOMAIN: z.string().min(1, 'Shopify domain is required'),
  VITE_SHOPIFY_STOREFRONT_TOKEN: z.string().min(1, 'Shopify token is required'),
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_', 'Invalid Stripe publishable key'),
});

export function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw new Error('Missing or invalid environment variables');
  }
}

export type Env = z.infer<typeof envSchema>;
