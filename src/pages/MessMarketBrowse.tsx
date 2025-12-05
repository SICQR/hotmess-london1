import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { RouteId } from '../lib/routes';
import { ShoppingBag, Package, Filter, Search, AlertCircle, Loader2, Store } from 'lucide-react';
import { DatabaseSetupError } from '../components/DatabaseSetupError';

interface MessMarketBrowseProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Listing {
  id: string;
  title: string;
  description?: string;
  price_pence: number;
  currency?: string;
  quantity_available: number;
  status: string;
  fulfilment_mode?: string;
  category: string;
  tags?: string[];
  created_at: string;
  slug?: string;
  seller?: {
    display_name: string;
  } | null;
  media?: Array<{
    storage_path: string;
    alt: string;
  }>;
}

const CATEGORIES = [
  'all',
  'clothing',
  'accessories',
  'art',
  'prints',
  'kink',
  'care',
  'experimental',
  'other',
];

export function MessMarketBrowse({ onNavigate }: MessMarketBrowseProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, selectedCategory, sortBy]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('market_listings')
        .select(`
          *,
          seller:market_sellers(display_name),
          media:market_listing_media(storage_path, alt)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching listings:', fetchError);
        
        // Check if it's a schema error (database not set up)
        if (fetchError.code === 'PGRST200' || fetchError.message.includes('relationship')) {
          setError('Database not set up. Please run the setup scripts in Supabase SQL Editor:\n1. commerce_architecture.sql\n2. stock_reservation.sql\n\nSee /DATABASE_SETUP_NOW.md for instructions.');
        } else {
          setError(`Failed to load listings: ${fetchError.message}`);
        }
        setLoading(false);
        return;
      }

      // Transform the data - Supabase returns seller as an array
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        seller: Array.isArray(item.seller) ? item.seller[0] : item.seller
      }));
      
      setListings(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((l) => l.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price_pence - b.price_pence);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price_pence - a.price_pence);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredListings(filtered);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="px-4 py-16 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl mb-4"
          >
            MESSMARKET
          </motion.h1>
          <div className="h-2 w-24 bg-hotmess-red mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mb-6"
          >
            Independent sellers. Verified. Fulfilled by the seller. One-off experiments, collabs, and bold designs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => onNavigate('sellerDashboard')}
              className="px-6 py-3 bg-hotmess-purple hover:bg-hotmess-purple/80 transition-colors flex items-center gap-2"
            >
              <Store className="w-5 h-5" />
              <span>SELL ON MESSMARKET</span>
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 bg-zinc-900 border border-zinc-700 hover:border-hotmess-red transition-colors"
            >
              OFFICIAL STORE
            </button>
          </motion.div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-8 border-b border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <DatabaseSetupError error={error} />
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <section className="px-4 py-6 bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, tags..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="text-zinc-500">Showing:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-zinc-800 rounded">
                  "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-1 bg-zinc-800 rounded capitalize">
                  {selectedCategory}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-hotmess-red hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-zinc-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">No products found</h2>
              <p className="text-zinc-400 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No active listings yet. Check back soon!'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-hotmess-red hover:bg-red-600 rounded transition-colors"
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 text-zinc-400">
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'product' : 'products'}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={index}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="px-4 py-16 bg-gradient-to-b from-transparent to-hotmess-red/10 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl mb-4">Sell Your Work</h2>
          <div className="h-1 w-16 bg-hotmess-red mx-auto mb-6" />
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Got experimental gear, limited collabs, or bold designs? Join MessMarket's care-first marketplace.
          </p>
          <button
            onClick={() => onNavigate('sellerDashboard')}
            className="px-8 py-4 bg-hotmess-red hover:bg-red-600 rounded transition-colors"
          >
            START SELLING
          </button>
        </div>
      </section>
    </div>
  );
}

// Listing Card Component
function ListingCard({
  listing,
  index,
  onNavigate,
}: {
  listing: Listing;
  index: number;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}) {
  const isLowStock = listing.quantity_available > 0 && listing.quantity_available <= 5;
  const isOutOfStock = listing.quantity_available === 0;
  const isWhiteLabel = listing.fulfilment_mode === 'white_label_partner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => {
        const identifier = listing.slug || listing.id;
        console.log('📍 Navigating to listing:', { title: listing.title, slug: listing.slug, id: listing.id, using: identifier });
        onNavigate('messmessMarketProduct', { slug: identifier });
      }}
      className="group bg-zinc-900 border border-zinc-800 hover:border-hotmess-red transition-colors cursor-pointer rounded-lg overflow-hidden relative"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isOutOfStock && (
          <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase">
            SOLD OUT
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase">
            {listing.quantity_available} LEFT
          </div>
        )}
        {isWhiteLabel && (
          <div className="bg-hotmess-purple text-white px-3 py-1 text-xs font-bold uppercase">
            WHITE-LABEL
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-zinc-800 overflow-hidden relative">
        {listing.media && listing.media[0] ? (
          <img
            src={listing.media[0].storage_path}
            alt={listing.media[0].alt || listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-hotmess-red/0 group-hover:bg-hotmess-red/10 transition-colors" />
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 group-hover:text-hotmess-red transition-colors line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-sm text-zinc-500 mb-2">
          by {listing.seller?.display_name || 'Test Seller Shop'}
        </p>
        {listing.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold">
            £{(listing.price_pence / 100).toFixed(2)}
          </span>
          {!isOutOfStock && (
            <span className="text-xs text-zinc-500">
              {listing.quantity_available} in stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
