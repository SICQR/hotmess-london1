import { RouteId } from '../lib/routes';
import { ArrowLeft, Upload } from 'lucide-react';

interface RecordsAdminUploadProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function RecordsAdminUpload({ onNavigate }: RecordsAdminUploadProps) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => onNavigate('records')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        BACK TO RECORDS
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload size={32} className="text-hotmess-red" />
            <h1 className="text-4xl uppercase">Upload Records</h1>
          </div>
          <p className="text-zinc-400 mb-8">Admin panel for uploading new records to the platform.</p>
          <p className="text-zinc-500 text-sm">This feature is coming soon.</p>
        </div>
      </div>
    </div>
  );
}
