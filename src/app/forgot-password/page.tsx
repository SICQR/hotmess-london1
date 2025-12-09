// app/forgot-password/page.tsx
// Password reset request page

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        console.error('Password reset error:', resetError);
        setError(resetError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Password reset email sent to:', email);
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Password reset exception:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            RESET PASSWORD
          </h1>
          <div className="text-sm opacity-80">Enter your email to receive reset instructions</div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-hotmess-red/10 border border-hotmess-red/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-hotmess-red" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl uppercase" style={{ fontWeight: 900 }}>
                  Check Your Email
                </h2>
                <p className="text-sm text-white/60">
                  We've sent password reset instructions to <span className="text-hotmess-red">{email}</span>
                </p>
                <p className="text-xs text-white/40">
                  Didn't receive it? Check your spam folder or try again in a few minutes.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-hotmess-red transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-white/60">
                Enter your email address and we'll send you a link to reset your password.
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-hotmess-red transition-colors disabled:opacity-50"
                  placeholder="your@email.com"
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-hotmess-red transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
