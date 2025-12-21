/**
 * QR Approve Page (Mobile)
 * User approves QR login from phone
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, X, Smartphone, Monitor } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../lib/supabase';

interface QrApproveProps {
  onNavigate: (route: RouteId) => void;
}

type ApprovalStatus = 'idle' | 'checking' | 'approving' | 'approved' | 'cancelled' | 'error';

export function QrApprove({ onNavigate }: QrApproveProps) {
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<ApprovalStatus>('idle');
  const [error, setError] = useState<string>('');
  const [expirySeconds, setExpirySeconds] = useState<number>(90);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/auth`;

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');

    if (!t) {
      setStatus('error');
      setError('Invalid QR code');
      return;
    }

    setToken(t);
    setStatus('idle');

    // Start countdown
    const interval = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If not logged in, redirect to login with return URL
    if (!authLoading && !user) {
      const returnUrl = encodeURIComponent(`/qr-approve?token=${token}`);
      onNavigate('login');
      // In a real app, you'd preserve the return URL
    }
  }, [user, authLoading, token]);

  async function handleApprove() {
    if (!user) {
      setError('You must be logged in to approve');
      return;
    }

    setStatus('approving');
    setError('');

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Session expired. Please log in again.');
        setStatus('error');
        return;
      }

      const res = await fetch(`${serverUrl}/qr/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const json = await res.json();

      if (!json.ok) {
        setStatus('error');
        
        switch (json.error) {
          case 'expired':
            setError('This QR code has expired');
            break;
          case 'not_found':
            setError('Invalid QR code');
            break;
          case 'not_pending':
            setError('This QR code has already been used');
            break;
          default:
            setError('Failed to approve sign-in');
        }
        return;
      }

      setStatus('approved');
    } catch (err) {
      console.error('Approve error:', err);
      setStatus('error');
      setError('Network error. Check your connection.');
    }
  }

  async function handleCancel() {
    setStatus('cancelled');

    try {
      await fetch(`${serverUrl}/qr/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error('Cancel error:', err);
    }

    // Navigate back after a moment
    setTimeout(() => {
      onNavigate('profile');
    }, 1500);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-hotmess-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-hotmess-gray-400 uppercase tracking-wider text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-hotmess-red mx-auto mb-6" />
          <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
            Sign In Required
          </h1>
          <p className="text-hotmess-gray-300 mb-6">
            You need to be signed in to approve QR login.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-hotmess-red text-black px-8 py-4 hover:bg-hotmess-red/80 transition-colors uppercase tracking-wider"
            style={{ fontWeight: 900 }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Success State */}
        {status === 'approved' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-hotmess-green/20 border-2 border-hotmess-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-hotmess-green" />
            </div>
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Approved!
            </h1>
            <div className="h-1 w-16 bg-hotmess-green mx-auto mb-4" />
            <p className="text-hotmess-gray-300 mb-6">
              You're now signed in on the other device. You can close this tab.
            </p>
            <button
              onClick={() => onNavigate('profile')}
              className="bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-8 py-4 hover:border-hotmess-green transition-colors uppercase tracking-wider"
              style={{ fontWeight: 700 }}
            >
              Go to Profile
            </button>
          </motion.div>
        )}

        {/* Cancelled State */}
        {status === 'cancelled' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-hotmess-yellow/20 border-2 border-hotmess-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-hotmess-yellow" />
            </div>
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Cancelled
            </h1>
            <div className="h-1 w-16 bg-hotmess-yellow mx-auto mb-4" />
            <p className="text-hotmess-gray-300">
              Sign-in request cancelled. Redirecting...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-hotmess-red/20 border-2 border-hotmess-red rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-hotmess-red" />
            </div>
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Failed
            </h1>
            <div className="h-1 w-16 bg-hotmess-red mx-auto mb-4" />
            <p className="text-hotmess-gray-300 mb-6">
              {error || 'Something went wrong'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-8 py-4 hover:border-hotmess-red transition-colors uppercase tracking-wider"
                style={{ fontWeight: 700 }}
              >
                Try Email Login
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full bg-transparent text-hotmess-gray-400 px-8 py-4 hover:text-white transition-colors uppercase tracking-wider text-sm"
                style={{ fontWeight: 700 }}
              >
                Go Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Approval Screen */}
        {status !== 'approved' && status !== 'cancelled' && status !== 'error' && (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-24 h-24 bg-hotmess-red/20 border-2 border-hotmess-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-hotmess-red" />
              </div>
              <h1 className="text-white mb-2" style={{ fontWeight: 900 }}>
                Approve Sign-In
              </h1>
              <div className="h-1 w-16 bg-hotmess-red mx-auto mb-4" />
              <p className="text-hotmess-gray-300">
                This will sign you in on the other device.
              </p>
            </div>

            {/* Device info */}
            <div className="bg-hotmess-gray-900 border-2 border-hotmess-gray-700 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Monitor className="w-10 h-10 text-hotmess-red" />
                </div>
                <div className="flex-1">
                  <p className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>
                    Desktop Device
                  </p>
                  <p className="text-hotmess-gray-400 text-sm">
                    Requesting sign-in approval
                  </p>
                </div>
              </div>

              {/* Countdown */}
              {expirySeconds > 0 ? (
                <div className="mt-4 pt-4 border-t border-hotmess-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-hotmess-gray-400 text-sm uppercase tracking-wider">
                      Time remaining
                    </span>
                    <span className="text-white" style={{ fontWeight: 700 }}>
                      {expirySeconds}s
                    </span>
                  </div>
                  <div className="h-1 bg-hotmess-gray-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-hotmess-red"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 90, ease: 'linear' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-hotmess-gray-800">
                  <p className="text-hotmess-yellow text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    ⏱ Expired
                  </p>
                </div>
              )}
            </div>

            {/* User confirmation */}
            <div className="bg-hotmess-purple/10 border border-hotmess-purple/30 p-4 mb-6">
              <p className="text-hotmess-gray-300 text-sm">
                Signed in as{' '}
                <span className="text-white" style={{ fontWeight: 700 }}>
                  {user.displayName || user.email}
                </span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleApprove}
                disabled={status === 'approving' || expirySeconds === 0}
                className="w-full bg-hotmess-red text-black px-8 py-4 hover:bg-hotmess-red/80 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 900 }}
              >
                {status === 'approving' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </span>
                ) : (
                  'Approve Sign-In'
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={status === 'approving'}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-8 py-4 hover:border-hotmess-yellow transition-colors uppercase tracking-wider disabled:opacity-50"
                style={{ fontWeight: 700 }}
              >
                Cancel
              </button>
            </div>

            {/* Security notice */}
            <div className="mt-6 p-4 bg-hotmess-gray-900 border border-hotmess-gray-800">
              <p className="text-hotmess-gray-500 text-xs">
                <strong className="text-hotmess-gray-400">Security:</strong> Only approve if you initiated this sign-in request. This QR expires in 90 seconds.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
