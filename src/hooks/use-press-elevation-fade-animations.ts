/**
 * Press, Elevation, and Fade Animation Hooks
 *
 * Reusable animation patterns:
 * - Press/scale effects
 * - Elevation (antigravity shadow + scale)
 * - Fade in/out
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { HOOK_SPRING_CONFIG, HOOK_TIMING_EASE } from '../animations/animation-utils';

// Re-export as the public API names callers expect
export const SPRING_CONFIG = HOOK_SPRING_CONFIG;
export const TIMING_CONFIG = HOOK_TIMING_EASE;

// ============================================
// PRESS ANIMATION HOOK
// ============================================

/**
 * Button/Card press animation with scale effect
 */
export const usePressAnimation = (config?: { scaleValue?: number; useSpring?: boolean }) => {
  const scale = useSharedValue(1);
  const { scaleValue = 0.98, useSpring: shouldUseSpring = true } = config || {};

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = shouldUseSpring
      ? withSpring(scaleValue, SPRING_CONFIG)
      : withTiming(scaleValue, TIMING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = shouldUseSpring ? withSpring(1, SPRING_CONFIG) : withTiming(1, TIMING_CONFIG);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
};

// ============================================
// HOVER ELEVATION ANIMATION
// ============================================

/**
 * Elevation animation (shadow + scale) - mimics web hover:shadow-xl
 */
export const useElevationAnimation = (config?: {
  elevationFrom?: number;
  elevationTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
}) => {
  const { elevationFrom = 4, elevationTo = 12, scaleFrom = 1, scaleTo = 1.02 } = config || {};
  const elevation = useSharedValue(elevationFrom);
  const scale = useSharedValue(scaleFrom);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    elevation: elevation.value,
    shadowOpacity: elevation.value / 20,
    shadowRadius: elevation.value * 1.5,
    shadowOffset: { width: 0, height: elevation.value / 2 },
  }));

  const handlePressIn = () => {
    elevation.value = withSpring(elevationTo * 1.5, SPRING_CONFIG);
    scale.value = withSpring(scaleTo, SPRING_CONFIG);
    translateY.value = withSpring(3, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    elevation.value = withSpring(elevationFrom, SPRING_CONFIG);
    scale.value = withSpring(scaleFrom, SPRING_CONFIG);
    translateY.value = withSpring(-2, { ...SPRING_CONFIG, damping: 20 });
    setTimeout(() => {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }, 300);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
};

// ============================================
// FADE ANIMATION
// ============================================

/**
 * Fade in/out animation
 */
export const useFadeAnimation = (config?: { initialOpacity?: number }) => {
  const opacity = useSharedValue(config?.initialOpacity || 0);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const fadeIn = (duration = 300) => {
    opacity.value = withTiming(1, { duration, easing: Easing.ease });
  };

  const fadeOut = (duration = 300) => {
    opacity.value = withTiming(0, { duration, easing: Easing.ease });
  };

  const setOpacity = (value: number) => {
    opacity.value = withTiming(value, TIMING_CONFIG);
  };

  return { animatedStyle, fadeIn, fadeOut, setOpacity };
};
