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
  login: () => void;
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

  // Load profile từ database
  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const userProfile = await getMyProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh profile (để gọi sau khi update)
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại khi app khởi động
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error.message);
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          // Load profile khi có session
          await loadProfile();
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Lắng nghe auth state changes (đăng nhập/đăng xuất)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);

      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setIsAuthenticated(true);
        // Load profile khi đăng nhập
        await loadProfile();
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setProfile(null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription khi unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // Login helper
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout - gọi Supabase signOut
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
        throw error;
      }

      setProfile(null);
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
        login,
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
