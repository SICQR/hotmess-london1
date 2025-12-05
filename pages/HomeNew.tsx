/**
 * HOTMESS LONDON — Home (PRODUCTION VERSION)
 * Natural scroll, NEW DROPS highlighted, MP3 teasers, QR beacon focus
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  MapPin,
  Ticket,
  Radio,
  ShoppingBag,
  Shield,
  Zap,
  Sparkles,
  Music,
  Heart,
  Users,
  Clock,
  Play,
  Pause,
  ArrowRight,
  Calendar,
  Star,
  Globe,
  Flame,
  QrCode,
  Volume2,
  Download,
  TrendingUp,
  Package,
  Headphones,
} from 'lucide-react';
import { BeaconScanner } from '../components/BeaconScanner';
import { getCurrentUser, AuthUser } from '../lib/auth';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { RouteId } from '../lib/routes';

interface HomeNewProps {
  onNavigate: (page: RouteId, params?: any) => void;
}

export function HomeNew({ onNavigate }: HomeNewProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleScanSuccess = (beaconId: string, xp: number) => {
    setScannerOpen(false);
    onNavigate('map');
  };

  const isAuthed = !!user;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Scanner Modal */}
      {scannerOpen && (
        <BeaconScanner onScanSuccess={handleScanSuccess} onClose={() => setScannerOpen(false)} />
      )}

      {/* Cinematic Hero Section - Auto Scroll */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2400"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-hot/10 via-transparent to-hot/10" />
          
          {/* Ambient Glow Effects */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-hot/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-hot/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 py-24">
          <motion.div
            className="text-hot uppercase tracking-widest mb-6 flex items-center gap-3"
            style={{ fontWeight: 700, fontSize: '14px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-hot rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-hot rounded-full animate-ping" />
            </div>
            HOTMESS LONDON · LIVE NOW
          </motion.div>

          <motion.h1
            className="uppercase tracking-[-0.04em] leading-[0.85] text-white mb-8"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(56px, 14vw, 160px)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            ALWAYS TOO
            <br />
            MUCH, YET
            <br />
            <span className="text-hot">NEVER ENOUGH</span>
          </motion.h1>

          <motion.p
            className="text-white/90 max-w-2xl mb-12 text-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Scan beacons. Find parties. Shop drops. Stream releases.
            <br />
            <span className="text-hot">Queer men 18+. London's nightlife, mapped.</span>
          </motion.p>

          {/* Primary Hero Actions */}
          <motion.div
            className="flex flex-wrap gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => onNavigate('nightPulse')}
              className="group px-10 py-5 bg-gradient-to-r from-hot to-hot/80 hover:from-white hover:to-hot text-white hover:text-black uppercase tracking-wider transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,22,148,0.6)] hover:shadow-[0_0_50px_rgba(255,22,148,0.9)]"
              style={{ fontWeight: 900, fontSize: '16px' }}
            >
              <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              🌍 NIGHT PULSE GLOBE
            </button>
            <button
              onClick={() => setScannerOpen(true)}
              className="group px-10 py-5 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all flex items-center gap-3"
              style={{ fontWeight: 900, fontSize: '16px' }}
            >
              <QrCode size={24} className="group-hover:rotate-12 transition-transform" />
              Scan QR Beacon
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-hot text-white backdrop-blur-sm uppercase tracking-wider transition-all flex items-center gap-3"
              style={{ fontWeight: 700, fontSize: '16px' }}
            >
              <MapPin size={24} />
              Find Parties
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-hot text-white backdrop-blur-sm uppercase tracking-wider transition-all flex items-center gap-3"
              style={{ fontWeight: 700, fontSize: '16px' }}
            >
              <Package size={24} />
              New Drops
            </button>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <HeroStatCard icon={<Flame />} value="247" label="Live Beacons" pulse />
            <HeroStatCard icon={<Ticket />} value="18" label="Events Tonight" />
            <HeroStatCard icon={<Radio />} value="1.2K" label="On Air Now" pulse />
            <HeroStatCard icon={<Users />} value="8.4K" label="Community" />
          </motion.div>
        </div>
      </section>

      {/* QR BEACON SCANNER SECTION - PROMINENT */}
      <section className="border-b border-hot/30 bg-gradient-to-b from-black to-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hot/5" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hot to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="text-center mb-12">
            <motion.div
              className="text-hot uppercase tracking-widest mb-4 flex items-center justify-center gap-3"
              style={{ fontWeight: 700, fontSize: '14px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <QrCode size={20} />
              QR BEACONS
            </motion.div>
            <motion.h2
              className="text-white uppercase tracking-[-0.03em] mb-6"
              style={{ fontWeight: 900, fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              FIND PARTIES
              <br />
              <span className="text-hot">WITH QR CODES</span>
            </motion.h2>
            <motion.p
              className="text-white/70 text-lg max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Scan QR beacons at venues, on flyers, or from hosts. Unlock secret locations, chat with attendees, and earn XP.
              No beacon near you? Enter a code manually.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setScannerOpen(true)}
                className="px-12 py-6 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all flex items-center gap-3"
                style={{ fontWeight: 900, fontSize: '18px' }}
              >
                <Scan size={28} />
                Scan Beacon Now
              </button>
              <button
                onClick={() => onNavigate('beaconsGlobe')}
                className="px-12 py-6 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-hot text-white uppercase tracking-wider transition-all flex items-center gap-3"
                style={{ fontWeight: 700, fontSize: '18px' }}
              >
                <Globe size={28} />
                View All Beacons
              </button>
            </motion.div>
          </div>

          {/* QR Examples Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <QRFeatureCard
              icon={<MapPin />}
              title="At Venues"
              description="Physical QR codes at clubs, bars, and events. Scan to check in and unlock perks."
            />
            <QRFeatureCard
              icon={<Ticket />}
              title="On Flyers"
              description="Digital and print flyers include beacon codes. Scan to RSVP and get event details."
            />
            <QRFeatureCard
              icon={<Users />}
              title="From Hosts"
              description="Hosts share private beacon codes. Scan to join exclusive chats and secret locations."
            />
          </div>
        </div>
      </section>

      {/* NEW DROPS - SHOPIFY PRODUCTS */}
      <section className="border-b border-white/10 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-hot to-transparent animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.div
                className="text-hot uppercase tracking-widest mb-4 flex items-center gap-3"
                style={{ fontWeight: 700, fontSize: '14px' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Package size={20} />
                NEW ARRIVALS · JUST DROPPED
              </motion.div>
              <motion.h2
                className="text-white uppercase tracking-[-0.03em]"
                style={{ fontWeight: 900, fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                FRESH
                <br />
                <span className="text-hot">DROPS</span>
              </motion.h2>
              <motion.p
                className="text-white/60 text-lg mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Limited stock. Curated gear. Don't sleep.
              </motion.p>
            </div>
            <motion.button
              onClick={() => onNavigate('shop')}
              className="hidden md:flex items-center gap-2 text-hot hover:text-white uppercase tracking-wider transition-colors"
              style={{ fontWeight: 700, fontSize: '16px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Shop All
              <ArrowRight size={20} />
            </motion.button>
          </div>

          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <NewDropCard
              image="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800"
              title="BULLDOG HARNESS V2"
              price="£89"
              badge="NEW"
              category="RAW"
              stock="Limited"
              onClick={() => onNavigate('shop')}
            />
            <NewDropCard
              image="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"
              title="RITUAL POPPERS PACK"
              price="£45"
              badge="HOT"
              category="HIGH"
              stock="In Stock"
              onClick={() => onNavigate('shopHigh')}
            />
            <NewDropCard
              image="https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800"
              title="LATEX JOCK STRAP"
              price="£35"
              badge="NEW"
              category="RAW"
              stock="Low Stock"
              onClick={() => onNavigate('shopRaw')}
            />
            <NewDropCard
              image="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
              title="BEAST MODE BLEND"
              price="£65"
              badge="BACK"
              category="SUPER"
              stock="In Stock"
              onClick={() => onNavigate('shopSuper')}
            />
          </motion.div>

          {/* Shop All CTA Mobile */}
          <motion.div
            className="md:hidden text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => onNavigate('shop')}
              className="w-full px-8 py-4 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
              style={{ fontWeight: 900, fontSize: '16px' }}
            >
              Shop All Drops →
            </button>
          </motion.div>
        </div>
      </section>

      {/* NEW MUSIC RELEASES - WITH MP3 TEASERS */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-hot/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-hot to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.div
                className="text-hot uppercase tracking-widest mb-4 flex items-center gap-3"
                style={{ fontWeight: 700, fontSize: '14px' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Headphones size={20} />
                RAW CONVICT RECORDS · NEW RELEASES
              </motion.div>
              <motion.h2
                className="text-white uppercase tracking-[-0.03em]"
                style={{ fontWeight: 900, fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                FRESH
                <br />
                <span className="text-hot">BEATS</span>
              </motion.h2>
              <motion.p
                className="text-white/60 text-lg mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Preview new tracks. Artists keep 70%. Underground techno, industrial, kink.
              </motion.p>
            </div>
            <motion.button
              onClick={() => onNavigate('records')}
              className="hidden md:flex items-center gap-2 text-hot hover:text-white uppercase tracking-wider transition-colors"
              style={{ fontWeight: 700, fontSize: '16px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              All Releases
              <ArrowRight size={20} />
            </motion.button>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MusicDropCard
              artwork="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800"
              title="CONVICT 024"
              artist="VOID SIGNAL"
              tracks={6}
              releaseDate="Nov 28"
              badge="NEW"
              onClick={() => onNavigate('records')}
            />
            <MusicDropCard
              artwork="https://images.unsplash.com/photo-1619983081563-430f63602796?w=800"
              title="INDUSTRIAL EP"
              artist="REDACTED"
              tracks={4}
              releaseDate="Nov 25"
              badge="HOT"
              onClick={() => onNavigate('records')}
            />
            <MusicDropCard
              artwork="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800"
              title="RAW 013"
              artist="BASEMENT FREQ"
              tracks={5}
              releaseDate="Nov 22"
              onClick={() => onNavigate('records')}
            />
          </motion.div>

          {/* Browse All Mobile */}
          <motion.div
            className="md:hidden text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => onNavigate('records')}
              className="w-full px-8 py-4 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
              style={{ fontWeight: 900, fontSize: '16px' }}
            >
              Browse All Releases →
            </button>
          </motion.div>
        </div>
      </section>

      {/* TONIGHT'S EVENTS */}
      <section className="border-b border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <SectionHeader
            tag="Tonight"
            title="HAPPENING NOW"
            description="Live events with beacons. Scan to enter, buy tickets, or just show up."
            action={{ label: 'View All Events', onClick: () => onNavigate('tickets') }}
          />

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EventCard
              image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
              title="LEATHER NIGHT"
              venue="The Eagle"
              time="Tonight · 22:00"
              price="£15"
              badge="Scan QR"
              onClick={() => onNavigate('tickets')}
            />
            <EventCard
              image="https://images.unsplash.com/photo-1571266028243-d220c6a4e4b2?w=800"
              title="MESS WAREHOUSE"
              venue="Secret Location"
              time="Sat · 23:00"
              price="£25"
              badge="Beacon Only"
              onClick={() => onNavigate('tickets')}
            />
            <EventCard
              image="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800"
              title="RAW SUNDAY"
              venue="Vauxhall"
              time="Sun · 14:00"
              price="£12"
              onClick={() => onNavigate('tickets')}
            />
          </motion.div>
        </div>
      </section>

      {/* LIVE MAP PREVIEW */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-hot/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <SectionHeader
            tag="Explore"
            title="LIVE BEACON MAP"
            description="247 beacons across London. Heat, pins, trails. See what's happening right now."
            action={{ label: 'Open Full Map', onClick: () => onNavigate('map') }}
          />

          <motion.div
            className="relative aspect-video md:aspect-[21/9] bg-black border border-white/20 overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => onNavigate('map')}
          >
            {/* Map Preview Image */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600"
              alt="Map Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Map Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                className="px-16 py-8 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all flex items-center gap-4 backdrop-blur-sm border border-hot"
                style={{ fontWeight: 900, fontSize: '20px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin size={32} />
                Launch Map
                <ArrowRight size={32} />
              </motion.button>
            </div>

            {/* Live Beacon Indicators */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-3">
              <BeaconPulse label="Soho" count={42} />
              <BeaconPulse label="Vauxhall" count={38} />
              <BeaconPulse label="Shoreditch" count={29} />
              <BeaconPulse label="Camden" count={18} />
            </div>
          </motion.div>

          {/* Map Features Grid */}
          <motion.div
            className="grid md:grid-cols-4 gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MapFeatureCard icon={<Globe />} label="3D Globe View" onClick={() => onNavigate('map')} />
            <MapFeatureCard icon={<Flame />} label="Heatmap Mode" onClick={() => onNavigate('map')} />
            <MapFeatureCard icon={<Scan />} label="Scan Beacon" onClick={() => setScannerOpen(true)} />
            <MapFeatureCard icon={<Calendar />} label="Event Calendar" onClick={() => onNavigate('tickets')} />
          </motion.div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="border-b border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <SectionHeader
            tag="Platform"
            title="EVERYTHING YOU NEED"
            description="From beacons to tickets, radio to records. All in one OS."
          />

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Radio />}
              title="24/7 Radio"
              description="Underground sets. Live chat. Residents and guest DJs. On air now."
              badge="Live"
              color="hot"
              onClick={() => onNavigate('radio')}
            />
            <FeatureCard
              icon={<ShoppingBag />}
              title="Shop"
              description="RAW / HUNG / HIGH / SUPER. Curated gear, harnesses, supplements, toys."
              onClick={() => onNavigate('shop')}
            />
            <FeatureCard
              icon={<Zap />}
              title="MessMarket"
              description="P2P marketplace. Sell your stuff. White-label mode for sellers."
              onClick={() => onNavigate('messmarket')}
            />
            <FeatureCard
              icon={<Heart />}
              title="Connect"
              description="Dating, hookups, friends. Location-based, kink-friendly, verified."
              onClick={() => onNavigate('connect')}
            />
            <FeatureCard
              icon={<Shield />}
              title="Care Resources"
              description="Mental health, harm reduction, aftercare. Care-first principles."
              onClick={() => onNavigate('care')}
            />
            <FeatureCard
              icon={<Users />}
              title="Community"
              description="Forums, guides, stories. 8.4K members. Real people, real kink."
              onClick={() => onNavigate('community')}
            />
          </motion.div>
        </div>
      </section>

      {/* COMMUNITY PROOF */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-hot/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <SectionHeader tag="Community" title="REAL VOICES" description="8,400+ members. Real stories." />

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TestimonialCard
              quote="Scanned a beacon at The Yard, unlocked a secret afterparty. This platform is insane."
              author="Marcus, 28"
              location="Vauxhall"
            />
            <TestimonialCard
              quote="Finally a nightlife app that actually gets our community. The care resources saved me."
              author="James, 34"
              location="Shoreditch"
            />
            <TestimonialCard
              quote="Sold my unused harness on MessMarket in 20 mins. No fees, no bullshit."
              author="Alex, 31"
              location="Soho"
            />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-white uppercase tracking-[-0.02em]"
              style={{ fontWeight: 900, fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1 }}
            >
              BY THE NUMBERS
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BigStatCard value="8.4K" label="Community Members" />
            <BigStatCard value="247" label="Active Beacons" />
            <BigStatCard value="1,200+" label="Events Hosted" />
            <BigStatCard value="£2.4M" label="Community Revenue" />
          </motion.div>
        </div>
      </section>

      {/* CARE SECTION */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Shield className="w-20 h-20 text-hot mx-auto mb-6" />
          </motion.div>
          <motion.div
            className="text-hot uppercase tracking-widest mb-4"
            style={{ fontWeight: 700, fontSize: '12px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Care First
          </motion.div>
          <motion.h2
            className="text-white uppercase tracking-[-0.02em] mb-6"
            style={{ fontWeight: 900, fontSize: 'clamp(36px, 6vw, 56px)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            BUILT WITH CARE
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Mental health resources, harm reduction info, aftercare triggers, consent frameworks. We don't just talk about care —
            we build it into every feature.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => onNavigate('care')}
              className="px-8 py-4 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              Care Resources
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              Community Guidelines
            </button>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-hot relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hot via-hot to-black/30" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
          <motion.h2
            className="text-white uppercase tracking-[-0.03em] mb-6"
            style={{ fontWeight: 900, fontSize: 'clamp(48px, 10vw, 96px)', lineHeight: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            READY TO
            <br />
            EXPLORE?
          </motion.h2>
          <motion.p
            className="text-white/95 text-xl mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {isAuthed ? "Welcome back. Let's find something tonight." : 'Join 8,400+ members exploring London nightlife.'}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {!isAuthed ? (
              <>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-14 py-6 bg-black hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
                  style={{ fontWeight: 900, fontSize: '18px' }}
                >
                  Create Account
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-14 py-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white uppercase tracking-wider transition-all"
                  style={{ fontWeight: 700, fontSize: '18px' }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('map')}
                  className="px-14 py-6 bg-black hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all flex items-center gap-3"
                  style={{ fontWeight: 900, fontSize: '18px' }}
                >
                  <MapPin size={28} />
                  Open Map
                </button>
                <button
                  onClick={() => onNavigate('tickets')}
                  className="px-14 py-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white uppercase tracking-wider transition-all flex items-center gap-3"
                  style={{ fontWeight: 700, fontSize: '18px' }}
                >
                  <Ticket size={28} />
                  Browse Events
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
                Platform
              </div>
              <div className="space-y-2">
                <FooterLink label="Map" onClick={() => onNavigate('map')} />
                <FooterLink label="Beacons" onClick={() => onNavigate('beacons')} />
                <FooterLink label="Tickets" onClick={() => onNavigate('tickets')} />
                <FooterLink label="Radio" onClick={() => onNavigate('radio')} />
              </div>
            </div>
            <div>
              <div className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
                Commerce
              </div>
              <div className="space-y-2">
                <FooterLink label="Shop" onClick={() => onNavigate('shop')} />
                <FooterLink label="MessMarket" onClick={() => onNavigate('messmarket')} />
                <FooterLink label="Records" onClick={() => onNavigate('records')} />
                <FooterLink label="Pricing" onClick={() => onNavigate('pricing')} />
              </div>
            </div>
            <div>
              <div className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
                Community
              </div>
              <div className="space-y-2">
                <FooterLink label="Connect" onClick={() => onNavigate('connect')} />
                <FooterLink label="Community" onClick={() => onNavigate('community')} />
                <FooterLink label="Care" onClick={() => onNavigate('care')} />
                <FooterLink label="About" onClick={() => onNavigate('about')} />
              </div>
            </div>
            <div>
              <div className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
                For Creators
              </div>
              <div className="space-y-2">
                <FooterLink label="Host Events" onClick={() => onNavigate('applyHost')} />
                <FooterLink label="Sell on Market" onClick={() => onNavigate('sellerDashboard')} />
                <FooterLink label="Affiliate" onClick={() => onNavigate('affiliate')} />
              </div>
            </div>
            <div>
              <div className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '10px' }}>
                Legal
              </div>
              <div className="space-y-2">
                <FooterLink label="Terms" onClick={() => onNavigate('legalTerms')} />
                <FooterLink label="Privacy" onClick={() => onNavigate('legalPrivacy')} />
                <FooterLink label="18+" onClick={() => onNavigate('legal18')} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function SectionHeader({
  tag,
  title,
  description,
  action,
}: {
  tag: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mb-12 flex items-end justify-between">
      <div>
        <motion.div
          className="text-hot uppercase tracking-widest mb-3"
          style={{ fontWeight: 700, fontSize: '12px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {tag}
        </motion.div>
        <motion.h2
          className="text-white uppercase tracking-[-0.02em] mb-4"
          style={{ fontWeight: 900, fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-white/60 max-w-2xl text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      </div>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="hidden md:flex items-center gap-2 text-hot hover:text-white uppercase tracking-wider transition-colors"
          style={{ fontWeight: 700, fontSize: '14px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {action.label}
          <ArrowRight size={16} />
        </motion.button>
      )}
    </div>
  );
}

function HeroStatCard({
  icon,
  value,
  label,
  pulse,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div className="bg-black/70 backdrop-blur-md border border-white/20 p-4 relative overflow-hidden group hover:border-hot transition-colors">
      {pulse && <div className="absolute inset-0 bg-hot/5 animate-pulse" />}
      <div className="relative flex items-center gap-3 mb-2">
        <div className={`${pulse ? 'text-hot' : 'text-white/60'} group-hover:text-hot transition-colors`}>{icon}</div>
        <div className="text-white" style={{ fontWeight: 900, fontSize: '28px' }}>
          {value}
        </div>
      </div>
      <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
        {label}
      </div>
    </div>
  );
}

function QRFeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 hover:border-hot p-8 transition-all group"
      whileHover={{ y: -4 }}
    >
      <div className="text-hot mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900, fontSize: '18px' }}>
        {title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function NewDropCard({
  image,
  title,
  price,
  badge,
  category,
  stock,
  onClick,
}: {
  image: string;
  title: string;
  price: string;
  badge: string;
  category: string;
  stock: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="group cursor-pointer bg-white/5 border border-white/10 hover:border-hot overflow-hidden transition-all"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-hot text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
          {badge}
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/80 backdrop-blur-sm text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '9px' }}>
          {category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white uppercase mb-2 leading-tight" style={{ fontWeight: 900, fontSize: '15px' }}>
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-hot" style={{ fontWeight: 900, fontSize: '20px' }}>
            {price}
          </div>
          <div className={`text-xs uppercase tracking-wider ${stock === 'Low Stock' ? 'text-hot' : 'text-white/60'}`} style={{ fontWeight: 700, fontSize: '10px' }}>
            {stock}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MusicDropCard({
  artwork,
  title,
  artist,
  tracks,
  releaseDate,
  badge,
  onClick,
}: {
  artwork: string;
  title: string;
  artist: string;
  tracks: number;
  releaseDate: string;
  badge?: string;
  onClick: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className="group cursor-pointer bg-white/5 border border-white/10 hover:border-hot overflow-hidden transition-all"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={artwork}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-hot hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
        </div>
        {badge && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-hot text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-white uppercase mb-1" style={{ fontWeight: 900, fontSize: '18px' }}>
          {title}
        </h3>
        <p className="text-white/60 mb-4" style={{ fontSize: '14px' }}>
          {artist}
        </p>
        <div className="flex items-center justify-between text-white/40 text-xs">
          <div className="flex items-center gap-2">
            <Music size={12} />
            {tracks} tracks
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} />
            {releaseDate}
          </div>
        </div>
      </div>
      {/* Audio element for teaser (would connect to real MP3) */}
      <audio ref={audioRef} src="" onEnded={() => setIsPlaying(false)} />
    </motion.div>
  );
}

function EventCard({
  image,
  title,
  venue,
  time,
  price,
  badge,
  onClick,
}: {
  image: string;
  title: string;
  venue: string;
  time: string;
  price: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="group cursor-pointer bg-white/5 border border-white/10 hover:border-hot overflow-hidden transition-all"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        {badge && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-hot text-white uppercase tracking-wider flex items-center gap-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            <QrCode size={12} />
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-white uppercase mb-2" style={{ fontWeight: 900, fontSize: '20px' }}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <MapPin size={14} />
          {venue}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock size={14} />
            {time}
          </div>
          <div className="text-hot" style={{ fontWeight: 900, fontSize: '18px' }}>
            {price}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BeaconPulse({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-hot/50 px-3 py-2">
      <div className="relative">
        <div className="w-2 h-2 bg-hot rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-hot rounded-full animate-ping opacity-75" />
      </div>
      <span className="text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
        {label}
      </span>
      <span className="text-hot" style={{ fontWeight: 900, fontSize: '12px' }}>
        {count}
      </span>
    </div>
  );
}

function MapFeatureCard({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group bg-white/5 border border-white/10 hover:border-hot p-6 transition-all text-left">
      <div className="text-hot mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
        {label}
      </div>
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  color?: 'hot';
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`group cursor-pointer bg-white/5 border p-8 transition-all ${
        color === 'hot' ? 'border-hot/50 hover:border-hot' : 'border-white/10 hover:border-hot'
      }`}
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${color === 'hot' ? 'text-hot' : 'text-hot'} group-hover:scale-110 transition-transform`}>{icon}</div>
        {badge && (
          <div className="px-2 py-1 bg-hot text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '9px' }}>
            {badge}
          </div>
        )}
      </div>
      <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900, fontSize: '18px' }}>
        {title}
      </h3>
      <p className="text-white/60 text-sm mb-4 leading-relaxed">{description}</p>
      <div
        className="text-hot uppercase tracking-wider group-hover:translate-x-2 transition-transform inline-flex items-center gap-2"
        style={{ fontWeight: 700, fontSize: '12px' }}
      >
        Explore <ArrowRight size={14} />
      </div>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, location }: { quote: string; author: string; location: string }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Star className="text-hot mb-4" size={24} />
      <p className="text-white/80 mb-6 leading-relaxed" style={{ fontSize: '15px' }}>
        "{quote}"
      </p>
      <div>
        <div className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>
          {author}
        </div>
        <div className="text-white/40 text-sm">{location}</div>
      </div>
    </motion.div>
  );
}

function BigStatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 hover:border-hot p-8 text-center transition-colors group"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-hot mb-2 group-hover:scale-110 transition-transform" style={{ fontWeight: 900, fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: 1 }}>
        {value}
      </div>
      <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
        {label}
      </div>
    </motion.div>
  );
}

function FooterLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="block text-white/60 hover:text-hot transition-colors text-left" style={{ fontSize: '14px' }}>
      {label}
    </button>
  );
}