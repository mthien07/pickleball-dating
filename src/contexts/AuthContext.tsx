/**
 * Auth Context - Tích hợp Supabase Auth + Profile
 *
 * Quản lý trạng thái đăng nhập và profile user:
 * - Lắng nghe auth state changes
 * - Tự động load profile khi đăng nhập
 * - Cung cấp methods login/logout/refreshProfile cho các component
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { supabase } from '../services/supabase';
import { getMyProfile, UserProfile } from '../services/api/profile.service';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: Error | null;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);

  // Load profile từ database
  const loadProfile = useCallback(async () => {
    try {
      if (__DEV__) {
        console.log('[AuthContext] Loading profile...');
      }
      setProfileLoading(true);
      setProfileError(null);
      const userProfile = await getMyProfile();
      if (__DEV__) {
        console.log('[AuthContext] Profile loaded:', userProfile);
      }
      setProfile(userProfile);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('[AuthContext] Error loading profile:', err);
      setProfile(null);
      setProfileError(err);
    } finally {
      setProfileLoading(false);
      if (__DEV__) {
        console.log('[AuthContext] Profile loading finished');
      }
    }
  }, []);

  // Refresh profile (để gọi sau khi update)
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Helper to set authenticated state (DRY principle)
  const setAuthState = useCallback((newSession: Session | null) => {
    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      if (__DEV__) {
        console.log('[AuthContext] Auth state set - User:', newSession.user.email);
      }
    } else {
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setProfile(null);
      setProfileError(null);
      setIsLoading(false);
      if (__DEV__) {
        console.log('[AuthContext] Auth state cleared');
      }
    }
  }, []);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại khi app khởi động
    const checkSession = async () => {
      try {
        if (__DEV__) {
          console.log('[AuthContext] Checking initial session at', new Date().toISOString());
        }
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session:', error.message);
        }

        // Use helper to set auth state
        setAuthState(currentSession);

        // Load profile in background if authenticated (non-blocking with error handling)
        if (currentSession) {
          if (__DEV__) {
            console.log('[AuthContext] Profile loading started in background');
          }
          loadProfile().catch((err) => {
            console.error('[AuthContext] Background profile load failed:', err);
          });
        }
      } catch (error) {
        console.error('[AuthContext] Session check error:', error);
        setIsLoading(false);
        if (__DEV__) {
          console.log('[AuthContext] isLoading set to FALSE after error');
        }
      }
    };

    checkSession();

    // 2. Lắng nghe auth state changes (đăng nhập/đăng xuất)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (__DEV__) {
        console.log('[AuthContext] Auth state changed:', event, 'at', new Date().toISOString());
      }

      // Use helper to set auth state
      setAuthState(newSession);

      // Load profile in background if authenticated (non-blocking with error handling)
      if (newSession) {
        if (__DEV__) {
          console.log('[AuthContext] Profile loading started in background');
        }
        loadProfile().catch((err) => {
          console.error('[AuthContext] Background profile load failed:', err);
        });
      }
    });

    // Cleanup subscription khi unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile, setAuthState]);

  // Logout - gọi Supabase signOut
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
        throw error;
      }

      // Clear all auth state using helper
      setAuthState(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        profile,
        profileLoading,
        profileError,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
