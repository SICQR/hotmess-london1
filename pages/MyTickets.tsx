// pages/MyTickets.tsx
// User's tickets dashboard - buying, selling, and transactions

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Ticket,
  ShoppingBag,
  DollarSign,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { Button } from '../components/design-system/Button';
import { Card } from '../components/design-system/Card';
import { Badge } from '../components/design-system/Badge';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';

interface MyTicketsProps {
  onNavigate: (route: RouteId, params?: any) => void;
}

export function MyTickets({ onNavigate }: MyTicketsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');
  const [buyingTickets, setBuyingTickets] = useState<any[]>([]);
  const [sellingTickets, setSellingTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMyTickets();
    }
  }, [user]);

  async function loadMyTickets() {
    try {
      // TODO: Replace with actual API calls
      const mockBuying = [
        {
          id: '1',
          event_title: 'XXL @ Fire London',
          quantity: 2,
          price: 15,
          currency: 'GBP',
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ];

      const mockSelling = [
        {
          id: '2',
          event_title: 'Horse Meat Disco',
          quantity: 1,
          price: 20,
          currency: 'GBP',
          status: 'active',
          views: 12,
          created_at: new Date().toISOString(),
        },
      ];

      setBuyingTickets(mockBuying);
      setSellingTickets(mockSelling);
    } catch (error) {
      console.error('Failed to load my tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card variant="flat">
          <div className="p-12 text-center">
            <h3 className="text-white mb-4">Please log in</h3>
            <Button variant="primary" size="md" onClick={() => onNavigate('login')}>
              Log In
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
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-8 h-8 text-hot" />
              <span className="text-hot uppercase tracking-widest text-sm">My Tickets</span>
            </div>
            <h1 className="text-white mb-3">Your ticket activity</h1>
            <p className="text-white/60">
              Manage your ticket purchases and listings
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/20 sticky top-0 bg-black/80 backdrop-blur-xl z-30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('buying')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'buying'
                  ? 'border-hot text-hot'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buying</span>
              {buyingTickets.length > 0 && (
                <Badge variant="secondary">{buyingTickets.length}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('selling')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'selling'
                  ? 'border-hot text-hot'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Selling</span>
              {sellingTickets.length > 0 && (
                <Badge variant="secondary">{sellingTickets.length}</Badge>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'buying' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white">
                Active purchases ({buyingTickets.length})
              </h2>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('tickets')}
              >
                Browse Tickets
              </Button>
            </div>

            {buyingTickets.length > 0 ? (
              <div className="space-y-4">
                {buyingTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card variant="elevated" hoverable>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white mb-2">
                              {ticket.event_title}
                            </h3>
                            <div className="text-white/60 text-sm">
                              {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'} ·{' '}
                              £{ticket.price} each
                            </div>
                          </div>
                          <Badge variant={ticket.status === 'active' ? 'success' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <Button variant="secondary" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Thread
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card variant="flat">
                <div className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white mb-2">No active purchases</h3>
                  <p className="text-white/60 mb-6">
                    Browse available tickets to get started
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('tickets')}
                  >
                    Browse Tickets
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white">
                Active listings ({sellingTickets.length})
              </h2>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('tickets')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Button>
            </div>

            {sellingTickets.length > 0 ? (
              <div className="space-y-4">
                {sellingTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card variant="elevated" hoverable>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white mb-2">
                              {ticket.event_title}
                            </h3>
                            <div className="text-white/60 text-sm">
                              {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'} ·{' '}
                              £{ticket.price} each
                            </div>
                            <div className="text-white/40 text-sm mt-1">
                              {ticket.views} views
                            </div>
                          </div>
                          <Badge variant={ticket.status === 'active' ? 'success' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card variant="flat">
                <div className="p-12 text-center">
                  <DollarSign className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white mb-2">No active listings</h3>
                  <p className="text-white/60 mb-6">
                    Create a listing to start selling tickets
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('tickets')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
