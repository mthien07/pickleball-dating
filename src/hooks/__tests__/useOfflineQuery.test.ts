/**
 * Tests for useOfflineQuery hooks
 *
 * Tests offline-aware query functionality with network status
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useNetworkStatus, usePrefetch, useOfflineIndicator } from '../useOfflineQuery';
import NetInfo from '@react-native-community/netinfo';

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('useOfflineQuery hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock: online
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      type: 'wifi',
    });

    (NetInfo.addEventListener as jest.Mock).mockReturnValue(jest.fn());
  });

  describe('useNetworkStatus', () => {
    it('should initialize with online status', async () => {
      const { result } = renderHook(() => useNetworkStatus());

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
        expect(result.current.isOffline).toBe(false);
      });
    });

    it('should detect offline status', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: false,
        type: 'none',
      });

      const { result } = renderHook(() => useNetworkStatus());

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
        expect(result.current.isOffline).toBe(true);
      });
    });

    it('should subscribe to network changes', () => {
      renderHook(() => useNetworkStatus());

      expect(NetInfo.addEventListener).toHaveBeenCalled();
    });

    it('should cleanup subscription on unmount', () => {
      const unsubscribe = jest.fn();
      (NetInfo.addEventListener as jest.Mock).mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useNetworkStatus());

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('usePrefetch', () => {
    it('should allow prefetch when online', async () => {
      const { result } = renderHook(() => usePrefetch());

      await waitFor(() => {
        expect(result.current.canPrefetch).toBe(true);
        expect(result.current.isOnline).toBe(true);
      });
    });

    it('should not allow prefetch when offline', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: false,
        type: 'none',
      });

      const { result } = renderHook(() => usePrefetch());

      await waitFor(() => {
        expect(result.current.canPrefetch).toBe(false);
        expect(result.current.isOnline).toBe(false);
      });
    });
  });

  describe('useOfflineIndicator', () => {
    it('should not show banner when online', async () => {
      const { result } = renderHook(() => useOfflineIndicator());

      await waitFor(() => {
        expect(result.current.shouldShowOfflineBanner).toBe(false);
      });
    });

    it('should show banner when offline', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: false,
        type: 'none',
      });

      const { result } = renderHook(() => useOfflineIndicator());

      await waitFor(() => {
        expect(result.current.shouldShowOfflineBanner).toBe(true);
      });
    });

    it('should detect wifi connection', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: true,
        type: 'wifi',
      });

      const { result } = renderHook(() => useOfflineIndicator());

      await waitFor(() => {
        expect(result.current.isWifi).toBe(true);
        expect(result.current.isCellular).toBe(false);
      });
    });

    it('should detect cellular connection', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: true,
        type: 'cellular',
      });

      const { result } = renderHook(() => useOfflineIndicator());

      await waitFor(() => {
        expect(result.current.isWifi).toBe(false);
        expect(result.current.isCellular).toBe(true);
      });
    });

    it('should cleanup on unmount', () => {
      const unsubscribe = jest.fn();
      (NetInfo.addEventListener as jest.Mock).mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useOfflineIndicator());

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle null network state gracefully', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
        isConnected: null,
        type: 'unknown',
      });

      const { result } = renderHook(() => useNetworkStatus());

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });
    });

    it('should handle network state changes', async () => {
      let networkCallback: ((state: any) => void) | null = null;

      (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
        networkCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useNetworkStatus());

      // Simulate going offline
      act(() => {
        if (networkCallback) {
          networkCallback({
            isConnected: false,
            type: 'none',
          });
        }
      });

      await waitFor(() => {
        expect(result.current.isOffline).toBe(true);
      });

      // Simulate going back online
      act(() => {
        if (networkCallback) {
          networkCallback({
            isConnected: true,
            type: 'wifi',
          });
        }
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });
    });
  });
});
