/**
 * BEACON ANALYTICS — Deep dive analytics for individual beacons
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, TrendingUp, Users, Zap, MapPin, Clock,
  Calendar, Eye, Target, BarChart3, Download
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Beacon, BEACON_TYPE_META, BeaconStats } from '../lib/beacon-system';
import { RouteId } from '../lib/routes';

interface BeaconAnalyticsProps {
  beaconCode: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function BeaconAnalytics({ beaconCode, onNavigate }: BeaconAnalyticsProps) {
  const [beacon, setBeacon] = useState<Beacon | null>(null);
  const [stats, setStats] = useState<BeaconStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [beaconCode, timeRange]);

  async function loadAnalytics() {
    // TODO: Replace with actual API call
    setLoading(true);
    
    // Mock data for now
    setTimeout(() => {
      setStats({
        beaconId: 'beacon-1',
        totalScans: 847,
        uniqueScans: 623,
        xpAwarded: 8470,
        conversionRate: 34.5,
        topCities: [
          { city: 'London', count: 623 },
          { city: 'Manchester', count: 124 },
          { city: 'Birmingham', count: 67 },
          { city: 'Brighton', count: 33 },
        ],
        scansByDay: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          count: Math.floor(Math.random() * 50) + 10,
        })),
        peakHours: [0, 2, 5, 8, 15, 42, 67, 89, 92, 78, 45, 32, 28, 35, 48, 62, 78, 95, 88, 82, 91, 98, 85, 45],
      });
      setLoading(false);
    }, 500);
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Loading analytics...</div>
      </div>
    );
  }

  const COLORS = ['#FF1744', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('beaconsManage')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-5" />
              <span className="text-[14px] font-bold uppercase tracking-wider">Back</span>
            </button>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                <Download className="size-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Beacon Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="text-[48px]">📍</div>
            <div>
              <h1 className="text-white mb-1">
                Beacon Analytics
              </h1>
              <p className="text-[14px] text-white/60 font-mono">{beaconCode}</p>
            </div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                timeRange === range
                  ? 'bg-hotmess-red text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range}`}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Eye />}
            label="Total Scans"
            value={stats.totalScans.toLocaleString()}
            trend="+12.5%"
            trendUp
          />
          <MetricCard
            icon={<Users />}
            label="Unique Users"
            value={stats.uniqueScans.toLocaleString()}
            trend="+8.3%"
            trendUp
          />
          <MetricCard
            icon={<Zap />}
            label="XP Awarded"
            value={stats.xpAwarded.toLocaleString()}
            trend="+15.2%"
            trendUp
          />
          <MetricCard
            icon={<Target />}
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            trend="+2.1%"
            trendUp
          />
        </div>

        {/* Scans Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/10 rounded-lg p-6"
        >
          <h2 className="text-[18px] font-bold text-white mb-6">Scans Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.scansByDay}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF1744" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                stroke="#ffffff60"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#ffffff60"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000', 
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#FF1744" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScans)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Peak Hours Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-lg p-6"
        >
          <h2 className="text-[18px] font-bold text-white mb-6">Peak Scanning Hours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.peakHours.map((count, hour) => ({ hour: `${hour}:00`, count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="hour" 
                stroke="#ffffff60"
                style={{ fontSize: '10px' }}
                interval={2}
              />
              <YAxis 
                stroke="#ffffff60"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000', 
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#FF1744" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/10 rounded-lg p-6"
        >
          <h2 className="text-[18px] font-bold text-white mb-6">Top Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.topCities}
                  dataKey="count"
                  nameKey="city"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.city}
                >
                  {stats.topCities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* City List */}
            <div className="space-y-3">
              {stats.topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[14px] text-white">{city.city}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[16px] font-bold text-white">{city.count}</div>
                    <div className="text-[11px] text-white/40">
                      {((city.count / stats.totalScans) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <InsightCard
            icon={<Clock />}
            title="Avg. Scan Time"
            value="22:34"
            description="Most scans happen late evening"
          />
          <InsightCard
            icon={<Calendar />}
            title="Best Day"
            value="Saturday"
            description="48% of weekly scans"
          />
          <InsightCard
            icon={<TrendingUp />}
            title="Growth Rate"
            value="+23.4%"
            description="vs. previous period"
          />
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendUp 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend: string; 
  trendUp: boolean;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-hotmess-red">{icon}</div>
        <span className="text-[13px] text-white/60 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-[32px] font-black text-white mb-1">{value}</div>
      <div className={`text-[13px] font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trend} <span className="text-white/40">from last period</span>
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
  description
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-hotmess-purple">{icon}</div>
        <span className="text-[13px] text-white/60 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-[24px] font-black text-white mb-1">{value}</div>
      <p className="text-[13px] text-white/40">{description}</p>
    </div>
  );
}
