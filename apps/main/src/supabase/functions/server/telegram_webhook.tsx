/**
 * TELEGRAM BOT WEBHOOK HANDLER
 * Processes incoming Telegram updates for HOTMESS hookup beacons
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import telegramBot from './telegram_bot.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * POST /telegram/webhook
 * Receives updates from Telegram Bot API
 */
app.post('/webhook', async (c) => {
  try {
    const update = await c.req.json();
    console.log('Telegram webhook update:', JSON.stringify(update, null, 2));

    // Handle callback query (button presses)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return c.json({ ok: true });
    }

    // Handle regular messages
    if (update.message) {
      await handleMessage(update.message);
      return c.json({ ok: true });
    }

    return c.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Internal error' }, 500);
  }
});

/**
 * Handle callback query (inline button presses)
 */
async function handleCallbackQuery(query: any) {
  const { data, from, message } = query;
  const userId = from.id.toString();

  console.log(`Callback query from ${userId}: ${data}`);

  // Hookup accept/decline
  if (data.startsWith('hookup_accept_')) {
    const connectionId = data.replace('hookup_accept_', '');
    await handleHookupAccept(userId, connectionId, message.chat.id);
    return;
  }

  if (data.startsWith('hookup_decline_')) {
    const connectionId = data.replace('hookup_decline_', '');
    await handleHookupDecline(userId, connectionId, message.chat.id);
    return;
  }

  // Care resources
  if (data === 'hookup_care' || data === 'consent_care') {
    await telegramBot.sendCareResources(message.chat.id);
    return;
  }

  // Consent flow
  if (data.startsWith('consent_yes_')) {
    const beaconId = data.replace('consent_yes_', '');
    await handleConsentAccept(userId, beaconId, message.chat.id);
    return;
  }

  if (data.startsWith('consent_no_')) {
    await telegramBot.sendMessage(
      message.chat.id,
      'No worries. Take care of yourself. 🖤',
      { parse_mode: 'Markdown' }
    );
    return;
  }
}

/**
 * Handle regular text messages
 */
async function handleMessage(message: any) {
  const { text, from, chat } = message;
  const userId = from.id.toString();

  if (!text) return;

  console.log(`Message from ${userId}: ${text}`);

  // Handle commands
  if (text.startsWith('/')) {
    const [command, ...args] = text.split(' ');
    const response = await telegramBot.handleHookupCommand(command, userId, args);
    
    if (response) {
      await telegramBot.sendMessage(chat.id, response, { parse_mode: 'Markdown' });
    }
    return;
  }

  // Handle regular messages in connection threads
  // (Would route to appropriate 1:1 connection based on chat context)
}

/**
 * Handle hookup connection acceptance
 */
async function handleHookupAccept(userId: string, connectionId: string, chatId: number) {
  try {
    // Get connection details
    const connection = await kv.get(connectionId);
    
    if (!connection) {
      await telegramBot.sendMessage(chatId, '❌ Connection not found or expired.', {
        parse_mode: 'Markdown',
      });
      return;
    }

    if (connection.status !== 'initiated') {
      await telegramBot.sendMessage(chatId, '❌ This connection has already been handled.', {
        parse_mode: 'Markdown',
      });
      return;
    }

    // Update connection status
    connection.status = 'accepted';
    connection.accepted_at = new Date().toISOString();
    await kv.set(connectionId, connection);

    // Get beacon details
    const beacon = await kv.get(`beacon:${connection.beacon_id}`);
    
    if (!beacon) {
      await telegramBot.sendMessage(chatId, '❌ Beacon not found.', {
        parse_mode: 'Markdown',
      });
      return;
    }

    // Notify both users
    await telegramBot.sendMessage(
      chatId,
      `✅ *Connection Accepted*\n\nYou're now connected via *${beacon.name}*.\n\nYou can start chatting now. Remember:\n• Respect boundaries\n• No screenshots\n• Consent is ongoing\n\n🖤`,
      { parse_mode: 'Markdown' }
    );

    // Notify scanner
    const scannerProfile = await kv.get(`user_profile:${connection.scanner_id}`);
    if (scannerProfile?.telegram) {
      await telegramBot.sendMessage(
        scannerProfile.telegram,
        `✅ *Connection Accepted*\n\nThey've accepted your connection request!\n\nYou can start chatting now. Remember:\n• Respect boundaries\n• No screenshots\n• Consent is ongoing\n\n🖤`,
        { parse_mode: 'Markdown' }
      );
    }

    // Award XP to target user
    const targetXP = await kv.get(`xp:${userId}`) || { total: 0 };
    await kv.set(`xp:${userId}`, {
      ...targetXP,
      total: (targetXP.total || 0) + 5, // Small XP for accepting
    });

  } catch (error) {
    console.error('Error handling hookup accept:', error);
    await telegramBot.sendMessage(
      chatId,
      '❌ Something went wrong. Please try again or contact support.',
      { parse_mode: 'Markdown' }
    );
  }
}

/**
 * Handle hookup connection decline
 */
async function handleHookupDecline(userId: string, connectionId: string, chatId: number) {
  try {
    // Get connection details
    const connection = await kv.get(connectionId);
    
    if (!connection) {
      await telegramBot.sendMessage(chatId, '✅ No problem. Take care. 🖤', {
        parse_mode: 'Markdown',
      });
      return;
    }

    // Update connection status
    connection.status = 'declined';
    connection.declined_at = new Date().toISOString();
    await kv.set(connectionId, connection);

    await telegramBot.sendMessage(
      chatId,
      '✅ *Not Tonight*\n\nConnection declined. That\'s totally okay.\n\nTake care of yourself. 🖤',
      { parse_mode: 'Markdown' }
    );

    // Notify scanner (gently)
    const scannerProfile = await kv.get(`user_profile:${connection.scanner_id}`);
    if (scannerProfile?.telegram) {
      await telegramBot.sendMessage(
        scannerProfile.telegram,
        '🖤 *Connection Not Accepted*\n\nThey\'re not interested right now. That\'s okay.\n\nKeep being respectful. There are other men out there. 🖤',
        { parse_mode: 'Markdown' }
      );
    }

  } catch (error) {
    console.error('Error handling hookup decline:', error);
    await telegramBot.sendMessage(
      chatId,
      '✅ No worries. Take care. 🖤',
      { parse_mode: 'Markdown' }
    );
  }
}

/**
 * Handle consent acceptance
 */
async function handleConsentAccept(userId: string, beaconId: string, chatId: number) {
  try {
    const beacon = await kv.get(`beacon:${beaconId}`);
    
    if (!beacon) {
      await telegramBot.sendMessage(chatId, '❌ Beacon not found.', {
        parse_mode: 'Markdown',
      });
      return;
    }

    if (beacon.mode === 'room') {
      const roomLink = `https://t.me/${beacon.telegram_room_id}`;
      
      await telegramBot.sendMessage(
        chatId,
        `✅ *Consent Confirmed*\n\nWelcome to *${beacon.name}*.\n\n[Join the room](${roomLink})\n\nKeep it respectful. Stay safe. 🖤`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await telegramBot.sendMessage(
        chatId,
        `✅ *Consent Confirmed*\n\nConnection is being established.\n\nYou'll be notified when the other person responds. 🖤`,
        { parse_mode: 'Markdown' }
      );
    }

  } catch (error) {
    console.error('Error handling consent accept:', error);
  }
}

/**
 * GET /telegram/webhook-info
 * Get webhook info
 */
app.get('/webhook-info', async (c) => {
  const BOT_TOKEN = Deno.env.get('HOTMESS_NEW_BOT_TOKEN') || '';
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
  const data = await response.json();
  return c.json(data);
});

/**
 * POST /telegram/set-webhook
 * Set webhook URL
 */
app.post('/set-webhook', async (c) => {
  try {
    const { url } = await c.req.json();
    
    if (!url) {
      return c.json({ error: 'URL required' }, 400);
    }

    const BOT_TOKEN = Deno.env.get('HOTMESS_NEW_BOT_TOKEN') || '';
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error setting webhook:', error);
    return c.json({ error: 'Failed to set webhook' }, 500);
  }
});

/**
 * POST /telegram/delete-webhook
 * Delete webhook
 */
app.post('/delete-webhook', async (c) => {
  try {
    const BOT_TOKEN = Deno.env.get('HOTMESS_NEW_BOT_TOKEN') || '';
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return c.json({ error: 'Failed to delete webhook' }, 500);
  }
});

export default app;
