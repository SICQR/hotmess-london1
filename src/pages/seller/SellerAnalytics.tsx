import { RouteId } from '../../lib/routes';
import { ArrowLeft, TrendingUp, DollarSign, Package, Users } from 'lucide-react';

interface SellerAnalyticsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function SellerAnalytics({ onNavigate }: SellerAnalyticsProps) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => onNavigate('sellerDashboard')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        BACK TO DASHBOARD
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <TrendingUp size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Analytics</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-6">
            <DollarSign size={32} className="text-hot mb-2" />
            <p className="text-white/60 uppercase mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>Revenue (30d)</p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>£0</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <Package size={32} className="text-hot mb-2" />
            <p className="text-white/60 uppercase mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>Orders (30d)</p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>0</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <Users size={32} className="text-hot mb-2" />
            <p className="text-white/60 uppercase mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>Customers (30d)</p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>0</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <TrendingUp size={32} className="text-hot mb-2" />
            <p className="text-white/60 uppercase mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>Conversion Rate</p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>0%</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white/5 border border-white/10 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>
            ANALYTICS COMING SOON
          </h2>
          <p className="text-white/60 max-w-md mx-auto" style={{ fontWeight: 400, fontSize: '14px' }}>
            Detailed sales analytics, customer insights, and performance metrics will be available here once you start making sales.
          </p>
        </div>
      </div>
    </div>
  );
}