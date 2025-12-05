/**
 * SELLER LISTING EDIT
 * Edit an existing marketplace listing
 */

import { RouteId } from '../../lib/routes';

interface SellerListingEditProps {
  listingId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function SellerListingEdit({ listingId, onNavigate }: SellerListingEditProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">EDIT LISTING</h1>
        <p className="text-white/60 mb-4">
          Listing ID: {listingId}
        </p>
        <p className="text-white/60 mb-8">
          Edit your marketplace listing. Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('sellerDashboard')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
