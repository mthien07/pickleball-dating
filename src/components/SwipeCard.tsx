/**
 * SwipeCard Component
 *
 * Swipeable card with gesture support (Tinder-style)
 * Wraps ProfileCard with swipe functionality
 *
 * Usage:
 * ```tsx
 * <SwipeCard
 *   user={user}
 *   onLike={handleLike}
 *   onPass={handlePass}
 *   onPress={handleViewProfile}
 * />
 * ```
 */

import React, { useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ProfileCard, ProfileCardProps } from './Card';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface SwipeCardProps extends ProfileCardProps {
  /**
   * Override swipe threshold
   * @default SCREEN_WIDTH * 0.35
   */
  swipeThreshold?: number;

  /**
   * Callback when card exits screen
   */
  onSwipeComplete?: () => void;
}

export interface SwipeCardRef {
  /**
   * Trigger swipe programmatically
   */
  swipe: (direction: 'left' | 'right') => void;

  /**
   * Reset card position
   */
  reset: () => void;
}

// ============================================
// COMPONENT
// ============================================

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(({
  user,
  onLike,
  onPass,
  onPress,
  swipeThreshold = SCREEN_WIDTH * 0.35,
  onSwipeComplete,
  ...profileCardProps
}, ref) => {
  // Swipe gesture hook
  const {
    gestureHandler,
    animatedStyle,
    swipe,
    reset,
  } = useSwipeGesture({
    onSwipeRight: onLike,
    onSwipeLeft: onPass,
    threshold: swipeThreshold,
    maxRotation: 15,
    enableHaptic: true,
    onSwipeComplete,
  });

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    swipe,
    reset,
  }));

  return (
    <GestureDetector gesture={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <ProfileCard
          user={user}
          onPress={onPress}
          {...profileCardProps}
        />
      </Animated.View>
    </GestureDetector>
  );
});

SwipeCard.displayName = 'SwipeCard';

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 3 / 4,
  },
});

// Default export
export default SwipeCard;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
<SwipeCard
  user={user}
  onLike={handleLike}
  onPass={handlePass}
/>

// With ref (programmatic control)
const swipeCardRef = useRef<SwipeCardRef>(null);

<SwipeCard
  ref={swipeCardRef}
  user={user}
  onLike={handleLike}
  onPass={handlePass}
/>

// Trigger swipe via button
<Button onPress={() => swipeCardRef.current?.swipe('left')} />
<Button onPress={() => swipeCardRef.current?.swipe('right')} />

// With onSwipeComplete
<SwipeCard
  user={user}
  onLike={handleLike}
  onPass={handlePass}
  onSwipeComplete={() => loadNextProfile()}
/>

// Custom threshold
<SwipeCard
  user={user}
  onLike={handleLike}
  onPass={handlePass}
  swipeThreshold={200}
/>
*/
