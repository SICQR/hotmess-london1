/**
 * RIGHT NOW REALTIME HOOK
 * Subscribes to live updates for city/geo_bin topics
 */

import { useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { RightNowPost } from './rightNowClient'

interface RealtimePayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  schema: string
  table: string
  new: RightNowPost | null
  old: RightNowPost | null
}

interface UseRightNowRealtimeProps {
  city?: string
  geoBin?: string
  onInsert?: (post: RightNowPost) => void
  onUpdate?: (post: RightNowPost) => void
  onDelete?: (postId: string) => void
}

export function useRightNowRealtime({
  city,
  geoBin,
  onInsert,
  onUpdate,
  onDelete,
}: UseRightNowRealtimeProps) {
  useEffect(() => {
    // Must have city or geoBin
    if (!city && !geoBin) return

    // Get auth token
    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If no session, try using the anon key for public realtime
      if (!session?.access_token) {
        // For public channels, we don't need to set auth - just subscribe directly
        const topic = geoBin 
          ? `right_now:geo_bin:${geoBin}`
          : `right_now:city:${city}`

        console.log('[RIGHT NOW REALTIME] Subscribing to:', topic)

        // Subscribe to public channel (no private config)
        const channel = supabase
          .channel(topic, {
            config: {
              broadcast: { self: false },
            },
          })
          .on('broadcast', { event: '*' }, (payload: any) => {
            console.log('[RIGHT NOW REALTIME] Broadcast received:', payload)

            const data = payload.payload as RealtimePayload

            if (data.type === 'INSERT' && data.new && onInsert) {
              onInsert(data.new)
            } else if (data.type === 'UPDATE' && data.new && onUpdate) {
              onUpdate(data.new)
            } else if (data.type === 'DELETE' && data.old && onDelete) {
              onDelete(data.old.id)
            }
          })
          .subscribe((status) => {
            console.log('[RIGHT NOW REALTIME] Status:', status)
          })

        return () => {
          console.log('[RIGHT NOW REALTIME] Unsubscribing from:', topic)
          supabase.removeChannel(channel)
        }
      }

      // Set auth for realtime (if we have a session)
      supabase.realtime.setAuth(session.access_token)

      // Determine topic
      const topic = geoBin 
        ? `right_now:geo_bin:${geoBin}`
        : `right_now:city:${city}`

      console.log('[RIGHT NOW REALTIME] Subscribing to:', topic)

      // Subscribe to private channel
      const channel = supabase
        .channel(topic, {
          config: {
            private: true,
            broadcast: { self: false },
          },
        })
        .on('broadcast', { event: '*' }, (payload: any) => {
          console.log('[RIGHT NOW REALTIME] Broadcast received:', payload)

          const data = payload.payload as RealtimePayload

          if (data.type === 'INSERT' && data.new && onInsert) {
            // New post created
            onInsert(data.new)
          } else if (data.type === 'UPDATE' && data.new && onUpdate) {
            // Post updated (expired, deleted, shadow banned)
            onUpdate(data.new)
          } else if (data.type === 'DELETE' && data.old && onDelete) {
            // Post deleted
            onDelete(data.old.id)
          }
        })
        .subscribe((status) => {
          console.log('[RIGHT NOW REALTIME] Status:', status)
        })

      // Cleanup on unmount
      return () => {
        console.log('[RIGHT NOW REALTIME] Unsubscribing from:', topic)
        supabase.removeChannel(channel)
      }
    }

    setupRealtime()
  }, [city, geoBin, onInsert, onUpdate, onDelete])
}

/**
 * Simpler hook: just returns callbacks you can use
 */
export function useRightNowRealtimeCallbacks(city?: string, geoBin?: string) {
  const callbacks = {
    onInsert: useCallback((post: RightNowPost) => {
      console.log('[RIGHT NOW] New post:', post)
      // Dispatch custom event that components can listen to
      window.dispatchEvent(new CustomEvent('rightnow:insert', { detail: post }))
    }, []),

    onUpdate: useCallback((post: RightNowPost) => {
      console.log('[RIGHT NOW] Updated post:', post)
      window.dispatchEvent(new CustomEvent('rightnow:update', { detail: post }))
    }, []),

    onDelete: useCallback((postId: string) => {
      console.log('[RIGHT NOW] Deleted post:', postId)
      window.dispatchEvent(new CustomEvent('rightnow:delete', { detail: postId }))
    }, []),
  }

  useRightNowRealtime({
    city,
    geoBin,
    ...callbacks,
  })

  return callbacks
}