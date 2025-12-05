/**
 * Responsive Stat Card Component
 * Used for dashboard stats, metrics, etc.
 */

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  color?: 'hot' | 'heat' | 'lime' | 'cyan';
  animate?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  color = 'hot',
  animate = false,
}: StatCardProps) {
  const colorClasses = {
    hot: 'text-hot border-hot/30 bg-hot/5',
    heat: 'text-heat border-heat/30 bg-heat/5',
    lime: 'text-neon-lime border-lime/30 bg-lime/5',
    cyan: 'text-cyan-static border-cyan-static/30 bg-cyan-static/5',
  };

  return (
    <div
      className={`rounded-3xl border p-4 sm:p-6 ${colorClasses[color]} ${
        animate ? 'hover:scale-105 transition-transform duration-200' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon size={24} className={colorClasses[color].split(' ')[0]} />
        {trend && (
          <span
            className={`px-2 py-1 rounded-full text-neon-lime bg-neon-lime/20`}
            style={{ fontSize: '10px', fontWeight: 700 }}
          >
            {trend}
          </span>
        )}
      </div>
      
      <div className={`mb-1 ${colorClasses[color].split(' ')[0]}`} style={{ fontSize: '28px', fontWeight: 700 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="text-white/80" style={{ fontSize: '12px', fontWeight: 700 }}>
        {label}
      </div>
      
      {sublabel && (
        <div className="text-white/60 mt-1" style={{ fontSize: '11px' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
