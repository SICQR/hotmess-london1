// components/auth/RegisterForm.tsx
// Registration form with Supabase auth

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
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
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (signUpError) {
        console.error('Registration error:', signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Registration successful:', data.user?.email);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error('Registration exception:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-hotmess-red/10 border border-hotmess-red/20 rounded-xl p-6 text-center space-y-3">
        <div className="text-2xl" style={{ fontWeight: 900 }}>
          ✅ WELCOME TO HOTMESS
        </div>
        <p className="text-sm text-white/80">
          Account created successfully. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="displayName" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
          Display Name (Optional)
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-hotmess-red transition-colors disabled:opacity-50"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
          Email *
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

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
          Password *
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
          Confirm Password *
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

      <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-white/60 space-y-2">
        <p>By creating an account, you confirm:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>You are 18+ years old</li>
          <li>You agree to our <a href="/legal/terms" className="text-hotmess-red underline">Terms of Service</a></li>
          <li>You accept our <a href="/legal/privacy" className="text-hotmess-red underline">Privacy Policy</a></li>
          <li>This is a men-only queer nightlife platform</li>
        </ul>
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
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      <div className="text-center">
        <a
          href="/login"
          className="text-sm text-white/60 hover:text-hotmess-red transition-colors"
        >
          Already have an account? <span className="underline">Sign in</span>
        </a>
      </div>
    </form>
  );
}
