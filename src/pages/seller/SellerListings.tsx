import { useState, useEffect } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner@2.0.3';
import { getMyListings, updateListing, deleteListing } from '../../lib/api/messmarket';

interface SellerListingsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'inactive';
  views: number;
  sold: number;
  image?: string;
  createdAt: string;
  images?: string[];
  description?: string;
  category?: string;
}

export function SellerListings({ onNavigate }: SellerListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading seller listings...');
      console.log('🔍 Current time:', new Date().toISOString());
      
      // Fetch from API
      const { listings: apiListings } = await getMyListings();
      
      console.log('📦 Loaded listings:', {
        count: apiListings?.length || 0,
        listings: apiListings
      });
      
      if (apiListings && apiListings.length > 0) {
        console.log('📋 First listing:', apiListings[0]);
        console.log('📋 Listing IDs:', apiListings.map((l: any) => l.id));
        console.log('📋 Listing statuses:', apiListings.map((l: any) => `${l.title}: ${l.status}`));
      }
      
      setListings(apiListings);
      setLoading(false);
    } catch (err) {
      console.error('❌ Failed to load listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Update via API
      await updateListing(id, { status: newStatus });
      
      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadListings();
    } catch (err) {
      console.error('Failed to update listing:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update listing status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete via API
      await deleteListing(id);
      
      toast.success('Listing deleted');
      loadListings();
    } catch (err) {
      console.error('Failed to delete listing:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'draft': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'inactive': return 'text-white/40 bg-white/5 border-white/10';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  if (loading) return <SellerLayout currentRoute="sellerListings" onNavigate={onNavigate}><LoadingState /></SellerLayout>;
  if (error) return <SellerLayout currentRoute="sellerListings" onNavigate={onNavigate}><ErrorState message={error} onRetry={loadListings} /></SellerLayout>;

  return (
    <SellerLayout currentRoute="sellerListings" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: 'clamp(32px, 5vw, 48px)' }}>
              MY LISTINGS
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              {listings.length} total listings
            </p>
          </div>
          <button
            onClick={() => onNavigate('sellerListingsNew')}
            className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all flex items-center gap-2 justify-center uppercase tracking-wider"
            style={{ fontWeight: 900, fontSize: '14px' }}
          >
            <Plus className="w-5 h-5" />
            CREATE LISTING
          </button>
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <EmptyState
            icon={Package}
            title="NO LISTINGS YET"
            description="Create your first listing to start selling on MessMarket"
            action={{
              label: 'CREATE LISTING',
              onClick: () => onNavigate('sellerListingsNew')
            }}
          />
        )}

        {/* Listings Grid */}
        {listings.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white/5 border border-white/10 p-4 md:p-6 hover:border-hot/50 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  <div className="w-full md:w-32 h-32 bg-black border border-white/10 flex-shrink-0 overflow-hidden">
                    {listing.image || (listing.images && listing.images.length > 0) ? (
                      <img 
                        src={listing.image || listing.images![0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white uppercase tracking-wider mb-2 md:mb-3" style={{ fontWeight: 900, fontSize: 'clamp(18px, 3vw, 24px)' }}>
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-white/60 mb-3 md:mb-4">
                      <span className="text-hot" style={{ fontWeight: 900, fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
                        £{listing.price.toFixed(2)}
                      </span>
                      <span className="text-white/40">•</span>
                      <span style={{ fontWeight: 400, fontSize: '13px' }}>Stock: {listing.stock}</span>
                      <span className="text-white/40">•</span>
                      <span style={{ fontWeight: 400, fontSize: '13px' }}>{listing.views} views</span>
                      <span className="text-white/40">•</span>
                      <span style={{ fontWeight: 400, fontSize: '13px' }}>{listing.sold} sold</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 border uppercase tracking-wider ${getStatusColor(listing.status)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                        {listing.status}
                      </span>
                      {listing.category && (
                        <span className="text-white/40 bg-white/5 px-2 py-1" style={{ fontWeight: 400, fontSize: '11px' }}>
                          {listing.category}
                        </span>
                      )}
                      {listing.images && listing.images.length > 1 && (
                        <span className="text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                          +{listing.images.length - 1} more
                        </span>
                      )}
                    </div>

                    {listing.description && (
                      <p className="text-white/60 line-clamp-2 mb-3" style={{ fontWeight: 400, fontSize: '13px' }}>
                        {listing.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onNavigate('editListing', { id: listing.id })}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-2 uppercase tracking-wider"
                        style={{ fontWeight: 700, fontSize: '11px' }}
                      >
                        <Edit className="w-4 h-4" />
                        EDIT
                      </button>
                      <button
                        onClick={() => handleToggleStatus(listing.id, listing.status)}
                        className={`px-4 py-2 transition-colors flex items-center gap-2 uppercase tracking-wider ${
                          listing.status === 'active'
                            ? 'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20'
                        }`}
                        style={{ fontWeight: 700, fontSize: '11px' }}
                      >
                        {listing.status === 'active' ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            DEACTIVATE
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            ACTIVATE
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors flex items-center gap-2 uppercase tracking-wider"
                        style={{ fontWeight: 700, fontSize: '11px' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
