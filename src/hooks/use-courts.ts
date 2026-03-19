/** useCourts - TanStack Query hook for court data with optional courtType filter */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import { getCourts } from '../services/api/court.service';
import { queryKeys } from '../config/query-keys';
import { MOCK_COURTS } from '@data/mockData';

export const useCourts = (courtType?: string) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    data: courts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.courts.list({ courtType }),
    queryFn: () => getCourts(courtType),
    enabled: isAuthenticated,
    placeholderData: __DEV__
      ? courtType
        ? (MOCK_COURTS.filter((c) => c.court_type === courtType) as any)
        : (MOCK_COURTS as any)
      : undefined,
  });

  return { courts, isLoading, refresh: refetch };
};
