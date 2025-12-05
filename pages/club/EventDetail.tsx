/**
 * HOTMESS LONDON — EVENT DETAIL & TICKET PURCHASE
 * 
 * Public-facing event page where users can:
 * - View event details
 * - Purchase tickets (GA/VIP)
 * - See capacity/availability
 * - View lineup
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Users,
  DollarSign,
  Star,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '../../components/layouts/PageHeader';
import { HMButton } from '../../components/library/HMButton';
import { Card } from '../../components/design-system/Card';
import { 
  getEvent, 
  getEventCapacity, 
  purchaseTicket,
  ClubEvent 
} from '../../lib/clubMode/clubModeService';
import { useAuth } from '../../contexts/AuthContext';
import { RouteId } from '../../lib/routes';
import { toast } from 'sonner@2.0.3';

interface Props {
  eventId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function EventDetail({ eventId, onNavigate }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [capacity, setCapacity] = useState({
    capacity: 0,
    checked_in: 0,
    tickets_sold: 0,
    available: 0,
    percentage: 0
  });

  const [selectedTier, setSelectedTier] = useState<'ga' | 'vip'>('ga');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);

    const eventData = await getEvent(eventId);
    setEvent(eventData);

    if (eventData) {
      const capacityData = await getEventCapacity(eventId);
      setCapacity(capacityData);
    }

    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to purchase tickets');
      onNavigate('login');
      return;
    }

    if (!event) return;

    setPurchasing(true);

    try {
      const result = await purchaseTicket({
        event_id: event.id,
        tier: selectedTier,
        buyer_id: user.id,
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
      });

      if (result.ok) {
        toast.success('Ticket purchased!');
        toast.success('Check your email for QR code');
        
        // Navigate to my tickets
        onNavigate('myTickets');
      } else {
        toast.error(result.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="aspect-video bg-white/5 rounded-lg" />
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white">Event not found</p>
          <HMButton onClick={() => onNavigate('home')}>
            Back to Home
          </HMButton>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;
  const doorsOpen = event.doors_open ? new Date(event.doors_open) : null;

  const isLive = event.status === 'live';
  const isUpcoming = event.status === 'upcoming';
  const isSoldOut = capacity.available === 0;

  const gaAvailable = event.capacity_ga ? event.capacity_ga - event.tickets_sold_ga : 999999;
  const vipAvailable = event.capacity_vip ? event.capacity_vip - event.tickets_sold_vip : 999999;

  const gaSoldOut = gaAvailable <= 0;
  const vipSoldOut = vipAvailable <= 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Cover Image */}
      {event.cover_image && (
        <div className="relative aspect-[21/9] bg-black">
          <img 
            src={event.cover_image} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase backdrop-blur ${
              isLive ? 'bg-red-500/90 text-white' :
              isSoldOut ? 'bg-white/20 text-white' :
              'bg-green-500/90 text-white'
            }`}>
              {isLive && '🔴 '}{isSoldOut ? 'SOLD OUT' : event.status}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                {event.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-bold">
                    {startDate.toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {event.venue_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-bold">{event.venue_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Description */}
        {event.description && (
          <Card className="p-6">
            <p className="text-white/80 leading-relaxed">
              {event.description}
            </p>
          </Card>
        )}

        {/* Lineup */}
        {event.lineup && event.lineup.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-black text-white uppercase mb-4">
              Lineup
            </h2>
            <div className="space-y-2">
              {event.lineup.map((artist, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded"
                >
                  <Star className="w-5 h-5 text-[#FF0080]" />
                  <span className="text-white font-bold">{artist}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Event Info */}
        <Card className="p-6">
          <h2 className="text-2xl font-black text-white uppercase mb-4">
            Event Info
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Date & Time</p>
                <p className="text-white/60">
                  {startDate.toLocaleString()}
                  {endDate && ` - ${endDate.toLocaleTimeString()}`}
                </p>
              </div>
            </div>

            {doorsOpen && (
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">Doors Open</p>
                  <p className="text-white/60">
                    {doorsOpen.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Capacity</p>
                <p className="text-white/60">
                  {capacity.tickets_sold} / {capacity.capacity} tickets sold
                </p>
              </div>
            </div>

            {event.age_restriction && (
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">Age Restriction</p>
                  <p className="text-white/60">
                    {event.age_restriction}+ only
                  </p>
                </div>
              </div>
            )}

            {event.gender_policy && (
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">Entry Policy</p>
                  <p className="text-white/60">
                    {event.gender_policy === 'men_only' && 'Men only (18+)'}
                    {event.gender_policy === 'all_genders' && 'All genders welcome'}
                    {event.gender_policy === 'women_only' && 'Women only'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tickets */}
        <Card className="p-6">
          <h2 className="text-2xl font-black text-white uppercase mb-4">
            Get Tickets
          </h2>

          <div className="space-y-4">
            {/* GA Ticket */}
            {event.capacity_ga && event.capacity_ga > 0 && (
              <button
                onClick={() => setSelectedTier('ga')}
                disabled={gaSoldOut}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedTier === 'ga' && !gaSoldOut
                    ? 'border-[#FF0080] bg-[#FF0080]/10'
                    : gaSoldOut
                    ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className={selectedTier === 'ga' ? 'w-5 h-5 text-[#FF0080]' : 'w-5 h-5 text-white/60'} />
                      <h3 className="text-white font-bold">General Admission</h3>
                    </div>
                    <p className="text-white/60 text-sm">
                      {gaSoldOut ? 'Sold Out' : `${gaAvailable} available`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#FF0080]">
                      £{(event.price_ga || 0) / 100}
                    </p>
                    <p className="text-white/40 text-xs">
                      + 10% fee
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* VIP Ticket */}
            {event.capacity_vip && event.capacity_vip > 0 && (
              <button
                onClick={() => setSelectedTier('vip')}
                disabled={vipSoldOut}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedTier === 'vip' && !vipSoldOut
                    ? 'border-[#FF0080] bg-[#FF0080]/10'
                    : vipSoldOut
                    ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className={selectedTier === 'vip' ? 'w-5 h-5 text-[#FF0080]' : 'w-5 h-5 text-white/60'} />
                      <h3 className="text-white font-bold">VIP</h3>
                    </div>
                    <p className="text-white/60 text-sm">
                      {vipSoldOut ? 'Sold Out' : `${vipAvailable} available`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#FF0080]">
                      £{(event.price_vip || 0) / 100}
                    </p>
                    <p className="text-white/40 text-xs">
                      + 10% fee
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Total */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">Ticket Price</span>
                <span className="text-white font-bold">
                  £{((selectedTier === 'ga' ? event.price_ga : event.price_vip) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">Buyer Fee (10%)</span>
                <span className="text-white font-bold">
                  £{(((selectedTier === 'ga' ? event.price_ga : event.price_vip) * 0.10) / 100).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-white/10 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#FF0080] text-2xl font-black">
                  £{(((selectedTier === 'ga' ? event.price_ga : event.price_vip) * 1.10) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <HMButton
              onClick={handlePurchase}
              disabled={purchasing || isSoldOut || (selectedTier === 'ga' ? gaSoldOut : vipSoldOut)}
              className="w-full py-4"
            >
              {purchasing ? 'Processing...' : 
               isSoldOut ? 'Sold Out' :
               (selectedTier === 'ga' ? gaSoldOut : vipSoldOut) ? 'This Tier is Sold Out' :
               'Purchase Ticket'}
            </HMButton>
          </div>
        </Card>

        {/* Share */}
        <HMButton
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
          }}
          className="w-full"
        >
          <Share2 className="w-4 h-4" />
          Share Event
        </HMButton>
      </div>
    </div>
  );
}
