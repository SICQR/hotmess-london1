/**
 * Notification Badge - Shows unread notification count
 */

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getUnreadCount } from '../lib/notifications-api';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { createClient } from '../lib/supabase';

interface NotificationBadgeProps {
  onClick?: () => void;
  className?: string;
}

export function NotificationBadge({ onClick, className = '' }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUnreadCount();
      
      // Poll for updates every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  async function loadUnreadCount() {
    if (!user) return;
    
    try {
      // Get current session to get access token
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUnreadCount(0);
        return;
      }
      
      const count = await getUnreadCount(session.access_token);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
      // Don't show mock count if error - just hide badge
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      className={`relative p-2 hover:bg-white/5 rounded-lg transition-colors ${className}`}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-5 h-5" />
      
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-hotmess-red to-hotmess-pink rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            <span className="text-[10px] font-black text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
