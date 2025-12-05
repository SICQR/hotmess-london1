import { useState } from 'react';
import { Card } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { ArrowLeft, Save, Trash2, Calendar, Clock, DollarSign } from 'lucide-react';
import type { RouteId } from '../../lib/routes';

interface EditEventProps {
  clubId: string;
  eventId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function EditEvent({ clubId, eventId, onNavigate }: EditEventProps) {
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState({
    title: 'HOTMESS Saturday Night',
    description: 'Join us for an unforgettable night of techno and house music.',
    date: '2024-12-21',
    startTime: '22:00',
    endTime: '06:00',
    doorPrice: 15,
    earlyBirdPrice: 10,
    capacity: 500,
    minAge: 18,
    lineup: 'DJ Shadow, MC Storm, VJ Neon',
    flyerUrl: '',
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setSaving(false);
      onNavigate('clubEventDetail', { eventId });
    }, 1000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    // TODO: Delete from backend
    onNavigate('clubDashboard', { clubId });
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('clubEventDetail', { eventId })}
            className="mb-4"
          >
            <ArrowLeft size={16} />
            Back to Event
          </Button>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Edit Event
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 400, color: '#999' }}>
            Update event details and settings
          </p>
        </div>

        {/* Basic Info */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Event Details
          </h2>
          <div className="space-y-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Event Title
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={event.description}
                onChange={(e) => setEvent({ ...event, description: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Date & Time */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            <Calendar size={20} className="inline mr-2" />
            Schedule
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Date
              </label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                <Clock size={14} className="inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={event.startTime}
                onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                <Clock size={14} className="inline mr-1" />
                End Time
              </label>
              <input
                type="time"
                value={event.endTime}
                onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            <DollarSign size={20} className="inline mr-2" />
            Tickets & Capacity
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Door Price (£)
              </label>
              <input
                type="number"
                value={event.doorPrice}
                onChange={(e) => setEvent({ ...event, doorPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Early Bird (£)
              </label>
              <input
                type="number"
                value={event.earlyBirdPrice}
                onChange={(e) => setEvent({ ...event, earlyBirdPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
                Capacity
              </label>
              <input
                type="number"
                value={event.capacity}
                onChange={(e) => setEvent({ ...event, capacity: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
          </div>
        </Card>

        {/* Lineup */}
        <Card className="p-6 mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Lineup
          </h2>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '8px' }}>
              Artists (comma-separated)
            </label>
            <textarea
              value={event.lineup}
              onChange={(e) => setEvent({ ...event, lineup: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              style={{ fontSize: '16px', color: '#fff' }}
              rows={3}
              placeholder="DJ Shadow, MC Storm, VJ Neon"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 size={20} className="text-red-500" />
            Delete Event
          </Button>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
