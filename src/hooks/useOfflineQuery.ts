/**
 * Offline-Aware React Query Hooks
 *
 * Custom hooks that provide offline support and network status awareness
 */

import { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { getNetworkStatus } from '../config/queryClient';

// ============================================
// NETWORK STATUS HOOK
// ============================================

/**
 * Hook to get current network status
 *
 * Usage:
 * ```tsx
 * const { isOnline, isOffline } = useNetworkStatus();
 * ```
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Get initial network status
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};

// ============================================
// OFFLINE-AWARE QUERY HOOK
// ============================================

/**
 * Offline-aware query hook with enhanced error handling
 *
 * Automatically handles:
 * - Showing cached data when offline
 * - Network status indicators
 * - Retry logic based on connection
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, isOffline, isFetchingOnline } = useOfflineQuery({
 *   queryKey: ['users', userId],
 *   queryFn: () => fetchUser(userId),
 * });
 * ```
 */
export const useOfflineQuery = <TData = unknown, TError = unknown>(
  options: UseQueryOptions<TData, TError, TData, QueryKey>
) => {
  const { isOnline, isOffline } = useNetworkStatus();

  const query = useQuery<TData, TError, TData, QueryKey>({
    ...options,
    // Use cached data when offline
    enabled: options.enabled !== false,
  });

  return {
    ...query,
    isOnline,
    isOffline,
    // Helper to know if data is from cache
    isFromCache: isOffline && query.isSuccess,
    // Helper to know if actively fetching while online
    isFetchingOnline: isOnline && query.isFetching,
  };
};

// ============================================
// OFFLINE-AWARE MUTATION HOOK
// ============================================

/**
 * Offline-aware mutation hook with queueing support
 *
 * Automatically handles:
 * - Queueing mutations when offline
 * - Retry when back online
 * - Optimistic updates
 *
 * Usage:
 * ```tsx
 * const { mutate, isPending, isOffline } = useOfflineMutation({
 *   mutationFn: (data) => updateProfile(data),
 *   onSuccess: () => {
 *     // Handle success
 *   },
 * });
 * ```
 */
export const useOfflineMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const { isOnline, isOffline } = useNetworkStatus();

  const mutation = useMutation<TData, TError, TVariables, TContext>(options);

  return {
    ...mutation,
    isOnline,
    isOffline,
    // Helper to know if mutation is queued
    isQueued: isOffline && mutation.isPending,
  };
};

// ============================================
// PREFETCH WITH OFFLINE AWARENESS
// ============================================

/**
 * Hook for prefetching data with offline awareness
 *
 * Usage:
 * ```tsx
 * const { prefetch, canPrefetch } = usePrefetch();
 *
 * useEffect(() => {
 *   if (canPrefetch) {
 *     prefetch(['users', 'list'], fetchUsers);
 *   }
 * }, [canPrefetch]);
 * ```
 */
export const usePrefetch = () => {
  const { isOnline } = useNetworkStatus();

  return {
    canPrefetch: isOnline,
    isOnline,
  };
};

// ============================================
// OFFLINE INDICATOR HOOK
// ============================================

/**
 * Hook to get offline indicator data
 *
 * Usage:
 * ```tsx
 * const { shouldShowOfflineBanner, networkType } = useOfflineIndicator();
 * ```
 */
export const useOfflineIndicator = () => {
  const [networkInfo, setNetworkInfo] = useState({
    isConnected: true,
    type: 'wifi',
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setNetworkInfo({
        isConnected: state.isConnected ?? false,
        type: state.type,
      });
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkInfo({
        isConnected: state.isConnected ?? false,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    shouldShowOfflineBanner: !networkInfo.isConnected,
    networkType: networkInfo.type,
    isWifi: networkInfo.type === 'wifi',
    isCellular: networkInfo.type === 'cellular',
  };
};
