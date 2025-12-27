import { z } from 'zod';

const envSchema = z.object({
  VITE_SHOPIFY_DOMAIN: z.string().min(1, 'Shopify domain is required').optional(),
  VITE_SHOPIFY_STOREFRONT_TOKEN: z.string().min(1, 'Shopify token is required').optional(),
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.startsWith('pk_test_') || value.startsWith('pk_live_');
      },
      { message: 'VITE_STRIPE_PUBLISHABLE_KEY must start with pk_test_ or pk_live_' }
    ),
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
