/**
 * React Query Client Configuration with Offline Support
 *
 * Features:
 * - Offline data persistence with AsyncStorage
 * - Network-aware retry logic
 * - Optimized cache and stale times
 * - Error handling and logging
 */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// ============================================
// NETWORK STATUS
// ============================================

let isOnline = true;

// Listen to network status changes
NetInfo.addEventListener((state) => {
  isOnline = state.isConnected ?? false;
});

export const getNetworkStatus = () => isOnline;

// ============================================
// ASYNC STORAGE PERSISTER
// ============================================

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  throttleTime: 1000, // Throttle saving to AsyncStorage
});

// ============================================
// QUERY CLIENT CONFIGURATION
// ============================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: How long data stays in cache
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)

      // Stale time: How long before data is considered stale
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }

        // Don't retry if offline
        if (!isOnline) {
          return false;
        }

        // Retry up to 3 times for network errors
        return failureCount < 3;
      },

      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },

      // Network mode: Use cached data when offline
      networkMode: 'offlineFirst',

      // Refetch on mount only if data is stale
      refetchOnMount: 'always',

      // Refetch on window focus when online
      refetchOnWindowFocus: (query) => {
        return isOnline && query.state.dataUpdateCount === 0;
      },

      // Refetch on reconnect
      refetchOnReconnect: 'always',
    },

    mutations: {
      // Retry mutations when back online
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }

        // Retry up to 2 times
        return failureCount < 2;
      },

      retryDelay: 1000,

      // Queue mutations when offline
      networkMode: 'offlineFirst',

      // Error handling
      onError: (error: any) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// ============================================
// OFFLINE QUERY HELPERS
// ============================================

/**
 * Check if we should use cached data
 */
export const shouldUseCachedData = () => {
  return !isOnline;
};

/**
 * Invalidate all queries when back online
 */
export const invalidateAllOnReconnect = () => {
  NetInfo.addEventListener((state) => {
    const wasOffline = !isOnline;
    isOnline = state.isConnected ?? false;

    // If we just reconnected, invalidate all queries
    if (wasOffline && isOnline) {
      queryClient.invalidateQueries();
    }
  });
};

// ============================================
// QUERY KEY FACTORY
// ============================================

/**
 * Centralized query key factory for consistency
 */
export const queryKeys = {
  // User queries
  user: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    profile: () => ['users', 'profile'] as const,
  },

  // Match queries
  matches: {
    all: ['matches'] as const,
    list: () => ['matches', 'list'] as const,
    detail: (id: string) => ['matches', id] as const,
  },

  // Court queries
  courts: {
    all: ['courts'] as const,
    list: (filters?: Record<string, any>) => ['courts', 'list', filters] as const,
    detail: (id: string) => ['courts', id] as const,
    nearby: (location: { latitude: number; longitude: number }) =>
      ['courts', 'nearby', location] as const,
  },

  // Booking queries
  bookings: {
    all: ['bookings'] as const,
    list: () => ['bookings', 'list'] as const,
    detail: (id: string) => ['bookings', id] as const,
    history: () => ['bookings', 'history'] as const,
  },

  // Message queries
  messages: {
    all: ['messages'] as const,
    conversation: (conversationId: string) => ['messages', conversationId] as const,
  },

  // Coach queries
  coaches: {
    all: ['coaches'] as const,
    list: (filters?: Record<string, any>) => ['coaches', 'list', filters] as const,
    detail: (id: string) => ['coaches', id] as const,
  },
};

// ============================================
// PREFETCH HELPERS
// ============================================

/**
 * Prefetch user profile data
 */
export const prefetchUserProfile = async (userId: string) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.detail(userId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Prefetch courts nearby
 */
export const prefetchNearbyCourts = async (location: {
  latitude: number;
  longitude: number;
}) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.courts.nearby(location),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
