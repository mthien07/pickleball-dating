/**
 * Query Client Tests
 *
 * Tests queryClient configuration (staleTime, gcTime, retry logic)
 * and asyncStoragePersister creation.
 */

// Mock NetInfo before importing queryClient (it registers a listener at module level)
import {
  queryClient,
  asyncStoragePersister,
  getNetworkStatus,
  shouldUseCachedData,
} from '../queryClient';

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

describe('queryClient configuration', () => {
  // ─── Default query options ─────────────────────────────────────────────

  describe('default query options', () => {
    it('has 5-minute stale time', () => {
      const { staleTime } = queryClient.getDefaultOptions().queries!;
      expect(staleTime).toBe(1000 * 60 * 5);
    });

    it('has 24-hour gc time', () => {
      const { gcTime } = queryClient.getDefaultOptions().queries!;
      expect(gcTime).toBe(1000 * 60 * 60 * 24);
    });

    it('uses offlineFirst network mode for queries', () => {
      const { networkMode } = queryClient.getDefaultOptions().queries!;
      expect(networkMode).toBe('offlineFirst');
    });

    it('uses offlineFirst network mode for mutations', () => {
      const { networkMode } = queryClient.getDefaultOptions().mutations!;
      expect(networkMode).toBe('offlineFirst');
    });
  });

  // ─── Retry logic ────────────────────────────────────────────────────────

  describe('query retry logic', () => {
    const getRetry = () =>
      queryClient.getDefaultOptions().queries!.retry as (...args: unknown[]) => unknown;

    it('does not retry on 4xx client errors', () => {
      const retry = getRetry();
      expect(retry(1, { status: 404 })).toBe(false);
      expect(retry(1, { status: 401 })).toBe(false);
      expect(retry(1, { status: 400 })).toBe(false);
    });

    it('retries up to 3 times on server errors when online', () => {
      const retry = getRetry();
      expect(retry(0, { status: 500 })).toBe(true);
      expect(retry(1, { status: 500 })).toBe(true);
      expect(retry(2, { status: 500 })).toBe(true);
      expect(retry(3, { status: 500 })).toBe(false);
    });
  });

  // ─── Mutation retry logic ───────────────────────────────────────────────

  describe('mutation retry logic', () => {
    const getMutationRetry = () =>
      queryClient.getDefaultOptions().mutations!.retry as (...args: unknown[]) => unknown;

    it('does not retry mutations on 4xx errors', () => {
      const retry = getMutationRetry();
      expect(retry(0, { status: 422 })).toBe(false);
    });

    it('retries mutations up to 2 times on server errors', () => {
      const retry = getMutationRetry();
      expect(retry(0, { status: 500 })).toBe(true);
      expect(retry(1, { status: 500 })).toBe(true);
      expect(retry(2, { status: 500 })).toBe(false);
    });
  });

  // ─── asyncStoragePersister ──────────────────────────────────────────────

  describe('asyncStoragePersister', () => {
    it('is created with AsyncStorage backend', () => {
      expect(asyncStoragePersister).toBeDefined();
      // Persister exposes persistClient / restoreClient / removeClient
      expect(typeof asyncStoragePersister.persistClient).toBe('function');
      expect(typeof asyncStoragePersister.restoreClient).toBe('function');
      expect(typeof asyncStoragePersister.removeClient).toBe('function');
    });
  });

  // ─── Network status helpers ─────────────────────────────────────────────

  describe('getNetworkStatus / shouldUseCachedData', () => {
    it('getNetworkStatus returns boolean', () => {
      expect(typeof getNetworkStatus()).toBe('boolean');
    });

    it('shouldUseCachedData is inverse of getNetworkStatus', () => {
      expect(shouldUseCachedData()).toBe(!getNetworkStatus());
    });
  });
});
