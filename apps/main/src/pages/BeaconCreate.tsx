import { useState } from 'react';
import { ArrowLeft, MapPin, Zap, Ticket, ShoppingBag, Gem, Handshake, Home, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { createBeacon } from '../lib/beacons/beaconService';

interface BeaconCreateProps {
  onNavigate: (route: string) => void;
}

type BeaconType = 'checkin' | 'event' | 'ticket' | 'product' | 'drop' | 'vendor';

interface BeaconTypeOption {
  id: BeaconType;
  label: string;
  icon: React.ReactNode;
  masterType: 'presence' | 'transaction';
  subtype: string;
}

const BEACON_TYPES: BeaconTypeOption[] = [
  {
    id: 'checkin',
    label: 'Check-in',
    icon: <MapPin size={24} />,
    masterType: 'presence',
    subtype: 'checkin',
  },
  {
    id: 'event',
    label: 'Event',
    icon: <Zap size={24} />,
    masterType: 'presence',
    subtype: 'event_presence',
  },
  {
    id: 'ticket',
    label: 'Ticket',
    icon: <Ticket size={24} />,
    masterType: 'transaction',
    subtype: 'ticket',
  },
  {
    id: 'product',
    label: 'Product',
    icon: <ShoppingBag size={24} />,
    masterType: 'transaction',
    subtype: 'product',
  },
  {
    id: 'drop',
    label: 'Drop',
    icon: <Gem size={24} />,
    masterType: 'transaction',
    subtype: 'drop',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: <Handshake size={24} />,
    masterType: 'transaction',
    subtype: 'product',
  },
];

export function BeaconCreate({ onNavigate }: BeaconCreateProps) {
  const [selectedType, setSelectedType] = useState<BeaconType>('checkin');
  const [beaconName, setBeaconName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!beaconName.trim()) {
      toast.error('Please enter a beacon name');
      return;
    }

    setIsCreating(true);

    const selectedOption = BEACON_TYPES.find(t => t.id === selectedType);

    // Map the beacon types to database schema types
    const typeMapping: Record<string, 'event' | 'ticket' | 'venue' | 'experience' | 'community'> = {
      'checkin': 'venue',
      'event': 'event',
      'ticket': 'ticket',
      'product': 'community',
      'drop': 'community',
      'vendor': 'community',
    };

    const beaconData = {
      type: typeMapping[selectedType] || 'venue',
      title: beaconName,
      description: description || null,
      city_id: 'london',
      host_type: 'approved_host' as const,
    };

    try {
      const result = await createBeacon(beaconData);
      
      if (result.ok) {
        toast.success(`Beacon "${beaconName}" created successfully!`);
        // Navigate back to beacons page
        onNavigate('beacons');
      } else {
        toast.error(result.error || 'Failed to create beacon');
      }
    } catch (error: any) {
      console.error('Error creating beacon:', error);
      toast.error(error?.message || 'Failed to create beacon');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
          >
            <Home size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Home</span>
          </button>
          <ChevronRight size={16} className="text-white/20" />
          <button
            onClick={() => onNavigate('beaconsManage')}
            className="text-white/40 hover:text-white transition-colors"
          >
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Beacon Manager</span>
          </button>
          <ChevronRight size={16} className="text-white/20" />
          <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-white">Create Beacon</span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[rgba(70,8,9,0.2)] to-black">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button
            onClick={() => onNavigate('beacons')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Back to Beacons</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 
                className="text-white uppercase mb-2"
                style={{ fontSize: '72px', fontWeight: 700, lineHeight: '1.2', letterSpacing: '-2.76px' }}
              >
                Create New Beacon
              </h1>
              <p 
                className="text-white/60"
                style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6', letterSpacing: '-0.47px' }}
              >
                Choose a beacon type and configure your QR code
              </p>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating || !beaconName.trim()}
              className="bg-[#ff1694] hover:bg-white hover:text-black disabled:bg-white/20 disabled:text-white/40 text-white px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(255,22,148,0.6)] hover:shadow-[0_0_50px_rgba(255,22,148,0.9)] disabled:shadow-none"
              style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.47px' }}
            >
              {isCreating ? 'Creating...' : 'Create Beacon'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Beacon Type Selection */}
        <div className="mb-8">
          <label 
            className="block text-white mb-4"
            style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.55px', textTransform: 'uppercase' }}
          >
            Beacon Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            {BEACON_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`
                  relative p-6 rounded-lg border transition-all
                  ${selectedType === type.id
                    ? 'bg-[#ff1694]/10 border-[#ff1694] shadow-[0_0_20px_rgba(255,22,148,0.4)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`${selectedType === type.id ? 'text-[#ff1694]' : 'text-white/60'}`}>
                    {type.icon}
                  </div>
                  <span 
                    className={`${selectedType === type.id ? 'text-white' : 'text-white/60'}`}
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Beacon Name */}
        <div className="mb-6">
          <label 
            className="block text-white mb-3"
            style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.55px', textTransform: 'uppercase' }}
          >
            Beacon Name
          </label>
          <input
            type="text"
            value={beaconName}
            onChange={(e) => setBeaconName(e.target.value)}
            placeholder="e.g., The Glory Check-in"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff1694] focus:shadow-[0_0_20px_rgba(255,22,148,0.3)] transition-all"
            style={{ fontSize: '16px', fontWeight: 400 }}
          />
        </div>

        {/* Description (Optional) */}
        <div className="mb-8">
          <label 
            className="block text-white mb-3"
            style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.55px', textTransform: 'uppercase' }}
          >
            Description <span className="text-white/40">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Venue check-in beacon for earning XP and tracking attendance"
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff1694] focus:shadow-[0_0_20px_rgba(255,22,148,0.3)] transition-all resize-none"
            style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.6' }}
          />
        </div>

        {/* Info Box */}
        <div className="bg-[#ff1694]/5 border border-[#ff1694]/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-[#ff1694] mt-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p 
                className="text-white/80 mb-2"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                What happens next?
              </p>
              <p 
                className="text-white/60"
                style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.6' }}
              >
                After creating this beacon, you'll be able to configure geo settings, time windows, XP rewards, and generate QR codes. The beacon will be saved as a draft until you activate it.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h3 
            className="text-white mb-4"
            style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.55px', textTransform: 'uppercase' }}
          >
            Beacon Type Reference
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[#ff1694] mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>
                Presence Beacons
              </h4>
              <ul className="space-y-1 text-white/60" style={{ fontSize: '13px' }}>
                <li>• <strong>Check-in:</strong> Venue, sauna, cruise area</li>
                <li>• <strong>Event:</strong> Non-ticketed event presence</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#ff1694] mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>
                Transaction Beacons
              </h4>
              <ul className="space-y-1 text-white/60" style={{ fontSize: '13px' }}>
                <li>• <strong>Ticket:</strong> Event access control</li>
                <li>• <strong>Product:</strong> MessMarket items</li>
                <li>• <strong>Drop:</strong> Limited-time releases</li>
                <li>• <strong>Vendor:</strong> Vendor-specific products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}