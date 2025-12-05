import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RouteId } from '../lib/routes';
import { Music, Download, Play, Loader2, Heart, Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/EmptyState';

interface RecordsLibraryProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface SavedRelease {
  id: string;
  slug: string;
  title: string;
  artist: string;
  artwork_url?: string;
  release_date?: string;
  saved_at: string;
  track_count: number;
  total_duration_ms?: number;
}

export function RecordsLibrary({ onNavigate }: RecordsLibraryProps) {
  const { user } = useAuth();
  const [savedReleases, setSavedReleases] = useState<SavedRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'downloaded'>('all');

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }
    fetchSavedReleases();
  }, [user]);

  const fetchSavedReleases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/records/library', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSavedReleases(data.releases || []);
      }
    } catch (error) {
      console.error('Failed to fetch library:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-white mb-4"
              style={{ 
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              YOUR LIBRARY
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Your saved releases from RAW CONVICT RECORDS. Stream, download, and support underground artists.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mt-8">
            {(['all', 'recent', 'downloaded'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 uppercase tracking-wider transition-all ${
                  filter === tab
                    ? 'bg-hot text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {savedReleases.length === 0 ? (
          <EmptyState
            icon={Music}
            title="No saved releases yet"
            message="Explore RAW CONVICT RECORDS and save your favorite releases to your library."
            primaryAction={{
              label: "Browse Releases",
              onClick: () => onNavigate('records')
            }}
          />
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {savedReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => onNavigate('recordsRelease', { slug: release.slug })}
              >
                <div className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all overflow-hidden">
                  {/* Artwork */}
                  <div className="aspect-square bg-black relative overflow-hidden">
                    {release.artwork_url ? (
                      <img
                        src={release.artwork_url}
                        alt={release.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hot/20 to-black">
                        <Music className="w-24 h-24 text-white/20" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>

                    {/* Saved Badge */}
                    <div className="absolute top-4 right-4 bg-hot text-white px-3 py-1 flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        Saved
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 
                      className="text-white mb-2 line-clamp-2"
                      style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {release.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">{release.artist}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-4">
                      {release.track_count && (
                        <div className="flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          <span>{release.track_count} tracks</span>
                        </div>
                      )}
                      {release.total_duration_ms && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(release.total_duration_ms)}</span>
                        </div>
                      )}
                      {release.release_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(release.release_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('recordsRelease', { slug: release.slug });
                        }}
                        className="flex-1 px-4 py-2 bg-hot hover:bg-white text-white hover:text-black transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                          Play
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement download
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Saved Date */}
                    <p className="text-xs text-white/30 mt-4">
                      Saved {formatDate(release.saved_at)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      {savedReleases.length > 0 && (
        <div className="border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <h2 
              className="text-white mb-4"
              style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em' }}
            >
              DISCOVER MORE MUSIC
            </h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              Support underground artists and expand your collection with exclusive releases from RAW CONVICT RECORDS.
            </p>
            <button
              onClick={() => onNavigate('records')}
              className="px-8 py-4 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              Browse All Releases
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
