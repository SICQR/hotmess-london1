/**
 * Toast notification component
 * Uses design system tokens for all copy
 */

import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NOTIFICATIONS } from '../design-system/tokens';

type ToastType = 'success' | 'warning' | 'error';

interface ToastProps {
  type: ToastType;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Use token if no custom message provided
  const displayMessage = message || NOTIFICATIONS[type].default;

  const styles = {
    success: {
      bg: 'bg-green-950/90',
      border: 'border-green-600',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-orange-950/90',
      border: 'border-orange-600',
      text: 'text-orange-400',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-red-950/90',
      border: 'border-red-600',
      text: 'text-red-400',
      icon: XCircle,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`fixed top-20 right-6 z-50 max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`${style.bg} ${style.border} border backdrop-blur-lg p-4 flex items-start gap-3 shadow-xl`}>
        <Icon className={style.text} size={20} />
        <p className="flex-1 text-white" style={{ fontSize: '14px' }}>{displayMessage}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * Toast manager hook
 */
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; type: ToastType; message?: string }>>([]);

  const show = (type: ToastType, message?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const remove = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    success: (message?: string) => show('success', message),
    warning: (message?: string) => show('warning', message),
    error: (message?: string) => show('error', message),
    toasts,
    remove,
  };
}