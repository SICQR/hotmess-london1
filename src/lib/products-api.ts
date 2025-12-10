import { supabase } from './supabase';

export interface Product {
  id: string;
  shopifyId: string;
  title: string;
  collection: 'raw' | 'hung' | 'high' | 'super';
  price: number;
  imageUrl: string;
  description: string | null;
  sizes: string[];
}

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProduct);
}

// Fetch products by collection
export async function fetchProductsByCollection(
  collection: 'raw' | 'hung' | 'high' | 'super'
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('collection', collection)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProduct);
}

// Fetch single product by ID
export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapProduct(data);
}

// Fetch single product by Shopify ID (for slug-based routing)
export async function fetchProductByShopifyId(shopifyId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shopify_id', shopifyId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapProduct(data);
}

// Helper to map database row to Product interface
function mapProduct(row: any): Product {
  return {
    id: row.id,
    shopifyId: row.shopify_id,
    title: row.title,
    collection: row.collection,
    price: parseFloat(row.price),
    imageUrl: row.image_url,
    description: row.description,
    sizes: row.sizes || ['S', 'M', 'L', 'XL'],
  };
}

// Get collection info
export function getCollectionInfo(collection: 'raw' | 'hung' | 'high' | 'super') {
  const collections = {
    raw: {
      name: 'RAW',
      description: 'Essential basics. Mesh tanks, harnesses, minimal branding.',
      color: '#FF0055',
    },
    hung: {
      name: 'HUNG',
      description: 'Oversized fits. Hoodies, joggers, statement pieces.',
      color: '#FF0055',
    },
    high: {
      name: 'HIGH',
      description: 'Performance gear. Jocks, singlets, technical fabrics.',
      color: '#FF0055',
    },
    super: {
      name: 'SUPER',
      description: 'Premium quality. Limited drops, elevated materials.',
      color: '#FF0055',
    },
  };

  return collections[collection];
}
