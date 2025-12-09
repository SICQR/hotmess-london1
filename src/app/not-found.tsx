// app/not-found.tsx
// 404 Page - HOTMESS style

import Link from 'next/link';
import { AlertTriangle, Home, Search, Radio, ShoppingBag, Music } from 'lucide-react';

export const metadata = {
  title: "404 - Page Not Found | HOTMESS",
  description: "This page doesn't exist",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Hero */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-24 h-24 text-hotmess-red" strokeWidth={1.5} />
          </div>
          
          <h1 
            className="text-[120px] md:text-[180px] leading-none text-hotmess-red"
            style={{ fontWeight: 900 }}
          >
            404
          </h1>
          
          <div className="space-y-2">
            <h2 
              className="text-3xl md:text-4xl uppercase tracking-tight"
              style={{ fontWeight: 900 }}
            >
              PAGE NOT FOUND
            </h2>
            <p className="text-white/60 max-w-md mx-auto">
              This page doesn't exist or has been moved. Maybe you scanned an expired beacon?
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <Link
            href="/"
            className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-hotmess-red hover:bg-black/60 transition-all"
          >
            <Home className="w-8 h-8 mx-auto mb-3 text-white/40 group-hover:text-hotmess-red transition-colors" />
            <div className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Home
            </div>
          </Link>

          <Link
            href="/radio"
            className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-hotmess-red hover:bg-black/60 transition-all"
          >
            <Radio className="w-8 h-8 mx-auto mb-3 text-white/40 group-hover:text-hotmess-red transition-colors" />
            <div className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Radio
            </div>
          </Link>

          <Link
            href="/shop"
            className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-hotmess-red hover:bg-black/60 transition-all"
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-white/40 group-hover:text-hotmess-red transition-colors" />
            <div className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Shop
            </div>
          </Link>

          <Link
            href="/records"
            className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-hotmess-red hover:bg-black/60 transition-all"
          >
            <Music className="w-8 h-8 mx-auto mb-3 text-white/40 group-hover:text-hotmess-red transition-colors" />
            <div className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Records
            </div>
          </Link>
        </div>

        {/* Search Alternative */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-hotmess-red" />
            <h3 className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Looking for something?
            </h3>
          </div>
          <p className="text-sm text-white/60 mb-6">
            Try browsing our main sections or check out what's happening now.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/beacons"
              className="px-4 py-2 rounded-lg bg-hotmess-red/10 border border-hotmess-red/20 text-hotmess-red hover:bg-hotmess-red hover:text-white transition-all text-sm uppercase tracking-wide"
              style={{ fontWeight: 700 }}
            >
              Beacons
            </Link>
            <Link
              href="/messmarket"
              className="px-4 py-2 rounded-lg bg-hotmess-red/10 border border-hotmess-red/20 text-hotmess-red hover:bg-hotmess-red hover:text-white transition-all text-sm uppercase tracking-wide"
              style={{ fontWeight: 700 }}
            >
              MessMarket
            </Link>
            <Link
              href="/connect"
              className="px-4 py-2 rounded-lg bg-hotmess-red/10 border border-hotmess-red/20 text-hotmess-red hover:bg-hotmess-red hover:text-white transition-all text-sm uppercase tracking-wide"
              style={{ fontWeight: 700 }}
            >
              Connect
            </Link>
            <Link
              href="/care"
              className="px-4 py-2 rounded-lg bg-hotmess-red/10 border border-hotmess-red/20 text-hotmess-red hover:bg-hotmess-red hover:text-white transition-all text-sm uppercase tracking-wide"
              style={{ fontWeight: 700 }}
            >
              Care
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-sm text-white/40">
          Still lost? <Link href="/care" className="text-hotmess-red underline">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
