import { supabase } from './supabase';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/vendor`;

export interface MessMarketProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  pricePence: number;
  priceGBP: number; // Computed
  images: string[];
  stockCount: number;
  creatorId: string | null;
  active: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean; // Computed
}

export interface NotificationRequest {
  email: string;
  productId: string;
  consentGiven: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface VendorApplication {
  userId?: string;
  email: string;
  displayName: string;
  bio?: string;
  portfolioUrl?: string;
  instagramHandle?: string;
  referralSource?: string;
}

// Fetch all active MessMarket products
export async function fetchMessMarketProducts(): Promise<MessMarketProduct[]> {
  const { data, error } = await supabase
    .from('messmarket_products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    // Silently handle "relation does not exist" errors (database not set up yet)
    if (error.code !== '42P01') {
      console.error('Error fetching MessMarket products:', error);
    }
    return [];
  }

  return data.map(mapProduct);
}

// Fetch single MessMarket product by slug
export async function fetchMessMarketProduct(slug: string): Promise<MessMarketProduct | null> {
  const { data, error } = await supabase
    .from('messmarket_products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching MessMarket product:', error);
    return null;
  }

  return mapProduct(data);
}

// Fetch single MessMarket product by ID (for cart operations)
export async function fetchMessMarketProductById(id: string): Promise<MessMarketProduct | null> {
  const { data, error } = await supabase
    .from('messmarket_products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching MessMarket product:', error);
    return null;
  }

  return mapProduct(data);
}

// Submit notification request for sold-out product
export async function submitNotificationRequest(request: NotificationRequest): Promise<boolean> {
  const { error } = await supabase
    .from('messmarket_notifications')
    .insert({
      email: request.email,
      product_id: request.productId,
      consent_given: request.consentGiven,
      ip_address: request.ipAddress,
      user_agent: request.userAgent,
    });

  if (error) {
    // If it's a duplicate, that's okay (unique constraint)
    if (error.code === '23505') {
      console.log('User already subscribed to this product');
      return true;
    }
    console.error('Error submitting notification request:', error);
    return false;
  }

  return true;
}

// Submit vendor application
export async function submitVendorApplication(application: VendorApplication): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(application),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error submitting vendor application:', error);
      return false;
    }

    console.log('✅ Vendor application submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting vendor application:', error);
    return false;
  }
}

// Check if user has pending vendor application
export async function checkVendorApplicationStatus(email: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/applications/${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.status || null;
  } catch (error) {
    console.error('Error checking vendor application status:', error);
    return null;
  }
}

// Helper to map database row to MessMarketProduct interface
function mapProduct(row: any): MessMarketProduct {
  const pricePence = row.price_pence || 0;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    pricePence,
    priceGBP: pricePence / 100,
    images: row.images || [],
    stockCount: row.stock_count || 0,
    creatorId: row.creator_id,
    active: row.active,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    inStock: (row.stock_count || 0) > 0,
  };
}

// Get category info
export function getCategoryInfo(category: string) {
  const categories: Record<string, { name: string; warning?: string }> = {
    general: {
      name: 'General',
    },
    intimate: {
      name: 'Intimate',
      warning: 'This product is intimate wear. See our Care & Aftercare resources.',
    },
    adult: {
      name: 'Adult',
      warning: 'This product contains adult content. 18+ only.',
    },
  };

  return categories[category] || categories.general;
}