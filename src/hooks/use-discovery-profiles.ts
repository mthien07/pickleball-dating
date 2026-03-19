/** useDiscoveryProfiles - TanStack Query hook for swipe card discovery feed */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import {
  getDiscoveryProfiles,
  recordSwipe,
  SwipeDirection,
  SwipeResult,
} from '../services/api/swipe.service';
import { queryKeys } from '../config/query-keys';
import { MOCK_USERS } from '@data/mockData';

export const useDiscoveryProfiles = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: profiles = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: queryKeys.discovery.profiles(),
    queryFn: () => getDiscoveryProfiles(),
    enabled: isAuthenticated,
    placeholderData: __DEV__ ? MOCK_USERS : undefined,
  });

  const swipeMutation = useMutation({
    mutationFn: ({ targetId, direction }: { targetId: string; direction: SwipeDirection }) =>
      recordSwipe(targetId, direction),
    onSuccess: (result) => {
      if (result.isMatch) {
        // Invalidate matches to show new match
        queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
      }
    },
  });

  const handleSwipe = useCallback(
    async (direction: SwipeDirection): Promise<SwipeResult> => {
      const profile = profiles[currentIndex];
      if (!profile) {
        return { isMatch: false };
      }

      setCurrentIndex((prev) => prev + 1);

      if (isAuthenticated) {
        try {
          return await swipeMutation.mutateAsync({
            targetId: profile.id,
            direction,
          });
        } catch (e) {
          console.error('[useDiscoveryProfiles] recordSwipe failed:', e);
        }
      }

      return { isMatch: false };
    },
    [profiles, currentIndex, isAuthenticated, swipeMutation]
  );

  const reload = useCallback(() => {
    setCurrentIndex(0);
    refetch();
  }, [refetch]);

  return {
    currentProfile: profiles[currentIndex],
    nextProfile: profiles[currentIndex + 1],
    hasMore: currentIndex < profiles.length,
    isLoading,
    handleSwipe,
    reload,
  };
};
