import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MapPin, 
  Plus, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Search,
  ChevronLeft,
  Download,
  Zap,
  Radio,
  Flame
} from 'lucide-react';
import { MapboxGlobe } from '../components/globe/MapboxGlobe';
import { LocationSearchInput } from '../components/LocationSearchInput';
import { LocationPickerOverlay } from '../components/LocationPickerOverlay';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

interface EarthPageProps {
  onNavigate: (route: string) => void;
}

export interface CustomLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
  createdAt: string;
  color?: string;
}

export interface Beacon {
  id: string;
  code: string;
  title: string;
  kind: 'drop' | 'event' | 'venue' | 'sponsor' | 'secret';
  lat: number;
  lng: number;
  city?: string;
  active: boolean;
  scans?: number;
  intensity?: number;
}

const LOCATION_COLORS = [
  '#FF1744', // HOTMESS Red
  '#FF6B9D', // Pink
  '#C41C00', // Deep Red
  '#FF9E00', // Orange
  '#FFD600', // Yellow
  '#00E676', // Green
  '#00B0FF', // Blue
  '#D500F9', // Purple
];

export function EarthPage({ onNavigate }: EarthPageProps) {
  const [locations, setLocations] = useState<CustomLocation[]>([]);
  const [showLocations, setShowLocations] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingLocation, setEditingLocation] = useState<CustomLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Beacon state
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [showBeacons, setShowBeacons] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [beaconsLoading, setBeaconsLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState<number>(0);
  const [formLng, setFormLng] = useState<number>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formColor, setFormColor] = useState(LOCATION_COLORS[0]);

  // Stats
  const [stats, setStats] = useState({
    totalLocations: 0,
    citiesCount: 0,
    countriesCount: 0,
    activeBeacons: 0,
  });

  // Load locations from backend
  useEffect(() => {
    loadLocations();
    loadBeacons();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/earth/locations`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load locations');

      const data = await response.json();
      setLocations(data.locations || []);
      
      // Calculate stats
      const cities = new Set(data.locations.map((loc: CustomLocation) => loc.address.split(',')[0]));
      const countries = new Set(data.locations.map((loc: CustomLocation) => loc.address.split(',').pop()?.trim()));
      
      setStats((prevStats) => ({
        ...prevStats,
        totalLocations: data.locations.length,
        citiesCount: cities.size,
        countriesCount: countries.size,
      }));
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBeacons = async () => {
    setBeaconsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/earth/beacons`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load beacons');

      const data = await response.json();
      setBeacons(data.beacons || []);
      
      // Calculate stats
      const activeBeacons = data.beacons.filter((beacon: Beacon) => beacon.active).length;
      
      setStats((prevStats) => ({
        ...prevStats,
        activeBeacons: activeBeacons,
      }));
    } catch (error) {
      console.error('Error loading beacons:', error);
      toast.error('Failed to load beacons');
    } finally {
      setBeaconsLoading(false);
    }
  };

  const handleLocationSelect = (result: { placeId: string; name: string; address: string; lat: number; lng: number }) => {
    setFormName(result.name);
    setFormAddress(result.address);
    setFormLat(result.lat);
    setFormLng(result.lng);
  };

  const handleSaveLocation = async () => {
    if (!formName || !formAddress) {
      toast.error('Name and address are required');
      return;
    }

    const locationData: Partial<CustomLocation> = {
      name: formName,
      address: formAddress,
      lat: formLat,
      lng: formLng,
      notes: formNotes,
      color: formColor,
    };

    try {
      const url = editingLocation
        ? `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/earth/locations/${editingLocation.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/earth/locations`;

      const response = await fetch(url, {
        method: editingLocation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) throw new Error('Failed to save location');

      toast.success(editingLocation ? 'Location updated!' : 'Location added!');
      
      // Reset form
      setFormName('');
      setFormAddress('');
      setFormLat(0);
      setFormLng(0);
      setFormNotes('');
      setFormColor(LOCATION_COLORS[0]);
      setIsAddMode(false);
      setEditingLocation(null);

      // Reload locations
      loadLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Delete this location?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/earth/locations/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete location');

      toast.success('Location deleted');
      loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleEditLocation = (location: CustomLocation) => {
    setEditingLocation(location);
    setFormName(location.name);
    setFormAddress(location.address);
    setFormLat(location.lat);
    setFormLng(location.lng);
    setFormNotes(location.notes || '');
    setFormColor(location.color || LOCATION_COLORS[0]);
    setIsAddMode(true);
  };

  const handleCancelEdit = () => {
    setFormName('');
    setFormAddress('');
    setFormLat(0);
    setFormLng(0);
    setFormNotes('');
    setFormColor(LOCATION_COLORS[0]);
    setIsAddMode(false);
    setEditingLocation(null);
  };

  const handleExportLocations = () => {
    const dataStr = JSON.stringify(locations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotmess-locations-${Date.now()}.json`;
    link.click();
    toast.success('Locations exported!');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background vignette - matching BeaconsGlobe */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,23,68,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.85))]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 min-h-screen">
        {/* LEFT RAIL */}
        <aside className="border-r border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="p-6">
            {/* Header */}
            <div className="text-4xl font-black tracking-tight uppercase">HOTMESS</div>
            <div className="mt-1 text-xs tracking-[0.32em] uppercase text-white/60">
              EARTH
            </div>

            {/* Stats Card */}
            <div className="mt-6 border border-white/15 rounded-2xl p-4 bg-black/50">
              <div className="text-xs tracking-[0.28em] uppercase text-white/70 mb-4">
                Your Stats
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-2xl font-black text-hotmess-red">
                    {stats.totalLocations}
                  </div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-white/50 mt-1">
                    SPOTS
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-hotmess-red">
                    {stats.activeBeacons}
                  </div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-white/50 mt-1">
                    BEACONS
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-hotmess-red">
                    {stats.citiesCount}
                  </div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-white/50 mt-1">
                    CITIES
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-hotmess-red">
                    {stats.countriesCount}
                  </div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-white/50 mt-1">
                    COUNTRIES
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="mt-6">
              <div className="text-xs tracking-[0.28em] uppercase text-white/60 mb-3">
                Layers
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setShowLocations(!showLocations)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all group ${
                    showLocations
                      ? 'border-hotmess-red/50 bg-hotmess-red/10'
                      : 'border-white/15 bg-black/50 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        showLocations ? 'bg-hotmess-red/20' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <MapPin className={`w-4 h-4 ${showLocations ? 'text-hotmess-red' : 'text-white/70'}`} />
                      </div>
                      <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                        My Locations
                      </div>
                    </div>
                    {showLocations ? <Eye className="w-4 h-4 text-hotmess-red" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                  </div>
                </button>

                <button
                  onClick={() => setShowBeacons(!showBeacons)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all group ${
                    showBeacons
                      ? 'border-hotmess-red/50 bg-hotmess-red/10'
                      : 'border-white/15 bg-black/50 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        showBeacons ? 'bg-hotmess-red/20' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Radio className={`w-4 h-4 ${showBeacons ? 'text-hotmess-red' : 'text-white/70'}`} />
                      </div>
                      <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                        Beacons
                      </div>
                    </div>
                    {showBeacons ? <Eye className="w-4 h-4 text-hotmess-red" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                  </div>
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all group ${
                    showHeatmap
                      ? 'border-hotmess-red/50 bg-hotmess-red/10'
                      : 'border-white/15 bg-black/50 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        showHeatmap ? 'bg-hotmess-red/20' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Flame className={`w-4 h-4 ${showHeatmap ? 'text-hotmess-red' : 'text-white/70'}`} />
                      </div>
                      <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                        Heatmap
                      </div>
                    </div>
                    {showHeatmap ? <Eye className="w-4 h-4 text-hotmess-red" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIsAddMode(!isAddMode)}
                className="w-full rounded-xl border-2 border-white/15 bg-black/50 backdrop-blur px-4 py-3 text-left hover:border-hotmess-red/50 hover:bg-hotmess-red/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-hotmess-red/10 flex items-center justify-center group-hover:bg-hotmess-red/20 transition-colors">
                      <Plus className="w-4 h-4 text-hotmess-red" />
                    </div>
                    <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                      Add Location
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleExportLocations}
                className="w-full rounded-xl border-2 border-white/15 bg-black/50 backdrop-blur px-4 py-3 text-left hover:border-white/30 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Download className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                      Export Data
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Locations List */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs tracking-[0.28em] uppercase text-white/60">
                  Locations ({locations.length})
                </div>
              </div>

              {isLoading ? (
                <div className="text-white/40 text-sm">Loading...</div>
              ) : locations.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-center">
                  <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <div className="text-xs text-white/40">No locations yet</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-600px)] overflow-y-auto pr-2">
                  {locations.map((location) => (
                    <motion.button
                      key={location.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                        selectedLocationId === location.id
                          ? 'border-hotmess-red bg-hotmess-red/10'
                          : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" 
                          style={{ backgroundColor: location.color || '#FF1744' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">
                            {location.name}
                          </div>
                          <div className="text-xs text-white/50 truncate mt-0.5">
                            {location.address.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLocation(location);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] tracking-[0.16em] uppercase transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          EDIT
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(location.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-hotmess-red/20 text-white/60 hover:text-hotmess-red text-[10px] tracking-[0.16em] uppercase transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          DELETE
                        </button>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer - Back Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black/60 backdrop-blur">
            <button
              onClick={() => onNavigate('home')}
              className="w-full rounded-xl border-2 border-white/15 bg-black/50 backdrop-blur px-4 py-3 text-left hover:border-white/30 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ChevronLeft className="w-4 h-4 text-white/70" />
                <div className="text-sm tracking-[0.16em] uppercase text-white/90">
                  Back to Home
                </div>
              </div>
            </button>
          </div>
        </aside>

        {/* MAIN - 3D Globe View */}
        <div className="relative h-screen bg-black overflow-hidden">
          <MapboxGlobe
            timeWindow="tonight"
            showHeat={showHeatmap}
            showBeacons={showBeacons || showLocations}
            beacons={[
              // Map beacons from backend
              ...beacons.map((b) => ({
                id: b.id,
                code: b.code,
                type: b.kind,
                title: b.title,
                lat: b.lat,
                lng: b.lng,
                city: b.city,
              })),
              // Add custom locations as beacons if layer is on
              ...(showLocations ? locations.map((loc) => ({
                id: loc.id,
                code: loc.id,
                type: 'checkin',
                title: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                city: loc.address.split(',')[0],
              })) : []),
            ]}
            onBeaconClick={(beaconId) => {
              const beacon = beacons.find(b => b.id === beaconId);
              const location = locations.find(l => l.id === beaconId);
              
              if (beacon) {
                toast.info(`Beacon: ${beacon.title}`);
              } else if (location) {
                toast.info(`Location: ${location.name}`);
                setSelectedLocationId(location.id);
              }
            }}
          />
        </div>
      </div>

      {/* Location Picker Overlay - 2D Map */}
      <LocationPickerOverlay
        isOpen={isAddMode}
        onClose={handleCancelEdit}
        onLocationSelect={(data) => {
          setFormName(data.name);
          setFormAddress(data.address);
          setFormLat(data.lat);
          setFormLng(data.lng);
          // Auto-save after selection
          handleSaveLocation();
        }}
        initialLocation={editingLocation ? {
          name: editingLocation.name,
          address: editingLocation.address,
          lat: editingLocation.lat,
          lng: editingLocation.lng,
        } : undefined}
        mode={editingLocation ? 'edit' : 'add'}
      />
    </div>
  );
}