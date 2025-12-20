// types/connect.ts
// TypeScript types for CONNECT module (mutual opt-in networking)

export type ConnectIntentStatus = 'live' | 'expired' | 'cancelled';
export type ConnectOptinStatus = 'pending' | 'matched' | 'withdrawn' | 'declined';
export type ConnectThreadStatus = 'open' | 'closed';

export interface ConnectIntent {
  id: string;
  publicId: string;
  beaconId: string;
  userId: string;
  status: ConnectIntentStatus;
  tags: string[];
  createdAt: string;
  expiresAt: string;
}

export interface ConnectIntentCard {
  publicId: string;
  tags: string[];
  expiresAt: string;
  createdAt: string;
}

export interface ConnectOptin {
  id: string;
  fromUserId: string;
  toIntentId: string;
  status: ConnectOptinStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectThread {
  id: string;
  beaconId: string;
  status: ConnectThreadStatus;
  createdAt: string;
  closedAt: string | null;
  closeReason: string | null;
}

export interface ConnectThreadMember {
  threadId: string;
  userId: string;
  role: string;
}

export interface ConnectMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
}

// RPC Response Types
export interface CreateIntentResponse {
  intentId: string;
  publicId: string;
  expiresAt: string;
}

export interface ListIntentsResponse {
  items: ConnectIntentCard[];
}

export interface OptInResponse {
  status: 'pending' | 'matched';
  threadId?: string;
}

export interface SendMessageResponse {
  messageId: string;
}

// UI Microcopy
export const CONNECT_COPY = {
  mutualOptIn: 'Mutual opt-in only.',
  consentFirst: 'Consent-first. You can stop anytime.',
  noUnsolicited: 'No unsolicited contact. Ever.',
  
  createIntentTitle: 'Create Intent',
  createIntentDescription: 'Share what you\'re into. Others can opt-in if they\'re interested.',
  tagsLabel: 'Tags (max 3)',
  tagsPlaceholder: 'e.g. "techno", "after hours", "warehouse"',
  
  browseIntentsTitle: 'Browse Intents',
  browseIntentsDescription: 'Opt-in to connect. Both sides must agree.',
  noIntentsFound: 'No intents yet. Create one to get started.',
  
  optInButton: 'Opt In',
  optInPending: 'Waiting for mutual opt-in...',
  optInMatched: 'It\'s a match! Start chatting.',
  
  threadClosed: 'This conversation has ended.',
  closeThreadButton: 'End Conversation',
  closeThreadConfirm: 'Are you sure? This can\'t be undone.',
  
  messagePlaceholder: 'Type a message...',
  messageMaxLength: '2000 characters max',
};
