/**
 * swipe-gesture-handler
 *
 * Encapsulates swipe action callbacks and keyboard gesture handling for HomeSwipeScreen.
 * Provides handleSwipeLeft, handleSwipeRight, handleSuperLike and web keyboard shortcuts.
 */

import { useRef, useCallback, useEffect, MutableRefObject } from 'react';
import { Platform } from 'react-native';
import { SwipeCardRef } from '../../../components/SwipeCard';
import { showSuccess } from '../../../services/toast';
import { DiscoveryProfile } from '../../../services/api/swipe.service';

interface SwipeHandlers {
  handleSwipeLeft: () => Promise<void>;
  handleSwipeRight: () => Promise<void>;
  handleSuperLike: () => Promise<void>;
}

interface Options {
  handleSwipe: (action: 'pass' | 'like' | 'super_like') => Promise<{ isMatch: boolean }>;
  currentProfile: DiscoveryProfile | null | undefined;
  swipeCardRef: MutableRefObject<SwipeCardRef | null>;
  shouldEnableKeyboard: boolean;
  isWeb: boolean;
}

export function useSwipeGestureHandler({
  handleSwipe,
  currentProfile,
  swipeCardRef,
  shouldEnableKeyboard,
  isWeb,
}: Options): SwipeHandlers {
  // Keep a ref so keyboard handlers always see the latest profile name
  const currentProfileRef = useRef(currentProfile);
  currentProfileRef.current = currentProfile;

  const handleSwipeLeft = useCallback(async () => {
    await handleSwipe('pass');
  }, [handleSwipe]);

  const handleSwipeRight = useCallback(async () => {
    const result = await handleSwipe('like');
    if (result.isMatch) {
      showSuccess("It's a Match! 🎉");
    } else {
      showSuccess(`Liked ${currentProfileRef.current?.display_name}!`);
    }
  }, [handleSwipe]);

  const handleSuperLike = useCallback(async () => {
    const result = await handleSwipe('super_like');
    if (result.isMatch) {
      showSuccess("It's a Match! 🎉");
    } else {
      showSuccess(`Super Liked ${currentProfileRef.current?.display_name}! ⚡`);
    }
    swipeCardRef.current?.swipe('up');
  }, [handleSwipe, swipeCardRef]);

  useEffect(() => {
    if (!shouldEnableKeyboard || !isWeb) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          swipeCardRef.current?.swipe('left');
          break;
        case 'ArrowRight':
          swipeCardRef.current?.swipe('right');
          break;
        case 'ArrowUp':
        case ' ':
          handleSuperLike();
          break;
        default:
          break;
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [shouldEnableKeyboard, isWeb, handleSuperLike, swipeCardRef]);

  return { handleSwipeLeft, handleSwipeRight, handleSuperLike };
}
