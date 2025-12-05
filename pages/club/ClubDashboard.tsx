/**
 * HOTMESS LONDON — CLUB MODE DASHBOARD
 * 
 * Main dashboard for venue owners/managers to:
 * - View club stats
 * - Manage events
 * - View ticket sales
 * - Access door scanner
 * - View settlement reports
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Ticket, 
  Users, 
  TrendingUp, 
  ScanLine,
  Plus,
  Settings,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { PageHeader } from '../../components/layouts/PageHeader';
import { HMButton } from '../../components/library/HMButton';
import { Card, CardHeader, CardContent } from '../../components/design-system/Card';
import { StatCard } from '../../components/StatCard';
import { getClub, getClubBySlug, getClubEvents, Club, ClubEvent } from '../../lib/clubMode/clubModeService';
import { useAuth } from '../../contexts/AuthContext';
import { RouteId } from '../../lib/routes';

interface Props {
  clubId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function ClubDashboard({ clubId, onNavigate }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'analytics'>('overview');

  useEffect(() => {
    loadDashboard();
  }, [clubId]);

  const loadDashboard = async () => {
    setLoading(true);

    // Load club data - handle both UUID and slug
    // If clubId looks like a UUID, use getClub, otherwise use getClubBySlug
    const isUUID = clubId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const clubData = isUUID 
      ? await getClub(clubId)
      : await getClubBySlug(clubId);
    
    setClub(clubData);

    // Load events (if club found)
    if (clubData) {
      const eventsData = await getClubEvents(clubData.id);
      setEvents(eventsData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/5 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-white/5 rounded" />
              <div className="h-32 bg-white/5 rounded" />
              <div className="h-32 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white">Club not found</p>
          <HMButton onClick={() => onNavigate('home')}>
            Back to Home
          </HMButton>
        </div>
      </div>
    );
  }

  // Filter events by status
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const liveEvents = events.filter(e => e.status === 'live');
  const pastEvents = events.filter(e => e.status === 'ended');

  // Calculate total revenue (in pounds)
  const totalRevenue = club.total_revenue / 100;
  const averageTicketPrice = club.total_tickets_sold > 0 
    ? totalRevenue / club.total_tickets_sold 
    : 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {club.logo && (
                  <img 
                    src={club.logo} 
                    alt={club.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                    {club.name}
                  </h1>
                  {club.verified && (
                    <p className="text-[#FF0080] text-sm font-bold">
                      ✓ VERIFIED VENUE
                    </p>
                  )}
                </div>
              </div>
              {club.description && (
                <p className="text-white/60 max-w-2xl">
                  {club.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <HMButton
                variant="secondary"
                onClick={() => onNavigate('clubSettings', { clubId: club.id })}
              >
                <Settings className="w-4 h-4" />
                Settings
              </HMButton>
              <HMButton
                onClick={() => onNavigate('clubDoorScanner', { clubId: club.id })}
              >
                <ScanLine className="w-4 h-4" />
                Door Scanner
              </HMButton>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Events"
              value={club.total_events.toString()}
              icon={<Calendar className="w-5 h-5" />}
            />
            <StatCard
              label="Tickets Sold"
              value={club.total_tickets_sold.toLocaleString()}
              icon={<Ticket className="w-5 h-5" />}
            />
            <StatCard
              label="Total Revenue"
              value={`£${totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              label="Avg Ticket"
              value={`£${averageTicketPrice.toFixed(2)}`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#FF0080] text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'events'
                  ? 'border-[#FF0080] text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-[#FF0080] text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <OverviewTab
            club={club}
            upcomingEvents={upcomingEvents}
            liveEvents={liveEvents}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'events' && (
          <EventsTab
            club={club}
            events={events}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            club={club}
            events={events}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// OVERVIEW TAB
// ============================================================================

function OverviewTab({ 
  club, 
  upcomingEvents, 
  liveEvents,
  onNavigate 
}: { 
  club: Club; 
  upcomingEvents: ClubEvent[];
  liveEvents: ClubEvent[];
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:border-[#FF0080]/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF0080]/20 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-[#FF0080]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">Create Event</h3>
              <p className="text-white/60 text-sm">Start selling tickets</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:border-[#FF0080]/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ScanLine className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">Door Scanner</h3>
              <p className="text-white/60 text-sm">Check in guests</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-white uppercase mb-4">
            🔴 Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveEvents.map(event => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white uppercase">
            Upcoming Events
          </h2>
          <HMButton
            variant="ghost"
            onClick={() => onNavigate('clubEventCreate', { clubId: club.id })}
          >
            <Plus className="w-4 h-4" />
            New Event
          </HMButton>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">No upcoming events</p>
            <HMButton onClick={() => onNavigate('clubEventCreate', { clubId: club.id })}>
              Create Your First Event
            </HMButton>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.slice(0, 4).map(event => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EVENTS TAB
// ============================================================================

function EventsTab({ 
  club, 
  events,
  onNavigate 
}: { 
  club: Club; 
  events: ClubEvent[];
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'upcoming', 'live', 'ended'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded text-sm font-bold uppercase transition-colors ${
                filter === f
                  ? 'bg-[#FF0080] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <HMButton onClick={() => onNavigate('clubEventCreate', { clubId: club.id })}>
          <Plus className="w-4 h-4" />
          New Event
        </HMButton>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-white/60">No events found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANALYTICS TAB
// ============================================================================

function AnalyticsTab({ 
  club, 
  events,
  onNavigate 
}: { 
  club: Club; 
  events: ClubEvent[];
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}) {
  // Calculate monthly stats
  const now = new Date();
  const thisMonth = events.filter(e => {
    const startDate = new Date(e.start_time);
    return startDate.getMonth() === now.getMonth() && 
           startDate.getFullYear() === now.getFullYear();
  });

  const monthlyTickets = thisMonth.reduce((sum, e) => sum + e.tickets_sold, 0);
  const monthlyRevenue = thisMonth.reduce((sum, e) => sum + e.revenue, 0) / 100;

  return (
    <div className="space-y-8">
      {/* Monthly Stats */}
      <div>
        <h2 className="text-xl font-black text-white uppercase mb-4">
          This Month
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Events"
            value={thisMonth.length.toString()}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            label="Tickets Sold"
            value={monthlyTickets.toLocaleString()}
            icon={<Ticket className="w-5 h-5" />}
          />
          <StatCard
            label="Revenue"
            value={`£${monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Top Events */}
      <div>
        <h2 className="text-xl font-black text-white uppercase mb-4">
          Top Events
        </h2>
        <Card>
          <div className="divide-y divide-white/10">
            {events
              .sort((a, b) => b.tickets_sold - a.tickets_sold)
              .slice(0, 10)
              .map((event, idx) => (
                <div 
                  key={event.id}
                  className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onNavigate('clubEventDetail', { eventId: event.id })}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-white/20">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">
                        {event.name}
                      </p>
                      <p className="text-white/60 text-sm">
                        {new Date(event.start_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {event.tickets_sold} tickets
                      </p>
                      <p className="text-[#FF0080] text-sm">
                        £{(event.revenue / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

function EventCard({ 
  event, 
  onNavigate 
}: { 
  event: ClubEvent;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}) {
  const startDate = new Date(event.start_time);
  const isToday = startDate.toDateString() === new Date().toDateString();
  
  const capacity = event.capacity || 0;
  const soldPercent = capacity > 0 ? (event.tickets_sold / capacity) * 100 : 0;

  return (
    <Card 
      className="p-0 overflow-hidden hover:border-[#FF0080]/50 transition-colors cursor-pointer"
      onClick={() => onNavigate('clubEventDetail', { eventId: event.id })}
    >
      {/* Cover Image */}
      {event.cover_image && (
        <div className="aspect-video bg-white/5 relative overflow-hidden">
          <img 
            src={event.cover_image} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              event.status === 'live' ? 'bg-red-500 text-white' :
              event.status === 'upcoming' ? 'bg-green-500 text-white' :
              'bg-white/20 text-white'
            }`}>
              {event.status === 'live' && '🔴 '}{event.status}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Event Name */}
        <h3 className="text-white font-bold line-clamp-1">
          {event.name}
        </h3>

        {/* Date/Time */}
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {isToday ? 'Today' : startDate.toLocaleDateString()} · {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Ticket className="w-4 h-4 text-white/60" />
            <span className="text-white font-bold">
              {event.tickets_sold}
            </span>
            <span className="text-white/60">
              / {capacity || '∞'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-[#FF0080]" />
            <span className="text-[#FF0080] font-bold">
              £{(event.revenue / 100).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {capacity > 0 && (
          <div className="space-y-1">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FF0080] transition-all"
                style={{ width: `${Math.min(soldPercent, 100)}%` }}
              />
            </div>
            <p className="text-white/60 text-xs">
              {soldPercent.toFixed(0)}% sold
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
