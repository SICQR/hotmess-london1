/**
 * BEACONS — Consumer Hub (Simple 2-Button Interface)
 * Clean, minimal page for scanning beacons or viewing the globe
 */

import { Scan, Globe2, ArrowRight } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface BeaconsProps {
  onNavigate: (route: RouteId) => void;
}

export function Beacons({ onNavigate }: BeaconsProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24">
        {/* Header */}
        <div className="mb-20">
          <h1 style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-0.02em' }} className="text-white mb-6">
            BEACONS
          </h1>
          <p style={{ fontSize: '20px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/60 max-w-2xl">
            Physical touchpoints across London that unlock events, tickets, and exclusive content.
            Scan QR codes or explore the map.
          </p>
        </div>

        {/* Two Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Scan Beacon - Hot Pink */}
          <button
            onClick={() => onNavigate('beaconScan')}
            className="group relative h-80 overflow-hidden border border-white/20 hover:border-[#ff1694] transition-all"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff1694]/20 to-[#ff0080]/20 group-hover:from-[#ff1694]/30 group-hover:to-[#ff0080]/30 transition-all duration-500" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,22,148,0.2)_0%,transparent_70%)]" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-12">
              <Scan className="w-24 h-24 text-[#ff1694] mb-6" strokeWidth={1.5} />
              <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }} className="text-white mb-4 uppercase">
                Scan Beacon
              </h2>
              <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/60 text-center mb-6 max-w-md">
                Enter a beacon code or scan a QR to unlock events, tickets, and exclusive drops.
              </p>
              <div className="inline-flex items-center gap-2 text-[#ff1694] group-hover:translate-x-1 transition-transform">
                <span style={{ fontSize: '14px', fontWeight: 700 }} className="uppercase tracking-wider">Scan Now</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </button>

          {/* Night Pulse Globe - White */}
          <button
            onClick={() => onNavigate('nightPulse')}
            className="group relative h-80 overflow-hidden border border-white/20 hover:border-white transition-all"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all duration-500" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-12">
              <Globe2 className="w-24 h-24 text-white mb-6" strokeWidth={1.5} />
              <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }} className="text-white mb-4 uppercase">
                Night Pulse Globe
              </h2>
              <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/60 text-center mb-6 max-w-md">
                Explore the 3D interactive globe showing live beacons across London.
              </p>
              <div className="inline-flex items-center gap-2 text-white group-hover:translate-x-1 transition-transform">
                <span style={{ fontSize: '14px', fontWeight: 700 }} className="uppercase tracking-wider">View Globe</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </button>
        </div>

        {/* Info Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* What are Beacons */}
          <div className="p-8 border border-white/10 hover:border-white/20 transition-all">
            <h3 style={{ fontSize: '20px', fontWeight: 700 }} className="text-white mb-4 uppercase">
              What are Beacons?
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/40">
              Physical or digital codes placed at venues, events, or locations that unlock content, tickets, and experiences.
            </p>
          </div>

          {/* How to Use */}
          <div className="p-8 border border-white/10 hover:border-white/20 transition-all">
            <h3 style={{ fontSize: '20px', fontWeight: 700 }} className="text-white mb-4 uppercase">
              How to Use
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/40">
              Scan a beacon code at a venue or event. Get instant access to tickets, event info, exclusive drops, and more.
            </p>
          </div>

          {/* Create Your Own */}
          <div className="p-8 border border-white/10 hover:border-white/20 transition-all">
            <h3 style={{ fontSize: '20px', fontWeight: 700 }} className="text-white mb-4 uppercase">
              Host a Beacon
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.6' }} className="text-white/40">
              Event organizers and venues can create beacons to connect with attendees and share exclusive content.
            </p>
          </div>
        </div>

        {/* Optional: Apply to Host CTA */}
        <div className="mt-16 pt-12 border-t border-white/10 text-center">
          <p style={{ fontSize: '16px', fontWeight: 400 }} className="text-white/40 mb-6">
            Want to create your own beacon for your venue or event?
          </p>
          <button
            onClick={() => onNavigate('beaconsManage')}
            className="inline-flex items-center gap-3 h-14 px-8 border border-white/20 hover:border-[#ff1694] hover:bg-white/5 transition-all"
          >
            <span style={{ fontSize: '14px', fontWeight: 700 }} className="text-white uppercase tracking-wider">
              Manage Beacons
            </span>
            <ArrowRight className="text-white" size={18} />
          </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff1694]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
