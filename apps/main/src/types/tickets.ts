// types/tickets.ts
// TypeScript types for TICKETS module (P2P marketplace)

export type TicketListingStatus = 'live' | 'pending_review' | 'sold' | 'removed';
export type TicketTransferMethod = 'digital_transfer' | 'pdf' | 'meet_in_person' | 'other';
export type TicketThreadStatus = 'open' | 'closed';

export interface TicketListing {
  id: string;
  beaconId: string;
  sellerUserId: string;
  status: TicketListingStatus;
  eventName: string;
  eventStartsAt: string | null;
  venue: string | null;
  city: string | null;
  quantity: number;
  priceCents: number;
  currency: string;
  transferMethod: TicketTransferMethod;
  notes: string | null;
  proofUrl: string | null;
  proofRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListingCard {
  listingId: string;
  status: TicketListingStatus;
  eventName: string;
  eventStartsAt: string | null;
  venue: string | null;
  city: string | null;
  quantity: number;
  priceCents: number;
  currency: string;
  transferMethod: TicketTransferMethod;
  notes: string | null;
  proofRequired: boolean;
}

export interface TicketThread {
  id: string;
  listingId: string;
  status: TicketThreadStatus;
  createdAt: string;
  closedAt: string | null;
}

export interface TicketThreadMember {
  threadId: string;
  userId: string;
  role: 'buyer' | 'seller';
}

export interface TicketMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
}

export interface TicketModerationEvent {
  id: string;
  listingId: string;
  actorUserId: string | null;
  action: string;
  reason: string | null;
  createdAt: string;
}

// RPC Response Types
export interface CreateListingResponse {
  listingId: string;
  status: TicketListingStatus;
}

export interface ListListingsResponse {
  items: TicketListingCard[];
}

export interface OpenThreadResponse {
  threadId: string;
}

export interface SendMessageResponse {
  messageId: string;
}

// Helper: Format price
export function formatPrice(priceCents: number, currency: string = 'GBP'): string {
  const amount = priceCents / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Helper: Get transfer method label
export function getTransferMethodLabel(method: TicketTransferMethod): string {
  const labels: Record<TicketTransferMethod, string> = {
    digital_transfer: 'Digital Transfer',
    pdf: 'PDF Download',
    meet_in_person: 'Meet in Person',
    other: 'Other',
  };
  return labels[method] || method;
}

// UI Microcopy
export const TICKETS_COPY = {
  keepSafe: 'Keep it safe: verify details. Report anything off.',
  reviewNote: 'Listings may be reviewed for safety.',
  noScams: 'No scams. No pressure.',
  
  createListingTitle: 'List Tickets',
  createListingDescription: 'Sell your tickets safely. All listings are reviewed.',
  
  eventNameLabel: 'Event Name',
  eventNamePlaceholder: 'e.g. "Printworks NYE 2025"',
  
  venueLabel: 'Venue',
  venuePlaceholder: 'e.g. "Ministry of Sound"',
  
  cityLabel: 'City',
  cityPlaceholder: 'e.g. "London"',
  
  quantityLabel: 'Quantity',
  quantityPlaceholder: '1-10 tickets',
  
  priceLabel: 'Price per ticket',
  pricePlaceholder: '£50.00',
  
  transferMethodLabel: 'Transfer Method',
  
  notesLabel: 'Additional Notes',
  notesPlaceholder: 'Any details buyers should know...',
  
  proofLabel: 'Proof of Purchase (Optional)',
  proofDescription: 'Upload a screenshot or PDF to build trust',
  
  browseListingsTitle: 'Available Tickets',
  browseListingsDescription: 'Message sellers to arrange safe transfers.',
  noListingsFound: 'No tickets available yet. Check back soon.',
  
  contactSellerButton: 'Contact Seller',
  
  statusLabels: {
    live: 'Available',
    pending_review: 'Pending Review',
    sold: 'Sold',
    removed: 'Removed',
  },
  
  messagePlaceholder: 'Type a message to the seller...',
  messageMaxLength: '2000 characters max',
  
  threadClosed: 'This conversation has ended.',
  markSoldButton: 'Mark as Sold',
  reportButton: 'Report Listing',
};
