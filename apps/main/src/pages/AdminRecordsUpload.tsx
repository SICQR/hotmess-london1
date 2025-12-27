/**
 * Admin Records Upload Page
 * Upload MP3s, cover images, and manage releases
 */

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  Music, 
  Image, 
  Save, 
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Disc3
} from 'lucide-react';
import { RouteId } from '../lib/routes';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminRecordsUploadProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Track {
  id: string;
  title: string;
  duration: string;
  badge: string | null;
  mp3File: File | null;
  mp3Url: string;
  uploading: boolean;
}

interface Credit {
  role: string;
  name: string;
}

export function AdminRecordsUpload({ onNavigate }: AdminRecordsUploadProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState('SINGLE');
  const [status, setStatus] = useState('ACTIVE');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [press, setPress] = useState('');

  // Cover image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Tracks
  const [tracks, setTracks] = useState<Track[]>([]);

  // Credits
  const [credits, setCredits] = useState<Credit[]>([]);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/records`;

  // ============================================================================
  // COVER IMAGE UPLOAD
  // ============================================================================

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverUrl(URL.createObjectURL(file));
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return '';

    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', coverFile);

      const response = await fetch(`${API_BASE}/upload-cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setCoverUrl(data.publicUrl);
      return data.publicUrl;
    } catch (error: any) {
      console.error('Cover upload error:', error);
      setMessage({ type: 'error', text: `Cover upload failed: ${error.message}` });
      return '';
    } finally {
      setCoverUploading(false);
    }
  };

  // ============================================================================
  // TRACK MANAGEMENT
  // ============================================================================

  const addTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      title: '',
      duration: '0:00',
      badge: null,
      mp3File: null,
      mp3Url: '',
      uploading: false,
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleTrackFileSelect = (trackId: string, file: File) => {
    updateTrack(trackId, { mp3File: file });
  };

  const uploadTrack = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !track.mp3File) return '';

    updateTrack(trackId, { uploading: true });
    
    try {
      const formData = new FormData();
      formData.append('file', track.mp3File);

      const response = await fetch(`${API_BASE}/upload-audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      updateTrack(trackId, { mp3Url: data.publicUrl, uploading: false });
      return data.publicUrl;
    } catch (error: any) {
      console.error('Track upload error:', error);
      setMessage({ type: 'error', text: `Track upload failed: ${error.message}` });
      updateTrack(trackId, { uploading: false });
      return '';
    }
  };

  // ============================================================================
  // CREDITS
  // ============================================================================

  const addCredit = () => {
    setCredits([...credits, { role: '', name: '' }]);
  };

  const removeCredit = (index: number) => {
    setCredits(credits.filter((_, i) => i !== index));
  };

  const updateCredit = (index: number, field: 'role' | 'name', value: string) => {
    const updated = [...credits];
    updated[index][field] = value;
    setCredits(updated);
  };

  // ============================================================================
  // SAVE RECORD
  // ============================================================================

  const handleSave = async () => {
    if (!slug || !title || !artist) {
      setMessage({ type: 'error', text: 'Slug, Title, and Artist are required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Upload cover if needed
      let finalCoverUrl = coverUrl;
      if (coverFile && !coverUrl.includes('supabase')) {
        finalCoverUrl = await uploadCover();
        if (!finalCoverUrl) {
          setLoading(false);
          return;
        }
      }

      // Upload all tracks
      const uploadedTracks: any[] = [];
      for (const track of tracks) {
        let mp3Url = track.mp3Url;
        if (track.mp3File && !track.mp3Url) {
          mp3Url = await uploadTrack(track.id);
          if (!mp3Url) {
            setLoading(false);
            return;
          }
        }

        uploadedTracks.push({
          id: track.id,
          title: track.title,
          duration: track.duration,
          badge: track.badge,
          mp3Url,
        });
      }

      // Calculate total duration
      const totalSeconds = tracks.reduce((sum, t) => {
        const [mins, secs] = t.duration.split(':').map(Number);
        return sum + (mins * 60) + (secs || 0);
      }, 0);
      const totalDuration = `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`;

      // Save record
      const record = {
        slug,
        title,
        artist,
        tagline,
        type,
        status,
        tags,
        coverUrl: finalCoverUrl,
        releaseDate,
        totalDuration,
        soundcloudUrl,
        cuts: uploadedTracks,
        credits,
        press,
        shopItems: [],
      };

      const response = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(record),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save record');

      setMessage({ type: 'success', text: `✅ Record "${title}" published successfully! Redirecting to Records page...` });
      
      // Reset form and navigate after 2 seconds
      setTimeout(() => {
        onNavigate('records');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 py-8 border-b border-hot/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Upload className="text-hot" size={32} />
            <h1 className="uppercase tracking-[-0.04em] text-white" style={{ fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>
              Upload Record
            </h1>
          </div>
          <p className="text-white/60 uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '12px' }}>
            Create a new release with MP3 tracks and cover art
          </p>
          <button
            onClick={() => onNavigate('records')}
            className="text-white/60 hover:text-hot uppercase tracking-wider transition-colors"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            ← Back to Records
          </button>
        </motion.div>
      </section>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-4 md:mx-8 lg:mx-12 mt-6 p-4 border ${
            message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-hot bg-hot/10'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <AlertCircle className="text-hot" size={20} />
            )}
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{message.text}</span>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <div className="px-4 md:px-8 lg:px-12 py-8 space-y-8 max-w-4xl">
        {/* Basic Info */}
        <FormSection title="Basic Info" icon={<Disc3 size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Slug (URL-safe ID)" required>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="hotmess-ep"
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              />
            </FormField>

            <FormField label="Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="HOTMESS"
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              />
            </FormField>

            <FormField label="Artist" required>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="RAW CONVICT"
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              />
            </FormField>

            <FormField label="Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                <option value="SINGLE">SINGLE</option>
                <option value="EP">EP</option>
                <option value="RELEASE PACK">RELEASE PACK</option>
                <option value="COMPILATION">COMPILATION</option>
              </select>
            </FormField>

            <FormField label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMING SOON">COMING SOON</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </FormField>

            <FormField label="Release Date">
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '14px' }}
              />
            </FormField>
          </div>

          <FormField label="Tagline">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="NEW VERSIONS. SAME PROBLEM."
              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
              style={{ fontWeight: 700, fontSize: '14px' }}
            />
          </FormField>

          <FormField label="Tags">
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-hot px-3 py-1 text-white uppercase tracking-wider flex items-center gap-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    {tag}
                    <button onClick={() => setTags(tags.filter((_, i) => i !== idx))}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-2 text-white"
                  style={{ fontWeight: 700, fontSize: '13px' }}
                />
              </div>
            </div>
          </FormField>

          <FormField label="SoundCloud URL">
            <input
              type="url"
              value={soundcloudUrl}
              onChange={(e) => setSoundcloudUrl(e.target.value)}
              placeholder="https://soundcloud.com/..."
              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white"
              style={{ fontWeight: 700, fontSize: '14px' }}
            />
          </FormField>

          <FormField label="Press / Description">
            <textarea
              value={press}
              onChange={(e) => setPress(e.target.value)}
              placeholder="High-octane edits built for peak-hour damage..."
              rows={4}
              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white leading-relaxed"
              style={{ fontWeight: 400, fontSize: '14px' }}
            />
          </FormField>
        </FormSection>

        {/* Cover Image */}
        <FormSection title="Cover Image" icon={<Image size={20} />}>
          <div className="space-y-4">
            {coverUrl && (
              <div className="relative w-64 h-64 border-2 border-white/20">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="bg-white/10 border-2 border-white/20 hover:border-hot text-white px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
              style={{ fontWeight: 900, fontSize: '13px' }}
            >
              {coverUploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
              {coverUploading ? 'Uploading...' : 'Select Cover Image'}
            </button>
          </div>
        </FormSection>

        {/* Tracks */}
        <FormSection title="Tracks" icon={<Music size={20} />}>
          <div className="space-y-4">
            {tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                onUpdate={(updates) => updateTrack(track.id, updates)}
                onFileSelect={(file) => handleTrackFileSelect(track.id, file)}
                onRemove={() => removeTrack(track.id)}
              />
            ))}
            <button
              onClick={addTrack}
              className="bg-white/10 border-2 border-white/20 hover:border-hot text-white px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
              style={{ fontWeight: 900, fontSize: '13px' }}
            >
              <Plus size={18} />
              Add Track
            </button>
          </div>
        </FormSection>

        {/* Credits */}
        <FormSection title="Credits" icon={<Music size={20} />}>
          <div className="space-y-4">
            {credits.map((credit, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <input
                  type="text"
                  value={credit.role}
                  onChange={(e) => updateCredit(idx, 'role', e.target.value)}
                  placeholder="PRODUCED BY"
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                  style={{ fontWeight: 700, fontSize: '13px' }}
                />
                <input
                  type="text"
                  value={credit.name}
                  onChange={(e) => updateCredit(idx, 'name', e.target.value)}
                  placeholder="DJ MESS"
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-white uppercase tracking-wider"
                  style={{ fontWeight: 700, fontSize: '13px' }}
                />
                <button
                  onClick={() => removeCredit(idx)}
                  className="p-3 border border-white/20 hover:border-hot hover:text-hot transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={addCredit}
              className="bg-white/10 border-2 border-white/20 hover:border-hot text-white px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
              style={{ fontWeight: 900, fontSize: '13px' }}
            >
              <Plus size={18} />
              Add Credit
            </button>
          </div>
        </FormSection>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-hot hover:bg-white text-white hover:text-black px-8 py-4 uppercase tracking-wider transition-all flex items-center gap-2"
            style={{ fontWeight: 900, fontSize: '14px' }}
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Saving...' : 'Save Record'}
          </button>
          <button
            onClick={() => onNavigate('records')}
            className="bg-black border-2 border-white text-white px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            style={{ fontWeight: 900, fontSize: '14px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-hot">{icon}</span>
        <h2 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '18px' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-white/60 uppercase tracking-wider block" style={{ fontWeight: 900, fontSize: '11px' }}>
        {label} {required && <span className="text-hot">*</span>}
      </label>
      {children}
    </div>
  );
}

function TrackRow({ track, index, onUpdate, onFileSelect, onRemove }: {
  track: Track;
  index: number;
  onUpdate: (updates: Partial<Track>) => void;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white/5 border border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '12px' }}>
          TRACK {index + 1}
        </span>
        <button onClick={onRemove} className="text-white/40 hover:text-hot transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={track.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Track Title"
          className="bg-white/10 border border-white/20 px-3 py-2 text-white uppercase tracking-wider"
          style={{ fontWeight: 700, fontSize: '13px' }}
        />
        <input
          type="text"
          value={track.duration}
          onChange={(e) => onUpdate({ duration: e.target.value })}
          placeholder="3:45"
          className="bg-white/10 border border-white/20 px-3 py-2 text-white uppercase tracking-wider"
          style={{ fontWeight: 700, fontSize: '13px' }}
        />
        <input
          type="text"
          value={track.badge || ''}
          onChange={(e) => onUpdate({ badge: e.target.value || null })}
          placeholder="Badge (optional)"
          className="bg-white/10 border border-white/20 px-3 py-2 text-white uppercase tracking-wider"
          style={{ fontWeight: 700, fontSize: '13px' }}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/mpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={track.uploading}
          className="bg-white/10 border border-white/20 hover:border-hot text-white px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2"
          style={{ fontWeight: 700, fontSize: '12px' }}
        >
          {track.uploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
          {track.mp3File ? track.mp3File.name : 'Select MP3'}
        </button>
        {track.mp3Url && (
          <CheckCircle className="text-green-500" size={20} />
        )}
      </div>
    </div>
  );
}