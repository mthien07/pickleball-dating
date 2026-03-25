/** useDiscoveryProfiles - TanStack Query hook for swipe card discovery feed */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import {
  getDiscoveryProfiles,
  recordSwipe,
  SwipeDirection,
  SwipeResult,
  DiscoveryProfile,
} from '../services/api/swipe.service';
import { showError } from '../services/toast';
import { queryKeys } from '../config/query-keys';
import { MOCK_USERS } from '@data/mockData';

export const useDiscoveryProfiles = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useAuthStore((s) => s.profile);
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: profiles = [],
    isLoading,
    refetch,
  } = useQuery<DiscoveryProfile[]>({
    queryKey: queryKeys.discovery.profiles(),
    queryFn: () => getDiscoveryProfiles(),
    enabled: isAuthenticated,
    placeholderData: __DEV__ ? MOCK_USERS : undefined,
  });

  // Reset index when profile list shrinks (e.g. background refetch)
  useEffect(() => {
    if (currentIndex > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
    }
  }, [profiles.length, currentIndex]);

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
      const currentCard = profiles[currentIndex];
      if (!currentCard) {
        return { isMatch: false };
      }

      // Bug 2: Guard against swipe insert violating check constraint for incomplete profiles.
      // A profile is considered complete when it has bio and at least one avatar.
      const isProfileComplete =
        profile?.bio &&
        profile?.bio.length > 0 &&
        Array.isArray(profile?.avatar_urls) &&
        profile.avatar_urls.length > 0;

      if (isAuthenticated && !isProfileComplete) {
        showError('Hoàn thiện hồ sơ trước khi thích người khác nhé!');
        return { isMatch: false };
      }

      setCurrentIndex((prev) => prev + 1);

      if (isAuthenticated) {
        try {
          return await swipeMutation.mutateAsync({
            targetId: currentCard.id,
            direction,
          });
        } catch (e) {
          console.error('[useDiscoveryProfiles] recordSwipe failed:', e);
        }
      }

      return { isMatch: false };
    },
    [profiles, currentIndex, isAuthenticated, profile, swipeMutation]
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
