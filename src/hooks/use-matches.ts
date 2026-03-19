/** useMatches - TanStack Query hook for matches and conversations */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import { getMatches } from '../services/api/match.service';
import { queryKeys } from '../config/query-keys';
import { MOCK_MATCHES } from '@data/mockData';

export const useMatches = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    data: matches = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.matches.list(),
    queryFn: getMatches,
    enabled: isAuthenticated,
    placeholderData: __DEV__ ? (MOCK_MATCHES as any) : undefined,
  });

  const newMatches = matches.filter((m: any) => !m.last_message);
  const conversations = matches.filter((m: any) => m.last_message || m.unread_count > 0);

  return { matches, newMatches, conversations, isLoading, refresh: refetch };
};
