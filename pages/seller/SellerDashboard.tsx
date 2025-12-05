import { useState, useEffect } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { Plus } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface SellerDashboardProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface SellerStats {
  totalSales: number;
  pendingPayouts: number;
  activeListings: number;
  totalListings: number;
  views: number;
  conversionRate: number;
  totalOrders: number;
  pendingShipments: number;
  completedOrders: number;
  sellerStatus: string;
  stripeConnected: boolean;
  stripeAccountId: string | null;
  recentOrders: Array<{
    id: string;
    listing_id: string;
    buyer_id: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    type: 'action' | 'info' | 'warning';
    priority: 'high' | 'medium' | 'low';
    cta?: {
      label: string;
      route: RouteId;
    };
  }>;
}

export function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setError('Please sign in to view your seller dashboard');
        setLoading(false);
        return;
      }

      // Fetch real dashboard stats from backend
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/seller-dashboard`;
      const response = await fetch(`${API_BASE}/dashboard/stats/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('No seller account found. Please apply to become a seller.');
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load dashboard');
      }

      const data = await response.json();
      
      if (!data.success || !data.stats) {
        throw new Error('Invalid response from server');
      }

      setStats(data.stats);
      setLoading(false);
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout currentRoute="sellerDashboard" onNavigate={onNavigate}>
        <LoadingState />
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout currentRoute="sellerDashboard" onNavigate={onNavigate}>
        <ErrorState message={error} onRetry={loadDashboard} />
      </SellerLayout>
    );
  }

  if (!stats) {
    return (
      <SellerLayout currentRoute="sellerDashboard" onNavigate={onNavigate}>
        <div className="text-center py-12">
          <p className="text-white/60 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
            No seller data available
          </p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout currentRoute="sellerDashboard" onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header - Figma Match */}
        <div className="mb-8">
          <div className="h-[43.195px] relative w-full">
            <p 
              className="absolute font-['Inter'] left-0 not-italic text-white top-0 uppercase whitespace-pre"
              style={{ fontWeight: 900, fontSize: '48px', lineHeight: '43.2px', letterSpacing: '-1.5684px' }}
            >
              SELLER DASHBOARD
            </p>
          </div>
          <div className="h-[22.398px] relative w-full mt-2">
            <p 
              className="absolute font-['Inter'] left-0 not-italic text-[rgba(255,255,255,0.6)] top-[0.5px] uppercase whitespace-pre"
              style={{ fontWeight: 700, fontSize: '14px', lineHeight: '22.4px', letterSpacing: '0.5496px' }}
            >
              Manage your MessMarket presence
            </p>
          </div>
        </div>

        {/* Create New Listing Button - Exact Figma Gradient */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('sellerListingCreate')}
            className="bg-gradient-to-b from-[#e70f3c] to-[rgba(0,0,0,0)] flex gap-[12px] h-[76px] items-center justify-center relative rounded-[10px] w-full hover:from-[#ff1a47] transition-all"
          >
            <div className="relative shrink-0 size-[24px]">
              <Plus className="text-white" size={24} strokeWidth={2} />
            </div>
            <div className="h-[28px] relative shrink-0">
              <p 
                className="font-['Inter'] text-center text-white"
                style={{ fontWeight: 400, fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.6092px' }}
              >
                CREATE NEW LISTING
              </p>
            </div>
          </button>
        </div>

        {/* Stats Grid - 4 columns exactly like Figma */}
        <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] h-[155.5px] mb-6">
          {/* Stat Card 1: Total Sales */}
          <div className="bg-[rgba(255,255,255,0.05)] relative">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="size-full">
              <div className="box-border flex flex-col items-start pb-px pt-[25px] px-[25px] h-full">
                <div className="h-[16.5px] relative w-full mb-2">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-[rgba(255,255,255,0.6)] top-[0.5px] uppercase"
                    style={{ fontWeight: 700, fontSize: '11px', lineHeight: '16.5px', letterSpacing: '0.6145px' }}
                  >
                    Total Sales
                  </p>
                </div>
                <div className="h-[48px] relative w-full">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-white top-0"
                    style={{ fontWeight: 900, fontSize: '32px', lineHeight: '48px', letterSpacing: '0.2463px' }}
                  >
                    £{stats.totalSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Pending Payouts */}
          <div className="bg-[rgba(255,255,255,0.05)] relative">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="size-full">
              <div className="box-border flex flex-col items-start pb-px pt-[25px] px-[25px] h-full">
                <div className="h-[16.5px] relative w-full mb-2">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-[rgba(255,255,255,0.6)] top-[0.5px] uppercase"
                    style={{ fontWeight: 700, fontSize: '11px', lineHeight: '16.5px', letterSpacing: '0.6145px' }}
                  >
                    Pending Payouts
                  </p>
                </div>
                <div className="h-[48px] relative w-full">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-white top-0"
                    style={{ fontWeight: 900, fontSize: '32px', lineHeight: '48px', letterSpacing: '0.2463px' }}
                  >
                    £{stats.pendingPayouts.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 3: Active Listings */}
          <div className="bg-[rgba(255,255,255,0.05)] relative">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="size-full">
              <div className="box-border flex flex-col items-start pb-px pt-[25px] px-[25px] h-full">
                <div className="h-[16.5px] relative w-full mb-2">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-[rgba(255,255,255,0.6)] top-[0.5px] uppercase"
                    style={{ fontWeight: 700, fontSize: '11px', lineHeight: '16.5px', letterSpacing: '0.6145px' }}
                  >
                    Active Listings
                  </p>
                </div>
                <div className="h-[48px] relative w-full">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-white top-0"
                    style={{ fontWeight: 900, fontSize: '32px', lineHeight: '48px', letterSpacing: '0.2463px' }}
                  >
                    {stats.activeListings}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 4: Total Views */}
          <div className="bg-[rgba(255,255,255,0.05)] relative">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="size-full">
              <div className="box-border flex flex-col items-start pb-px pt-[25px] px-[25px] h-full">
                <div className="h-[16.5px] relative w-full mb-2">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-[rgba(255,255,255,0.6)] top-[0.5px] uppercase"
                    style={{ fontWeight: 700, fontSize: '11px', lineHeight: '16.5px', letterSpacing: '0.6145px' }}
                  >
                    Total Views (7d)
                  </p>
                </div>
                <div className="h-[48px] relative w-full">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-white top-0"
                    style={{ fontWeight: 900, fontSize: '32px', lineHeight: '48px', letterSpacing: '0.2463px' }}
                  >
                    {stats.views}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks & Notifications - Figma Match */}
        {stats.tasks && stats.tasks.length > 0 && (
          <div className="bg-[rgba(255,255,255,0.05)] relative mb-6">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="size-full">
              <div className="box-border flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px]">
                {/* Heading */}
                <div className="h-[20px] relative w-full">
                  <p 
                    className="absolute font-['Inter'] left-0 not-italic text-white top-0 uppercase"
                    style={{ fontWeight: 900, fontSize: '20px', lineHeight: '20px', letterSpacing: '0.5508px' }}
                  >
                    TASKS & NOTIFICATIONS
                  </p>
                </div>

                {/* Task Items */}
                <div className="flex flex-col gap-[12px] w-full">
                  {stats.tasks.map((task) => (
                    <div key={task.id} className="bg-black h-auto min-h-[68px] relative w-full">
                      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
                      
                      {/* Warning Icon */}
                      <div className="absolute left-[17px] size-[20px] top-[19px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          <g clipPath="url(#clip0_task)">
                            <path d="M8.57465 3.21652L1.51632 14.9999C1.37079 15.2519 1.29379 15.5377 1.29298 15.8288C1.29216 16.1198 1.36756 16.406 1.51167 16.6588C1.65579 16.9116 1.86359 17.1223 2.11441 17.2702C2.36523 17.4181 2.6502 17.498 2.94132 17.4999H17.058C17.3491 17.498 17.6341 17.4181 17.8849 17.2702C18.1357 17.1223 18.3435 16.9116 18.4876 16.6588C18.6317 16.406 18.7071 16.1198 18.7063 15.8288C18.7055 15.5377 18.6285 15.2519 18.483 14.9999L11.4247 3.21652C11.2762 2.97174 11.0669 2.76925 10.8173 2.62872C10.5677 2.48819 10.2862 2.41437 9.99965 2.41437C9.71308 2.41437 9.43163 2.48819 9.18202 2.62872C8.93241 2.76925 8.72312 2.97174 8.57465 3.21652V3.21652Z" stroke="#F0B100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d="M10 6.66667V10" stroke="#F0B100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d="M10 13.3333H10.0083" stroke="#F0B100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          </g>
                          <defs>
                            <clipPath id="clip0_task">
                              <rect fill="white" height="20" width="20" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

                      {/* Task Text */}
                      <div className="absolute left-[53px] top-[17px] right-[170px]">
                        <p 
                          className="font-['Inter'] not-italic text-[rgba(255,255,255,0.8)]"
                          style={{ fontWeight: 400, fontSize: '14px', lineHeight: '22.4px', letterSpacing: '-0.2904px' }}
                        >
                          {task.title}
                        </p>
                      </div>

                      {/* CTA Button */}
                      {task.cta && (
                        <button
                          onClick={() => onNavigate(task.cta!.route)}
                          className="absolute right-[25px] top-[17px] h-[34px] px-4 hover:bg-white/10 transition-all"
                        >
                          <p 
                            className="font-['Inter'] text-center text-white uppercase"
                            style={{ fontWeight: 700, fontSize: '12px', lineHeight: '18px', letterSpacing: '0.6px' }}
                          >
                            {task.cta.label}
                          </p>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links - 3 Buttons in Row */}
        <div className="h-[185px] relative w-full">
          {/* MY LISTINGS */}
          <button
            onClick={() => onNavigate('sellerListings')}
            className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[185px] left-0 top-0 w-[calc(33.33%-12px)] hover:border-hot transition-all"
          >
            <div className="absolute left-[24px] size-[32px] top-[24px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M4 12L16 5.33334L28 12L16 18.6667L4 12Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d="M16 29.3333V16" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d="M28 20V12L16 18.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d="M10 5.69336L22 12.56" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </svg>
            </div>
            <div className="absolute h-[48px] left-[24px] top-[68px]">
              <p 
                className="font-['Inter'] not-italic text-white uppercase"
                style={{ fontWeight: 900, fontSize: '16px', lineHeight: '24px', letterSpacing: '0.4875px' }}
              >
                MY LISTINGS
              </p>
            </div>
            <div className="absolute h-[39px] left-[24px] top-[120px]">
              <p 
                className="font-['Inter'] not-italic text-[rgba(255,255,255,0.6)]"
                style={{ fontWeight: 400, fontSize: '13px', lineHeight: '19.5px', letterSpacing: '-0.2362px' }}
              >
                Manage your products
              </p>
            </div>
          </button>

          {/* ORDERS */}
          <button
            onClick={() => onNavigate('sellerOrders')}
            className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[185px] left-[calc(33.33%)] top-0 w-[calc(33.33%-12px)] hover:border-hot transition-all"
          >
            <div className="pt-[37px] px-[25px] pb-px">
              <div className="h-[32px] relative w-full mb-3">
                <p 
                  className="font-['Inter'] text-white"
                  style={{ fontWeight: 400, fontSize: '24px', lineHeight: '32px', letterSpacing: '-0.0897px' }}
                >
                  📦
                </p>
              </div>
              <div className="h-[24px] relative w-full mb-3">
                <p 
                  className="font-['Inter'] not-italic text-white uppercase"
                  style={{ fontWeight: 900, fontSize: '16px', lineHeight: '24px', letterSpacing: '0.4875px' }}
                >
                  ORDERS
                </p>
              </div>
              <div className="h-[39px] relative w-full">
                <p 
                  className="font-['Inter'] not-italic text-[rgba(255,255,255,0.6)]"
                  style={{ fontWeight: 400, fontSize: '13px', lineHeight: '19.5px', letterSpacing: '-0.2362px' }}
                >
                  Process and ship orders
                </p>
              </div>
            </div>
          </button>

          {/* PAYOUTS */}
          <button
            onClick={() => onNavigate('sellerPayouts')}
            className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[185px] left-[calc(66.67%)] top-0 w-[calc(33.33%-12px)] hover:border-hot transition-all"
          >
            <div className="absolute left-[24px] size-[32px] top-[36px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M16 2.66667V29.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d="M22.6667 6.66667H12.8333C11.7282 6.66667 10.6685 7.10566 9.88706 7.88706C9.10566 8.66846 8.66667 9.72826 8.66667 10.8333C8.66667 11.9384 9.10566 12.9982 9.88706 13.7796C10.6685 14.561 11.7282 15 12.8333 15H19.1667C20.2717 15 21.3315 15.439 22.1129 16.2204C22.8943 17.0018 23.3333 18.0616 23.3333 19.1667C23.3333 20.2717 22.8943 21.3315 22.1129 22.1129C21.3315 22.8943 20.2717 23.3333 19.1667 23.3333H8" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </svg>
            </div>
            <div className="absolute h-[24px] left-[24px] top-[80px]">
              <p 
                className="font-['Inter'] not-italic text-white uppercase"
                style={{ fontWeight: 900, fontSize: '16px', lineHeight: '24px', letterSpacing: '0.4875px' }}
              >
                PAYOUTS
              </p>
            </div>
            <div className="absolute h-[39px] left-[24px] top-[108px]">
              <p 
                className="font-['Inter'] not-italic text-[rgba(255,255,255,0.6)]"
                style={{ fontWeight: 400, fontSize: '13px', lineHeight: '19.5px', letterSpacing: '-0.2362px' }}
              >
                View payment history
              </p>
            </div>
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}
