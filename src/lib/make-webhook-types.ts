// HOTMESS LONDON - Make.com Webhook Payload Types
// All payload interfaces for the 12 Make.com automation scenarios

export interface BeaconScanPayload {
  eventType: 'beacon.scanned';
  timestamp: string;
  beaconId: string;
  beaconCode: string;
  beaconType: string;
  beaconTitle: string;
  userId: string;
  userName: string;
  userXP: number;
  location: {
    venue: string;
    address: string;
    lat: number;
    lng: number;
    city: string;
  };
  scanContext: {
    platform: string;
    firstScan: boolean;
    streakDay: number;
    scansToday?: number;
  };
  xpEarned: number;
}

export interface OrderPlacedPayload {
  eventType: 'order.placed';
  timestamp: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderTotal: number;
  currency: string;
  items: Array<{
    productId: string;
    productSlug: string;
    productTitle: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    name: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  stripePaymentIntentId?: string;
}

export interface UserSignupPayload {
  eventType: 'user.signup';
  timestamp: string;
  userId: string;
  email: string;
  userName: string;
  signupMethod: 'email' | 'google' | 'github' | 'facebook';
  referralCode?: string;
  city?: string;
  age: number;
  agreedTerms: boolean;
  agreedAge: boolean;
}

export interface TicketPurchasedPayload {
  eventType: 'ticket.purchased';
  timestamp: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventAddress: string;
  ticketType: string;
  ticketPrice: number;
  ticketQuantity: number;
  ticketTotal: number;
  qrData: string;
}

export interface ListingCreatedPayload {
  eventType: 'listing.created';
  timestamp: string;
  listingId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  condition: string;
  city: string;
}

export interface RadioShowStartPayload {
  eventType: 'radio.show_start';
  timestamp: string;
  showId: string;
  showTitle: string;
  hostName: string;
  duration: number;
  genres: string[];
  coverImage: string;
}

export interface RecordReleasedPayload {
  eventType: 'record.released';
  timestamp: string;
  recordId: string;
  artistName: string;
  trackTitle: string;
  releaseType: 'single' | 'album' | 'ep';
  coverArt: string;
  spotifyUrl?: string;
  soundcloudUrl?: string;
  genre: string;
}

export interface AbuseReportedPayload {
  eventType: 'abuse.reported';
  timestamp: string;
  reportId: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'listing' | 'post' | 'message';
  targetId: string;
  targetName?: string;
  reason: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
}

export interface StripePayoutPayload {
  eventType: 'payout.paid';
  timestamp: string;
  payoutId: string;
  sellerId: string;
  sellerEmail: string;
  amount: number;
  currency: string;
  stripeAccountId: string;
  arrivalDate: string;
}

export type MakeWebhookPayload =
  | BeaconScanPayload
  | OrderPlacedPayload
  | UserSignupPayload
  | TicketPurchasedPayload
  | ListingCreatedPayload
  | RadioShowStartPayload
  | RecordReleasedPayload
  | AbuseReportedPayload
  | StripePayoutPayload;

export interface WebhookResponse {
  success: boolean;
  executionId?: string;
  error?: string;
}
