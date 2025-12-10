import { useEffect, useState } from 'react';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { Card } from '../components/design-system/Card';
import { ArrowLeft, Heart, Settings, Flag, MessageCircle, Star, Trophy, Instagram, Twitter } from 'lucide-react';
import { ReportModal } from '../components/ReportModal';
import type { RouteId } from '../lib/routes';

interface VendorProfileProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface VendorProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  rating: number;
  reviewCount: number;
  level: number;
  isPro: boolean;
  salesCount: number;
  positivePercentage: number;
  joinDate: string;
  socials: {
    instagram?: string;
    twitter?: string;
  };
}

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  isNsfw: boolean;
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  buyerUsername: string;
  timestamp: string;
}

export default function VendorProfile({ onNavigate }: VendorProfileProps) {
  const [vendor, setVendor] = useState<VendorProfile>({
    id: '1',
    username: 'hotgymguy',
    displayName: 'Hot Gym Guy',
    avatar: '',
    banner: '',
    bio: 'London-based gym rat selling my worn gear. Custom requests welcome. Discreet shipping. 💪',
    rating: 4.9,
    reviewCount: 127,
    level: 15,
    isPro: true,
    salesCount: 127,
    positivePercentage: 98,
    joinDate: '2024',
    socials: {
      instagram: 'hotgymguy',
    },
  });

  const [activeTab, setActiveTab] = useState<'all' | 'underwear' | 'socks'>('all');
  const [listings, setListings] = useState<Listing[]>([
    { id: '1', title: 'Calvin Klein Briefs', price: 45, image: '', isNsfw: true, category: 'underwear' },
    { id: '2', title: 'Gym Socks (3 days)', price: 30, image: '', isNsfw: true, category: 'socks' },
    { id: '3', title: 'Compression Shorts', price: 60, image: '', isNsfw: true, category: 'underwear' },
    { id: '4', title: 'White Ankle Socks', price: 25, image: '', isNsfw: true, category: 'socks' },
    { id: '5', title: 'Designer Trunks', price: 55, image: '', isNsfw: true, category: 'underwear' },
    { id: '6', title: 'Sport Socks Bundle', price: 40, image: '', isNsfw: true, category: 'socks' },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', rating: 5, comment: 'Great seller! Fast shipping and amazing quality.', buyerUsername: 'buyer1', timestamp: '2 days ago' },
    { id: '2', rating: 5, comment: 'Fast shipping, exactly as described.', buyerUsername: 'buyer2', timestamp: '1 week ago' },
    { id: '3', rating: 5, comment: 'Very responsive and professional. Highly recommend!', buyerUsername: 'buyer3', timestamp: '2 weeks ago' },
  ]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredListings = activeTab === 'all'
    ? listings
    : listings.filter(l => l.category === activeTab);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('messmarket')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-hot/20 to-purple-600/20">
        {vendor.banner && (
          <img
            src={vendor.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-lg bg-white/10 border-2 border-white/20 overflow-hidden shrink-0">
            {vendor.avatar ? (
              <img src={vendor.avatar} alt={vendor.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black">
                {vendor.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black mb-1">@{vendor.username}</h1>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{vendor.rating}</span>
              </div>
              <span className="text-white/60">•</span>
              <span className="text-white/60">Level {vendor.level}</span>
              {vendor.isPro && (
                <>
                  <span className="text-white/60">•</span>
                  <Badge variant="primary" className="gap-1">
                    <Trophy className="w-3 h-3" />
                    PRO VENDOR
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {vendor.bio && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/20" />
              <h2 className="text-xs uppercase tracking-wider text-white/70">Bio</h2>
              <div className="h-px flex-1 bg-white/20" />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{vendor.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-white/20" />
            <h2 className="text-xs uppercase tracking-wider text-white/70">Stats</h2>
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <p className="text-sm text-white/60">
            {vendor.salesCount} sales • {vendor.positivePercentage}% positive • Est. {vendor.joinDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => onNavigate('connectMessages', { recipientId: vendor.id })}
            variant="outline"
            className="flex-1 gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
          <Button
            onClick={() => setIsFollowing(!isFollowing)}
            variant={isFollowing ? 'outline' : 'primary'}
            className="flex-1"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>

        {/* Socials */}
        {(vendor.socials.instagram || vendor.socials.twitter) && (
          <div className="flex gap-3 justify-center mb-6">
            {vendor.socials.instagram && (
              <a
                href={`https://instagram.com/${vendor.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {vendor.socials.twitter && (
              <a
                href={`https://twitter.com/${vendor.socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Listings */}
      <section className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Listings ({listings.length})</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm uppercase tracking-wider shrink-0 rounded transition-colors ${
              activeTab === 'all'
                ? 'bg-hot text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('underwear')}
            className={`px-4 py-2 text-sm uppercase tracking-wider shrink-0 rounded transition-colors ${
              activeTab === 'underwear'
                ? 'bg-hot text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Used Underwear
          </button>
          <button
            onClick={() => setActiveTab('socks')}
            className={`px-4 py-2 text-sm uppercase tracking-wider shrink-0 rounded transition-colors ${
              activeTab === 'socks'
                ? 'bg-hot text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Socks
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-3 gap-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onNavigate('messmessMarketProduct', { productId: listing.id })}
              className="cursor-pointer group"
            >
              <div className="aspect-square bg-white/5 border border-white/10 rounded overflow-hidden mb-2 group-hover:border-hot transition-colors relative">
                {listing.image ? (
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover blur-md group-hover:blur-none transition-all"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🩲
                  </div>
                )}
                {listing.isNsfw && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="danger" className="text-xs">NSFW</Badge>
                  </div>
                )}
              </div>
              <p className="text-sm font-bold mb-1">£{listing.price}</p>
              <p className="text-xs text-white/60 truncate">{listing.title}</p>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <p>No listings in this category</p>
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Reviews ({vendor.reviewCount})</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4 bg-white/5 border-white/10">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/80 mb-2">{review.comment}</p>
              <p className="text-xs text-white/40">
                @{review.buyerUsername} • {review.timestamp}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          targetType="user"
          targetId={vendor.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}