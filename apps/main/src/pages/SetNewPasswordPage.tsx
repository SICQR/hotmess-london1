// HOTMESS LONDON - Set New Password Page
// User lands here after clicking password reset link in email

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface SetNewPasswordPageProps {
  onNavigate: (route: RouteId) => void;
}

export function SetNewPasswordPage({ onNavigate }: SetNewPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if we have a valid session (user clicked the email link)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Password updated successfully!');

      // Redirect to home after 2 seconds
      setTimeout(() => {
        onNavigate('home');
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Error state - invalid/expired link
  if (error) {
    return (
      <div className="bg-black min-h-screen w-full overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#FF1744', backgroundColor: 'rgba(255, 23, 68, 0.1)' }}>
              <AlertCircle className="w-12 h-12" style={{ color: '#FF1744' }} />
            </div>

            {/* Title */}
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Link Expired
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#FF1744' }} />

            {/* Message */}
            <p className="text-gray-300 mb-8">
              {error}
            </p>

            {/* Action */}
            <button
              onClick={() => onNavigate('passwordReset')}
              className="w-full px-6 py-5 transition-colors uppercase tracking-wider text-xl"
              style={{ 
                fontWeight: 900,
                backgroundColor: '#FF1744',
                color: '#000000'
              }}
            >
              Request New Link
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="mt-4 text-gray-500 hover:text-white transition-colors text-sm"
            >
              Back to Login
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="bg-black min-h-screen w-full overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-8">
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
              Password Updated!
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#00E676' }} />

            {/* Message */}
            <p className="text-gray-300 mb-8">
              Your password has been successfully updated. Redirecting you to HOTMESS...
            </p>

            <div className="animate-spin w-8 h-8 border-4 border-gray-700 border-t-white rounded-full mx-auto" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Main form
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
            Set New Password
          </h1>
          <div className="h-1 w-16 mb-4" style={{ backgroundColor: '#FF1744' }} />
          <p className="text-gray-300">
            Choose a strong password for your HOTMESS account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 text-white px-12 py-3 focus:outline-none transition-colors pr-12"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#3a3a3a',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF1744'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-2 text-white px-12 py-3 focus:outline-none transition-colors pr-12"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#3a3a3a',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF1744'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password strength indicator */}
          {password && (
            <div className="p-4 border" style={{ borderColor: '#3a3a3a', backgroundColor: '#1a1a1a' }}>
              <div className="text-sm text-gray-300 mb-2">Password strength:</div>
              <div className="flex gap-2">
                <div 
                  className="h-2 flex-1 rounded transition-colors"
                  style={{ 
                    backgroundColor: password.length >= 6 ? '#00E676' : '#3a3a3a'
                  }}
                />
                <div 
                  className="h-2 flex-1 rounded transition-colors"
                  style={{ 
                    backgroundColor: password.length >= 10 ? '#00E676' : '#3a3a3a'
                  }}
                />
                <div 
                  className="h-2 flex-1 rounded transition-colors"
                  style={{ 
                    backgroundColor: password.length >= 14 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#00E676' : '#3a3a3a'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {password.length < 6 && 'Too short'}
                {password.length >= 6 && password.length < 10 && 'Fair'}
                {password.length >= 10 && password.length < 14 && 'Good'}
                {password.length >= 14 && /[A-Z]/.test(password) && /[0-9]/.test(password) && 'Strong'}
              </p>
            </div>
          )}

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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
