// HOTMESS Button Component - Production Ready
// Matches Figma-level component blueprint spec

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function HotmessButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base =
    'px-5 h-11 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-white/10 hover:bg-white/20 text-white border border-white/5',
    secondary: 'border border-white/20 hover:bg-white/10 text-white bg-transparent',
    danger: 'bg-hot hover:bg-hot/90 text-white border border-hot',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
}
