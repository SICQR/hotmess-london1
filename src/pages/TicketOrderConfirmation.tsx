import { useEffect, useState } from 'react';
import type { RouteId } from '../lib/routes';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { Card } from '../components/design-system/Card';
import { ArrowLeft, CheckCircle, Download, Mail, Calendar, MapPin, Share2, MessageCircle } from 'lucide-react';
import { BeaconQRCode } from '../components/BeaconQRCode';

interface TicketOrder {
  id: string;
  orderNumber: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  ticketType: string;
  quantity: number;
  pricePerTicket: number;
  bookingFee: number;
  total: number;
  purchaseDate: string;
  buyerName: string;
  buyerEmail: string;
  qrCode: string;
  accessBeaconCode?: string;
  isC2C: boolean;
  sellerUsername?: string;
  transferStatus?: 'pending' | 'transferred' | 'confirmed';
}

interface TicketOrderConfirmationProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function TicketOrderConfirmation({ onNavigate }: TicketOrderConfirmationProps) {
  const [order, setOrder] = useState<TicketOrder>({
    id: '1',
    orderNumber: 'TIX-2024-001234',
    eventName: 'FABRIC - OPENING PARTY',
    eventDate: 'Friday, November 29, 2024',
    eventTime: '23:00 - 06:00',
    venueName: 'Fabric',
    venueAddress: '77A Charterhouse St, London EC1M 6HJ',
    ticketType: 'General Admission',
    quantity: 1,
    pricePerTicket: 25.00,
    bookingFee: 2.50,
    total: 27.50,
    purchaseDate: 'November 28, 2024 14:35',
    buyerName: 'John Smith',
    buyerEmail: 'john@example.com',
    qrCode: 'TICK-ABC123',
    accessBeaconCode: 'FABRIC-ENTRY-001',
    isC2C: false,
  });

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // In production, fetch order details from API
    // const orderId = window.location.pathname.split('/').pop();
    // fetchOrderDetails(orderId);
  }, []);

  const handleDownloadTicket = () => {
    // Generate PDF or download ticket
    alert('Downloading ticket...');
  };

  const handleAddToCalendar = () => {
    // Generate calendar event
    const event = {
      title: order.eventName,
      location: `${order.venueName}, ${order.venueAddress}`,
      description: `${order.ticketType} ticket`,
      start: order.eventDate + ' ' + order.eventTime.split(' - ')[0],
      end: order.eventDate + ' ' + order.eventTime.split(' - ')[1],
    };
    alert('Adding to calendar...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: order.eventName,
        text: `I'm going to ${order.eventName} on ${order.eventDate}!`,
        url: window.location.href,
      });
    } else {
      alert('Share feature not supported on this device');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('myTickets')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl uppercase tracking-wider">Order Confirmation</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Success Message */}
      <div className="px-4 py-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-black mb-2">TICKET CONFIRMED</h2>
        <p className="text-white/60 mb-1">Order #{order.orderNumber}</p>
        <p className="text-sm text-white/40">Purchased {order.purchaseDate}</p>
      </div>

      {/* Event Details */}
      <section className="px-4 py-4">
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-xl font-black mb-4">{order.eventName}</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-hot shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{order.eventDate}</p>
                <p className="text-sm text-white/60">{order.eventTime}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-hot shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{order.venueName}</p>
                <p className="text-sm text-white/60">{order.venueAddress}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60">{order.quantity}x {order.ticketType}</span>
              <span>£{order.pricePerTicket.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60">Booking fee</span>
              <span>£{order.bookingFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="font-bold">Total</span>
              <span className="font-bold text-xl">£{order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* QR Code */}
      {order.accessBeaconCode && (
        <section className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-white/20" />
            <h2 className="text-sm uppercase tracking-wider text-white/70">Your Ticket</h2>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <BeaconQRCode code={order.accessBeaconCode} size={200} />
              </div>
              <p className="text-sm text-white/60 mb-2">Scan this QR code at the venue</p>
              <p className="text-xs text-white/40 font-mono">{order.accessBeaconCode}</p>
            </div>
          </Card>
        </section>
      )}

      {/* C2C Transfer Status */}
      {order.isC2C && order.transferStatus && (
        <section className="px-4 py-4">
          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-500" />
              Transfer Status
            </h3>
            {order.transferStatus === 'pending' && (
              <p className="text-sm text-white/80">
                Waiting for @{order.sellerUsername} to transfer your ticket. You'll receive a notification once it's ready.
              </p>
            )}
            {order.transferStatus === 'transferred' && (
              <p className="text-sm text-white/80">
                Ticket has been transferred! Check your email for details.
              </p>
            )}
            {order.transferStatus === 'confirmed' && (
              <p className="text-sm text-white/80">
                Transfer confirmed. Your ticket is ready to use!
              </p>
            )}
            {order.sellerUsername && (
              <Button
                onClick={() => onNavigate('connectThread', { threadId: order.id })}
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Seller
              </Button>
            )}
          </Card>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleDownloadTicket} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={handleAddToCalendar} variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </Button>
        </div>
      </section>

      {/* Email Confirmation */}
      <section className="px-4 py-4">
        <Card className="p-4 bg-white/5 border-white/10">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-hot shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium mb-1">Email Confirmation</h3>
              <p className="text-sm text-white/60 mb-3">
                A confirmation email has been sent to <span className="text-white">{order.buyerEmail}</span>
              </p>
              {!emailSent && (
                <button
                  onClick={() => {
                    setEmailSent(true);
                    setTimeout(() => setEmailSent(false), 3000);
                  }}
                  className="text-sm text-hot hover:text-hot/80 transition-colors"
                >
                  Resend email
                </button>
              )}
              {emailSent && (
                <p className="text-sm text-green-500">✓ Email sent</p>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* Important Info */}
      <section className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Important Info</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <Card className="p-4 bg-white/5 border-white/10">
          <ul className="space-y-2 text-sm text-white/80">
            <li>• Arrive 30 minutes before entry time</li>
            <li>• Valid photo ID required (18+)</li>
            <li>• QR code must be scanned at the door</li>
            <li>• No refunds or exchanges</li>
            <li>• Screenshot your QR code as backup</li>
          </ul>
        </Card>
      </section>

      {/* Support */}
      <section className="px-4 py-4">
        <Card className="p-4 bg-white/5 border-white/10 text-center">
          <p className="text-sm text-white/60 mb-3">
            Need help with your ticket?
          </p>
          <Button
            onClick={() => onNavigate('care')}
            variant="outline"
            size="sm"
          >
            Contact Support
          </Button>
        </Card>
      </section>

      {/* CTA */}
      <section className="px-4 py-4">
        <Button
          onClick={() => onNavigate('myTickets')}
          variant="primary"
          className="w-full"
        >
          View All My Tickets
        </Button>
      </section>
    </div>
  );
}
