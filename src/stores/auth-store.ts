/**
 * Auth Store - Zustand store for authentication state.
 * Persists user metadata/profile via AsyncStorage (not raw tokens -- Supabase SDK handles those).
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { supabase } from '../services/supabase';
import { getMyProfile } from '../services/api/profile.service';
import { queryClient } from '../config/queryClient';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../services/api/profile.service';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: Error | null;
}

interface AuthActions {
  setAuthState: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setProfileLoading: (loading: boolean) => void;
  setProfileError: (error: Error | null) => void;
  loadProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  profile: null,
  profileLoading: false,
  profileError: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setAuthState: (session) => {
          if (session) {
            set({
              session,
              user: session.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ ...initialState, isLoading: false });
          }
        },

        setProfile: (profile) => set({ profile }),
        setProfileLoading: (loading) => set({ profileLoading: loading }),
        setProfileError: (error) => set({ profileError: error }),

        loadProfile: async () => {
          try {
            if (__DEV__) {
              console.log('[AuthStore] Loading profile...');
            }
            set({ profileLoading: true, profileError: null });
            const profile = await getMyProfile();
            set({ profile, profileLoading: false });
            if (__DEV__) {
              console.log('[AuthStore] Profile loaded:', profile);
            }
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error('[AuthStore] Profile load error:', err);
            set({ profile: null, profileError: err, profileLoading: false });
          }
        },

        refreshProfile: async () => {
          await get().loadProfile();
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await supabase.auth.signOut();
          } catch (error) {
            // Log but do not block logout — always reset local state
            console.error('[AuthStore] Logout error (ignored):', error);
          }
          get().reset();
        },

        reset: () => {
          queryClient.clear();
          set({ ...initialState, isLoading: false });
        },
      }),
      {
        name: 'auth-store',
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
        }),
      }
    ),
    { name: 'AuthStore', enabled: __DEV__ }
  )
);

/**
 * Initialize Supabase auth listener that syncs auth events into the store.
 * Returns unsubscribe function.
 */
export const initAuthListener = (): (() => void) => {
  const { setAuthState, loadProfile } = useAuthStore.getState();

  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('[AuthStore] Session check error:', error.message);
    }
    setAuthState(session);
    if (session) {
      loadProfile().catch((err) => {
        console.error('[AuthStore] Initial profile load failed:', err);
      });
    }
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (__DEV__) {
      console.log('[AuthStore] onAuthStateChange:', event, !!session);
    }
    if (event === 'INITIAL_SESSION') {
      return;
    }

    setAuthState(session);
    if (session) {
      loadProfile().catch((err) => {
        console.error('[AuthStore] Profile load on auth change failed:', err);
      });
    }
  });

  /**
   * Re-validate session when app regains focus (mobile) or tab becomes visible (web).
   * Guards against token being removed directly from storage while app is backgrounded.
   */
  const checkSession = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && !session) {
        setAuthState(null);
      }
    });
  };

  let unsubscribeFocus: (() => void) | undefined;

  if (Platform.OS === 'web') {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    unsubscribeFocus = () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  } else {
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkSession();
      }
    });
    unsubscribeFocus = () => appStateSub.remove();
  }

  return () => {
    subscription.unsubscribe();
    unsubscribeFocus?.();
  };
};
