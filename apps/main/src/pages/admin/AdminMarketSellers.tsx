import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { CheckCircle, XCircle, AlertCircle, Store, ExternalLink } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';

interface AdminMarketSellersProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Seller {
  id: string;
  owner_id: string;
  display_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  white_label_enabled: boolean;
  created_at: string;
  updated_at: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'suspended';

export function AdminMarketSellers({ onNavigate }: AdminMarketSellersProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('pending');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      const mockSellers: Seller[] = [
        {
          id: '1',
          owner_id: 'user_abc123',
          display_name: 'VIBE SUPPLY',
          status: 'approved',
          stripe_account_id: 'acct_1234567890',
          stripe_onboarding_complete: true,
          white_label_enabled: true,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-16T14:20:00Z'
        },
        {
          id: '2',
          owner_id: 'user_def456',
          display_name: 'NIGHT CRAWLER GEAR',
          status: 'pending',
          stripe_account_id: null,
          stripe_onboarding_complete: false,
          white_label_enabled: false,
          created_at: '2024-11-28T09:15:00Z',
          updated_at: '2024-11-28T09:15:00Z'
        },
        {
          id: '3',
          owner_id: 'user_ghi789',
          display_name: 'KINK ESSENTIALS',
          status: 'suspended',
          stripe_account_id: 'acct_9876543210',
          stripe_onboarding_complete: true,
          white_label_enabled: false,
          created_at: '2024-09-10T16:45:00Z',
          updated_at: '2024-11-20T11:30:00Z'
        }
      ];
      setSellers(mockSellers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSellers = sellers.filter(s => statusFilter === 'all' || s.status === statusFilter);

  const handleApprove = (sellerId: string) => {
    console.log('Approve seller:', sellerId);
    // TODO: API call
  };

  const handleReject = (sellerId: string) => {
    console.log('Reject seller:', sellerId);
    // TODO: API call
  };

  const handleSuspend = (sellerId: string) => {
    console.log('Suspend seller:', sellerId);
    // TODO: API call
  };

  const statusConfig: Record<FilterStatus, { label: string; color: string; bg: string }> = {
    all: { label: 'ALL', color: 'text-white', bg: 'bg-white/10' },
    pending: { label: 'PENDING', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    approved: { label: 'APPROVED', color: 'text-green-500', bg: 'bg-green-500/10' },
    rejected: { label: 'REJECTED', color: 'text-red-500', bg: 'bg-red-500/10' },
    suspended: { label: 'SUSPENDED', color: 'text-orange-500', bg: 'bg-orange-500/10' }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminMarketSellers" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminMarketSellers" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
            ADMIN · COMMERCE
          </div>
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            SELLER MANAGEMENT
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Approve, reject, or suspend MessMarket sellers
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(Object.keys(statusConfig) as FilterStatus[]).map((status) => {
            const config = statusConfig[status];
            const count = status === 'all' ? sellers.length : sellers.filter(s => s.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? `${config.bg} ${config.color} border-2 ${config.color.replace('text-', 'border-')}`
                    : 'bg-white/5 border-2 border-white/20 text-white/60 hover:border-white/40'
                }`}
                style={{ fontWeight: 700, fontSize: '13px' }}
              >
                {config.label} <span className="ml-2">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && filteredSellers.length === 0 && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '24px' }}>
              NO SELLERS
            </h2>
            <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
              No sellers in {statusFilter} state
            </p>
          </div>
        )}

        {/* Sellers Table */}
        {!loading && filteredSellers.length > 0 && (
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      Seller
                    </th>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      Stripe Connect
                    </th>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      White-Label
                    </th>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-hot" />
                          <div>
                            <div className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{seller.display_name}</div>
                            <div className="text-white/40 font-mono mt-1" style={{ fontWeight: 400, fontSize: '11px' }}>
                              {seller.owner_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 border uppercase tracking-wider ${
                            statusConfig[seller.status].bg
                          } ${statusConfig[seller.status].color} border-${seller.status === 'approved' ? 'green' : seller.status === 'rejected' ? 'red' : seller.status === 'suspended' ? 'orange' : 'yellow'}-500/20`}
                          style={{ fontWeight: 700, fontSize: '11px' }}
                        >
                          {seller.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {seller.stripe_onboarding_complete ? (
                          <div className="space-y-1">
                            <div className="text-white/80 font-mono truncate max-w-[200px]" style={{ fontWeight: 400, fontSize: '11px' }}>
                              {seller.stripe_account_id}
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-green-500" style={{ fontWeight: 700, fontSize: '11px' }}>
                                COMPLETE
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>Not connected</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {seller.white_label_enabled ? (
                          <span className="text-hot uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
                            Enabled
                          </span>
                        ) : (
                          <span className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>Disabled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white/80" style={{ fontWeight: 400, fontSize: '13px' }}>
                          {new Date(seller.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                          {new Date(seller.created_at).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {seller.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(seller.id)}
                                className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-colors"
                                title="Approve Seller"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(seller.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                title="Reject Seller"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {seller.status === 'approved' && (
                            <button
                              onClick={() => handleSuspend(seller.id)}
                              className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-colors"
                              title="Suspend Seller"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate('vendorProfile', { id: seller.id })}
                            className="p-2 bg-white/10 hover:bg-hot/20 text-white/60 hover:text-hot transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-white/5 border border-white/10 p-6" style={{ fontWeight: 400, fontSize: '14px' }}>
          <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900, fontSize: '16px' }}>
            STATUS GUIDELINES
          </h3>
          <div className="space-y-2 text-white/60">
            <div><strong className="text-yellow-500">PENDING:</strong> New seller application awaiting review</div>
            <div><strong className="text-green-500">APPROVED:</strong> Seller can list and sell products</div>
            <div><strong className="text-red-500">REJECTED:</strong> Application denied, cannot sell</div>
            <div><strong className="text-orange-500">SUSPENDED:</strong> Temporarily blocked from selling</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
