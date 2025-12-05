/**
 * NOTIFICATIONS CENTER
 * Real-time activity feed for users
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Check, CheckCheck, Trash2, Zap, Loader2, ArrowLeft, Filter } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  type Notification,
  type NotificationType
} from '../lib/notifications-api';
import { useUser } from '../contexts/UserContext';
import { createClient } from '../lib/supabase';

interface NotificationsProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
  onClose?: () => void;
}

type FilterType = 'all' | 'unread' | NotificationType;

export function Notifications({ onNavigate, onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { isAuthenticated, user } = useUser();

  // Get access token
  useEffect(() => {
    async function getToken() {
      if (isAuthenticated && user) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAccessToken(session.access_token);
        }
      }
    }
    getToken();
  }, [isAuthenticated, user]);

  // Load notifications
  useEffect(() => {
    if (accessToken) {
      loadNotifications();
      loadUnreadCount();
    } else {
      // Show mock data if not authenticated
      setNotifications(MOCK_NOTIFICATIONS);
      setUnreadCount(3);
      setLoading(false);
    }
  }, [filter, accessToken]);

  async function loadNotifications() {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const { notifications: data } = await getNotifications(accessToken, {
        limit: 50,
        unreadOnly: filter === 'unread'
      });

      let filtered = data;
      if (filter !== 'all' && filter !== 'unread') {
        filtered = data.filter(n => n.type === filter);
      }

      setNotifications(filtered);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Load mock data for demo
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }

  async function loadUnreadCount() {
    if (!accessToken) return;
    
    try {
      const count = await getUnreadCount(accessToken);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
      setUnreadCount(3); // Mock count
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    if (!accessToken) return;
    
    try {
      setActionLoading(notificationId);
      const { unreadCount: newCount } = await markAsRead(accessToken, notificationId);
      setUnreadCount(newCount);
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkAllAsRead() {
    if (!accessToken) return;
    
    try {
      setActionLoading('all');
      await markAllAsRead(accessToken);
      setUnreadCount(0);
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(notificationId: string) {
    if (!accessToken) return;
    
    try {
      setActionLoading(notificationId);
      await deleteNotification(accessToken, notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    } finally {
      setActionLoading(null);
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      onNavigate(notification.actionUrl, notification.actionParams);
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read);
  const hasUnread = unreadNotifications.length > 0;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">Notifications</h1>
                <p className="text-sm text-white/50">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>

            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={actionLoading === 'all'}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading === 'all' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                Mark All Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <FilterTab
              label="All"
              active={filter === 'all'}
              count={notifications.length}
              onClick={() => setFilter('all')}
            />
            <FilterTab
              label="Unread"
              active={filter === 'unread'}
              count={unreadCount}
              onClick={() => setFilter('unread')}
            />
            <FilterTab
              label="XP"
              icon="⚡"
              active={filter === 'xp_earned'}
              onClick={() => setFilter('xp_earned')}
            />
            <FilterTab
              label="Beacons"
              icon="📍"
              active={filter === 'beacon_scan'}
              onClick={() => setFilter('beacon_scan')}
            />
            <FilterTab
              label="Matches"
              icon="💕"
              active={filter === 'new_match'}
              onClick={() => setFilter('new_match')}
            />
            <FilterTab
              label="Events"
              icon="🎟️"
              active={filter === 'event_rsvp'}
              onClick={() => setFilter('event_rsvp')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/40" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                  onClick={() => handleNotificationClick(notification)}
                  isLoading={actionLoading === notification.id}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// Filter Tab Component
function FilterTab({
  label,
  icon,
  active,
  count,
  onClick
}: {
  label: string;
  icon?: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all
        ${active 
          ? 'bg-gradient-to-r from-hotmess-red to-hotmess-pink text-white' 
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      <span className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
        {count !== undefined && count > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-white/10'}`}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

// Notification Card
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  isLoading
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onClick: () => void;
  isLoading: boolean;
}) {
  const icon = notification.icon || NOTIFICATION_ICONS[notification.type];
  const colorClass = NOTIFICATION_COLORS[notification.type];
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        relative bg-gradient-to-br ${colorClass} border rounded-lg p-4
        ${!notification.read ? 'border-l-4' : ''}
        ${notification.actionUrl ? 'cursor-pointer hover:bg-white/5' : ''}
        transition-all group
      `}
      onClick={() => notification.actionUrl && onClick()}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div className="absolute top-3 right-3">
          <div className="size-2 rounded-full bg-hotmess-red animate-pulse" />
        </div>
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white mb-1">{notification.title}</h3>
          <p className="text-sm text-white/70 leading-relaxed">{notification.message}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-white/40">{timeAgo}</span>
            {notification.actionUrl && (
              <span className="text-xs text-hotmess-red font-bold uppercase">View →</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
            Mark Read
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isLoading}
          className="ml-auto px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 text-red-400 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
          Delete
        </button>
      </div>
    </motion.div>
  );
}

// Empty State
function EmptyState({ filter }: { filter: FilterType }) {
  const messages: Record<FilterType, { icon: string; title: string; message: string }> = {
    all: {
      icon: '🔔',
      title: 'No Notifications Yet',
      message: 'Your activity feed will appear here',
    },
    unread: {
      icon: '✅',
      title: 'All Caught Up!',
      message: 'No unread notifications',
    },
    beacon_scan: {
      icon: '📍',
      title: 'No Beacon Activity',
      message: 'Scan beacons to get started',
    },
    xp_earned: {
      icon: '⚡',
      title: 'No XP Earned Yet',
      message: 'Complete actions to earn XP',
    },
    level_up: {
      icon: '🎊',
      title: 'No Level Ups',
      message: 'Keep earning XP to level up',
    },
    new_match: {
      icon: '💕',
      title: 'No Matches Yet',
      message: 'Connect with others to get matches',
    },
    message: {
      icon: '💬',
      title: 'No Messages',
      message: 'Your messages will appear here',
    },
    event_rsvp: {
      icon: '🎟️',
      title: 'No Event RSVPs',
      message: 'RSVP to events to see updates',
    },
    product_shipped: {
      icon: '📦',
      title: 'No Shipments',
      message: 'Order tracking will appear here',
    },
    vendor_approved: {
      icon: '✅',
      title: 'No Vendor Updates',
      message: 'Vendor application updates appear here',
    },
    admin_action: {
      icon: '🛡️',
      title: 'No Admin Actions',
      message: 'Admin notifications appear here',
    },
    system: {
      icon: '⚙️',
      title: 'No System Alerts',
      message: 'System notifications appear here',
    },
  };

  const content = messages[filter] || messages.all;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="text-6xl mb-4">{content.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
      <p className="text-white/50 text-center">{content.message}</p>
    </motion.div>
  );
}

// Helper: Time ago formatter
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Mock notifications for demo
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: 'mock',
    type: 'beacon_scan',
    title: 'Beacon Scanned!',
    message: 'You scanned The Glory beacon and earned 50 XP',
    icon: '📍',
    actionUrl: 'beacons',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: 'mock',
    type: 'xp_earned',
    title: '+100 XP Earned',
    message: 'You completed your daily check-in streak!',
    icon: '⚡',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: 'mock',
    type: 'new_match',
    title: 'New Match!',
    message: 'Alex liked you back. Start chatting now!',
    icon: '💕',
    actionUrl: 'connect',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: 'mock',
    type: 'level_up',
    title: 'Level Up! 🎊',
    message: 'You\'ve reached Level 5! Keep going!',
    icon: '🎊',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    userId: 'mock',
    type: 'event_rsvp',
    title: 'Event Reminder',
    message: 'KLUB MESS starts in 2 hours at The Glory',
    icon: '🎟️',
    actionUrl: 'tickets',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
