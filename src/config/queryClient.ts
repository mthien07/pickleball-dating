/** React Query Client with offline persistence, network-aware retry, and optimized caching */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { queryKeys as _queryKeys } from './query-keys';

export { queryKeys } from './query-keys';

let isOnline = true;

NetInfo.addEventListener((state) => {
  isOnline = state.isConnected ?? false;
});

export const getNetworkStatus = () => isOnline;

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  throttleTime: 1000,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        if (!isOnline) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'offlineFirst',
      refetchOnMount: 'always',
      refetchOnWindowFocus: (query) => isOnline && query.state.dataUpdateCount === 0,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: 1000,
      networkMode: 'offlineFirst',
      onError: (error: any) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

export const shouldUseCachedData = () => !isOnline;

export const invalidateAllOnReconnect = () => {
  NetInfo.addEventListener((state) => {
    const wasOffline = !isOnline;
    isOnline = state.isConnected ?? false;
    if (wasOffline && isOnline) {
      queryClient.invalidateQueries();
    }
  });
};

export const prefetchUserProfile = async (userId: string) => {
  await queryClient.prefetchQuery({
    queryKey: _queryKeys.user.detail(userId),
    staleTime: 1000 * 60 * 10,
  });
};

export const prefetchNearbyCourts = async (location: { latitude: number; longitude: number }) => {
  await queryClient.prefetchQuery({
    queryKey: _queryKeys.courts.nearby(location),
    staleTime: 1000 * 60 * 5,
  });
};
