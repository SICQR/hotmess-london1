/**
 * @hotmess/telegram
 * Telegram bot SDK for HOTMESS platform
 * Supports bots, rooms, and 1:1 threads
 */

// Placeholder types for Telegram SDK
export interface TelegramBot {
  id: string;
  name: string;
  token: string;
}

export interface TelegramRoom {
  id: string;
  name: string;
  members: string[];
}

export interface TelegramThread {
  id: string;
  participants: [string, string];
  messages: TelegramMessage[];
}

export interface TelegramMessage {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
}

// Placeholder functions
export function createBot(name: string, token: string): TelegramBot {
  return { id: crypto.randomUUID(), name, token };
}

export function createRoom(name: string, members: string[]): TelegramRoom {
  return { id: crypto.randomUUID(), name, members };
}

export function createThread(user1: string, user2: string): TelegramThread {
  return { id: crypto.randomUUID(), participants: [user1, user2], messages: [] };
}

export function sendMessage(_threadId: string, from: string, content: string): TelegramMessage {
  return { id: crypto.randomUUID(), from, content, timestamp: new Date() };
}
