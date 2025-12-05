// pages/SavedContent.tsx
// HOTMESS LONDON - Saved Content Dashboard
// Unified view of all saved beacons, records, products, posts, and shows

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Zap, Music, ShoppingBag, MessageSquare, Radio, Trash2, ExternalLink, Calendar, MapPin, X } from 'lucide-react';
import type { NavFunction, RouteId } from '../lib/routes';
import { getAllSaved, getSavedCounts, unsaveContent, type SavedItem, type SavedCounts, type ContentType } from '../lib/saved-api';

interface SavedContentProps {
  onNavigate: NavFunction;
}

type TabType = 'all' | ContentType;

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Bookmark;
  color: string;
}

const tabs: TabConfig[] = [
  { id: 'all', label: 'All', icon: Bookmark, color: '#FF1FCE' },
  { id: 'beacon', label: 'Beacons', icon: Zap, color: '#FF1FCE' },
  { id: 'record', label: 'Records', icon: Music, color: '#00FFD1' },
  { id: 'release', label: 'Releases', icon: Music, color: '#FFED00' },
  { id: 'product', label: 'Products', icon: ShoppingBag, color: '#FF1FCE' },
  { id: 'post', label: 'Posts', icon: MessageSquare, color: '#00FFD1' },
  { id: 'show', label: 'Shows', icon: Radio, color: '#FFED00' },
];

export function SavedContent({ onNavigate }: SavedContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [items, setItems] = useState<SavedItem[]>([]);
  const [counts, setCounts] = useState<SavedCounts>({ 
    beacon: 0, record: 0, release: 0, product: 0, post: 0, show: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  // Load saved counts
  useEffect(() => {
    loadCounts();
  }, []);

  // Load items when tab changes
  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadCounts = async () => {
    const { counts: fetchedCounts, error: countError } = await getSavedCounts();
    if (!countError) {
      setCounts(fetchedCounts);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    const contentType = activeTab === 'all' ? undefined : activeTab;
    const { items: fetchedItems, error: fetchError } = await getAllSaved(contentType);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setItems(fetchedItems);
    }
    
    setLoading(false);
  };

  const handleUnsave = async (item: SavedItem) => {
    setRemoving(`${item.contentType}:${item.contentId}`);
    
    const { error: unsaveError } = await unsaveContent(item.contentType, item.contentId);
    
    if (unsaveError) {
      console.error('Failed to unsave:', unsaveError);
      setRemoving(null);
      return;
    }

    // Optimistically update UI
    setItems(prev => prev.filter(i => 
      !(i.contentType === item.contentType && i.contentId === item.contentId)
    ));
    
    // Update counts
    setCounts(prev => ({
      ...prev,
      [item.contentType]: Math.max(0, prev[item.contentType] - 1)
    }));
    
    setRemoving(null);
  };

  const handleItemClick = (item: SavedItem) => {
    // Navigate to the appropriate page based on content type
    switch (item.contentType) {
      case 'beacon':
        onNavigate('beaconScan' as RouteId, { code: item.contentId });
        break;
      case 'record':
        // Navigate to record page (if exists)
        break;
      case 'release':
        onNavigate('recordsRelease' as RouteId, { id: item.contentId });
        break;
      case 'product':
        onNavigate('messmarketOrder' as RouteId, { id: item.contentId });
        break;
      case 'post':
        onNavigate('communityPost' as RouteId, { id: item.contentId });
        break;
      case 'show':
        onNavigate('radioShow' as RouteId, { id: item.contentId });
        break;
    }
  };

  const getTabCount = (tabId: TabType): number => {
    if (tabId === 'all') {
      return Object.values(counts).reduce((sum, count) => sum + count, 0);
    }
    return counts[tabId as ContentType] || 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getItemIcon = (type: ContentType) => {
    const tab = tabs.find(t => t.id === type);
    return tab?.icon || Bookmark;
  };

  const getItemColor = (type: ContentType) => {
    const tab = tabs.find(t => t.id === type);
    return tab?.color || '#FF1FCE';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-hot" />
              <h1 className="text-xl uppercase tracking-wider" style={{ fontWeight: 900 }}>
                Saved
              </h1>
            </div>
            <button
              onClick={() => onNavigate('home' as RouteId)}
              className="p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-black border-b border-white/20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => {
              const count = getTabCount(tab.id);
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all"
                  style={{
                    fontWeight: isActive ? 900 : 700,
                    color: isActive ? tab.color : 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1 text-xs opacity-60">({count})</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: tab.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-hot border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/50 p-6 text-center">
            <p className="text-red-500 uppercase tracking-wider" style={{ fontWeight: 700 }}>
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Bookmark className="w-16 h-16 text-white/20 mb-4" />
            <h2 className="text-xl uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>
              No Saved Items
            </h2>
            <p className="text-white/60 max-w-md mb-8">
              {activeTab === 'all' 
                ? "Save beacons, records, products, and more to access them here."
                : `You haven't saved any ${activeTab}s yet.`}
            </p>
            <button
              onClick={() => onNavigate('home' as RouteId)}
              className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all"
              style={{ fontWeight: 900 }}
            >
              Explore Content
            </button>
          </motion.div>
        )}

        {/* Items Grid */}
        {!loading && !error && items.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const Icon = getItemIcon(item.contentType);
                const color = getItemColor(item.contentType);
                const isRemoving = removing === `${item.contentType}:${item.contentId}`;
                
                return (
                  <motion.div
                    key={`${item.contentType}:${item.contentId}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative bg-white/5 border border-white/20 hover:border-white/40 transition-all overflow-hidden"
                  >
                    {/* Type Badge */}
                    <div 
                      className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 text-xs uppercase tracking-wider"
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color,
                        fontWeight: 700
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      {item.contentType}
                    </div>

                    {/* Content */}
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-full p-6 text-left"
                      disabled={isRemoving}
                    >
                      {/* Image */}
                      {item.metadata?.image && (
                        <div className="aspect-video bg-black/50 mb-4 overflow-hidden">
                          <img 
                            src={item.metadata.image} 
                            alt={item.metadata?.title || 'Saved item'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-white uppercase tracking-wider mb-2 line-clamp-2" style={{ fontWeight: 900 }}>
                        {item.metadata?.title || item.contentId}
                      </h3>

                      {/* Description */}
                      {item.metadata?.description && (
                        <p className="text-white/60 text-sm line-clamp-2 mb-3">
                          {item.metadata.description}
                        </p>
                      )}

                      {/* Metadata Row */}
                      <div className="flex items-center gap-4 text-xs text-white/40 uppercase tracking-wider">
                        {item.metadata?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.metadata.location}
                          </div>
                        )}
                        {item.metadata?.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.metadata.date}
                          </div>
                        )}
                        <div className="flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.savedAt)}
                        </div>
                      </div>
                    </button>

                    {/* Unsave Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(item);
                      }}
                      disabled={isRemoving}
                      className="absolute bottom-3 right-3 p-2 bg-black/80 hover:bg-red-500 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Remove from saved"
                    >
                      {isRemoving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <ExternalLink className="w-8 h-8 text-hot" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
