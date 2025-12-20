// components/auth/LoginForm.tsx
// Login form with Supabase auth

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export function LoginForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Login successful:', data.user?.email);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>
          Email
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
          Password
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
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign in</span>
        )}
      </button>

      <div className="text-center space-y-3">
        <a
          href="/register"
          className="block text-sm text-white/60 hover:text-hotmess-red transition-colors"
        >
          Don't have an account? <span className="underline">Register</span>
        </a>
        <a
          href="/forgot-password"
          className="block text-sm text-white/60 hover:text-hotmess-red transition-colors"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}
