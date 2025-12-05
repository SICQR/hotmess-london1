/**
 * HOTMESS Notifications API
 * Real-time activity feed for users
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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
  icon?: string; // emoji or icon name
  actionUrl?: string; // route to navigate when clicked
  actionParams?: Record<string, string>;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>; // extra context data
}

// Generate notification ID
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Get KV key for user notifications
function getUserNotificationsKey(userId: string): string {
  return `notifications:user:${userId}`;
}

// Get KV key for unread count
function getUnreadCountKey(userId: string): string {
  return `notifications:unread:${userId}`;
}

/**
 * POST /notifications - Create notification
 */
app.post('/', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { targetUserId, type, title, message, icon, actionUrl, actionParams, metadata } = body;

    // Validate required fields
    if (!targetUserId || !type || !title || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const notification: Notification = {
      id: generateNotificationId(),
      userId: targetUserId,
      type,
      title,
      message,
      icon,
      actionUrl,
      actionParams,
      read: false,
      createdAt: new Date().toISOString(),
      metadata
    };

    // Get existing notifications
    const key = getUserNotificationsKey(targetUserId);
    const existing = await kv.get<Notification[]>(key) || [];

    // Add new notification to front
    const updated = [notification, ...existing];

    // Keep only last 100 notifications
    const trimmed = updated.slice(0, 100);

    // Save notifications
    await kv.set(key, trimmed);

    // Update unread count
    const unreadCount = trimmed.filter(n => !n.read).length;
    await kv.set(getUnreadCountKey(targetUserId), unreadCount);

    return c.json({
      success: true,
      notification
    });

  } catch (error: any) {
    console.error('❌ Error creating notification:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /notifications - Get user's notifications
 */
app.get('/', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const limit = parseInt(c.req.query('limit') || '50');
    const unreadOnly = c.req.query('unreadOnly') === 'true';

    const key = getUserNotificationsKey(user.id);
    let notifications = await kv.get<Notification[]>(key) || [];

    // Filter unread if requested
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    // Apply limit
    notifications = notifications.slice(0, limit);

    return c.json({
      success: true,
      notifications,
      total: notifications.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching notifications:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /notifications/count - Get unread count
 */
app.get('/count', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const count = await kv.get<number>(getUnreadCountKey(user.id)) || 0;

    return c.json({
      success: true,
      count
    });

  } catch (error: any) {
    console.error('❌ Error fetching notification count:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PUT /notifications/:id/read - Mark notification as read
 */
app.put('/:id/read', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    const key = getUserNotificationsKey(user.id);
    const notifications = await kv.get<Notification[]>(key) || [];

    // Find and mark as read
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );

    await kv.set(key, updated);

    // Update unread count
    const unreadCount = updated.filter(n => !n.read).length;
    await kv.set(getUnreadCountKey(user.id), unreadCount);

    return c.json({
      success: true,
      unreadCount
    });

  } catch (error: any) {
    console.error('❌ Error marking notification as read:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PUT /notifications/read-all - Mark all as read
 */
app.put('/read-all', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const key = getUserNotificationsKey(user.id);
    const notifications = await kv.get<Notification[]>(key) || [];

    // Mark all as read
    const updated = notifications.map(n => ({ ...n, read: true }));

    await kv.set(key, updated);
    await kv.set(getUnreadCountKey(user.id), 0);

    return c.json({
      success: true,
      unreadCount: 0
    });

  } catch (error: any) {
    console.error('❌ Error marking all as read:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /notifications/:id - Delete notification
 */
app.delete('/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    const key = getUserNotificationsKey(user.id);
    const notifications = await kv.get<Notification[]>(key) || [];

    // Remove notification
    const updated = notifications.filter(n => n.id !== notificationId);

    await kv.set(key, updated);

    // Update unread count
    const unreadCount = updated.filter(n => !n.read).length;
    await kv.set(getUnreadCountKey(user.id), unreadCount);

    return c.json({
      success: true
    });

  } catch (error: any) {
    console.error('❌ Error deleting notification:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
