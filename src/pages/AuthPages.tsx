import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User, ArrowLeft, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RouteId } from '../lib/routes';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthPageProps {
  onNavigate: (route: RouteId) => void;
}

export function LoginPage({ onNavigate }: AuthPageProps) {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmingEmail, setConfirmingEmail] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [userStatus, setUserStatus] = useState<{exists: boolean; emailConfirmed: boolean} | null>(null);

  const handleCheckUser = async (emailToCheck: string) => {
    if (!emailToCheck) return;
    
    setCheckingUser(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a670c824/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();
      
      if (data.exists) {
        setUserStatus({
          exists: true,
          emailConfirmed: data.user.emailConfirmed
        });
        
        if (!data.user.emailConfirmed) {
          toast.error('⚠️ Your email is not confirmed. Click "CONFIRM EMAIL" below.');
        }
      } else {
        setUserStatus({ exists: false, emailConfirmed: false });
      }
    } catch (error) {
      console.error('Check user error:', error);
    } finally {
      setCheckingUser(false);
    }
  };

  const handleConfirmEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    setConfirmingEmail(true);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a670c824/auth/confirm-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to confirm email');
      }

      toast.success('✅ Email confirmed! You can now log in with your password.');
      
      // Re-check user status
      await handleCheckUser(email);
    } catch (error: any) {
      console.error('Email confirm error:', error);
      if (error.message.includes('not found')) {
        toast.error('No account found with this email. Please register first.');
      } else {
        toast.error(error.message || 'Failed to confirm email');
      }
    } finally {
      setConfirmingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      onNavigate('home');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Better error messages
      const errorMsg = error.message || '';
      if (errorMsg.includes('Invalid login credentials')) {
        toast.error(
          'Invalid email or password. If you just registered, try clicking "Confirm Email" below.',
          { duration: 5000 }
        );
      } else if (errorMsg.includes('Email not confirmed')) {
        toast.error('Please confirm your email address');
      } else {
        toast.error(errorMsg || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="bg-black min-h-screen w-full overflow-y-auto">
      <div className="max-w-md mx-auto px-4 py-8 pb-20">
        {/* Back button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-hotmess-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white mb-2" style={{ fontWeight: 900 }}>
            Welcome back
          </h1>
          <div className="h-1 w-16 bg-hotmess-red mb-4" />
          <p className="text-hotmess-gray-300">
            Sign in to access your cart, orders, and community posts.
          </p>
        </div>

        {/* QR Login Option */}
        <button
          onClick={() => onNavigate('qrLogin')}
          className="w-full bg-hotmess-red/10 border-2 border-hotmess-red text-hotmess-red px-6 py-4 hover:bg-hotmess-red hover:text-black transition-all uppercase tracking-wider mb-6 flex items-center justify-center gap-3"
          style={{ fontWeight: 900 }}
        >
          <QrCode className="w-6 h-6" />
          Log in with QR
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-hotmess-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-hotmess-gray-500 uppercase tracking-wider">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            {/* Forgot password link */}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => onNavigate('passwordReset')}
                className="text-hotmess-gray-400 hover:text-hotmess-red transition-colors text-sm"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6">
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Confirm Email Helper (for unconfirmed accounts) */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-200 text-sm mb-3">
            <strong>Can't log in?</strong> If you registered before and can't log in, your email might need confirmation.
          </p>
          <button
            type="button"
            onClick={handleConfirmEmail}
            disabled={confirmingEmail}
            className="w-full px-4 py-3 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-200 hover:bg-yellow-500 hover:text-black transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
            style={{ fontWeight: 700 }}
          >
            {confirmingEmail ? 'Confirming...' : 'Confirm Email (Demo Fix)'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-hotmess-gray-800 text-center">
          <p className="text-hotmess-gray-400 mb-4">
            Don't have an account?
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="text-hotmess-red hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700 }}
          >
            Create Account
          </button>
        </div>

        {/* Demo account info */}
        <div className="mt-8 p-4 bg-hotmess-purple/10 border border-hotmess-purple/30 mb-8">
          <p className="text-hotmess-gray-400 text-sm">
            <strong className="text-white">Demo:</strong> Create an account to test the full experience with real data persistence.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate }: AuthPageProps) {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Warn about test domains
    const invalidDomains = ['.test', '.local', '.localhost', '.example'];
    const emailLower = email.toLowerCase();
    if (invalidDomains.some(domain => emailLower.includes(domain))) {
      toast.error('Please use a real email domain (e.g., @gmail.com, @icloud.com, @hotmail.com)');
      return;
    }

    if (!ageConfirmed) {
      toast.error('You must confirm you are 18 or older');
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

    try {
      await signUp(email, password, displayName);
      toast.success('Account created successfully!');
      // Navigate to home after successful registration
      onNavigate('home');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      // Better error messages
      const errorMsg = error.message || '';
      if (errorMsg.includes('invalid') && errorMsg.includes('email')) {
        toast.error('Invalid email address. Please use a real email domain (e.g., @gmail.com, @icloud.com)');
      } else if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
        toast.error('This email is already registered. Try logging in instead.');
      } else if (errorMsg.includes('Password')) {
        toast.error('Password must be at least 6 characters');
      } else {
        toast.error(errorMsg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="bg-black min-h-screen w-full overflow-y-auto">
      <div className="max-w-md mx-auto px-4 py-8 pb-40">
        {/* Back button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-hotmess-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white mb-2" style={{ fontWeight: 900 }}>
            Join HOTMESS
          </h1>
          <div className="h-1 w-16 bg-hotmess-red mb-4" />
          <p className="text-hotmess-gray-300">
            Create an account to shop, post, and connect with the community.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="text-hotmess-gray-500 text-sm mt-2">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-white mb-2 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hotmess-gray-400 w-5 h-5" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-hotmess-gray-900 border-2 border-hotmess-gray-700 text-white px-12 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* 18+ Age Verification - REQUIRED */}
          <div className="p-4 bg-hotmess-red/10 border-2 border-hotmess-red/30">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="ageConfirmation"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-hotmess-red cursor-pointer"
                required
              />
              <div>
                <label htmlFor="ageConfirmation" className="text-white cursor-pointer block" style={{ fontWeight: 700 }}>
                  I am 18 years or older *
                </label>
                <p className="text-sm text-hotmess-gray-300 mt-1">
                  HOTMESS LONDON is strictly 18+. By checking this box, you confirm you meet the age requirement.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 mb-8">
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-hotmess-gray-800 text-center pb-8">
          <p className="text-hotmess-gray-400 mb-4">
            Already have an account?
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="text-hotmess-red hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}