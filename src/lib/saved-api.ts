// lib/saved-api.ts
// Frontend API for saved content system

import { projectId } from '../utils/supabase/info';
import { supabase } from './supabase';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/saved`;

export type ContentType = 'beacon' | 'record' | 'release' | 'product' | 'post' | 'show';

export interface SavedItem {
  userId: string;
  contentType: ContentType;
  contentId: string;
  savedAt: string;
  metadata?: any;
}

export interface SavedCounts {
  beacon: number;
  record: number;
  release: number;
  product: number;
  post: number;
  show: number;
}

// Get access token for authenticated requests
async function getAccessToken(): Promise<string | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }
  
  return session.access_token;
}

/**
 * Save content item
 */
export async function saveContent(
  contentType: ContentType, 
  contentId: string, 
  metadata?: any
): Promise<{ success: boolean; item?: SavedItem; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const response = await fetch(`${baseUrl}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ contentType, contentId, metadata })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to save content' };
    }

    return { success: true, item: data.item };
  } catch (error) {
    console.error('Error saving content:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Unsave content item
 */
export async function unsaveContent(
  contentType: ContentType, 
  contentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const response = await fetch(`${baseUrl}/unsave`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ contentType, contentId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to unsave content' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error unsaving content:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Check if content is saved
 */
export async function checkSaved(
  contentType: ContentType, 
  contentId: string
): Promise<{ saved: boolean; item?: SavedItem; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { saved: false, error: 'User not authenticated' };
    }
    
    const response = await fetch(
      `${baseUrl}/check?contentType=${contentType}&contentId=${contentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return { saved: false, error: data.error || 'Failed to check saved status' };
    }

    return { saved: data.saved, item: data.item };
  } catch (error) {
    console.error('Error checking saved status:', error);
    return { saved: false, error: (error as Error).message };
  }
}

/**
 * Get all saved content (optionally filtered by type)
 */
export async function getAllSaved(
  contentType?: ContentType
): Promise<{ items: SavedItem[]; count: number; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { items: [], count: 0, error: 'User not authenticated' };
    }
    
    const url = contentType 
      ? `${baseUrl}/all?contentType=${contentType}`
      : `${baseUrl}/all`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { items: [], count: 0, error: data.error || 'Failed to fetch saved content' };
    }

    return { items: data.items, count: data.count };
  } catch (error) {
    console.error('Error fetching saved content:', error);
    return { items: [], count: 0, error: (error as Error).message };
  }
}

/**
 * Get saved counts by type
 */
export async function getSavedCounts(): Promise<{ counts: SavedCounts; total: number; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { 
        counts: { beacon: 0, record: 0, release: 0, product: 0, post: 0, show: 0 },
        total: 0, 
        error: 'User not authenticated' 
      };
    }
    
    const response = await fetch(`${baseUrl}/counts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        counts: { beacon: 0, record: 0, release: 0, product: 0, post: 0, show: 0 },
        total: 0, 
        error: data.error || 'Failed to fetch saved counts' 
      };
    }

    return { counts: data.counts, total: data.total };
  } catch (error) {
    console.error('Error fetching saved counts:', error);
    return { 
      counts: { beacon: 0, record: 0, release: 0, product: 0, post: 0, show: 0 },
      total: 0, 
      error: (error as Error).message 
    };
  }
}