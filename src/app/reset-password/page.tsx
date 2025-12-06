// app/reset-password/page.tsx
// Password reset confirmation page

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setValidToken(!!session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError(updateError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Password updated successfully');
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password update exception:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verifying reset link...</span>
        </div>
      </main>
    );
  }

  if (validToken === false) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-5xl">❌</div>
          <h1 className="text-3xl uppercase" style={{ fontWeight: 900 }}>
            Invalid Reset Link
          </h1>
          <p className="text-white/60">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="inline-block bg-hotmess-red hover:bg-red-600 text-white px-6 py-3 rounded-xl uppercase tracking-wide transition-all"
            style={{ fontWeight: 900 }}
          >
            Request New Link
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            NEW PASSWORD
          </h1>
          <div className="text-sm opacity-80">Choose a strong password for your account</div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl uppercase" style={{ fontWeight: 900 }}>
                  Password Updated!
                </h2>
                <p className="text-sm text-white/60">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-hotmess-red transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                  minLength={8}
                />
                <p className="text-xs text-white/50">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-hotmess-red transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-hotmess-red hover:bg-red-600 text-white px-6 py-3 rounded-xl uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontWeight: 900 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
