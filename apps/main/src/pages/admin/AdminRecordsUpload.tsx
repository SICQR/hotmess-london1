import { useState, useRef } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { Upload, Music, Image as ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminRecordsUploadProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function AdminRecordsUpload({ onNavigate }: AdminRecordsUploadProps) {
  const [mp3File, setMp3File] = useState<UploadedFile | null>(null);
  const [coverFile, setCoverFile] = useState<UploadedFile | null>(null);
  const [metadata, setMetadata] = useState({
    artist: '',
    title: '',
    album: '',
    year: new Date().getFullYear().toString(),
    genre: '',
    label: 'RAW Convict',
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const mp3InputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleMp3Select = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio')) {
      alert('Please select an MP3 file');
      return;
    }

    setMp3File({
      file,
      status: 'pending',
      progress: 0
    });
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverFile({
        file,
        preview: e.target?.result as string,
        status: 'pending',
        progress: 0
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!mp3File || !coverFile) {
      alert('Please select both MP3 and cover art');
      return;
    }

    if (!metadata.artist || !metadata.title) {
      alert('Please fill in artist and title');
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('mp3', mp3File.file);
      formData.append('cover', coverFile.file);
      formData.append('metadata', JSON.stringify(metadata));

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/records/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setSuccess(true);
      setMp3File(null);
      setCoverFile(null);
      setMetadata({
        artist: '',
        title: '',
        album: '',
        year: new Date().getFullYear().toString(),
        genre: '',
        label: 'RAW Convict',
      });

      // Reset file inputs
      if (mp3InputRef.current) mp3InputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout currentRoute="adminRecordsUpload" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-white uppercase mb-2"
            style={{ fontWeight: 900, fontSize: '48px', lineHeight: '1', letterSpacing: '-0.02em' }}
          >
            Upload Records
          </h1>
          <p 
            className="text-white/60 uppercase"
            style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em' }}
          >
            Upload MP3s and cover art for RAW Convict
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-white" style={{ fontWeight: 600, fontSize: '14px' }}>
              Record uploaded successfully!
            </p>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white/5 border border-white/10 p-8">
          <div className="space-y-6">
            {/* MP3 Upload */}
            <div>
              <label className="block text-white mb-3 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                MP3 File *
              </label>
              <div className="border-2 border-dashed border-white/20 hover:border-hot/50 transition-all p-8 text-center">
                <input
                  ref={mp3InputRef}
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  onChange={handleMp3Select}
                  className="hidden"
                  id="mp3-upload"
                />
                {!mp3File ? (
                  <label htmlFor="mp3-upload" className="cursor-pointer block">
                    <Music className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-white mb-2" style={{ fontWeight: 600, fontSize: '14px' }}>
                      Click to upload MP3
                    </p>
                    <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                      Maximum file size: 50MB
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-hot" />
                      <div className="text-left">
                        <p className="text-white" style={{ fontWeight: 600, fontSize: '14px' }}>
                          {mp3File.file.name}
                        </p>
                        <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                          {(mp3File.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMp3File(null);
                        if (mp3InputRef.current) mp3InputRef.current.value = '';
                      }}
                      className="p-2 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Art Upload */}
            <div>
              <label className="block text-white mb-3 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                Cover Art *
              </label>
              <div className="border-2 border-dashed border-white/20 hover:border-hot/50 transition-all p-8 text-center">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="hidden"
                  id="cover-upload"
                />
                {!coverFile ? (
                  <label htmlFor="cover-upload" className="cursor-pointer block">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-white mb-2" style={{ fontWeight: 600, fontSize: '14px' }}>
                      Click to upload cover art
                    </p>
                    <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                      Recommended: 1000x1000px, JPG or PNG
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/5 p-4">
                    <div className="flex items-center gap-4">
                      {coverFile.preview && (
                        <img 
                          src={coverFile.preview} 
                          alt="Cover preview" 
                          className="w-16 h-16 object-cover border border-white/20"
                        />
                      )}
                      <div className="text-left">
                        <p className="text-white" style={{ fontWeight: 600, fontSize: '14px' }}>
                          {coverFile.file.name}
                        </p>
                        <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                          {(coverFile.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCoverFile(null);
                        if (coverInputRef.current) coverInputRef.current.value = '';
                      }}
                      className="p-2 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Form */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Artist *
                </label>
                <input
                  type="text"
                  value={metadata.artist}
                  onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="Artist name"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>

              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="Track title"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>

              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Album
                </label>
                <input
                  type="text"
                  value={metadata.album}
                  onChange={(e) => setMetadata({ ...metadata, album: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="Album name (optional)"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>

              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Year
                </label>
                <input
                  type="text"
                  value={metadata.year}
                  onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="2025"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>

              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Genre
                </label>
                <input
                  type="text"
                  value={metadata.genre}
                  onChange={(e) => setMetadata({ ...metadata, genre: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="Electronic, Techno, etc."
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>

              <div>
                <label className="block text-white mb-2 uppercase" style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                  Label
                </label>
                <input
                  type="text"
                  value={metadata.label}
                  onChange={(e) => setMetadata({ ...metadata, label: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="RAW Convict"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => onNavigate('adminRecordsReleases')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white transition-all uppercase border border-white/20"
                style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
              >
                View All Releases
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading || !mp3File || !coverFile || !metadata.artist || !metadata.title}
                className="px-8 py-3 bg-hot hover:bg-hot/90 text-black transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontWeight: 900, fontSize: '12px', letterSpacing: '0.05em' }}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Record
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
