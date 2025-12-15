// Mock data for HOTMESS LONDON

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'RAW' | 'HUNG' | 'HIGH' | 'SUPER';
  pricePence: number;
  images: string[];
  active: boolean;
}

export interface RadioShow {
  id: string;
  slug: string;
  title: string;
  host: string;
  description: string;
  schedule: string;
  imageUrl: string;
}

export interface Post {
  id: string;
  authorName: string;
  title?: string;
  body: string;
  createdAt: string;
  status: 'LIVE' | 'QUEUED' | 'REMOVED';
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'paid' | 'processing' | 'shipped' | 'delivered';
  items: { productTitle: string; qty: number; price: number }[];
}

export interface CareResource {
  id: string;
  title: string;
  description: string;
  category: 'mental' | 'sexual' | 'substance' | 'crisis';
  url: string;
  phone?: string;
  available: string;
}

// Products
export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'raw-tank-black',
    title: 'RAW Tank — Black',
    description: 'Mesh tank. No apologies. 100% polyester, hand wash.',
    category: 'RAW',
    pricePence: 2800,
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
    active: true,
  },
  {
    id: '2',
    slug: 'hung-harness',
    title: 'HUNG Chest Harness',
    description: 'Premium leather harness. Adjustable. Made in UK.',
    category: 'HUNG',
    pricePence: 6500,
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'],
    active: true,
  },
  {
    id: '3',
    slug: 'high-bucket-hat',
    title: 'HIGH Bucket Hat',
    description: 'Reflective bucket hat. One size. Logo embroidered.',
    category: 'HIGH',
    pricePence: 3200,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'],
    active: true,
  },
  {
    id: '4',
    slug: 'super-zip-hoodie',
    title: 'SUPER Zip Hoodie',
    description: 'Oversized zip hoodie. Heavy cotton. Logo front and back.',
    category: 'SUPER',
    pricePence: 5800,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    active: true,
  },
  {
    id: '5',
    slug: 'raw-mesh-shorts',
    title: 'RAW Mesh Shorts',
    description: 'See-through mesh shorts. Elastic waist. No shame.',
    category: 'RAW',
    pricePence: 2400,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'],
    active: true,
  },
  {
    id: '6',
    slug: 'hung-leather-cap',
    title: 'HUNG Leather Cap',
    description: 'Classic leather cap. Snapback. Premium Italian leather.',
    category: 'HUNG',
    pricePence: 4800,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'],
    active: true,
  },
];

// Radio Shows
export const mockRadioShows: RadioShow[] = [
  {
    id: '1',
    slug: 'wake-the-mess',
    title: 'Wake The Mess',
    host: 'Nic',
    description: 'Morning chaos. Coffee, beats, and brutal honesty. 6-9AM Mon-Fri.',
    schedule: 'Mon-Fri 6:00-9:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
  },
  {
    id: '2',
    slug: 'dial-a-daddy',
    title: 'Dial A Daddy',
    host: 'Stewart',
    description: 'Call in. Ask anything. No script. Pure mess.',
    schedule: 'Wed 8:00-10:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800',
  },
  {
    id: '3',
    slug: 'hand-n-hand',
    title: 'Hand N Hand (Sun)',
    host: 'HOTMESS Care Team',
    description: 'Sunday care hour. Mental health, harm reduction, community support.',
    schedule: 'Sun 7:00-8:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
  },
];

// Community Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    authorName: 'Marcus_87',
    title: 'First time at Vauxhall Tavern',
    body: 'Went last night for the first time. The energy was INSANE. Met some amazing people. This community is everything.',
    createdAt: '2025-11-24T22:34:00Z',
    status: 'LIVE',
  },
  {
    id: '2',
    authorName: 'JakeLDN',
    body: 'Anyone know good queer-friendly gyms in East London? Looking for a space where I can just exist without the usual bullshit.',
    createdAt: '2025-11-24T18:12:00Z',
    status: 'LIVE',
  },
  {
    id: '3',
    authorName: 'Alex_K',
    title: 'Shout out to the Hand N Hand team',
    body: 'Called the support line last week during a really rough moment. The person I spoke to was incredible. Just wanted to say thank you to whoever runs this.',
    createdAt: '2025-11-23T15:45:00Z',
    status: 'LIVE',
  },
];

// Care Resources
export const mockCareResources: CareResource[] = [
  {
    id: '1',
    title: 'Switchboard LGBT+ Helpline',
    description: 'Confidential support for LGBTQ+ people. Information, support, referrals.',
    category: 'mental',
    url: 'https://switchboard.lgbt',
    phone: '0300 330 0630',
    available: '10am-10pm daily',
  },
  {
    id: '2',
    title: '56 Dean Street',
    description: 'Free sexual health clinic in Soho. Walk-in and appointments. PrEP, testing, treatment.',
    category: 'sexual',
    url: 'https://dean.st',
    available: 'Mon-Fri 8am-8pm, Sat-Sun 9am-4pm',
  },
  {
    id: '3',
    title: 'Frank',
    description: 'Honest information about drugs. Confidential advice. Harm reduction resources.',
    category: 'substance',
    url: 'https://www.talktofrank.com',
    phone: '0300 123 6600',
    available: '24/7',
  },
  {
    id: '4',
    title: 'Samaritans',
    description: 'Crisis support. Someone to talk to, any time. Confidential, non-judgmental.',
    category: 'crisis',
    url: 'https://www.samaritans.org',
    phone: '116 123',
    available: '24/7',
  },
  {
    id: '5',
    title: 'London Friend',
    description: 'LGBTQ+ mental health support groups, counseling, peer support.',
    category: 'mental',
    url: 'https://londonfriend.org.uk',
    phone: '020 7833 1674',
    available: 'Mon-Fri 10am-6pm',
  },
  {
    id: '6',
    title: 'CliniQ',
    description: 'Trans and non-binary sexual health and wellbeing service.',
    category: 'sexual',
    url: 'https://cliniq.org.uk',
    available: 'Appointments only',
  },
];

// Orders (for account page)
export const mockOrders: Order[] = [
  {
    id: 'ORD-2025-0847',
    date: '2025-11-20',
    total: 9300,
    status: 'delivered',
    items: [
      { productTitle: 'RAW Tank — Black', qty: 1, price: 2800 },
      { productTitle: 'HUNG Harness', qty: 1, price: 6500 },
    ],
  },
  {
    id: 'ORD-2025-0723',
    date: '2025-11-15',
    total: 3200,
    status: 'delivered',
    items: [
      { productTitle: 'HIGH Bucket Hat', qty: 1, price: 3200 },
    ],
  },
];

// User profile (mock)
export const mockUser = {
  id: 'user_2ZYX9K8M3N',
  email: 'marcus@example.com',
  displayName: 'Marcus_87',
  role: 'USER' as const,
  createdAt: '2025-09-12T14:22:00Z',
  stats: {
    level: 12,
    xp: 2847,
    streak: 7,
  },
  consents: {
    age18Plus: { granted: true, date: '2025-09-12T14:22:00Z' },
    explicitContent: { granted: true, date: '2025-09-12T14:25:00Z' },
    communityRules: { granted: true, date: '2025-09-15T19:08:00Z' },
    marketingEmails: { granted: false, date: null },
    cookiesAnalytics: { granted: true, date: '2025-09-12T14:22:00Z' },
  },
};

// Helper functions
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return mockProducts.filter(p => p.category === category && p.active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(p => p.slug === slug);
}

export function getShowBySlug(slug: string): RadioShow | undefined {
  return mockRadioShows.find(s => s.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  return mockPosts.find(p => p.id === id);
}
