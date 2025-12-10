// HOTMESS LONDON - Shop Product Data
// Centralized product catalog for RAW, HUNG, HIGH, SUPER collections

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: 'raw' | 'hung' | 'high' | 'super';
  price: number;
  images: string[];
  description: string;
  longDescription: string;
  sizes: string[];
  colors?: string[];
  materials: string[];
  careInstructions: string;
  features: string[];
  bestseller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: 'in' | 'low' | 'out';
  xp: number;
  aftercareNote?: string;
  tags: string[];
}

export const SHOP_PRODUCTS: Product[] = [
  // ==================== RAW COLLECTION ====================
  {
    id: 'raw-001',
    slug: 'sweat-soaked-tank',
    name: 'Sweat-Soaked Tank',
    collection: 'raw',
    price: 35,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800',
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&sat=-50',
    ],
    description: 'Vests that don\'t ask permission. Tees that cling like they\'ve missed you.',
    longDescription: 'Cut low. Cut deep. Built for bodies that move through crowds like they own them. This isn\'t gym wear—it\'s club armor. The kind of vest that gets noticed on the dance floor and remembered after last call.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    materials: ['95% Cotton', '5% Elastane'],
    careInstructions: 'Machine wash cold. Tumble dry low. Iron inside out.',
    features: [
      'Deep scoop neck',
      'Athletic cut',
      'Reinforced stitching',
      'Moisture-wicking fabric',
      'Tag-free design'
    ],
    bestseller: true,
    stock: 'low',
    xp: 10,
    aftercareNote: 'Remember: looking good is one thing, feeling safe is everything. Check our Care hub for post-party recovery tips.',
    tags: ['tank', 'club wear', 'basics', 'bestseller']
  },
  {
    id: 'raw-002',
    slug: 'no-permission-tee',
    name: 'No Permission Tee',
    collection: 'raw',
    price: 30,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&sat=-50',
    ],
    description: 'Tees that cling. Cuts sharp enough to draw attention.',
    longDescription: 'A fitted tee that says everything without saying anything. Minimal branding, maximum attitude. Worn solo or layered, this is the foundation of your going-out arsenal.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Navy'],
    materials: ['100% Premium Cotton'],
    careInstructions: 'Machine wash cold. Hang dry preferred.',
    features: [
      'Slim athletic fit',
      'Crew neck',
      'Soft-touch finish',
      'Pre-shrunk',
      'Double-stitched hems'
    ],
    newArrival: true,
    stock: 'in',
    xp: 5,
    tags: ['tee', 'basics', 'new arrival']
  },
  {
    id: 'raw-003',
    slug: 'mesh-overlay-shirt',
    name: 'Mesh Overlay Shirt',
    collection: 'raw',
    price: 48,
    images: [
      'https://images.unsplash.com/photo-1602810319428-019690571b5b?w=800',
    ],
    description: 'See-through confidence. Breathable attitude.',
    longDescription: 'Strategic transparency. The mesh overlay reveals just enough while maintaining structure. Perfect for humid club nights or beach party weekends.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red'],
    materials: ['85% Nylon Mesh', '15% Spandex'],
    careInstructions: 'Hand wash recommended. Lay flat to dry.',
    features: [
      'Full mesh construction',
      'Stretch fit',
      'Breathable',
      'Quick-dry',
      'Athletic cut'
    ],
    stock: 'in',
    xp: 12,
    aftercareNote: 'Showing skin? Make sure you\'re prepared. Visit Care for info on sun protection and skin care.',
    tags: ['shirt', 'mesh', 'party wear']
  },
  {
    id: 'raw-004',
    slug: 'raw-jockstrap',
    name: 'RAW Jockstrap',
    collection: 'raw',
    price: 28,
    images: [
      'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800',
    ],
    description: 'Minimal coverage. Maximum confidence.',
    longDescription: 'The foundation of any good night out. Premium elastic waistband with HOTMESS branding. Built for movement, designed to be seen.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red', 'Neon Green'],
    materials: ['90% Cotton', '10% Elastane'],
    careInstructions: 'Machine wash cold with like colors. Do not bleach.',
    features: [
      'Branded waistband',
      'Supportive pouch',
      'Breathable cotton',
      'Classic cut',
      'Tag-free'
    ],
    bestseller: true,
    stock: 'in',
    xp: 8,
    tags: ['underwear', 'jockstrap', 'basics']
  },

  // ==================== HUNG COLLECTION ====================
  {
    id: 'hung-001',
    slug: 'stretched-crop',
    name: 'Stretched Crop',
    collection: 'hung',
    price: 40,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
    ],
    description: 'Shapes that say everything without saying anything. Stretched, cropped, teased.',
    longDescription: 'The crop that launched a thousand double-takes. Cut to show abs, designed to show attitude. Stretch fabric moves with you from the dance floor to the dark room.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'White'],
    materials: ['92% Polyester', '8% Spandex'],
    careInstructions: 'Machine wash cold. Hang dry.',
    features: [
      'Cropped hem',
      '4-way stretch',
      'Moisture-wicking',
      'Form-fitting',
      'Reinforced seams'
    ],
    stock: 'in',
    xp: 15,
    aftercareNote: 'Showing more skin? Stay hydrated and protected. Check Care for body safety tips.',
    tags: ['crop', 'stretch', 'party wear']
  },
  {
    id: 'hung-002',
    slug: 'attitude-shorts',
    name: 'Attitude Shorts',
    collection: 'hung',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
    ],
    description: 'Short enough to make a statement. Tight enough to mean it.',
    longDescription: 'Athletic cut meets club confidence. These aren\'t gym shorts—they\'re a declaration. Built-in brief liner for support, stretch fabric for movement.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Camo'],
    materials: ['88% Polyester', '12% Spandex'],
    careInstructions: 'Machine wash cold. Tumble dry low.',
    features: [
      '5-inch inseam',
      'Built-in brief',
      'Side pockets',
      'Elastic waistband',
      'Quick-dry fabric'
    ],
    bestseller: true,
    stock: 'in',
    xp: 20,
    tags: ['shorts', 'bottoms', 'bestseller']
  },
  {
    id: 'hung-003',
    slug: 'harness-hybrid-top',
    name: 'Harness Hybrid Top',
    collection: 'hung',
    price: 68,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&brightness=0.7',
    ],
    description: 'Half shirt, half harness. All attitude.',
    longDescription: 'Where fashion meets fetish. Structured straps with a cropped base layer. Adjustable fit means it works on any body. Wear it to the club or under a jacket for surprise impact.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red'],
    materials: ['Cotton base', 'Vegan leather straps'],
    careInstructions: 'Spot clean only. Do not machine wash.',
    features: [
      'Adjustable straps',
      'O-ring details',
      'Vegan leather',
      'Cropped base layer',
      'Metal hardware'
    ],
    limitedEdition: true,
    stock: 'low',
    xp: 25,
    aftercareNote: 'Playing with kink aesthetics? Remember consent and boundaries. Visit Care for resources.',
    tags: ['harness', 'kink', 'limited edition']
  },
  {
    id: 'hung-004',
    slug: 'thigh-high-compression',
    name: 'Thigh-High Compression Socks',
    collection: 'hung',
    price: 32,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
    ],
    description: 'Compression meets fashion. Function meets fetish.',
    longDescription: 'Performance wear with club aesthetics. True compression technology keeps legs fresh during long nights. HOTMESS stripe detail at thigh.',
    sizes: ['S/M', 'L/XL'],
    colors: ['Black', 'White', 'Black/Red stripe'],
    materials: ['85% Nylon', '15% Spandex'],
    careInstructions: 'Machine wash cold. Lay flat to dry.',
    features: [
      'True compression',
      'Moisture-wicking',
      'Anti-slip silicone band',
      'Reinforced toe and heel',
      'Graduated compression'
    ],
    newArrival: true,
    stock: 'in',
    xp: 10,
    tags: ['socks', 'compression', 'accessories']
  },

  // ==================== HIGH COLLECTION ====================
  {
    id: 'high-001',
    slug: 'high-contrast-vest',
    name: 'High Contrast Vest',
    collection: 'high',
    price: 50,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
    ],
    description: 'Higher contrast. Higher heat. The silhouette of a man who stopped pretending.',
    longDescription: 'Asymmetric cut with reflective panels. Made to be seen in dark spaces and strobe lights. This isn\'t subtle—it\'s a statement piece for men who command attention.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black/Silver', 'Black/Neon'],
    materials: ['Main: Cotton blend', 'Panels: Reflective polyester'],
    careInstructions: 'Turn inside out. Machine wash cold. Hang dry.',
    features: [
      'Reflective panels',
      'Asymmetric cut',
      'Deep arm holes',
      'Extended back hem',
      '3M reflective material'
    ],
    newArrival: true,
    stock: 'in',
    xp: 25,
    tags: ['vest', 'reflective', 'statement']
  },
  {
    id: 'high-002',
    slug: 'silhouette-set',
    name: 'Silhouette Set',
    collection: 'high',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
    ],
    description: 'Matching crop + shorts. Complete confidence.',
    longDescription: 'The full look. Designed to be worn together or broken apart. Minimal branding, maximum impact. This is the uniform of men who know exactly who they are.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['All Black', 'Black/White'],
    materials: ['90% Polyester', '10% Spandex'],
    careInstructions: 'Machine wash cold. Tumble dry low.',
    features: [
      'Matching set',
      'Seamless design',
      '4-way stretch',
      'Sweat-wicking',
      'Compression fit'
    ],
    bestseller: true,
    stock: 'in',
    xp: 30,
    tags: ['set', 'matching', 'bestseller']
  },
  {
    id: 'high-003',
    slug: 'leather-look-joggers',
    name: 'Leather-Look Joggers',
    collection: 'high',
    price: 78,
    images: [
      'https://images.unsplash.com/photo-1624378441864-6eda7eac51cb?w=800',
    ],
    description: 'Vegan leather. Real attitude.',
    longDescription: 'The look of leather without the care requirements. Stretch fabric with wet-look finish. Zip pockets, elastic waist. Dress them up or down—they work everywhere.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Burgundy'],
    materials: ['95% Polyester (wet-look)', '5% Spandex'],
    careInstructions: 'Wipe clean with damp cloth. Do not machine wash.',
    features: [
      'Vegan leather look',
      'Stretch waistband',
      'Functional pockets',
      'Tapered leg',
      'Zip ankle detail'
    ],
    stock: 'in',
    xp: 28,
    aftercareNote: 'Exploring kink aesthetics? Learn about leather care and culture at Care.',
    tags: ['joggers', 'leather look', 'kink']
  },
  {
    id: 'high-004',
    slug: 'neon-accent-harness',
    name: 'Neon Accent Harness',
    collection: 'high',
    price: 55,
    images: [
      'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&hue=90',
    ],
    description: 'Glow in the dark. Stand out in the crowd.',
    longDescription: 'Full chest harness with neon piping. Fully adjustable for any body type. UV-reactive accents make you visible under club lights. Built for comfort during long nights.',
    sizes: ['One Size Adjustable'],
    colors: ['Black/Neon Green', 'Black/Neon Pink'],
    materials: ['Vegan leather', 'Nylon webbing', 'Metal O-rings'],
    careInstructions: 'Wipe clean with damp cloth. Store flat.',
    features: [
      'Fully adjustable',
      'UV-reactive piping',
      'Metal hardware',
      'Vegan leather',
      'Multiple O-rings'
    ],
    limitedEdition: true,
    stock: 'low',
    xp: 35,
    tags: ['harness', 'neon', 'kink', 'limited edition']
  },

  // ==================== SUPER COLLECTION ====================
  {
    id: 'super-001',
    slug: 'super-suit-bodysuit',
    name: 'SUPER Suit Bodysuit',
    collection: 'super',
    price: 120,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&brightness=0.8&contrast=1.2',
    ],
    description: 'Full coverage. Full commitment. Not for beginners.',
    longDescription: 'The ultimate statement piece. Full-body compression suit with strategic mesh panels. Built for festival headliners and fearless club icons. This isn\'t clothing—it\'s transformation.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Silver'],
    materials: ['85% Nylon', '10% Spandex', '5% Metallic thread'],
    careInstructions: 'Hand wash cold. Lay flat to dry. Do not wring.',
    features: [
      'Full body coverage',
      'Mesh ventilation panels',
      'Front zip closure',
      'Reinforced crotch',
      'Metallic sheen finish'
    ],
    limitedEdition: true,
    stock: 'low',
    xp: 50,
    aftercareNote: 'Extreme looks require extreme care. Check our aftercare guide before wearing.',
    tags: ['bodysuit', 'extreme', 'limited edition', 'festival']
  },
  {
    id: 'super-002',
    slug: 'custom-leather-vest',
    name: 'Custom Leather Vest',
    collection: 'super',
    price: 285,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    description: 'Real leather. Real commitment. Made to order.',
    longDescription: 'Genuine leather cut and stitched in London. Made to measure with your choice of hardware and lining. This is an investment piece that gets better with age and wear.',
    sizes: ['Made to Measure'],
    colors: ['Black', 'Brown', 'Custom'],
    materials: ['100% Genuine Leather', 'Custom lining options'],
    careInstructions: 'Professional leather cleaning recommended. Condition regularly.',
    features: [
      'Made to measure',
      'Genuine leather',
      'Custom hardware options',
      'Choice of lining',
      'Handmade in London',
      '6-8 week production time'
    ],
    limitedEdition: true,
    stock: 'in',
    xp: 100,
    aftercareNote: 'Leather is a commitment. Visit Care for leather maintenance and culture guides.',
    tags: ['leather', 'custom', 'premium', 'made to order']
  },
  {
    id: 'super-003',
    slug: 'festival-wings',
    name: 'Festival Wings',
    collection: 'super',
    price: 95,
    images: [
      'https://images.unsplash.com/photo-1562887284-5c6e1c0e8b83?w=800',
    ],
    description: 'Wearable art. Festival-grade drama.',
    longDescription: 'Lightweight harness with iridescent wing attachments. LED-compatible frame (lights sold separately). Made for festival season, circuit parties, and moments when you need to be unforgettable.',
    sizes: ['One Size Adjustable'],
    colors: ['Iridescent', 'Black Chrome'],
    materials: ['Aluminum frame', 'Iridescent fabric', 'Nylon harness'],
    careInstructions: 'Spot clean only. Store carefully to prevent bending.',
    features: [
      'Adjustable harness',
      'LED-compatible frame',
      'Lightweight aluminum',
      'Iridescent fabric',
      'Collapsible for travel'
    ],
    limitedEdition: true,
    stock: 'low',
    xp: 75,
    tags: ['wings', 'festival', 'costume', 'limited edition']
  },
  {
    id: 'super-004',
    slug: 'full-face-hood',
    name: 'Full Face Hood',
    collection: 'super',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&sat=-30',
    ],
    description: 'Anonymity. Mystery. Total transformation.',
    longDescription: 'Premium spandex hood with breathable mouth panel. Full coverage with comfort. This is for advanced users who understand the psychology and safety of anonymity play.',
    sizes: ['One Size'],
    colors: ['Black', 'Red', 'Silver'],
    materials: ['90% Spandex', '10% Elastane', 'Mesh breathing panel'],
    careInstructions: 'Hand wash cold. Air dry. Do not bleach.',
    features: [
      'Full face coverage',
      'Breathable mesh panel',
      'Stretch fit',
      'Comfortable seams',
      'Machine-finished edges'
    ],
    stock: 'in',
    xp: 45,
    aftercareNote: 'CRITICAL: Understand consent and safety before use. Read our kink safety guide at Care.',
    tags: ['hood', 'kink', 'anonymity', 'advanced']
  },
];

export function getProductsByCollection(collection: 'raw' | 'hung' | 'high' | 'super'): Product[] {
  return SHOP_PRODUCTS.filter(p => p.collection === collection);
}

export function getProductBySlug(slug: string): Product | undefined {
  return SHOP_PRODUCTS.find(p => p.slug === slug);
}

export function getFeaturedProducts(limit: number = 4): Product[] {
  return SHOP_PRODUCTS.filter(p => p.bestseller).slice(0, limit);
}

export function getNewArrivals(limit: number = 4): Product[] {
  return SHOP_PRODUCTS.filter(p => p.newArrival).slice(0, limit);
}
