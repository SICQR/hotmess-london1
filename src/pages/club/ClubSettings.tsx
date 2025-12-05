import { useState } from 'react';
import { Card } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { ArrowLeft, Save, Upload, MapPin, Clock, DollarSign } from 'lucide-react';
import type { RouteId } from '../../lib/routes';

interface ClubSettingsProps {
  clubId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function ClubSettings({ clubId, onNavigate }: ClubSettingsProps) {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: 'The Vault London',
    tagline: 'Londons Premier Underground Club',
    description: 'Dark, intimate club space in the heart of Vauxhall. Known for cutting-edge techno and house.',
    address: '123 Vauxhall Walk, London SE11',
    capacity: 500,
    minAge: 18,
    doorPrice: 15,
    memberPrice: 10,
    openTime: '22:00',
    closeTime: '06:00',
    logoUrl: '',
    bannerUrl: '',
    instagramHandle: '@thevaultldn',
    websiteUrl: 'https://thevaultlondon.com',
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('clubDashboard', { clubId })}
            className="mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Club Settings
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 400, color: '#999' }}>
            Manage your venue profile and settings
          </p>
        </div>

        {/* Basic Info */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Club Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Location & Hours */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            <MapPin size={20} className="inline mr-2" />
            Location & Hours
          </h2>
          <div className="space-y-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                  <Clock size={14} className="inline mr-1" />
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings.openTime}
                  onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                  style={{ fontSize: '16px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                  <Clock size={14} className="inline mr-1" />
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings.closeTime}
                  onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                  style={{ fontSize: '16px', color: '#fff' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing & Capacity */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            <DollarSign size={20} className="inline mr-2" />
            Pricing & Capacity
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Capacity
              </label>
              <input
                type="number"
                value={settings.capacity}
                onChange={(e) => setSettings({ ...settings, capacity: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Door Price (£)
              </label>
              <input
                type="number"
                value={settings.doorPrice}
                onChange={(e) => setSettings({ ...settings, doorPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Member Price (£)
              </label>
              <input
                type="number"
                value={settings.memberPrice}
                onChange={(e) => setSettings({ ...settings, memberPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
