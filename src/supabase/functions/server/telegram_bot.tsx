/**
 * TELEGRAM BOT INTEGRATION
 * Handles Telegram Bot API interactions for HOTMESS
 */

const BOT_TOKEN = Deno.env.get('HOTMESS_NEW_BOT_TOKEN') || '';
const BOT_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send a message via Telegram Bot API
 */
export async function sendMessage(
  chatId: string | number,
  text: string,
  options: {
    parse_mode?: 'Markdown' | 'HTML';
    reply_markup?: any;
    disable_web_page_preview?: boolean;
  } = {}
) {
  try {
    const response = await fetch(`${BOT_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parse_mode || 'Markdown',
        disable_web_page_preview: options.disable_web_page_preview ?? true,
        ...options,
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return null;
  }
}

/**
 * Create a private group/channel for 1:1 connections
 */
export async function createPrivateGroup(userId1: string, userId2: string, beaconName: string) {
  try {
    // In production, this would create a Telegram group with both users
    // For now, we return a mock group creation
    console.log(`Creating private group for ${userId1} and ${userId2} via beacon: ${beaconName}`);
    
    // This would use Telegram's createGroup or similar API
    // Since we need Telegram usernames/IDs, this is handled via bot conversation
    
    return {
      success: true,
      group_id: `hookup_${Date.now()}`,
      message: 'Private connection group created',
    };
  } catch (error) {
    console.error('Failed to create private group:', error);
    return null;
  }
}

/**
 * Send hookup connection notification to user
 */
export async function notifyHookupConnection(
  telegramUserId: string,
  connectionDetails: {
    type: 'room' | '1to1';
    beaconName: string;
    fromUser?: string;
    roomLink?: string;
    connectionId?: string;
  }
) {
  const { type, beaconName, fromUser, roomLink, connectionId } = connectionDetails;

  if (type === 'room') {
    // Room-based hookup notification
    const message = `
🔥 *HOTMESS HOOK-UP ZONE*

You've joined: *${beaconName}*

${roomLink ? `[Join the room](${roomLink})` : 'Opening room...'}

━━━━━━━━━━━━━━━━━━━━━━━━
*Remember:*
• Respect boundaries
• No screenshots
• Consent is ongoing
• You can leave anytime

Need support? Type /care
━━━━━━━━━━━━━━━━━━━━━━━━

MEN SUPPORTING MEN 🖤
    `.trim();

    return await sendMessage(telegramUserId, message, {
      parse_mode: 'Markdown',
    });
  } else {
    // 1:1 connection notification
    const message = `
🔥 *NEW CONNECTION*

${fromUser ? `*${fromUser}* ` : 'Someone '}wants to connect with you via *${beaconName}*.

━━━━━━━━━━━━━━━━━━━━━━━━
*Before you continue:*
• You're clear-minded
• You've thought about what you want
• You can stop anytime

━━━━━━━━━━━━━━━━━━━━━━━━

Reply to start chatting, or type /decline to pass.

Connection ID: \`${connectionId}\`
    `.trim();

    return await sendMessage(telegramUserId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Accept & Connect', callback_data: `hookup_accept_${connectionId}` },
            { text: '❌ Not Tonight', callback_data: `hookup_decline_${connectionId}` },
          ],
          [
            { text: '🆘 Care Resources', callback_data: 'hookup_care' },
          ],
        ],
      },
    });
  }
}

/**
 * Send consent check-in message
 */
export async function sendConsentCheckIn(
  telegramUserId: string,
  beaconName: string,
  mode: 'room' | '1to1'
) {
  const checkItems = mode === 'room'
    ? [
        '✓ Respect boundaries and consent',
        '✓ No screenshots without permission',
        '✓ What happens here stays here',
        '✓ You can leave anytime',
      ]
    : [
        '✓ I\'m clear-minded and sober',
        '✓ I\'ve thought about what I want',
        '✓ I\'m okay to stop if it doesn\'t feel right',
        '✓ I won\'t screenshot or share without consent',
      ];

  const message = `
🖤 *CONSENT CHECK-IN*

Before joining *${beaconName}*:

${checkItems.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━

Ready to continue?
  `.trim();

  return await sendMessage(telegramUserId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ I Agree - Continue', callback_data: 'consent_agree' },
        ],
        [
          { text: '❌ Not Tonight', callback_data: 'consent_decline' },
          { text: '🆘 Care', callback_data: 'consent_care' },
        ],
      ],
    },
  });
}

/**
 * Send care resources
 */
export async function sendCareResources(telegramUserId: string) {
  const message = `
💜 *CARE RESOURCES*

If anything feels off or you need support:

🆘 *Immediate Support:*
• Type /care anytime
• DM @hotmess_care_bot
• Visit hotmessldn.com/care

📞 *Crisis Lines:*
• Switchboard LGBT+ Helpline: 0300 330 0630
• Samaritans: 116 123
• LGBT Foundation: 0345 3 30 30 30

━━━━━━━━━━━━━━━━━━━━━━━━

You're not alone. Men supporting men. 🖤

━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return await sendMessage(telegramUserId, message, {
    parse_mode: 'Markdown',
  });
}

/**
 * Handle hookup bot commands
 */
export async function handleHookupCommand(
  command: string,
  userId: string,
  args?: string[]
): Promise<string> {
  switch (command) {
    case '/care':
      await sendCareResources(userId);
      return 'Care resources sent.';

    case '/decline':
      return 'Connection declined. That\'s totally okay. Take care of yourself. 🖤';

    case '/report':
      return 'Report filed. Our moderation team will review this immediately. Thank you for keeping our community safe.';

    case '/help':
      return `
🔥 *HOTMESS HOOK-UP BOT COMMANDS*

/care - Get care and support resources
/report - Report safety concern or abuse
/decline - Decline a connection
/help - Show this message

━━━━━━━━━━━━━━━━━━━━━━━━

For more: hotmessldn.com/hookup
      `.trim();

    default:
      return 'Unknown command. Type /help for available commands.';
  }
}

/**
 * Create inline keyboard for consent flow
 */
export function createConsentKeyboard(beaconId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ I Understand - Continue', callback_data: `consent_yes_${beaconId}` },
      ],
      [
        { text: '❌ Not Tonight', callback_data: `consent_no_${beaconId}` },
        { text: '🆘 Need Support', callback_data: 'consent_care' },
      ],
    ],
  };
}

/**
 * Send welcome message to hookup room
 */
export async function sendRoomWelcome(
  roomId: string,
  userName: string,
  isFirstJoin: boolean = false
) {
  const message = isFirstJoin
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WELCOME TO THE HOOK-UP ZONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Men-only. 18+. Consent-first.

*VIBES ARE LIVE. KEEP IT SMOOTH:*
✓ Respect boundaries
✓ No screenshots
✓ No outing
✓ No pressure
✓ Stop anytime

If anything feels off → /care
If someone breaks rules → /report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEN SUPPORTING MEN 🖤
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()
    : `Welcome @${userName}. Take your time, keep it real, speak respectfully. 🖤`;

  return await sendMessage(roomId, message, {
    parse_mode: 'Markdown',
  });
}

/**
 * Send moderation warning
 */
export async function sendModerationWarning(
  userId: string,
  reason: string,
  severity: 'warning' | 'mute' | 'ban'
) {
  const messages = {
    warning: `⚠️ Warning: ${reason}\n\nPlease respect the community guidelines. Next violation may result in removal.`,
    mute: `🔇 You've been muted for: ${reason}\n\nYou can return after 30 minutes. Please reflect on community guidelines.`,
    ban: `🚫 You've been removed for: ${reason}\n\nThis violation of consent and safety is not acceptable in HOTMESS spaces.`,
  };

  return await sendMessage(userId, messages[severity], {
    parse_mode: 'Markdown',
  });
}

/**
 * Get chat/user info
 */
export async function getChatInfo(chatId: string | number) {
  try {
    const response = await fetch(`${BOT_API}/getChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId }),
    });

    const data = await response.json();
    return data.ok ? data.result : null;
  } catch (error) {
    console.error('Failed to get chat info:', error);
    return null;
  }
}

/**
 * Create invite link for private group
 */
export async function createInviteLink(chatId: string | number, expiresIn?: number) {
  try {
    const response = await fetch(`${BOT_API}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        expire_date: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined,
        member_limit: 2, // For 1:1 connections
      }),
    });

    const data = await response.json();
    return data.ok ? data.result.invite_link : null;
  } catch (error) {
    console.error('Failed to create invite link:', error);
    return null;
  }
}

export default {
  sendMessage,
  createPrivateGroup,
  notifyHookupConnection,
  sendConsentCheckIn,
  sendCareResources,
  handleHookupCommand,
  createConsentKeyboard,
  sendRoomWelcome,
  sendModerationWarning,
  getChatInfo,
  createInviteLink,
};