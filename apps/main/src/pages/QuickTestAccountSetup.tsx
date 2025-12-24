/**
 * HOTMESS LONDON - Quick Test Account Setup
 * 
 * Quick page to create a test account for payment testing
 */

import { useState } from 'react';
import { Card } from '../components/design-system/Card';
import { HMButton } from '../components/library/HMButton';
import { supabase } from '../lib/supabase';

export default function QuickTestAccountSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const createTestAccount = async () => {
    setLoading(true);
    setError(null);

    const email = (document.getElementById('login-email') as HTMLInputElement)?.value?.trim();
    const password = (document.getElementById('login-password') as HTMLInputElement)?.value;

    if (!email || !password) {
      setLoading(false);
      setError('Enter an email + password first.');
      return;
    }

    try {
      const emailRedirectTo = `${window.location.origin}/?route=login&confirmed=1`;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: 'Test User'
          },
          emailRedirectTo,
        }
      });

      if (signUpError) throw signUpError;

      setCredentials({ email, password });
      setSuccess(true);
    } catch (err: any) {
      console.error('Error creating test account:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const loginExisting = async () => {
    setLoading(true);
    setError(null);

    const email = (document.getElementById('login-email') as HTMLInputElement)?.value;
    const password = (document.getElementById('login-password') as HTMLInputElement)?.value;

    try {
      console.log('🔐 Attempting login...', { email });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      console.log('✅ Login successful!', {
        hasSession: !!data.session,
        hasUser: !!data.user,
        hasAccessToken: !!data.session?.access_token,
        userId: data.user?.id
      });

      // Verify session is stored
      const { data: verifyData } = await supabase.auth.getSession();
      console.log('🔍 Session verification:', {
        hasSession: !!verifyData.session,
        hasAccessToken: !!verifyData.session?.access_token
      });

      // Check localStorage
      const keys = Object.keys(localStorage);
      const authKeys = keys.filter(k => k.includes('auth') || k.startsWith('sb-'));
      console.log('💾 localStorage auth keys:', authKeys);

      alert('✅ Login successful! Check console for session details. Now go to ?route=sellerListingsNew');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl mb-2 text-center">🎫 Quick Test Setup</h1>
        <p className="text-gray-400 text-center mb-6">
          Create a test account to test the ticket purchase flow
        </p>

        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-xl mb-4">Account Created!</h2>
            <div className="bg-gray-900 p-4 rounded-lg mb-4 text-left">
              <p className="text-sm text-gray-400 mb-1">Email:</p>
              <p className="font-mono text-sm mb-3">{credentials.email}</p>
              <p className="text-sm text-gray-400 mb-1">Password:</p>
              <p className="font-mono text-sm">{credentials.password}</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Check your email to confirm the account, then log in.
            </p>
            <HMButton
              onClick={() => {
                window.location.href = '/?route=login';
              }}
              className="w-full"
            >
              Go to Login
            </HMButton>
          </div>
        ) : (
          <>
            {/* Quick Create */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-lg mb-3">Option 1: Quick Create</h3>
              <p className="text-sm text-gray-400 mb-4">
                Creates an account and sends a confirmation email.
              </p>
              <HMButton
                onClick={createTestAccount}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating Account...' : 'Create Account (send confirmation email)'}
              </HMButton>
            </div>

            {/* Manual Login */}
            <div>
              <h3 className="text-lg mb-3">Option 2: Login Existing</h3>
              <p className="text-sm text-gray-400 mb-4">
                Already have an account? Login here.
              </p>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@real-email.com"
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <HMButton
                onClick={loginExisting}
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </HMButton>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Or go to{' '}
                <a href="/?route=register" className="text-red-500 hover:underline">
                  /?route=register
                </a>{' '}
                to create account manually
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}