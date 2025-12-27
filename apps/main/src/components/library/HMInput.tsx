/**
 * hm/Input — HOTMESS Input Component
 * Variants: Text, Password, Email, Code
 */

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputVariant = 'text' | 'password' | 'email' | 'code';

interface HMInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  success?: string;
}

export function HMInput({
  variant = 'text',
  label,
  error,
  success,
  className = '',
  ...props
}: HMInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const baseStyles = 'w-full px-4 py-3 bg-charcoal border-2 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-hot focus:shadow-[0_0_10px_rgba(231,15,60,0.3)]';

  const stateStyles = error
    ? 'border-red-500 animate-shake'
    : success
    ? 'border-neon-lime'
    : 'border-gray-800 hover:border-gray-700';

  const inputType =
    props.type ??
    (variant === 'password' && !showPassword
      ? 'password'
      : variant === 'password'
        ? 'text'
        : variant);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          className={`${baseStyles} ${stateStyles} ${variant === 'password' ? 'pr-12' : ''} ${variant === 'code' ? 'text-center text-2xl tracking-widest' : ''} ${className}`}
          {...props}
        />
        
        {variant === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-neon-lime">{success}</p>
      )}
    </div>
  );
}

// Shake animation for errors
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.animate-shake {
  animation: shake 0.3s;
}
`;

// Inject shake animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shakeKeyframes;
  document.head.appendChild(style);
}
