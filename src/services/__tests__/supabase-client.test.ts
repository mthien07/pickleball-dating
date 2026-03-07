/**
 * Supabase Client Tests
 *
 * Tests client helper functions: isAuthenticated, getCurrentUserId, signOut.
 * Imports helpers statically; global mock from jest.setup.js provides supabase stub.
 */

// Extend global mock to add getUser before module import
import { supabase, isAuthenticated, getCurrentUserId, signOut } from '../supabase';

jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  },
  isAuthenticated: jest.fn(),
  getCurrentUserId: jest.fn(),
  signOut: jest.fn(),
}));

const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;
const mockIsAuthenticated = isAuthenticated as jest.Mock;
const mockGetCurrentUserId = getCurrentUserId as jest.Mock;
const mockSignOut = signOut as jest.Mock;

describe('supabase client helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── isAuthenticated ──────────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('returns true when a session exists', async () => {
      mockIsAuthenticated.mockResolvedValue(true);

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('returns false when no session exists', async () => {
      mockIsAuthenticated.mockResolvedValue(false);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });

    it('delegates to supabase.auth.getSession', async () => {
      mockAuth.getSession.mockResolvedValue({
        data: { session: { access_token: 'tok' } as any },
        error: null,
      } as any);
      mockIsAuthenticated.mockImplementation(async () => {
        const { data } = await supabase.auth.getSession();
        return !!data.session;
      });

      const result = await isAuthenticated();

      expect(mockAuth.getSession).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  // ─── getCurrentUserId ─────────────────────────────────────────────────────

  describe('getCurrentUserId', () => {
    it('returns user id when authenticated', async () => {
      mockGetCurrentUserId.mockResolvedValue('user-42');

      const id = await getCurrentUserId();

      expect(id).toBe('user-42');
    });

    it('returns null when not authenticated', async () => {
      mockGetCurrentUserId.mockResolvedValue(null);

      const id = await getCurrentUserId();

      expect(id).toBeNull();
    });

    it('delegates to supabase.auth.getUser', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-99' } as any },
        error: null,
      } as any);
      mockGetCurrentUserId.mockImplementation(async () => {
        const { data } = await supabase.auth.getUser();
        return data.user?.id ?? null;
      });

      const id = await getCurrentUserId();

      expect(mockAuth.getUser).toHaveBeenCalled();
      expect(id).toBe('user-99');
    });
  });

  // ─── signOut ─────────────────────────────────────────────────────────────

  describe('signOut', () => {
    it('resolves without error on success', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await expect(signOut()).resolves.toBeUndefined();
    });

    it('rejects when sign-out fails', async () => {
      const authError = { message: 'Not authenticated' };
      mockSignOut.mockRejectedValue(authError);

      await expect(signOut()).rejects.toEqual(authError);
    });

    it('delegates to supabase.auth.signOut', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null } as any);
      mockSignOut.mockImplementation(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      });

      await signOut();

      expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  // ─── client object ────────────────────────────────────────────────────────

  describe('client object', () => {
    it('exposes auth namespace', () => {
      expect(supabase.auth).toBeDefined();
      expect(typeof supabase.auth.getSession).toBe('function');
      expect(typeof supabase.auth.signOut).toBe('function');
    });

    it('exposes from() query builder', () => {
      expect(typeof supabase.from).toBe('function');
    });
  });
});
