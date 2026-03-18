/**
 * useDiscoveryProfiles - Hook for swipe card discovery feed
 *
 * Dual-mode operation:
 * - Authenticated: fetches real profiles from Supabase, records swipes
 * - Unauthenticated: falls back to MOCK_USERS for UI preview
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  getDiscoveryProfiles,
  recordSwipe,
  DiscoveryProfile,
  SwipeDirection,
  SwipeResult,
} from '../services/api/swipe.service';
import { MOCK_USERS } from '@data/mockData';

export const useDiscoveryProfiles = () => {
  const authContext = useContext(AuthContext);
  const isRealMode = !!authContext?.user?.id;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    if (isRealMode) {
      try {
        const data = await getDiscoveryProfiles();
        setProfiles(data);
      } catch (e) {
        console.error('[useDiscoveryProfiles] Supabase fetch failed, falling back to mock:', e);
        setProfiles(MOCK_USERS);
      }
    } else {
      setProfiles(MOCK_USERS);
    }
    setCurrentIndex(0);
    setIsLoading(false);
  }, [isRealMode]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleSwipe = useCallback(
    async (direction: SwipeDirection): Promise<SwipeResult> => {
      const profile = profiles[currentIndex];
      if (!profile) {
        return { isMatch: false };
      }

      setCurrentIndex((prev) => prev + 1);

      if (isRealMode) {
        try {
          return await recordSwipe(profile.id, direction);
        } catch (e) {
          console.error('[useDiscoveryProfiles] recordSwipe failed:', e);
        }
      }

      return { isMatch: false };
    },
    [profiles, currentIndex, isRealMode]
  );

  const reload = useCallback(() => loadProfiles(), [loadProfiles]);

  return {
    currentProfile: profiles[currentIndex],
    nextProfile: profiles[currentIndex + 1],
    hasMore: currentIndex < profiles.length,
    isLoading,
    handleSwipe,
    reload,
  };
};
