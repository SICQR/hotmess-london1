/**
 * MessMarket API Client
 * Handles all marketplace listing operations
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { getAccessToken, getAccessTokenAsync } from '../auth';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/messmarket`;

export interface Listing {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  shippingCost: number;
  processingTime: string;
  condition?: string;
  size?: string;
  brand?: string;
  shipsFrom?: string;
  shippingRates?: {
    uk: number;
    eu: number;
    usa: number;
  };
  policies?: {
    customRequestsAccepted: boolean;
    discretePackaging: boolean;
    noRefunds: boolean;
  };
  isNsfw: boolean;
  status: 'active' | 'draft' | 'inactive';
  images: string[];
  views: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number | string;
  stock: number | string;
  category?: string;
  tags?: string[] | string;
  shippingCost?: number | string;
  processingTime?: string;
  condition?: string;
  size?: string;
  brand?: string;
  shipsFrom?: string;
  shippingUK?: number | string;
  shippingEU?: number | string;
  shippingUSA?: number | string;
  customRequestsAccepted?: boolean;
  discretePackaging?: boolean;
  noRefunds?: boolean;
  isNsfw?: boolean;
  status?: 'active' | 'draft';
  images?: string[];
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Use async token getter for reliable auth
  const accessToken = await getAccessTokenAsync();
  
  console.log('fetchAPI called:', {
    endpoint,
    method: options.method || 'GET',
    hasAccessToken: !!accessToken,
    token: accessToken ? `${accessToken.slice(0, 20)}...` : 'none'
  });
  
  const url = `${API_BASE}${endpoint}`;
  console.log('Making request to:', url);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`,
      ...options.headers,
    },
  });

  console.log('Response received:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error('API error response:', error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  console.log('API success response:', result);
  return result;
}

export async function getListings(params?: {
  category?: string;
  search?: string;
  status?: 'active' | 'draft' | 'inactive' | 'all';
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.category) queryParams.set('category', params.category);
  if (params?.search) queryParams.set('search', params.search);
  if (params?.status) queryParams.set('status', params.status);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  
  const query = queryParams.toString();
  return fetchAPI(`/listings${query ? '?' + query : ''}`);
}

export async function getListing(id: string) {
  return fetchAPI(`/listings/${id}`);
}

export async function getMyListings() {
  return fetchAPI('/listings/me/all');
}

export async function createListing(data: CreateListingInput) {
  return fetchAPI('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateListing(id: string, data: Partial<CreateListingInput>) {
  return fetchAPI(`/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id: string) {
  return fetchAPI(`/listings/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  // Use async token getter for more reliable auth
  const accessToken = await getAccessTokenAsync();
  
  console.log('uploadImage called:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasAccessToken: !!accessToken,
    token: accessToken ? `${accessToken.slice(0, 20)}...` : 'none',
    apiUrl: `${API_BASE}/images`
  });
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken || publicAnonKey}`,
      },
      body: formData,
    });
    
    console.log('Upload response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error('Upload error response:', error);
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Upload success:', result);
    return result;
  } catch (err) {
    console.error('Upload fetch error:', err);
    throw err;
  }
}

export async function getVendorProfile(username: string) {
  return fetchAPI(`/vendors/${username}`);
}