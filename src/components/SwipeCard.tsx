/**
 * SwipeCard Component
 *
 * Swipeable card with gesture support (Tinder-style)
 * Features LIKE/NOPE overlay indicators that appear during swipe
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
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProfileCard, ProfileCardProps } from './Card';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { colors, borderRadius } from '../theme/tokens';

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

  /**
   * Show overlay indicators (LIKE/NOPE)
   * @default true
   */
  showOverlays?: boolean;
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
// OVERLAY COMPONENT
// ============================================

interface SwipeOverlayProps {
  type: 'like' | 'nope';
  translateX: { value: number };
  threshold: number;
}

const SwipeOverlay = ({ type, translateX, threshold }: SwipeOverlayProps) => {
  const isLike = type === 'like';

  const animatedStyle = useAnimatedStyle(() => {
    // LIKE appears when swiping right (positive translateX)
    // NOPE appears when swiping left (negative translateX)
    const inputRange = isLike ? [0, threshold * 0.5, threshold] : [-threshold, -threshold * 0.5, 0];

    const opacity = interpolate(
      translateX.value,
      inputRange,
      isLike ? [0, 0.5, 1] : [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      inputRange,
      isLike ? [0.5, 0.8, 1] : [1, 0.8, 0.5],
      Extrapolate.CLAMP
    );

    const rotate = isLike ? '-15deg' : '15deg';

    return {
      opacity,
      transform: [{ scale }, { rotate }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.overlayContainer,
        isLike ? styles.likeOverlay : styles.nopeOverlay,
        animatedStyle,
      ]}
    >
      <View style={[styles.overlayBadge, { borderColor: isLike ? '#10B981' : '#EF4444' }]}>
        <Text style={[styles.overlayText, { color: isLike ? '#10B981' : '#EF4444' }]}>
          {isLike ? 'LIKE' : 'NOPE'}
        </Text>
      </View>
    </Animated.View>
  );
};

// ============================================
// SUPER LIKE OVERLAY
// ============================================

interface SuperLikeOverlayProps {
  translateY: { value: number };
  threshold: number;
}

const SuperLikeOverlay = ({ translateY, threshold }: SuperLikeOverlayProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Super Like appears when swiping up (negative translateY)
    const opacity = interpolate(
      translateY.value,
      [-threshold, -threshold * 0.5, 0],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      translateY.value,
      [-threshold, -threshold * 0.5, 0],
      [1, 0.8, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.superLikeOverlay, animatedStyle]}>
      <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.superLikeBadge}>
        <Ionicons name="star" size={32} color="#FFFFFF" />
        <Text style={styles.superLikeText}>SUPER LIKE</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// ============================================
// COMPONENT
// ============================================

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  (
    {
      user,
      onLike,
      onPass,
      onPress,
      swipeThreshold = SCREEN_WIDTH * 0.35,
      onSwipeComplete,
      showOverlays = true,
      ...profileCardProps
    },
    ref
  ) => {
    // Swipe gesture hook
    const { gestureHandler, animatedStyle, translateX, translateY, swipe, reset } = useSwipeGesture(
      {
        onSwipeRight: onLike,
        onSwipeLeft: onPass,
        threshold: swipeThreshold,
        maxRotation: 15,
        enableHaptic: true,
        onSwipeComplete,
      }
    );

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      swipe,
      reset,
    }));

    return (
      <GestureDetector gesture={gestureHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {/* Profile Card */}
          <ProfileCard user={user} onPress={onPress} {...profileCardProps} />

          {/* LIKE/NOPE Overlays */}
          {showOverlays && (
            <>
              <SwipeOverlay type="like" translateX={translateX} threshold={swipeThreshold} />
              <SwipeOverlay type="nope" translateX={translateX} threshold={swipeThreshold} />
              <SuperLikeOverlay translateY={translateY} threshold={100} />
            </>
          )}
        </Animated.View>
      </GestureDetector>
    );
  }
);

SwipeCard.displayName = 'SwipeCard';

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 3 / 4,
  },

  // Overlay base
  overlayContainer: {
    position: 'absolute',
    top: 60,
    zIndex: 100,
  },
  likeOverlay: {
    left: 24,
  },
  nopeOverlay: {
    right: 24,
  },
  overlayBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Super Like
  superLikeOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  superLikeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.xl,
  },
  superLikeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

// Default export
export default SwipeCard;
