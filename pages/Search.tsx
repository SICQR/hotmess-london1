/**
 * GLOBAL SEARCH
 * Universal search across all HOTMESS content
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, X, Loader2, TrendingUp, Clock, ArrowRight, Filter } from 'lucide-react';
import {
  search,
  RESULT_TYPE_ICONS,
  RESULT_TYPE_COLORS,
  RESULT_TYPE_LABELS,
  type SearchResult,
  type SearchResultType
} from '../lib/search-api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface SearchProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
  onClose?: () => void;
  initialQuery?: string;
}

type FilterType = 'all' | SearchResultType;

export function Search({ onNavigate, onClose, initialQuery = '' }: SearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('hotmess_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
    
    // Auto-focus input
    inputRef.current?.focus();
  }, []);

  // Auto-search on initial query
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const { results: data } = await search(searchQuery, {
        type: filter === 'all' ? undefined : filter,
        limit: 50
      });

      setResults(data);
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function saveRecentSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('hotmess_recent_searches', JSON.stringify(updated));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    performSearch(query);
  }

  function handleClear() {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }

  function handleRecentClick(recent: string) {
    setQuery(recent);
    performSearch(recent);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem('hotmess_recent_searches');
  }

  const showRecent = !query && recentSearches.length > 0;
  const showResults = query && !loading;
  const showEmpty = showResults && results.length === 0;

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, SearchResult[]>);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with Search Bar */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search beacons, music, events, products..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-hotmess-red transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            )}
          </form>

          {/* Filter Pills */}
          {query && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <FilterPill
                label="All"
                active={filter === 'all'}
                onClick={() => {
                  setFilter('all');
                  if (query) performSearch(query);
                }}
              />
              <FilterPill
                label="Beacons"
                icon="📍"
                active={filter === 'beacon'}
                onClick={() => {
                  setFilter('beacon');
                  if (query) performSearch(query);
                }}
              />
              <FilterPill
                label="Music"
                icon="🎵"
                active={filter === 'release'}
                onClick={() => {
                  setFilter('release');
                  if (query) performSearch(query);
                }}
              />
              <FilterPill
                label="Products"
                icon="🛍️"
                active={filter === 'product'}
                onClick={() => {
                  setFilter('product');
                  if (query) performSearch(query);
                }}
              />
              <FilterPill
                label="Events"
                icon="🎟️"
                active={filter === 'event'}
                onClick={() => {
                  setFilter('event');
                  if (query) performSearch(query);
                }}
              />
              <FilterPill
                label="Shows"
                icon="📻"
                active={filter === 'show'}
                onClick={() => {
                  setFilter('show');
                  if (query) performSearch(query);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/40" />
          </div>
        )}

        {showRecent && (
          <RecentSearches
            searches={recentSearches}
            onClick={handleRecentClick}
            onClear={clearRecentSearches}
          />
        )}

        {showEmpty && (
          <EmptyResults query={query} />
        )}

        {showResults && results.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">
                {results.length} {results.length === 1 ? 'Result' : 'Results'}
              </h2>
            </div>

            {filter === 'all' ? (
              // Grouped view
              Object.entries(groupedResults).map(([type, items]) => (
                <ResultSection
                  key={type}
                  type={type as SearchResultType}
                  results={items}
                  onNavigate={onNavigate}
                />
              ))
            ) : (
              // List view
              <div className="space-y-3">
                {results.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    onClick={() => onNavigate(result.route, result.routeParams)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending/Suggested (when no query) */}
        {!query && !showRecent && (
          <TrendingSection onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}

// Filter Pill
function FilterPill({
  label,
  icon,
  active,
  onClick
}: {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all
        ${active 
          ? 'bg-gradient-to-r from-hotmess-red to-hotmess-pink text-white' 
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      <span className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
    </button>
  );
}

// Recent Searches
function RecentSearches({
  searches,
  onClick,
  onClear
}: {
  searches: string[];
  onClick: (search: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {searches.map((search, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onClick(search)}
            className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
          >
            <Clock className="w-4 h-4 text-white/40" />
            <span className="flex-1 text-white">{search}</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Result Section (for grouped view)
function ResultSection({
  type,
  results,
  onNavigate
}: {
  type: SearchResultType;
  results: SearchResult[];
  onNavigate: (route: string, params?: Record<string, string>) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-tight flex items-center gap-2">
        <span>{RESULT_TYPE_ICONS[type]}</span>
        {RESULT_TYPE_LABELS[type]}
        <span className="text-sm text-white/40 font-normal">({results.length})</span>
      </h3>

      <div className="space-y-3">
        {results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            onClick={() => onNavigate(result.route, result.routeParams)}
          />
        ))}
      </div>
    </div>
  );
}

// Result Card
function ResultCard({
  result,
  onClick
}: {
  result: SearchResult;
  onClick: () => void;
}) {
  const icon = RESULT_TYPE_ICONS[result.type];
  const colorClass = RESULT_TYPE_COLORS[result.type];
  const label = RESULT_TYPE_LABELS[result.type];

  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full text-left bg-gradient-to-br ${colorClass} border rounded-lg p-4
        hover:bg-white/5 transition-all group
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex gap-3">
        {/* Image/Icon */}
        {result.imageUrl ? (
          <ImageWithFallback
            src={result.imageUrl}
            alt={result.title}
            className="w-16 h-16 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded bg-white/5 flex items-center justify-center text-3xl flex-shrink-0">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60 uppercase tracking-wider font-bold">
              {label}
            </span>
          </div>

          <h4 className="font-bold text-white mb-1 truncate">{result.title}</h4>
          
          {result.description && (
            <p className="text-sm text-white/60 line-clamp-2">{result.description}</p>
          )}

          {result.tags && result.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {result.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-hotmess-red transition-colors flex-shrink-0 self-center" />
      </div>
    </motion.button>
  );
}

// Empty Results
function EmptyResults({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
      <p className="text-white/50 text-center max-w-md">
        We couldn't find anything matching "<span className="text-hotmess-red">{query}</span>".
        Try different keywords or browse categories.
      </p>
    </motion.div>
  );
}

// Trending Section
function TrendingSection({ onNavigate }: { onNavigate: (route: string, params?: Record<string, string>) => void }) {
  const trending = [
    { label: 'KLUB MESS', icon: '🎟️', route: 'tickets' },
    { label: 'Wake the Mess', icon: '📻', route: 'radioShow', params: { slug: 'wake-the-mess' } },
    { label: 'The Glory Beacon', icon: '📍', route: 'beaconScan', params: { code: 'GLO-001' } },
    { label: 'Latest Releases', icon: '🎵', route: 'records' },
  ];

  return (
    <div>
      <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4" />
        Trending Now
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {trending.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavigate(item.route, item.params)}
            className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg hover:border-hotmess-red/50 transition-colors text-left"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-sm font-bold text-white">{item.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
