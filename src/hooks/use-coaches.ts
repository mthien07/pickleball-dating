/** useCoaches - TanStack Query hook for coach directory */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import { getCoaches } from '../services/api/coach.service';
import { queryKeys } from '../config/query-keys';
import { MOCK_COACHES } from '@data/mockData';

export const useCoaches = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    data: coaches = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.coaches.list(),
    queryFn: getCoaches,
    enabled: isAuthenticated,
    placeholderData: __DEV__ ? (MOCK_COACHES as any) : undefined,
  });

  return { coaches, isLoading, refresh: refetch };
};
