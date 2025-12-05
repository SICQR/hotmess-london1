// pages/TicketsBeacon.tsx
// Individual Beacon page showing all listings for a specific event

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { Button } from '../components/design-system/Button';
import { Card } from '../components/design-system/Card';
import { RouteId } from '../lib/routes';

interface TicketsBeaconProps {
  beaconId: string;
  onNavigate: (route: RouteId, params?: any) => void;
}

export function TicketsBeacon({ beaconId, onNavigate }: TicketsBeaconProps) {
  const [beacon, setBeacon] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeaconAndListings();
  }, [beaconId]);

  async function loadBeaconAndListings() {
    try {
      // TODO: Replace with actual API calls
      const mockBeacon = {
        id: beaconId,
        title: 'XXL @ Fire London',
        city: 'London',
        starts_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        venue: 'Fire London',
        address: 'South Lambeth Rd, London SW8 1RT',
      };

      const mockListings = [
        {
          id: '1',
          seller_name: 'John',
          price: 15,
          currency: 'GBP',
          quantity: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          seller_name: 'Mike',
          price: 20,
          currency: 'GBP',
          quantity: 1,
          created_at: new Date().toISOString(),
        },
      ];

      setBeacon(mockBeacon);
      setListings(mockListings);
    } catch (error) {
      console.error('Failed to load beacon:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!beacon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card variant="flat">
          <div className="p-12 text-center">
            <h3 className="text-white mb-2">Beacon not found</h3>
            <Button variant="secondary" size="md" onClick={() => onNavigate('tickets')}>
              Back to Tickets
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/20">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('tickets')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-hot/10 border border-hot/20 mb-4">
              <Ticket className="w-3 h-3 text-hot mr-2" />
              <span className="text-hot text-xs uppercase tracking-wider">
                Ticket Beacon
              </span>
            </div>

            <h1 className="text-white mb-4">{beacon.title}</h1>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-white/80">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{beacon.venue}</div>
                    <div className="text-sm text-white/60">{beacon.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span>{formatDate(beacon.starts_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span>{formatTime(beacon.starts_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">
            Available Listings ({listings.length})
          </h2>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
        </div>

        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  variant="elevated"
                  hoverable
                  onClick={() => onNavigate('ticketsListing', { listingId: listing.id })}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white mb-1">
                          {listing.quantity} {listing.quantity === 1 ? 'ticket' : 'tickets'}
                        </div>
                        <div className="text-white/60 text-sm">
                          Seller: {listing.seller_name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-hot text-2xl mb-1">
                          £{listing.price}
                        </div>
                        <Button variant="primary" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="flat">
            <div className="p-12 text-center">
              <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white mb-2">No listings yet</h3>
              <p className="text-white/60 mb-6">
                Be the first to list tickets for this event
              </p>
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card variant="flat" className="mt-8">
          <div className="p-6">
            <h3 className="text-white mb-3">How it works</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>• All listings are moderated for safety</li>
              <li>• Proof of tickets happens in the chat thread</li>
              <li>• Payment happens securely through the platform</li>
              <li>• Report any suspicious activity immediately</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
