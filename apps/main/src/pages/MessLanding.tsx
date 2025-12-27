/**
 * HNH MESS LANDING PAGE
 * Entry point when someone scans QR on HNH MESS bottle
 * Care-first, stigma-smashing, connection-driven
 */

import { RouteId } from '../lib/routes';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, Radio, ShoppingBag, Users, ExternalLink } from 'lucide-react';

interface MessLandingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function MessLanding({ onNavigate }: MessLandingProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black" />
        
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl uppercase tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent">
                HNH MESS
              </span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6" />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-zinc-300 mb-4 leading-relaxed">
            The stigma-smashing lube built for connection.
          </p>
          <p className="text-lg text-zinc-400 mb-12">
            Scan to land somewhere safe. Men-only. Care-first. For the culture.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">18+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Age Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">M</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Men Only</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Care-First</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-4">
        {/* Community Room */}
        <button
          onClick={() => onNavigate('rooms')}
          className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 text-left transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Users size={28} className="text-blue-400" />
                <h2 className="text-2xl uppercase tracking-tight">Join Community Rooms</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Connect with men in your city. Share tips, resources, and real talk. 
                No judgment. No bullshit.
              </p>
            </div>
            <ExternalLink size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>

        {/* HAND N HAND Radio */}
        <button
          onClick={() => onNavigate('radioShow', { slug: 'handnhand' })}
          className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 text-left transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Radio size={28} className="text-purple-400" />
                <h2 className="text-2xl uppercase tracking-tight">Listen: HAND N HAND</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-3">
                Live radio every Sunday @ 20:00 UK. Real stories, real men, real care. 
                No corporate wellness garbage.
              </p>
              <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded px-3 py-1 text-sm text-purple-300 uppercase tracking-wider">
                Live Sundays 8pm
              </div>
            </div>
            <ExternalLink size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>

        {/* Aftercare Resources */}
        <button
          onClick={() => onNavigate('care')}
          className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 text-left transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Heart size={28} className="text-red-400" />
                <h2 className="text-2xl uppercase tracking-tight">Aftercare Resources</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                You're not alone. Find support, talk to someone, or just check in. 
                Aftercare isn't optional—it's culture.
              </p>
            </div>
            <ExternalLink size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>

        {/* Shop HNH MESS */}
        <button
          onClick={() => onNavigate('shopProduct', { slug: 'hnh-mess' })}
          className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 text-left transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag size={28} className="text-green-400" />
                <h2 className="text-2xl uppercase tracking-tight">Buy HNH MESS</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Restock your supply. Premium water-based lube that doesn't judge. 
                Fast shipping, discreet packaging.
              </p>
            </div>
            <ExternalLink size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-900 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-500 text-sm leading-relaxed mb-4">
            Men-only. 18+ only. Consent-first. Aftercare isn't optional—it's culture.
          </p>
          <p className="text-zinc-600 text-xs">
            HNH MESS is part of HOTMESS LONDON — the complete masculine nightlife OS for queer men.
          </p>
        </div>
      </div>
    </div>
  );
}
