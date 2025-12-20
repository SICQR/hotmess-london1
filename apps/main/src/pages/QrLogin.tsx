/**
 * QR Login Page (Desktop)
 * User scans QR with phone to authenticate
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, RefreshCw, ArrowLeft, Smartphone } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import QRCode from 'qrcode';

interface QrLoginProps {
  onNavigate: (route: RouteId) => void;
}

type QrStatus = 'init' | 'creating' | 'waiting' | 'pending' | 'approved' | 'expired' | 'error';

export function QrLogin({ onNavigate }: QrLoginProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<QrStatus>('init');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [error, setError] = useState<string>('');

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/auth`;

  // Debug log
  if (import.meta.env.DEV) {
    console.log('[QrLogin] Component mounted', { projectId, serverUrl });
  }

  async function createQR() {
    if (import.meta.env.DEV) {
      console.log('[QrLogin] Creating QR code...');
    }
    setStatus('creating');
    setError('');

    try {
      const res = await fetch(`${serverUrl}/qr/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();

      if (!json.ok) {
        setStatus('error');
        setError('Failed to generate QR code');
        return;
      }

      setToken(json.token);
      setExpiresAt(json.expiresAt);
      setStatus('waiting');

      // Generate QR code image
      const dataUrl = await QRCode.toDataURL(json.qrUrl, {
        margin: 1,
        scale: 8,
        color: {
          dark: '#FFFFFF',
          light: '#000000',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR create error:', err);
      setStatus('error');
      setError('Network error. Check your connection.');
    }
  }

  async function pollStatus(t: string) {
    try {
      const res = await fetch(`${serverUrl}/qr/status?token=${encodeURIComponent(t)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const json = await res.json();

      if (!json.ok) return;

      setStatus(json.status as QrStatus);

      if (json.status === 'approved') {
        // Consume the token to get session
        await consumeToken(t);
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }

  async function consumeToken(t: string) {
    try {
      const res = await fetch(`${serverUrl}/qr/consume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: t }),
      });

      const json = await res.json();

      if (!json.ok) {
        setStatus('error');
        setError('Failed to complete sign-in');
        return;
      }

      // Set Supabase session with the tokens
      const { supabase } = await import('../lib/supabase');
      await supabase.auth.setSession({
        access_token: json.accessToken,
        refresh_token: json.refreshToken,
      });

      // Navigate to profile
      setTimeout(() => {
        onNavigate('profile');
      }, 500);
    } catch (err) {
      console.error('Consume error:', err);
      setStatus('error');
      setError('Failed to complete sign-in');
    }
  }

  // Initial QR generation
  useEffect(() => {
    createQR();
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (!token || status === 'approved' || status === 'expired' || status === 'error') {
      return;
    }

    const interval = setInterval(() => {
      pollStatus(token);
    }, 1200);

    return () => clearInterval(interval);
  }, [token, status]);

  const getStatusMessage = () => {
    switch (status) {
      case 'creating':
        return 'Generating QR...';
      case 'waiting':
        return 'Scan with your phone';
      case 'pending':
        return 'Approve on your device';
      case 'approved':
        return 'Approved. Signing you in...';
      case 'expired':
        return 'QR code expired';
      case 'error':
        return error || 'Something went wrong';
      default:
        return '';
    }
  };

  const getTimeRemaining = () => {
    if (!expiresAt) return '';
    const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const seconds = Math.floor(remaining / 1000);
    return seconds > 0 ? `${seconds}s remaining` : 'Expired';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Back button */}
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-hotmess-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="uppercase tracking-wider text-sm">Back to login</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <QrCode className="w-12 h-12 text-hotmess-red" />
            <h1 className="text-white" style={{ fontWeight: 900 }}>
              QR Login
            </h1>
          </div>
          <div className="h-1 w-24 bg-hotmess-red mb-4" />
          <p className="text-hotmess-gray-300">
            Scan with your phone, approve, you're in.
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-hotmess-gray-900 border-2 border-hotmess-gray-700 p-8">
          {qrDataUrl ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative"
            >
              <img
                src={qrDataUrl}
                alt="QR code for login"
                className="w-full h-auto border-4 border-white"
              />
              
              {/* Status overlay for approved/expired */}
              {(status === 'approved' || status === 'expired' || status === 'error') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm"
                >
                  <div className="text-center">
                    {status === 'approved' && (
                      <div className="text-hotmess-green text-6xl mb-4">✓</div>
                    )}
                    {status === 'expired' && (
                      <div className="text-hotmess-yellow text-6xl mb-4">⏱</div>
                    )}
                    {status === 'error' && (
                      <div className="text-hotmess-red text-6xl mb-4">✕</div>
                    )}
                    <p className="text-white uppercase tracking-wider" style={{ fontWeight: 700 }}>
                      {getStatusMessage()}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-hotmess-gray-800">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-hotmess-gray-600 mx-auto mb-4 animate-spin" />
                <p className="text-hotmess-gray-500 uppercase tracking-wider text-sm">
                  Generating QR...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="mt-6 bg-hotmess-gray-900 border-2 border-hotmess-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-hotmess-red" />
              <span className="text-white uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
                {getStatusMessage()}
              </span>
            </div>
            {status === 'waiting' || status === 'pending' ? (
              <span className="text-hotmess-gray-400 text-xs uppercase tracking-wider">
                {getTimeRemaining()}
              </span>
            ) : null}
          </div>

          {/* Progress indicator */}
          {(status === 'waiting' || status === 'pending') && (
            <div className="mt-3 h-1 bg-hotmess-gray-800 overflow-hidden">
              <motion.div
                className="h-full bg-hotmess-red"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 90, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={createQR}
            disabled={status === 'creating' || status === 'approved'}
            className="bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-6 py-4 hover:border-hotmess-red transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 700 }}
          >
            <RefreshCw className="w-5 h-5 mx-auto mb-2" />
            Refresh QR
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-6 py-4 hover:border-hotmess-red transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700 }}
          >
            <ArrowLeft className="w-5 h-5 mx-auto mb-2" />
            Use Email
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-hotmess-purple/10 border border-hotmess-purple/30">
          <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>
            How it works
          </h3>
          <ol className="text-hotmess-gray-400 text-sm space-y-2">
            <li className="flex gap-3">
              <span className="text-hotmess-red" style={{ fontWeight: 900 }}>1.</span>
              <span>Open HOTMESS on your phone</span>
            </li>
            <li className="flex gap-3">
              <span className="text-hotmess-red" style={{ fontWeight: 900 }}>2.</span>
              <span>Scan this QR code</span>
            </li>
            <li className="flex gap-3">
              <span className="text-hotmess-red" style={{ fontWeight: 900 }}>3.</span>
              <span>Approve the sign-in</span>
            </li>
            <li className="flex gap-3">
              <span className="text-hotmess-red" style={{ fontWeight: 900 }}>4.</span>
              <span>You're signed in on both devices</span>
            </li>
          </ol>
        </div>

        {/* Security note */}
        <div className="mt-4 p-4 bg-hotmess-gray-900 border border-hotmess-gray-800">
          <p className="text-hotmess-gray-500 text-xs">
            <strong className="text-hotmess-gray-400">Security:</strong> QR codes expire in 90 seconds and can only be used once. Never share QR codes with anyone.
          </p>
        </div>
      </motion.div>
    </div>
  );
}