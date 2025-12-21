// HOTMESS LONDON - useDrops Hook
// Manages drop data and operations

import { useState, useEffect } from 'react';
import { Drop, DropCreateInput, DropAnalytics } from '../types/drops';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/drops`;

export function useDrops(filters?: {
  city?: string;
  type?: string;
  status?: string;
  limit?: number;
}) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrops();
  }, [filters]);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters?.city) params.append('city', filters.city);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_URL}/browse?${params}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drops');
      }

      const data = await response.json();
      setDrops(data.drops || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching drops:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDrops();
  };

  return { drops, loading, error, refetch };
}

export function useDrop(dropId: string) {
  const [drop, setDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dropId) {
      fetchDrop();
    }
  }, [dropId]);

  const fetchDrop = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/${dropId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drop');
      }

      const data = await response.json();
      setDrop(data.drop);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching drop:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDrop();
  };

  return { drop, loading, error, refetch };
}

export function useDropActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDrop = async (input: DropCreateInput, authToken: string): Promise<Drop | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create drop');
      }

      const data = await response.json();
      return data.drop;
    } catch (err: any) {
      console.error('Error creating drop:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDrop = async (dropId: string, updates: Partial<Drop>, authToken: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/${dropId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update drop');
      }

      return true;
    } catch (err: any) {
      console.error('Error updating drop:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDrop = async (dropId: string, authToken: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/${dropId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete drop');
      }

      return true;
    } catch (err: any) {
      console.error('Error deleting drop:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveDrop = async (dropId: string, authToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${dropId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save drop');
      }

      return true;
    } catch (err: any) {
      console.error('Error saving drop:', err);
      return false;
    }
  };

  const unsaveDrop = async (dropId: string, authToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${dropId}/save`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unsave drop');
      }

      return true;
    } catch (err: any) {
      console.error('Error unsaving drop:', err);
      return false;
    }
  };

  const getAnalytics = async (dropId: string, authToken: string): Promise<DropAnalytics | null> => {
    try {
      const response = await fetch(`${API_URL}/${dropId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const data = await response.json();
      return data.analytics;
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      return null;
    }
  };

  return {
    createDrop,
    updateDrop,
    deleteDrop,
    saveDrop,
    unsaveDrop,
    getAnalytics,
    loading,
    error,
  };
}

export function useSellerDrops(sellerId: string) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sellerId) {
      fetchSellerDrops();
    }
  }, [sellerId]);

  const fetchSellerDrops = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/seller/${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seller drops');
      }

      const data = await response.json();
      setDrops(data.drops || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching seller drops:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSellerDrops();
  };

  return { drops, loading, error, refetch };
}
