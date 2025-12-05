/**
 * ARCHITECTURE HUB — HOTMESS Global OS Command Center
 * Visual tracker for all 15 modules across the platform
 */

import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';

type ModuleStatus = 'complete' | 'in-progress' | 'planned';

interface Module {
  id: string;
  name: string;
  description: string;
  status: ModuleStatus;
  progress: number;
  features: string[];
  dependencies?: string[];
  route?: string;
}

const modules: Module[] = [
  {
    id: 'beacons',
    name: 'Beacons OS',
    description: 'QR-based interaction engine with 14 beacon types powering scans, check-ins, tickets, drops, and XP rewards',
    status: 'planned',
    progress: 0,
    features: [
      '14 beacon types (checkin, event, ticket, product, drop, vendor, chat, reward, sponsor, music, promo, quest, scan-to-join, scan-to-buy)',
      'Beacon Routing Engine (BRE)',
      'QR generation & scanning',
      'XP attribution per scan',
      'Bot automation triggers',
      'Analytics & heatmaps'
    ],
    dependencies: ['xp-system', 'bot-network']
  },
  {
    id: 'messmarket',
    name: 'MessMarket',
    description: '18+ gay marketplace - the "queer Etsy" for underwear, gear, toys, kink items, and creator content',
    status: 'in-progress',
    progress: 35,
    features: [
      'Seller accounts & onboarding',
      'Product listings with age-gating',
      'Auto-sync with Etsy/eBay/Shopify',
      'Reputation & safety scoring',
      'Beacon wrap for every listing',
      '10% platform fee + 2% affiliate',
      'Vendor analytics dashboard'
    ],
    dependencies: ['beacons', 'xp-system'],
    route: 'messmarket'
  },
  {
    id: 'shop',
    name: 'Shopify Shop (RAW/HUNG/HIGH/SUPER)',
    description: 'Four branded collections with Shopify integration and beacon-powered drops',
    status: 'complete',
    progress: 100,
    features: [
      'RAW collection (essentials)',
      'HUNG collection (gear)',
      'HIGH collection (party)',
      'SUPER collection (luxury)',
      'Shopify product sync',
      'Cart & checkout',
      'Drop campaigns'
    ],
    route: 'shopRaw'
  },
  {
    id: 'tickets',
    name: 'Tickets (C2C + Venue Mode)',
    description: 'Dual-mode ticketing: P2P resale marketplace + official venue sales with door scanning',
    status: 'complete',
    progress: 100,
    features: [
      'C2C ticket resale with escrow',
      'Venue Mode with door scanner',
      'Multi-tier tickets (GA/VIP/Queue-jump)',
      'Guestlist management',
      'Capacity tracking',
      'Promoter attribution',
      'Post-party aftercare flow'
    ],
    route: 'tickets'
  },
  {
    id: 'radio',
    name: 'Radio + Music Player',
    description: '24/7 streaming with playlist management, show scheduling, and bot integration',
    status: 'complete',
    progress: 100,
    features: [
      '24/7 live player',
      'Queue management',
      'Mini player bar',
      'Track history',
      'Playlist curation',
      'Radio bot commands (/nowplaying)',
      'RAW CONVICT premieres'
    ],
    route: 'radio'
  },
  {
    id: 'records',
    name: 'RAW CONVICT RECORDS',
    description: 'Music label with artist pipeline, release management, and beacon-powered drops',
    status: 'in-progress',
    progress: 40,
    features: [
      'Artist sign-up & onboarding',
      'Track upload & ISRC generation',
      'Pre-save campaigns',
      'Beacon creation for releases',
      'Radio rotation integration',
      'Royalty dashboard',
      'Debut: HOTMESS - Paul King x Stuart Whoo'
    ],
    dependencies: ['beacons', 'radio', 'xp-system']
  },
  {
    id: 'club-mode',
    name: 'Club Mode',
    description: 'Venue management system with event creation, door scanning, and Stripe Connect payouts',
    status: 'complete',
    progress: 100,
    features: [
      'Club dashboard',
      'Event creation & management',
      'Door scanner app',
      'Ticket sales with QR',
      'Capacity monitoring',
      'Stripe Connect integration',
      '5% platform fee collection'
    ],
    route: 'clubDashboard'
  },
  {
    id: 'connect',
    name: 'Connect (Dating/Hookups)',
    description: 'Profile-based matching for dating and casual encounters',
    status: 'complete',
    progress: 100,
    features: [
      'Profile creation',
      'Photo galleries',
      'Filtering & discovery',
      'Match system',
      'In-app messaging',
      'Location-based search'
    ],
    route: 'connect'
  },
  {
    id: 'xp-system',
    name: 'XP & Gamification',
    description: 'Universal points system rewarding scans, purchases, engagement - with tiered multipliers',
    status: 'planned',
    progress: 0,
    features: [
      'XP ledger (blockchain-inspired)',
      'Sources: scans, purchases, posts, streams',
      'Membership tier multipliers',
      'XP rewards: merch, early access, VIP, mystery boxes',
      'Leaderboards (city, global)',
      'Quest system (multi-step journeys)'
    ],
    dependencies: []
  },
  {
    id: 'bot-network',
    name: 'Bot Network (Telegram)',
    description: '6 specialized bots handling radio, drops, care, admin, moderation, and analytics',
    status: 'planned',
    progress: 0,
    features: [
      'HotmessRadioBot (/nowplaying, /schedule)',
      'HotmessDropBot (vendor broadcasts)',
      'HotmessCareBot (harm reduction)',
      'HotmessAdminBot (moderation)',
      'HotmessAnalyticsBot (KPIs)',
      'HotmessMarketBot (listings)'
    ],
    dependencies: ['beacons', 'xp-system']
  },
  {
    id: 'membership',
    name: 'Membership Tiers',
    description: 'Three tiers (£5/£12/£25) + £7 care add-on with XP multipliers and exclusive features',
    status: 'planned',
    progress: 0,
    features: [
      'FREE: 10 scans/month, 1x XP',
      'MEMBER (£5): 100 scans, 2x XP',
      'PLUS (£12): Unlimited scans, 3x XP, premium beacons',
      'PRO (£25): 5x XP, early drops, queue-jump, concierge',
      'CARE add-on (£7): Therapy directory, crisis support',
      'Stripe Billing integration'
    ],
    dependencies: ['xp-system']
  },
  {
    id: 'care',
    name: 'Care & Community',
    description: 'Harm reduction resources, safer use guides, mental health support, crisis intervention',
    status: 'complete',
    progress: 100,
    features: [
      'Harm reduction guides',
      'Safer use information',
      'Crisis resources by city',
      'Mental health directory',
      'Community guidelines',
      'Incident reporting'
    ],
    route: 'care'
  },
  {
    id: 'city-expansion',
    name: 'City Expansion System',
    description: '60-day playbook for launching new cities with clubs, hosts, beacons, and local partnerships',
    status: 'planned',
    progress: 0,
    features: [
      '8 cities: London, Berlin, Barcelona, Lisbon, Amsterdam, NYC, Sydney, São Paulo',
      '100-beacon footprint per city',
      '4 anchor clubs + 10 bars',
      'Local host programme',
      '50+ Telegram city rooms',
      'City-specific care partners',
      'City economics: £5.5K net/month'
    ],
    dependencies: ['beacons', 'bot-network', 'care']
  },
  {
    id: 'growth',
    name: 'Growth & Distribution Engine',
    description: '7 acquisition channels, 5 viral loops, retention hooks, and complete analytics framework',
    status: 'planned',
    progress: 0,
    features: [
      '7 channels: organic, paid, partnerships, affiliates, PR, events, bots',
      '5 viral loops: beacon sharing, ticket referrals, marketplace listings, radio shares, XP leaderboards',
      'Weekly rituals: drop Monday, events Friday, care Sunday',
      'Year 1: £720K revenue, 12K users',
      'Year 2: £3M revenue, 60K users',
      '40+ tracked metrics'
    ],
    dependencies: ['beacons', 'xp-system', 'bot-network', 'membership']
  },
  {
    id: 'admin',
    name: 'Admin & Moderation',
    description: 'Moderation desk, incident handling, user management, and analytics dashboard',
    status: 'complete',
    progress: 100,
    features: [
      'User moderation',
      'Content flagging',
      'Incident reports',
      'Ban management',
      'DSAR handling',
      'Analytics dashboard',
      'Vendor approval'
    ],
    route: 'admin'
  }
];

function getStatusIcon(status: ModuleStatus) {
  switch (status) {
    case 'complete':
      return <CheckCircle2 className="size-5 text-green-500" />;
    case 'in-progress':
      return <AlertCircle className="size-5 text-yellow-500" />;
    case 'planned':
      return <Circle className="size-5 text-white/20" />;
  }
}

function getStatusLabel(status: ModuleStatus) {
  switch (status) {
    case 'complete':
      return 'COMPLETE';
    case 'in-progress':
      return 'IN PROGRESS';
    case 'planned':
      return 'PLANNED';
  }
}

function getStatusColor(status: ModuleStatus) {
  switch (status) {
    case 'complete':
      return 'text-green-500';
    case 'in-progress':
      return 'text-yellow-500';
    case 'planned':
      return 'text-white/40';
  }
}

interface ArchitectureHubProps {
  onNavigate: (route: string) => void;
}

export function ArchitectureHub({ onNavigate }: ArchitectureHubProps) {
  const completedModules = modules.filter(m => m.status === 'complete').length;
  const inProgressModules = modules.filter(m => m.status === 'in-progress').length;
  const plannedModules = modules.filter(m => m.status === 'planned').length;
  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              GLOBAL OPERATING SYSTEM
            </span>
          </div>
          
          <h1 className="mb-6">
            HOTMESS Architecture Hub
          </h1>
          
          <p className="text-[18px] leading-[1.6] text-white/60 max-w-2xl mx-auto mb-8">
            15 interconnected modules powering the complete masculine nightlife OS 
            for queer men 18+. From beacons to bots, tickets to XP, radio to records.
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-500" />
              <span className="text-[14px] font-semibold text-white/80">
                {completedModules} Complete
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-yellow-500" />
              <span className="text-[14px] font-semibold text-white/80">
                {inProgressModules} In Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="size-5 text-white/20" />
              <span className="text-[14px] font-semibold text-white/80">
                {plannedModules} Planned
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-white/40 uppercase tracking-wider">
                Overall Progress
              </span>
              <span className="text-[14px] font-bold text-white">
                {totalProgress}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white/[0.02] border border-white/10 rounded-lg p-6 hover:bg-white/[0.04] transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(module.status)}
                    <h3 className="font-bold text-[20px] text-white">
                      {module.name}
                    </h3>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-white/60">
                    {module.description}
                  </p>
                </div>
                
                {module.route && (
                  <button
                    onClick={() => onNavigate(module.route!)}
                    className="ml-4 p-2 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ArrowRight className="size-5 text-white/40" />
                  </button>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-[11px] uppercase tracking-[0.15em] font-bold ${getStatusColor(module.status)}`}>
                  {getStatusLabel(module.status)}
                </span>
                
                {module.status !== 'planned' && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">
                        Progress
                      </span>
                      <span className="text-[11px] font-bold text-white/60">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-2">
                  Key Features
                </div>
                <ul className="space-y-1.5">
                  {module.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px] text-white/50">
                      <span className="text-red-500 mt-1.5">•</span>
                      <span className="flex-1 leading-[1.5]">{feature}</span>
                    </li>
                  ))}
                  {module.features.length > 4 && (
                    <li className="text-[12px] text-white/30 italic pl-4">
                      +{module.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Dependencies */}
              {module.dependencies && module.dependencies.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-2">
                    Dependencies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-2 py-1 bg-white/[0.03] border border-white/10 rounded text-[11px] text-white/40"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-red-950/10 border border-red-900/20 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[16px] text-white mb-2">
                Level 5 Architecture Complete
              </h4>
              <p className="text-[14px] leading-[1.6] text-white/60 mb-3">
                This hub tracks the complete HOTMESS Global OS — 15 modules spanning beacons, 
                marketplace, ticketing, music, bots, XP gamification, memberships, and global expansion. 
                All systems designed for care-first, masculine aesthetics, 18+ compliance.
              </p>
              <p className="text-[13px] text-white/40">
                Year 1 target: £720K revenue across 6 cities. Year 2: £3M revenue, 60K users, 20 cities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
