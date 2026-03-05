/**
 * Auth Context - Supabase Auth + Profile integration
 *
 * Manages auth state and user profile:
 * - Listens to auth state changes
 * - Auto-loads profile on login
 * - Provides login/logout/refreshProfile methods
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
import { getMyProfile } from '../services/api/profile.service';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthContextType } from './auth-context.types';
import type { UserProfile } from '../services/api/profile.service';

export type { AuthContextType };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);

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

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

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
        setAuthState(currentSession);
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
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(
        '[AuthContext] onAuthStateChange:',
        event,
        'session:',
        !!newSession,
        'user:',
        newSession?.user?.email
      );
      setAuthState(newSession);
      if (newSession) {
        console.log('[AuthContext] User authenticated, loading profile in background...');
        loadProfile().catch((err) => {
          console.error('[AuthContext] Background profile load failed:', err);
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile, setAuthState]);

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        throw error;
      }
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
