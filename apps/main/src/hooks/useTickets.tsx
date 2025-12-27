// useTickets.tsx
// React hook for TICKETS module (P2P marketplace)

import { useState, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner';
import type {
  CreateListingResponse,
  ListListingsResponse,
  OpenThreadResponse,
  SendMessageResponse,
  TicketMessage,
  TicketThread,
  TicketTransferMethod,
} from '../types/tickets';

export function useTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  /**
   * Create a new ticket listing
   */
  const createListing = useCallback(async (params: {
    beaconId: string;
    eventName: string;
    eventStartsAt: string | null;
    venue: string | null;
    city: string | null;
    quantity: number;
    priceCents: number;
    currency: string;
    transferMethod: TicketTransferMethod;
    notes: string | null;
    proofUrl: string | null;
  }): Promise<CreateListingResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase.rpc as any)('ticket_create_listing', {
        p_beacon_id: params.beaconId,
        p_event_name: params.eventName,
        p_event_starts_at: params.eventStartsAt,
        p_venue: params.venue,
        p_city: params.city,
        p_quantity: params.quantity,
        p_price_cents: params.priceCents,
        p_currency: params.currency,
        p_transfer_method: params.transferMethod,
        p_notes: params.notes,
        p_proof_url: params.proofUrl,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      const result = data as CreateListingResponse;

      if (result.status === 'pending_review') {
        toast.success('Listing created!', {
          description: 'It\'s being reviewed and will go live soon.',
        });
      } else {
        toast.success('Listing is live!', {
          description: 'Buyers can now contact you.',
        });
      }

      return result;
    } catch (err: any) {
      const message = 'Failed to create listing';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * List available tickets for a beacon
   */
  const listListings = useCallback(async (
    beaconId: string,
    limit: number = 50
  ): Promise<ListListingsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase.rpc as any)('ticket_list_listings', {
        p_beacon_id: beaconId,
        p_limit: limit,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      return data as ListListingsResponse;
    } catch (err: any) {
      const message = 'Failed to load listings';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Open a thread with a seller
   */
  const openThread = useCallback(async (
    listingId: string
  ): Promise<OpenThreadResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase.rpc as any)('ticket_open_thread', {
        p_listing_id: listingId,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      toast.success('Thread opened', {
        description: 'You can now message the seller.',
      });

      return data as OpenThreadResponse;
    } catch (err: any) {
      const message = 'Failed to open thread';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Send a message in a ticket thread
   */
  const sendMessage = useCallback(async (
    threadId: string,
    body: string
  ): Promise<SendMessageResponse | null> => {
    if (!body.trim() || body.length > 2000) {
      toast.error('Message must be between 1-2000 characters');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase.rpc as any)('ticket_send_message', {
        p_thread_id: threadId,
        p_body: body.trim(),
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      return data as SendMessageResponse;
    } catch (err: any) {
      const message = 'Failed to send message';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Get thread messages (via RLS-protected select)
   */
  const getThreadMessages = useCallback(async (
    threadId: string
  ): Promise<TicketMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      return [];
    }
  }, [supabase]);

  /**
   * Get user's threads (via RLS-protected select)
   */
  const getMyThreads = useCallback(async (): Promise<TicketThread[]> => {
    try {
      const { data, error } = await supabase
        .from('ticket_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      console.error('Failed to load threads:', err);
      return [];
    }
  }, [supabase]);

  /**
   * Get user's own listings (via RLS-protected select)
   */
  const getMyListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      console.error('Failed to load my listings:', err);
      return [];
    }
  }, [supabase]);

  return {
    isLoading,
    error,
    createListing,
    listListings,
    openThread,
    sendMessage,
    getThreadMessages,
    getMyThreads,
    getMyListings,
  };
}

// Helper: Map RPC errors to user-friendly messages
function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    not_authenticated: 'Please sign in to continue',
    age18_required: 'You must be 18+ to use Tickets',
    consent_required: 'You must accept terms to use Tickets',
    beacon_not_found: 'Beacon not found',
    beacon_type_mismatch: 'This beacon is not a Ticket beacon',
    beacon_not_live: 'This beacon is not active',
    beacon_not_started: 'This beacon hasn\'t started yet',
    beacon_expired: 'This beacon has expired',
    listing_not_found: 'Listing not found',
    listing_not_available: 'This listing is no longer available',
    cannot_message_self: 'You can\'t message your own listing',
    not_thread_member: 'You don\'t have access to this conversation',
  };

  return errorMap[error] || error || 'Something went wrong';
}
