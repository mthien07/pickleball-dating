/**
 * useSwipeGesture Hook
 *
 * Reusable hook for swipe card gestures (Tinder-style).
 * Uses react-native-gesture-handler and Reanimated worklets.
 *
 * Usage:
 * ```tsx
 * const { gestureHandler, animatedStyle } = useSwipeGesture({
 *   onSwipeRight: handleLike,
 *   onSwipeLeft: handlePass,
 * });
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
import type { UseSwipeGestureOptions, UseSwipeGestureReturn } from './useSwipeGesture.types';

export type { UseSwipeGestureOptions, UseSwipeGestureReturn };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const useSwipeGesture = (options: UseSwipeGestureOptions = {}): UseSwipeGestureReturn => {
  const {
    onSwipeRight,
    onSwipeLeft,
    threshold = SCREEN_WIDTH * 0.4,
    maxRotation = 15,
    enableHaptic = true,
    onSwipeComplete,
  } = options;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const triggerHaptic = useCallback(() => {
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [enableHaptic]);

  const gestureHandler = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onChange((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
      if (enableHaptic && Math.abs(event.translationX) > threshold) {
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      const swipeDistance = event.translationX;

      if (Math.abs(swipeDistance) > threshold) {
        const direction = swipeDistance > 0 ? 1 : -1;
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(translateY.value + event.velocityY * 0.1, { duration: 300 });

        if (direction > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)();
        } else if (direction < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)();
        }
        if (onSwipeComplete) {
          runOnJS(onSwipeComplete)();
        }
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

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
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, threshold * 0.5],
      [1, 1.05],
      Extrapolate.CLAMP
    );
    const shadowOpacity = interpolate(
      Math.abs(translateX.value),
      [0, threshold * 0.5],
      [0.15, 0.4],
      Extrapolate.CLAMP
    );
    const shadowRadius = interpolate(
      Math.abs(translateX.value),
      [0, threshold * 0.5],
      [8, 20],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity,
      shadowOpacity,
      shadowRadius,
      shadowOffset: {
        width: 0,
        height: interpolate(
          Math.abs(translateX.value),
          [0, threshold * 0.5],
          [4, 12],
          Extrapolate.CLAMP
        ),
      },
      elevation: interpolate(
        Math.abs(translateX.value),
        [0, threshold * 0.5],
        [4, 12],
        Extrapolate.CLAMP
      ),
    };
  });

  const reset = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  }, []);

  const swipe = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      if (direction === 'up') {
        translateY.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
      } else {
        const dir = direction === 'right' ? 1 : -1;
        translateX.value = withTiming(dir * SCREEN_WIDTH * 1.5, { duration: 300 });
      }
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
    },
    [onSwipeRight, onSwipeLeft, onSwipeComplete, enableHaptic]
  );

  return { gestureHandler, animatedStyle, translateX, translateY, reset, swipe };
};

export default useSwipeGesture;
