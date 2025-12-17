// useConnect.tsx
// React hook for CONNECT module (mutual opt-in networking)

import { useState, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner';
import type {
  CreateIntentResponse,
  ListIntentsResponse,
  OptInResponse,
  SendMessageResponse,
  ConnectMessage,
  ConnectThread,
} from '../types/connect';

export function useConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  /**
   * Create a new connect intent
   */
  const createIntent = useCallback(async (
    beaconId: string,
    tags: string[]
  ): Promise<CreateIntentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('connect_create_intent', {
        p_beacon_id: beaconId,
        p_tags: tags,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      toast.success('Intent created!', {
        description: 'Others can now opt-in to connect with you.',
      });

      return data as CreateIntentResponse;
    } catch (err: any) {
      const message = 'Failed to create intent';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * List available intents for a beacon
   */
  const listIntents = useCallback(async (
    beaconId: string,
    limit: number = 50
  ): Promise<ListIntentsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('connect_list_intents', {
        p_beacon_id: beaconId,
        p_limit: limit,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      return data as ListIntentsResponse;
    } catch (err: any) {
      const message = 'Failed to load intents';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Opt-in to an intent (mutual opt-in required for match)
   */
  const optIn = useCallback(async (
    intentPublicId: string
  ): Promise<OptInResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('connect_opt_in', {
        p_intent_public_id: intentPublicId,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return null;
      }

      const result = data as OptInResponse;

      if (result.status === 'matched') {
        toast.success('It\'s a match!', {
          description: 'Start chatting now.',
        });
      } else {
        toast.success('Opt-in sent', {
          description: 'Waiting for mutual opt-in...',
        });
      }

      return result;
    } catch (err: any) {
      const message = 'Failed to opt-in';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Send a message in a connect thread
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
      const { data, error } = await supabase.rpc('connect_send_message', {
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
   * Close a connect thread
   */
  const closeThread = useCallback(async (
    threadId: string,
    reason?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('connect_close_thread', {
        p_thread_id: threadId,
        p_reason: reason || null,
      });

      if (error) {
        const message = getErrorMessage(error.message);
        setError(message);
        toast.error(message);
        return false;
      }

      toast.success('Conversation ended');
      return true;
    } catch (err: any) {
      const message = 'Failed to close thread';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /**
   * Get thread messages (via RLS-protected select)
   */
  const getThreadMessages = useCallback(async (
    threadId: string
  ): Promise<ConnectMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('connect_messages')
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
  const getMyThreads = useCallback(async (): Promise<ConnectThread[]> => {
    try {
      const { data, error } = await supabase
        .from('connect_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      console.error('Failed to load threads:', err);
      return [];
    }
  }, [supabase]);

  return {
    isLoading,
    error,
    createIntent,
    listIntents,
    optIn,
    sendMessage,
    closeThread,
    getThreadMessages,
    getMyThreads,
  };
}

// Helper: Map RPC errors to user-friendly messages
function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    not_authenticated: 'Please sign in to continue',
    age18_required: 'You must be 18+ to use Connect',
    consent_required: 'You must accept terms to use Connect',
    premium_required: 'Connect requires a premium account',
    beacon_not_found: 'Beacon not found',
    beacon_type_mismatch: 'This beacon is not a Connect beacon',
    beacon_not_live: 'This beacon is not active',
    beacon_not_started: 'This beacon hasn\'t started yet',
    beacon_expired: 'This beacon has expired',
    too_many_tags: 'Maximum 3 tags allowed',
    intent_not_found: 'Intent not found',
    intent_expired: 'This intent has expired',
    cannot_opt_in_to_self: 'You can\'t opt-in to your own intent',
    not_thread_member: 'You don\'t have access to this conversation',
  };

  return errorMap[error] || error || 'Something went wrong';
}
