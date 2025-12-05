/**
 * Admin Content - Radio, shows, episodes management
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  Radio, 
  Plus,
  Calendar,
  Play,
  Edit,
  Trash2,
  Upload,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';

interface AdminContentProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Show {
  id: string;
  title: string;
  host: string;
  schedule: string;
  status: 'live' | 'scheduled' | 'offline';
  listeners: number;
  episodeCount: number;
  image: string;
}

export function AdminContent({ onNavigate }: AdminContentProps) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shows' | 'schedule' | 'stats'>('shows');

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    setLoading(true);
    // TODO: Replace with real RadioKing API call
    setTimeout(() => {
      setShows([
        {
          id: '1',
          title: 'LATE NIGHT FRENZY',
          host: 'DJ STORM',
          schedule: 'Friday 23:00-01:00',
          status: 'scheduled',
          listeners: 0,
          episodeCount: 24,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400'
        },
        {
          id: '2',
          title: 'SUNDAY WARM-UP',
          host: 'MC VIBE',
          schedule: 'Sunday 18:00-20:00',
          status: 'offline',
          listeners: 0,
          episodeCount: 18,
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400'
        },
        {
          id: '3',
          title: 'THE MESS SHOW',
          host: 'HOTMESS CREW',
          schedule: 'Wednesday 20:00-22:00',
          status: 'scheduled',
          listeners: 0,
          episodeCount: 45,
          image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'offline': return 'bg-white/10 text-white/40 border-white/20';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminContent" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminContent" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
              RADIO CONTENT
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              Manage shows, schedule & RadioKing integration
            </p>
          </div>
          <button
            onClick={() => {
              alert('Create show flow - integrate with RadioKing API');
            }}
            className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
            style={{ fontWeight: 900, fontSize: '14px' }}
          >
            <Plus size={20} />
            Create Show
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Radio size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {shows.length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Shows
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Play size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {shows.reduce((sum, s) => sum + s.episodeCount, 0)}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Episodes
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Users size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {shows.reduce((sum, s) => sum + s.listeners, 0)}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Current Listeners
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><TrendingUp size={20} /></span>
              <span className="text-red-500 animate-pulse" style={{ fontWeight: 900, fontSize: '28px' }}>
                {shows.filter(s => s.status === 'live').length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Live Now
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {(['shows', 'schedule', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-hot text-hot'
                  : 'text-white/60 hover:text-white'
              }`}
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RadioKing Integration Warning */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500 p-6 mb-6">
          <div className="flex items-start gap-4">
            <Radio className="text-yellow-500 flex-shrink-0" size={32} />
            <div>
              <h3 className="text-yellow-500 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>
                RadioKing Integration Required
              </h3>
              <p className="text-white/80 mb-2" style={{ fontWeight: 400, fontSize: '14px' }}>
                This page currently uses mock data. To make it functional, you need to:
              </p>
              <ul className="text-white/60 space-y-1 mb-4" style={{ fontWeight: 400, fontSize: '13px' }}>
                <li>• Connect RadioKing API credentials</li>
                <li>• Fetch live show schedule</li>
                <li>• Stream current listener count</li>
                <li>• Sync episode metadata</li>
              </ul>
              <button
                onClick={() => {
                  alert('RadioKing setup flow - see platform documentation for API integration');
                }}
                className="bg-yellow-500 text-black px-6 py-3 uppercase tracking-wider hover:bg-yellow-400 transition-all"
                style={{ fontWeight: 900, fontSize: '13px' }}
              >
                Setup RadioKing
              </button>
            </div>
          </div>
        </div>

        {/* Shows Grid */}
        {activeTab === 'shows' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <div key={show.id} className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all group">
                <div className="aspect-video bg-white/10 overflow-hidden relative">
                  <img 
                    src={show.image} 
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 border uppercase tracking-wider ${getStatusColor(show.status)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                    {show.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>
                    {show.title}
                  </h3>
                  <div className="text-white/60 mb-1" style={{ fontWeight: 400, fontSize: '13px' }}>
                    Host: {show.host}
                  </div>
                  <div className="flex items-center gap-2 text-white/40 mb-4" style={{ fontWeight: 400, fontSize: '12px' }}>
                    <Clock size={14} />
                    {show.schedule}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
                        Episodes
                      </div>
                      <div className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
                        {show.episodeCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
                        Listeners
                      </div>
                      <div className="text-hot" style={{ fontWeight: 700, fontSize: '16px' }}>
                        {show.listeners}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-3 py-2 uppercase tracking-wider transition-all flex items-center justify-center gap-2" style={{ fontWeight: 700, fontSize: '12px' }}>
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500 text-white px-3 py-2 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <Calendar className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '14px' }}>
              Schedule view coming soon
            </p>
            <p className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
              Integrate with RadioKing to display weekly schedule
            </p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <TrendingUp className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '14px' }}>
              Analytics coming soon
            </p>
            <p className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
              Track listener stats, popular shows, and engagement metrics
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
