/**
 * Frontend API for Notifications System
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

export type NotificationType = 
  | 'beacon_scan'
  | 'xp_earned'
  | 'level_up'
  | 'new_match'
  | 'message'
  | 'event_rsvp'
  | 'product_shipped'
  | 'vendor_approved'
  | 'admin_action'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionParams?: Record<string, string>;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/notifications`;

/**
 * Get user's notifications
 */
export async function getNotifications(
  accessToken: string,
  options?: {
    limit?: number;
    unreadOnly?: boolean;
  }
): Promise<{ notifications: Notification[]; total: number }> {
  const params = new URLSearchParams();
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.unreadOnly) params.set('unreadOnly', 'true');

  const url = `${API_BASE}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  const data = await response.json();
  return {
    notifications: data.notifications || [],
    total: data.total || 0,
  };
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(accessToken: string): Promise<number> {
  const response = await fetch(`${API_BASE}/count`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notification count');
  }

  const data = await response.json();
  return data.count || 0;
}

/**
 * Mark notification as read
 */
export async function markAsRead(
  accessToken: string,
  notificationId: string
): Promise<{ unreadCount: number }> {
  const response = await fetch(`${API_BASE}/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }

  const data = await response.json();
  return { unreadCount: data.unreadCount || 0 };
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE}/read-all`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark all as read');
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(
  accessToken: string,
  notificationId: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
}

/**
 * Create notification (admin/system use)
 */
export async function createNotification(
  accessToken: string,
  notification: {
    targetUserId: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    actionUrl?: string;
    actionParams?: Record<string, string>;
    metadata?: Record<string, any>;
  }
): Promise<Notification> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }

  const data = await response.json();
  return data.notification;
}

// Icon mapping for notification types
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  beacon_scan: '📍',
  xp_earned: '⚡',
  level_up: '🎊',
  new_match: '💕',
  message: '💬',
  event_rsvp: '🎟️',
  product_shipped: '📦',
  vendor_approved: '✅',
  admin_action: '🛡️',
  system: '⚙️',
};

// Color mapping for notification types
export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  beacon_scan: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
  xp_earned: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  level_up: 'from-pink-500/20 to-red-500/20 border-pink-500/30',
  new_match: 'from-red-500/20 to-pink-500/20 border-red-500/30',
  message: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  event_rsvp: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  product_shipped: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
  vendor_approved: 'from-green-500/20 to-teal-500/20 border-green-500/30',
  admin_action: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  system: 'from-zinc-500/20 to-gray-500/20 border-zinc-500/30',
};
