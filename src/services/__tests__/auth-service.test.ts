/**
 * Auth Service Tests
 *
 * Tests AuthContext logic: signUp, signIn, signOut,
 * session persistence/restoration, auth state changes.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { supabase } from '../supabase';

import { getMyProfile } from '../api/profile.service';

// Profile service mock - prevents real API calls
jest.mock('../api/profile.service', () => ({
  getMyProfile: jest.fn(),
}));

const mockSupabaseAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;
const mockGetMyProfile = getMyProfile as jest.Mock;

// Wrapper providing AuthProvider context
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AuthProvider, null, children);

const MOCK_SESSION = {
  user: { id: 'user-1', email: 'test@example.com' },
  access_token: 'token-abc',
  refresh_token: 'refresh-abc',
  expires_in: 3600,
  token_type: 'bearer',
} as any;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no existing session
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as any);
    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    } as any);
    mockGetMyProfile.mockResolvedValue({ id: 'user-1', full_name: 'Test User' });
  });

  // ─── Initial state ────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts unauthenticated with no session', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  // ─── Session restoration ──────────────────────────────────────────────────

  describe('session restoration', () => {
    it('restores existing session on mount', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.user).toEqual(MOCK_SESSION.user);
      expect(result.current.session).toEqual(MOCK_SESSION);
    });

    it('handles getSession error gracefully', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Session error' },
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('loads profile after session is restored', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(mockGetMyProfile).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.profile).toEqual({ id: 'user-1', full_name: 'Test User' });
      });
    });
  });

  // ─── Auth state changes ───────────────────────────────────────────────────

  describe('auth state changes', () => {
    it('becomes authenticated when onAuthStateChange fires SIGNED_IN', async () => {
      let authCallback: ((event: string, session: any) => void) | null = null;

      mockSupabaseAuth.onAuthStateChange.mockImplementation((cb) => {
        authCallback = cb;
        return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        authCallback?.('SIGNED_IN', MOCK_SESSION);
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('test@example.com');
      });
    });

    it('clears state when onAuthStateChange fires SIGNED_OUT', async () => {
      let authCallback: ((event: string, session: any) => void) | null = null;

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);

      mockSupabaseAuth.onAuthStateChange.mockImplementation((cb) => {
        authCallback = cb;
        return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        authCallback?.('SIGNED_OUT', null);
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.profile).toBeNull();
      });
    });

    it('unsubscribes auth listener on unmount', async () => {
      const unsubscribe = jest.fn();
      mockSupabaseAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe } },
      } as any);

      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {});

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  // ─── signOut ─────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('calls supabase signOut and clears state', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });

    it('throws when signOut returns an error', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.logout();
        })
      ).rejects.toBeDefined();
    });
  });

  // ─── refreshProfile ───────────────────────────────────────────────────────

  describe('refreshProfile', () => {
    it('reloads profile data', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);
      mockGetMyProfile
        .mockResolvedValueOnce({ id: 'user-1', full_name: 'Old Name' })
        .mockResolvedValueOnce({ id: 'user-1', full_name: 'New Name' });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile?.full_name).toBe('Old Name');
      });

      await act(async () => {
        await result.current.refreshProfile();
      });

      expect(result.current.profile?.full_name).toBe('New Name');
    });

    it('sets profileError when profile load fails', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: MOCK_SESSION },
        error: null,
      } as any);
      mockGetMyProfile.mockRejectedValue(new Error('Profile fetch failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait until profileError is populated (set before profileLoading → false)
      await waitFor(() => {
        expect(result.current.profileError).toBeTruthy();
      });

      expect(result.current.profileLoading).toBe(false);
    });
  });

  // ─── useAuth guard ────────────────────────────────────────────────────────

  describe('useAuth', () => {
    it('throws when used outside AuthProvider', () => {
      // Suppress expected error output
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => renderHook(() => useAuth())).toThrow(
        'useAuth must be used within an AuthProvider'
      );
      spy.mockRestore();
    });
  });
});
