import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, onAuthStateChange, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../lib/auth';
import type { AuthUser } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BYPASS: Auto-login for testing (remove in production)
    const devBypass = localStorage.getItem('hotmess_dev_auth_bypass');
    console.log('🔍 Checking dev bypass flag:', devBypass);
    
    if (devBypass === 'true') {
      const mockUser: AuthUser = {
        id: 'dev-user-123',
        email: 'dev@hotmess.london',
        displayName: 'Dev Tester',
        role: 'admin'
      };
      setUser(mockUser);
      setLoading(false);
      console.log('🔓 Auth bypassed for testing');
      console.log('✅ Dev user created:', mockUser);
      return; // Don't set up real auth listeners when bypassed
    }
    
    console.log('⚠️ Dev bypass NOT active - using real auth');

    // Check for existing session on mount
    getCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authSignIn(email, password);
      const user = await getCurrentUser();
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      await authSignUp(email, password, displayName);
      const user = await getCurrentUser();
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}