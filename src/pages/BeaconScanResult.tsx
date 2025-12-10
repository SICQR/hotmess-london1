import { useEffect, useState } from 'react';
import { Card } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { CheckCircle, XCircle, MapPin, Calendar, ExternalLink, Share2, Star, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import type { RouteId } from '../lib/routes';

interface BeaconScanResultProps {
  code: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface ScanResult {
  success: boolean;
  beacon?: {
    id: string;
    code: string;
    type: string;
    title: string;
    description: string;
    venue?: string;
    location?: string;
    startsAt?: string;
    endsAt?: string;
    ctaUrl?: string;
    ctaText?: string;
  };
  xpAwarded?: number;
  error?: string;
  message?: string;
}

export default function BeaconScanResult({ code, onNavigate }: BeaconScanResultProps) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate beacon scan
    setTimeout(() => {
      setResult({
        success: true,
        beacon: {
          id: '1',
          code,
          type: 'event',
          title: 'HOTMESS Saturday Night',
          description: 'Join us for an unforgettable night of techno and house music at Londons premier underground club.',
          venue: 'The Vault',
          location: 'Vauxhall, London',
          startsAt: '2024-12-21T22:00:00Z',
          endsAt: '2024-12-22T06:00:00Z',
          ctaUrl: '/tickets',
          ctaText: 'GET TICKETS',
        },
        xpAwarded: 50,
      });
      setLoading(false);
    }, 1500);
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#999' }}>
            Scanning beacon...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (!result.success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 text-center max-w-md">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Scan Failed
            </h1>
            <p style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '24px' }}>
              {result.error || result.message || 'Unable to scan this beacon'}
            </p>
            <Button onClick={() => onNavigate('scan')} variant="outline">
              Try Again
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const { beacon, xpAwarded } = result;

  if (!beacon) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Beacon Scanned!
          </h1>
          {xpAwarded && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Trophy size={24} className="text-yellow-500" />
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#ff1eff' }}>
                +{xpAwarded} XP
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Beacon Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="blue" className="mb-3">
                  {beacon.type.toUpperCase()}
                </Badge>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {beacon.title}
                </h2>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 size={20} />
              </Button>
            </div>

            <p style={{ fontSize: '16px', fontWeight: 400, color: '#ccc', marginBottom: '24px', lineHeight: '1.6' }}>
              {beacon.description}
            </p>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              {beacon.venue && (
                <div className="flex items-center gap-3" style={{ fontSize: '16px', color: '#999' }}>
                  <MapPin size={20} className="text-pink-500" />
                  <span>{beacon.venue}</span>
                  {beacon.location && <span className="text-gray-600">• {beacon.location}</span>}
                </div>
              )}
              {beacon.startsAt && (
                <div className="flex items-center gap-3" style={{ fontSize: '16px', color: '#999' }}>
                  <Calendar size={20} className="text-pink-500" />
                  <span>
                    {new Date(beacon.startsAt).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* CTA */}
            {beacon.ctaUrl && (
              <Button
                onClick={() => {
                  if (beacon.ctaUrl.startsWith('/')) {
                    onNavigate(beacon.ctaUrl.slice(1) as RouteId);
                  } else {
                    window.open(beacon.ctaUrl, '_blank');
                  }
                }}
                size="lg"
                className="w-full"
              >
                {beacon.ctaText || 'Learn More'}
                <ExternalLink size={20} className="ml-2" />
              </Button>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => onNavigate('beacons')}
              className="flex-1"
            >
              Browse Beacons
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('scan')}
              className="flex-1"
            >
              Scan Another
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
