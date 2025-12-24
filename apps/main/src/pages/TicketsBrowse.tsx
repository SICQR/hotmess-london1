// pages/TicketsBrowse.tsx
// Main Tickets Browse page - Shows all active ticket beacons
// Mobile-first responsive with search + filter

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, Search, Filter, Ticket, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/design-system/Button';
import { Card } from '../components/design-system/Card';
import { Input } from '../components/design-system/Input';
import { RouteId } from '../lib/routes';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface TicketsBrowseProps {
  onNavigate: (route: RouteId, params?: any) => void;
}

interface BeaconType {
  id: string;
  title: string;
  city: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  listing_count?: number;
}

export function TicketsBrowse({ onNavigate }: TicketsBrowseProps) {
  const [beacons, setBeacons] = useState<BeaconType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    loadBeacons();
  }, []);

  async function loadBeacons() {
    try {
      // TODO: Replace with actual API call to /supabase/functions/server/tickets_api
      // For now, using mock data
      const mockBeacons: BeaconType[] = [
        {
          id: '1',
          title: 'XXL @ Fire London',
          city: 'London',
          starts_at: new Date(Date.now() + 86400000 * 2).toISOString(),
          ends_at: new Date(Date.now() + 86400000 * 2 + 18000000).toISOString(),
          is_active: true,
          listing_count: 3,
        },
        {
          id: '2',
          title: 'Horse Meat Disco',
          city: 'London',
          starts_at: new Date(Date.now() + 86400000 * 5).toISOString(),
          ends_at: new Date(Date.now() + 86400000 * 5 + 21600000).toISOString(),
          is_active: true,
          listing_count: 8,
        },
        {
          id: '3',
          title: 'Savage @ The Glory',
          city: 'London',
          starts_at: new Date(Date.now() + 86400000 * 7).toISOString(),
          ends_at: new Date(Date.now() + 86400000 * 7 + 18000000).toISOString(),
          is_active: true,
          listing_count: 2,
        },
      ];
      setBeacons(mockBeacons);
    } catch (error) {
      console.error('Failed to load ticket beacons:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBeacons = beacons.filter((beacon) => {
    const matchesSearch = beacon.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !cityFilter || beacon.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesCity;
  });

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Date TBA';
    }
  }

  function formatTime(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '--:--';
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-8 h-8 text-hot" />
              <span className="text-hot uppercase tracking-widest text-sm">Tickets</span>
            </div>
            <h1 className="text-white mb-3">
              Beacons with live listings.
            </h1>
            <p className="text-white/60 mb-6">
              Keep it clean. Keep it moving.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('map')}
              >
                <Map className="w-4 h-4 mr-2" />
                Open Map
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onNavigate('myTickets')}
              >
                My Tickets
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="md:col-span-1">
              <Input
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                iconLeft={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beacons Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredBeacons.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredBeacons.map((beacon, index) => (
              <motion.div
                key={beacon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="elevated"
                  hoverable
                  onClick={() => onNavigate('ticketsBeacon', { beaconId: beacon.id })}
                >
                  <div className="p-6 space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-hot/10 border border-hot/20">
                      <Ticket className="w-3 h-3 text-hot mr-2" />
                      <span className="text-hot text-xs uppercase tracking-wider">
                        Ticket Beacon
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white">
                      {beacon.title}
                    </h3>

                    {/* Location & Date */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{beacon.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(beacon.starts_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(beacon.starts_at)}</span>
                      </div>
                    </div>

                    {/* Listing Count */}
                    {beacon.listing_count !== undefined && (
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-white/60 text-sm">
                          {beacon.listing_count} {beacon.listing_count === 1 ? 'listing' : 'listings'} available
                        </span>
                      </div>
                    )}

                    {/* Footer Note */}
                    <p className="text-white/40 text-xs pt-2 border-t border-white/10">
                      Listings are moderated. Proof happens in-thread.
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Card variant="flat">
              <div className="p-12">
                <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white mb-2">
                  No ticket beacons found
                </h3>
                <p className="text-white/60 mb-6">
                  {searchQuery || cityFilter
                    ? 'Try adjusting your filters'
                    : 'Check back soon for new events'}
                </p>
                {(searchQuery || cityFilter) && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setSearchQuery('');
                      setCityFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
