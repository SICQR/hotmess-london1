/**
 * HOTMESS LONDON — CLUB MODE SERVICE
 * 
 * Complete B2B ticketing system for venues:
 * - Event management
 * - Ticket tiers (GA, VIP, Guestlist)
 * - Door scanner mode
 * - Real-time capacity tracking
 * - Promoter attribution
 * - Settlement reports
 * 
 * This is the P0 B2B feature that drives club partnerships.
 */

import { supabase as supabaseClient } from '../supabase';

const supabase: any = supabaseClient;

// ============================================================================
// TYPES
// ============================================================================

export interface Club {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  website?: string;
  address?: string;
  city_id?: string;
  lat?: number;
  lng?: number;
  owner_id: string;
  door_staff?: string[];
  managers?: string[];
  stripe_account_id?: string;
  onboarding_complete: boolean;
  payouts_enabled: boolean;
  subscription_tier?: 'starter' | 'pro' | 'enterprise';
  subscription_started_at?: string;
  subscription_ends_at?: string;
  status: 'pending' | 'active' | 'suspended';
  verified: boolean;
  total_events: number;
  total_tickets_sold: number;
  total_revenue: number;
  default_capacity?: number;
  default_age_restriction?: number;
  gender_policy?: 'men_only' | 'all_genders' | 'women_only';
}

export interface ClubEvent {
  id: string;
  club_id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  lineup?: string[];
  start_time: string;
  end_time?: string;
  doors_open?: string;
  timezone?: string;
  venue_name?: string;
  address?: string;
  city_id?: string;
  capacity?: number;
  capacity_ga?: number;
  capacity_vip?: number;
  price_ga?: number; // in cents
  price_vip?: number; // in cents
  guestlist?: any[];
  status: 'draft' | 'upcoming' | 'live' | 'ended' | 'cancelled';
  age_restriction?: number;
  gender_policy?: 'men_only' | 'all_genders' | 'women_only';
  dress_code?: string;
  event_beacon_id?: string;
  checkin_beacon_id?: string;
  tickets_sold: number;
  tickets_sold_ga: number;
  tickets_sold_vip: number;
  revenue: number; // in cents
  checked_in_count: number;
  promoters?: any[];
}

export interface Ticket {
  id: string;
  type: 'club_primary';
  event_id: string;
  tier: 'ga' | 'vip' | 'guestlist';
  buyer_id: string;
  price: number; // in cents
  fee_buyer: number;
  status: 'purchased' | 'checked_in' | 'cancelled';
  qr_code: string;
  access_beacon_id?: string;
  purchased_at: string;
  checked_in_at?: string;
  checked_in_by?: string;
  checked_in_location?: any;
  promoter_id?: string;
  promoter_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface DoorScanResult {
  success: boolean;
  ticket?: Ticket;
  event?: ClubEvent;
  message: string;
  allow_entry: boolean;
}

// ============================================================================
// CLUB MANAGEMENT
// ============================================================================

/**
 * Create a new club
 */
export async function createClub(data: {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city_id?: string;
  lat?: number;
  lng?: number;
  default_capacity?: number;
}): Promise<{ ok: true; club: Club } | { ok: false; error: string }> {
  try {
    const { data: club, error } = await supabase
      .from('clubs')
      .insert({
        ...data,
        status: 'pending',
        verified: false,
        onboarding_complete: false,
        total_events: 0,
        total_tickets_sold: 0,
        total_revenue: 0
      })
      .select()
      .single();

    if (error) throw error;

    return { ok: true, club };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to create club' };
  }
}

/**
 * Get club by ID
 */
export async function getClub(clubId: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', clubId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get club by slug
 */
export async function getClubBySlug(slug: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Update club
 */
export async function updateClub(
  clubId: string,
  updates: Partial<Club>
): Promise<{ ok: true; club: Club } | { ok: false; error: string }> {
  try {
    const { data: club, error } = await supabase
      .from('clubs')
      .update(updates)
      .eq('id', clubId)
      .select()
      .single();

    if (error) throw error;

    return { ok: true, club };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to update club' };
  }
}

/**
 * Add door staff member
 */
export async function addDoorStaff(
  clubId: string,
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // Get current door_staff array
    const club = await getClub(clubId);
    if (!club) throw new Error('Club not found');

    const currentStaff = club.door_staff || [];
    if (currentStaff.includes(userId)) {
      return { ok: true }; // Already added
    }

    // Add to array
    const { error } = await supabase
      .from('clubs')
      .update({
        door_staff: [...currentStaff, userId]
      })
      .eq('id', clubId);

    if (error) throw error;

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to add door staff' };
  }
}

// ============================================================================
// EVENT MANAGEMENT
// ============================================================================

/**
 * Create a new event
 */
export async function createEvent(data: {
  club_id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  lineup?: string[];
  start_time: string;
  end_time?: string;
  doors_open?: string;
  capacity?: number;
  capacity_ga?: number;
  capacity_vip?: number;
  price_ga?: number;
  price_vip?: number;
  age_restriction?: number;
  gender_policy?: 'men_only' | 'all_genders' | 'women_only';
}): Promise<{ ok: true; event: ClubEvent; beacons: any[] } | { ok: false; error: string }> {
  try {
    // Create event
    const { data: event, error: eventError } = await supabase
      .from('club_events')
      .insert({
        ...data,
        status: 'draft',
        tickets_sold: 0,
        tickets_sold_ga: 0,
        tickets_sold_vip: 0,
        revenue: 0,
        checked_in_count: 0
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Generate beacons for event
    const beacons = await generateEventBeacons(event);

    // Update event with beacon IDs
    await supabase
      .from('club_events')
      .update({
        event_beacon_id: beacons.find(b => b.type === 'event')?.id,
        checkin_beacon_id: beacons.find(b => b.type === 'checkin')?.id
      })
      .eq('id', event.id);

    return { ok: true, event, beacons };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to create event' };
  }
}

/**
 * Generate beacons for an event
 */
async function generateEventBeacons(event: ClubEvent): Promise<any[]> {
  const beacons: any[] = [];

  // 1. Main event beacon (for browsing/purchasing)
  const { data: eventBeacon } = await supabase
    .from('beacons')
    .insert({
      type: 'event',
      title: event.name,
      description: event.description,
      geo_lat: null, // Will be set if club has location
      geo_lng: null,
      radius_m: 150,
      starts_at: event.start_time,
      ends_at: event.end_time || new Date(new Date(event.start_time).getTime() + 8 * 60 * 60 * 1000).toISOString(), // +8h default
      requires_gps: false,
      config: {
        event_id: event.id,
        xp_amount: 15
      },
      status: 'active'
    })
    .select()
    .single();

  if (eventBeacon) beacons.push(eventBeacon);

  // 2. Check-in beacon (for door scanning)
  const { data: checkinBeacon } = await supabase
    .from('beacons')
    .insert({
      type: 'checkin',
      title: `${event.name} - Check In`,
      description: 'Scan at door for entry',
      geo_lat: null,
      geo_lng: null,
      radius_m: 50, // Tight radius for door
      starts_at: event.doors_open || event.start_time,
      ends_at: event.end_time || new Date(new Date(event.start_time).getTime() + 8 * 60 * 60 * 1000).toISOString(),
      requires_gps: true, // Must be at venue
      config: {
        event_id: event.id,
        xp_amount: 10,
        door_only: true
      },
      status: 'active'
    })
    .select()
    .single();

  if (checkinBeacon) beacons.push(checkinBeacon);

  return beacons;
}

/**
 * Get event by ID
 */
export async function getEvent(eventId: string): Promise<ClubEvent | null> {
  const { data, error } = await supabase
    .from('club_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get events for a club
 */
export async function getClubEvents(
  clubId: string,
  status?: ClubEvent['status']
): Promise<ClubEvent[]> {
  let query = supabase
    .from('club_events')
    .select('*')
    .eq('club_id', clubId)
    .order('start_time', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data;
}

/**
 * Publish event (make live for ticket sales)
 */
export async function publishEvent(
  eventId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { error } = await supabase
      .from('club_events')
      .update({ status: 'upcoming' })
      .eq('id', eventId);

    if (error) throw error;

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to publish event' };
  }
}

// ============================================================================
// TICKETING
// ============================================================================

/**
 * Purchase ticket
 */
export async function purchaseTicket(data: {
  event_id: string;
  tier: 'ga' | 'vip';
  buyer_id: string;
  promoter_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): Promise<{ ok: true; ticket: Ticket; qrCode: string } | { ok: false; error: string }> {
  try {
    // Get event
    const event = await getEvent(data.event_id);
    if (!event) throw new Error('Event not found');

    // Check capacity
    const tierCapacity = data.tier === 'ga' ? event.capacity_ga : event.capacity_vip;
    const tierSold = data.tier === 'ga' ? event.tickets_sold_ga : event.tickets_sold_vip;
    
    if (tierCapacity && tierSold >= tierCapacity) {
      return { ok: false, error: 'This tier is sold out' };
    }

    // Calculate price
    const price = data.tier === 'ga' ? event.price_ga || 0 : event.price_vip || 0;
    const buyerFee = Math.round(price * 0.10); // 10% buyer fee

    // Generate QR code
    const qrCode = generateTicketQR();

    // Find promoter if code provided
    let promoter_id: string | undefined;
    if (data.promoter_code) {
      // Look up promoter by code
      // This would query a promoters table or event.promoters JSONB
    }

    // Create ticket
    const { data: ticket, error } = await supabase
      .from('club_tickets')
      .insert({
        type: 'club_primary',
        event_id: data.event_id,
        tier: data.tier,
        buyer_id: data.buyer_id,
        price,
        fee_buyer: buyerFee,
        status: 'purchased',
        qr_code: qrCode,
        promoter_id,
        promoter_code: data.promoter_code,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign
      })
      .select()
      .single();

    if (error) throw error;

    // Update event stats
    await supabase.rpc('increment_event_ticket_sales', {
      event_id: data.event_id,
      tier: data.tier,
      amount: price
    });

    return { ok: true, ticket, qrCode };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Failed to purchase ticket' };
  }
}

function generateTicketQR(): string {
  // Generate unique ticket QR code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TIX-';
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Get ticket by QR code
 */
export async function getTicketByQR(qrCode: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('club_tickets')
    .select('*')
    .eq('qr_code', qrCode)
    .single();

  if (error || !data) return null;
  return data;
}

// ============================================================================
// DOOR SCANNER
// ============================================================================

/**
 * Scan ticket at door (validate and check in)
 */
export async function scanTicketAtDoor(
  qrCode: string,
  staffId: string,
  lat?: number,
  lng?: number
): Promise<DoorScanResult> {
  try {
    // Get ticket
    const ticket = await getTicketByQR(qrCode);
    if (!ticket) {
      return {
        success: false,
        message: 'Ticket not found',
        allow_entry: false
      };
    }

    // Get event
    const event = await getEvent(ticket.event_id);
    if (!event) {
      return {
        success: false,
        message: 'Event not found',
        allow_entry: false
      };
    }

    // Check if already checked in
    if (ticket.status === 'checked_in') {
      return {
        success: false,
        ticket,
        event,
        message: 'Ticket already used',
        allow_entry: false
      };
    }

    // Check if ticket is cancelled
    if (ticket.status === 'cancelled') {
      return {
        success: false,
        ticket,
        event,
        message: 'Ticket cancelled',
        allow_entry: false
      };
    }

    // Verify staff has permission
    const club = await getClub(event.club_id);
    if (!club) {
      return {
        success: false,
        message: 'Club not found',
        allow_entry: false
      };
    }

    const isDoorStaff = club.door_staff?.includes(staffId);
    const isManager = club.managers?.includes(staffId);
    const isOwner = club.owner_id === staffId;

    if (!isDoorStaff && !isManager && !isOwner) {
      return {
        success: false,
        message: 'Unauthorized scanner',
        allow_entry: false
      };
    }

    // Check capacity
    if (event.capacity && event.checked_in_count >= event.capacity) {
      return {
        success: false,
        ticket,
        event,
        message: 'Venue at capacity',
        allow_entry: false
      };
    }

    // Check timing
    const now = new Date();
    const doorsOpen = event.doors_open ? new Date(event.doors_open) : new Date(event.start_time);
    const eventEnd = event.end_time ? new Date(event.end_time) : new Date(new Date(event.start_time).getTime() + 8 * 60 * 60 * 1000);

    if (now < doorsOpen) {
      return {
        success: false,
        ticket,
        event,
        message: 'Doors not open yet',
        allow_entry: false
      };
    }

    if (now > eventEnd) {
      return {
        success: false,
        ticket,
        event,
        message: 'Event has ended',
        allow_entry: false
      };
    }

    // Check in the ticket
    const { error: updateError } = await supabase
      .from('club_tickets')
      .update({
        status: 'checked_in',
        checked_in_at: new Date().toISOString(),
        checked_in_by: staffId,
        checked_in_location: lat && lng ? { lat, lng } : null
      })
      .eq('id', ticket.id);

    if (updateError) throw updateError;

    // Increment event checked_in_count
    await supabase.rpc('increment_event_checkin_count', {
      event_id: event.id
    });

    return {
      success: true,
      ticket: { ...ticket, status: 'checked_in' },
      event,
      message: 'Entry granted',
      allow_entry: true
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'Scan failed',
      allow_entry: false
    };
  }
}

/**
 * Get real-time capacity for an event
 */
export async function getEventCapacity(eventId: string): Promise<{
  capacity: number;
  checked_in: number;
  tickets_sold: number;
  available: number;
  percentage: number;
}> {
  const event = await getEvent(eventId);
  if (!event) {
    return {
      capacity: 0,
      checked_in: 0,
      tickets_sold: 0,
      available: 0,
      percentage: 0
    };
  }

  const capacity = event.capacity || 0;
  const checked_in = event.checked_in_count || 0;
  const tickets_sold = event.tickets_sold || 0;
  const available = Math.max(0, capacity - tickets_sold);
  const percentage = capacity > 0 ? (checked_in / capacity) * 100 : 0;

  return {
    capacity,
    checked_in,
    tickets_sold,
    available,
    percentage: Math.round(percentage)
  };
}

// ============================================================================
// SETTLEMENT & ANALYTICS
// ============================================================================

/**
 * Generate settlement report for an event
 */
export async function generateSettlementReport(eventId: string): Promise<{
  event: ClubEvent;
  tickets_breakdown: {
    ga: { sold: number; revenue: number };
    vip: { sold: number; revenue: number };
  };
  promoter_breakdown: Array<{
    promoter_id: string;
    sales: number;
    revenue: number;
  }>;
  total_revenue: number;
  platform_fee: number; // 10%
  club_payout: number; // 90%
}> {
  const event = await getEvent(eventId);
  if (!event) throw new Error('Event not found');

  // Get all tickets for this event
  const { data: tickets } = await supabase
    .from('club_tickets')
    .select('*')
    .eq('event_id', eventId)
    .neq('status', 'cancelled');

  const allTickets = tickets || [];

  // Calculate GA breakdown
  const gaTickets = allTickets.filter(t => t.tier === 'ga');
  const gaRevenue = gaTickets.reduce((sum, t) => sum + t.price, 0);

  // Calculate VIP breakdown
  const vipTickets = allTickets.filter(t => t.tier === 'vip');
  const vipRevenue = vipTickets.reduce((sum, t) => sum + t.price, 0);

  // Calculate promoter breakdown
  const promoterMap = new Map<string, { sales: number; revenue: number }>();
  allTickets.forEach(t => {
    if (t.promoter_id) {
      const current = promoterMap.get(t.promoter_id) || { sales: 0, revenue: 0 };
      promoterMap.set(t.promoter_id, {
        sales: current.sales + 1,
        revenue: current.revenue + t.price
      });
    }
  });

  const promoter_breakdown = Array.from(promoterMap.entries()).map(([promoter_id, data]) => ({
    promoter_id,
    ...data
  }));

  // Calculate totals
  const total_revenue = gaRevenue + vipRevenue;
  const platform_fee = Math.round(total_revenue * 0.10); // 10%
  const club_payout = total_revenue - platform_fee; // 90%

  return {
    event,
    tickets_breakdown: {
      ga: { sold: gaTickets.length, revenue: gaRevenue },
      vip: { sold: vipTickets.length, revenue: vipRevenue }
    },
    promoter_breakdown,
    total_revenue,
    platform_fee,
    club_payout
  };
}

// ============================================================================
// ALL FUNCTIONS ALREADY EXPORTED ABOVE WITH 'export' KEYWORD
// ============================================================================
