/**
 * Badge component for achievements, status indicators, etc.
 */

import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  icon?: LucideIcon;
  label: string;
  variant?: 'default' | 'hot' | 'heat' | 'lime' | 'cyan' | 'locked';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function Badge({
  icon: Icon,
  label,
  variant = 'default',
  size = 'md',
  pulse = false,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    hot: 'bg-hot/20 text-hot border-hot neon-border',
    heat: 'bg-heat/20 text-heat border-heat',
    lime: 'bg-neon-lime/20 text-neon-lime border-neon-lime',
    cyan: 'bg-cyan-static/20 text-cyan-static border-cyan-static',
    locked: 'bg-gray-900 text-gray-600 border-gray-800 opacity-50',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 border rounded-full uppercase tracking-wider transition-all ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${pulse ? 'beacon-flare' : ''}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />}
      <span>{label}</span>
    </div>
  );
}
