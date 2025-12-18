/**
 * User Context - Manages authenticated user state and profile
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';
import { getCurrentUser, getUserProfile, UserProfile } from '../lib/user-profile';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refetchProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUser();
      
      if (result) {
        setUser(result.user);
        setProfile(result.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refetchProfile = async () => {
    if (!user) return;
    
    try {
      const updatedProfile = await getUserProfile(user.id);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error refetching profile:', error);
    }
  };

  useEffect(() => {
    fetchUser();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (import.meta.env.DEV) {
          console.log('🔐 Auth state changed:', event);
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: UserContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    refetchProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
