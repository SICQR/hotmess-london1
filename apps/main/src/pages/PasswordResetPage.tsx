// HOTMESS LONDON - Password Reset Flow
// Request password reset link

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface PasswordResetPageProps {
  onNavigate: (route: RouteId) => void;
}

export function PasswordResetPage({ onNavigate }: PasswordResetPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?route=setNewPassword`,
      });

      if (error) throw error;

      setSent(true);
      toast.success('Password reset link sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-black min-h-screen w-full overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Success State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#00E676' }}
            >
              <Check className="w-12 h-12 text-black" strokeWidth={3} />
            </motion.div>

            {/* Title */}
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Check Your Email
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#00E676' }} />

            {/* Message */}
            <p className="text-gray-300 mb-8 text-lg">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>

            <div className="mb-8 p-4 border border-yellow-500/30 text-left" style={{ backgroundColor: 'rgba(255, 235, 59, 0.1)' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-bold text-white mb-1">Didn’t get it?</p>
                  <p>Check your spam folder, and make sure you typed the right email address.</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-zinc-900 border-2 p-6 mb-8 text-left" style={{ borderColor: '#00E676' }}>
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#00E676' }} />
                <div>
                  <div className="text-white font-bold mb-2">Next Steps:</div>
                  <ol className="text-gray-300 space-y-2 text-sm list-decimal list-inside">
                    <li>Check your inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Enter your new password</li>
                  </ol>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <p className="text-gray-400 text-sm">
                  The link expires in 1 hour. If you don't receive it, you can request a new one.
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="w-full mb-4 px-6 py-4 transition-colors uppercase tracking-wider text-lg"
              style={{ 
                fontWeight: 900,
                backgroundColor: '#1a1a1a',
                border: '2px solid #3a3a3a',
                color: '#ffffff'
              }}
            >
              Send Another Link
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              Back to Login
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full overflow-y-auto">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white mb-2" style={{ fontWeight: 900 }}>
            Reset Password
          </h1>
          <div className="h-1 w-16 mb-4" style={{ backgroundColor: '#FF1744' }} />
          <p className="text-gray-300">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mb-6 p-4 border border-yellow-500/30" style={{ backgroundColor: 'rgba(255, 235, 59, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-bold text-white mb-1">Password reset email</p>
              <p>We’ll send a secure link. If it doesn’t arrive, check spam or try again.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 text-white px-12 py-3 focus:outline-none transition-colors"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#3a3a3a',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF1744'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-5 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed text-xl hover:opacity-80"
              style={{ 
                fontWeight: 900,
                backgroundColor: '#FF1744',
                color: '#000000'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-gray-400 mb-4">
            Remember your password?
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="hover:text-white transition-colors uppercase tracking-wider"
            style={{ 
              fontWeight: 700,
              color: '#FF1744'
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
