/**
 * hm/Button — HOTMESS Button Component
 * Variants: Primary, Secondary, Tertiary, Ghost
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface HMButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function HMButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: HMButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot';

  const variantStyles = {
    primary: 'bg-hot text-white border-2 border-hot hover:bg-heat hover:border-heat hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] hover:-translate-y-0.5 active:scale-[0.98]',
    secondary: 'bg-transparent text-hot border-2 border-hot hover:bg-hot/20 hover:border-heat hover:text-heat active:scale-[0.98]',
    tertiary: 'bg-transparent text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white active:scale-[0.98]',
    ghost: 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:text-white active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {!loading && icon}
      <span>{children}</span>
    </button>
  );
}

// Preset buttons with UX copy
export const ScanBeaconButton = (props: Omit<HMButtonProps, 'children'>) => (
  <HMButton {...props}>Scan Beacon</HMButton>
);

export const ListenLiveButton = (props: Omit<HMButtonProps, 'children'>) => (
  <HMButton {...props}>Listen Live</HMButton>
);

export const ShopHeatButton = (props: Omit<HMButtonProps, 'children'>) => (
  <HMButton {...props}>Shop the Heat</HMButton>
);

export const RedeemButton = (props: Omit<HMButtonProps, 'children'>) => (
  <HMButton {...props}>Redeem</HMButton>
);

export const ConsentButton = (props: Omit<HMButtonProps, 'children'>) => (
  <HMButton {...props}>I consent. Enter.</HMButton>
);
