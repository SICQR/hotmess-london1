import { useState } from 'react';
import { Card } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { Badge } from '../../components/design-system/Badge';
import { Plus, Music, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import type { RouteId } from '../../lib/routes';

interface AdminRecordsReleasesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Release {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  coverArt: string;
  trackCount: number;
  status: 'published' | 'draft' | 'scheduled';
  plays: number;
}

export function AdminRecordsReleases({ onNavigate }: AdminRecordsReleasesProps) {
  const [releases, setReleases] = useState<Release[]>([
    {
      id: '1',
      title: 'HOTMESS VOL. 1',
      artist: 'Various Artists',
      releaseDate: '2024-12-01',
      coverArt: '/api/placeholder/200/200',
      trackCount: 12,
      status: 'published',
      plays: 45230
    },
    {
      id: '2',
      title: 'Dark Nights EP',
      artist: 'DJ Shadow',
      releaseDate: '2024-12-15',
      coverArt: '/api/placeholder/200/200',
      trackCount: 4,
      status: 'scheduled',
      plays: 0
    },
  ]);

  const getStatusColor = (status: Release['status']) => {
    switch (status) {
      case 'published': return 'green';
      case 'scheduled': return 'blue';
      case 'draft': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Records Releases
            </h1>
            <p style={{ fontSize: '16px', fontWeight: 400, color: '#999' }}>
              Manage RAW CONVICT label releases
            </p>
          </div>
          <Button onClick={() => onNavigate('adminRecordsUpload')} size="lg">
            <Plus size={20} />
            New Release
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#999', marginBottom: '8px' }}>
              Total Releases
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
              {releases.length}
            </div>
          </Card>
          <Card className="p-6">
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#999', marginBottom: '8px' }}>
              Published
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f0' }}>
              {releases.filter(r => r.status === 'published').length}
            </div>
          </Card>
          <Card className="p-6">
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#999', marginBottom: '8px' }}>
              Scheduled
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#00f' }}>
              {releases.filter(r => r.status === 'scheduled').length}
            </div>
          </Card>
          <Card className="p-6">
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#999', marginBottom: '8px' }}>
              Total Plays
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ff1eff' }}>
              {releases.reduce((acc, r) => acc + r.plays, 0).toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Releases Grid */}
        <div className="grid grid-cols-1 gap-4">
          {releases.map((release) => (
            <Card key={release.id} className="p-6">
              <div className="flex items-center gap-6">
                {/* Cover Art */}
                <div className="w-24 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                  <Music className="w-full h-full p-6 text-gray-600" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                      {release.title}
                    </h3>
                    <Badge variant={getStatusColor(release.status)}>
                      {release.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>
                    {release.artist}
                  </p>
                  <div className="flex items-center gap-6" style={{ fontSize: '14px', color: '#666' }}>
                    <span className="flex items-center gap-2">
                      <Music size={16} />
                      {release.trackCount} tracks
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(release.releaseDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye size={16} />
                      {release.plays.toLocaleString()} plays
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('recordsRelease', { slug: release.id })}
                  >
                    <Eye size={18} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit size={18} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
