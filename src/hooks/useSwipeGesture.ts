/**
 * useSwipeGesture Hook
 *
 * Reusable hook for swipe card gestures (Tinder-style)
 * Uses react-native-gesture-handler and Reanimated worklets
 *
 * Usage:
 * ```tsx
 * const { gestureHandler, animatedStyle, translateX } = useSwipeGesture({
 *   onSwipeRight: handleLike,
 *   onSwipeLeft: handlePass,
 *   threshold: 150,
 * });
 *
 * <PanGestureHandler {...gestureHandler}>
 *   <Animated.View style={animatedStyle}>
 *     <Card />
 *   </Animated.View>
 * </PanGestureHandler>
 * ```
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Gesture } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface UseSwipeGestureOptions {
  /**
   * Callback when swiped right (like)
   */
  onSwipeRight?: () => void;

  /**
   * Callback when swiped left (pass)
   */
  onSwipeLeft?: () => void;

  /**
   * Swipe distance threshold to trigger action
   * @default SCREEN_WIDTH * 0.4 (40% of screen)
   */
  threshold?: number;

  /**
   * Maximum rotation angle in degrees
   * @default 15
   */
  maxRotation?: number;

  /**
   * Enable haptic feedback
   * @default true
   */
  enableHaptic?: boolean;

  /**
   * Callback when swipe completed (any direction)
   */
  onSwipeComplete?: () => void;
}

export interface UseSwipeGestureReturn {
  /**
   * Gesture handler event
   */
  gestureHandler: any;

  /**
   * Animated style object
   */
  animatedStyle: any;

  /**
   * Shared value for translateX
   */
  translateX: any;

  /**
   * Shared value for translateY
   */
  translateY: any;

  /**
   * Reset position programmatically
   */
  reset: () => void;

  /**
   * Trigger swipe programmatically
   */
  swipe: (direction: 'left' | 'right') => void;
}

// ============================================
// HOOK
// ============================================

export const useSwipeGesture = (
  options: UseSwipeGestureOptions = {}
): UseSwipeGestureReturn => {
  const {
    onSwipeRight,
    onSwipeLeft,
    threshold = SCREEN_WIDTH * 0.4,
    maxRotation = 15,
    enableHaptic = true,
    onSwipeComplete,
  } = options;

  // Shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Context for gesture (store start positions)
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [enableHaptic]);

  // Gesture handler
  const gestureHandler = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onChange((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;

      // Trigger haptic at threshold
      if (enableHaptic && Math.abs(event.translationX) > threshold) {
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      const swipeDistance = event.translationX;

      if (Math.abs(swipeDistance) > threshold) {
        // Complete the swipe
        const direction = swipeDistance > 0 ? 1 : -1;
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, {
          duration: 300,
        });
        translateY.value = withTiming(translateY.value + event.velocityY * 0.1, {
          duration: 300,
        });

        // Trigger callbacks
        if (direction > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)();
        } else if (direction < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)();
        }

        if (onSwipeComplete) {
          runOnJS(onSwipeComplete)();
        }
      } else {
        // Bounce back
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-maxRotation, 0, maxRotation],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, threshold * 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  // Reset position
  const reset = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  }, []);

  // Programmatic swipe
  const swipe = useCallback((direction: 'left' | 'right') => {
    const dir = direction === 'right' ? 1 : -1;
    translateX.value = withTiming(dir * SCREEN_WIDTH * 1.5, {
      duration: 300,
    });

    if (enableHaptic) {
      triggerHaptic();
    }

    if (direction === 'right' && onSwipeRight) {
      onSwipeRight();
    } else if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    }

    if (onSwipeComplete) {
      onSwipeComplete();
    }
  }, [onSwipeRight, onSwipeLeft, onSwipeComplete, enableHaptic]);

  return {
    gestureHandler,
    animatedStyle,
    translateX,
    translateY,
    reset,
    swipe,
  };
};

export default useSwipeGesture;
