/**
 * Offline-Aware React Query Hooks
 *
 * Custom hooks providing offline support and network status awareness.
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

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
};

// ============================================
// OFFLINE-AWARE QUERY HOOK
// ============================================

export const useOfflineQuery = <TData = unknown, TError = unknown>(
  options: UseQueryOptions<TData, TError, TData, QueryKey>
) => {
  const { isOnline, isOffline } = useNetworkStatus();

  const query = useQuery<TData, TError, TData, QueryKey>({
    ...options,
    enabled: options.enabled !== false,
  });

  return {
    ...query,
    isOnline,
    isOffline,
    isFromCache: isOffline && query.isSuccess,
    isFetchingOnline: isOnline && query.isFetching,
  };
};

// ============================================
// OFFLINE-AWARE MUTATION HOOK
// ============================================

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
    isQueued: isOffline && mutation.isPending,
  };
};

// ============================================
// PREFETCH WITH OFFLINE AWARENESS
// ============================================

export const usePrefetch = () => {
  const { isOnline } = useNetworkStatus();
  return { canPrefetch: isOnline, isOnline };
};

// ============================================
// OFFLINE INDICATOR HOOK
// ============================================

export const useOfflineIndicator = () => {
  const [networkInfo, setNetworkInfo] = useState({ isConnected: true, type: 'wifi' });

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setNetworkInfo({ isConnected: state.isConnected ?? false, type: state.type });
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkInfo({ isConnected: state.isConnected ?? false, type: state.type });
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
