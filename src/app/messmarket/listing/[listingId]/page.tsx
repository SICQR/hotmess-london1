// app/messmarket/listing/[listingId]/page.tsx
// MessMarket Listing Detail Page

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Package, 
  Shield, 
  TrendingUp, 
  User, 
  MessageCircle,
  Heart,
  Share2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_pence: number;
  quantity_available: number;
  status: string;
  category: string;
  condition: string;
  size?: string;
  created_at: string;
  seller_id: string;
  seller?: {
    display_name: string;
    rating?: number;
    sales_count?: number;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.listingId as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const loadListing = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('market_listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (fetchError) {
        console.error('Error fetching listing:', fetchError);
        setError('Listing not found');
        setLoading(false);
        return;
      }

      // Fetch seller info
      const { data: sellerData } = await supabase
        .from('market_sellers')
        .select('display_name')
        .eq('id', data.seller_id)
        .single();

      setListing({
        ...data,
        seller: sellerData || { display_name: 'Unknown Seller' }
      });
      setLoading(false);
    } catch (err: any) {
      console.error('Exception loading listing:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMessageSeller = () => {
    // TODO: Implement messaging
    alert('Messaging feature coming soon!');
  };

  const handleBuyNow = () => {
    // TODO: Implement checkout
    alert('Checkout feature coming soon! Connect with seller via message.');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading listing...</span>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-3xl uppercase" style={{ fontWeight: 900 }}>
            Listing Not Found
          </h1>
          <p className="text-white/60">
            {error || 'This listing may have been removed or sold.'}
          </p>
          <button
            onClick={() => router.push('/messmarket')}
            className="inline-flex items-center gap-2 bg-hotmess-red hover:bg-red-600 text-white px-6 py-3 rounded-xl uppercase tracking-wide transition-all"
            style={{ fontWeight: 900 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to MessMarket
          </button>
        </div>
      </main>
    );
  }

  const price = (listing.price_pence / 100).toFixed(2);

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/messmarket')}
            className="flex items-center gap-2 text-white/60 hover:text-hotmess-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
              Back to Browse
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSaved(!saved)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-hotmess-red text-hotmess-red' : 'text-white/40'}`} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Share2 className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
              <Package className="w-32 h-32 text-white/10" />
            </div>
            
            {/* Thumbnail grid would go here */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border border-white/10 bg-black/20 flex items-center justify-center"
                >
                  <Package className="w-8 h-8 text-white/10" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Listing Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Title & Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl md:text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
                  {listing.title}
                </h1>
                {listing.status === 'active' && (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs uppercase tracking-wide shrink-0" style={{ fontWeight: 700 }}>
                    Available
                  </span>
                )}
              </div>
              
              <div className="text-5xl text-hotmess-red" style={{ fontWeight: 900 }}>
                £{price}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-sm text-white/40 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                  Category
                </div>
                <div className="text-white" style={{ fontWeight: 700 }}>
                  {listing.category}
                </div>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-sm text-white/40 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                  Condition
                </div>
                <div className="text-white" style={{ fontWeight: 700 }}>
                  {listing.condition || 'New'}
                </div>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-sm text-white/40 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                  Stock
                </div>
                <div className="text-white" style={{ fontWeight: 700 }}>
                  {listing.quantity_available}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 space-y-3">
              <h3 className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Description
              </h3>
              <p className="text-white/80 leading-relaxed">
                {listing.description || 'No description provided.'}
              </p>
            </div>

            {/* Seller Info */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-hotmess-red/10 border border-hotmess-red/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-hotmess-red" />
                  </div>
                  <div>
                    <div className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
                      {listing.seller?.display_name || 'Seller'}
                    </div>
                    <div className="text-xs text-white/40">
                      Member since {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-hotmess-red hover:bg-red-600 text-white px-8 py-4 rounded-xl uppercase tracking-wide transition-all flex items-center justify-center gap-3"
                style={{ fontWeight: 900 }}
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now - £{price}
              </button>
              
              <button
                onClick={handleMessageSeller}
                className="w-full border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-xl uppercase tracking-wide transition-all flex items-center justify-center gap-3"
                style={{ fontWeight: 700 }}
              >
                <MessageCircle className="w-5 h-5" />
                Message Seller
              </button>
            </div>

            {/* Trust & Safety */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  Protected Transaction
                </span>
              </div>
              <p className="text-xs text-white/60">
                All MessMarket purchases are protected by HOTMESS buyer protection. 
                If something goes wrong, we've got you covered.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
