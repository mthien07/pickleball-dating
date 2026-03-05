/**
 * Miscellaneous Animation Hooks
 *
 * - Ripple/Wave (Material Design)
 * - Bounce (attention-grabbing)
 * - Shimmer/Skeleton loading
 * - Slide in/out
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from './use-press-elevation-fade-animations';

// ============================================
// RIPPLE EFFECT
// ============================================

/**
 * Ripple/Wave animation (like Material Design)
 */
export const useRippleAnimation = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const triggerRipple = () => {
    scale.value = 0;
    opacity.value = 0.5;
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
  };

  return { animatedStyle, triggerRipple };
};

// ============================================
// BOUNCE ANIMATION
// ============================================

/**
 * Bounce animation for attention-grabbing effects
 */
export const useBounceAnimation = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bounce = () => {
    scale.value = withSpring(1.2, { damping: 2, stiffness: 100 }, () => {
      scale.value = withSpring(1, { damping: 2, stiffness: 100 });
    });
  };

  return { animatedStyle, bounce };
};

// ============================================
// SHIMMER/SKELETON ANIMATION
// ============================================

/**
 * Shimmer loading animation
 */
export const useShimmerAnimation = () => {
  const translateX = useSharedValue(-300);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const startShimmer = () => {
    translateX.value = withTiming(300, { duration: 1500, easing: Easing.linear }, () => {
      translateX.value = -300;
    });
  };

  return { animatedStyle, startShimmer };
};

// ============================================
// SLIDE ANIMATION
// ============================================

/**
 * Slide in/out animation
 */
export const useSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const slideIn = (_distance = 100) => {
    if (direction === 'left' || direction === 'right') {
      translateX.value = withSpring(0, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  };

  const slideOut = (distance = 100) => {
    if (direction === 'left') {
      translateX.value = withSpring(-distance, SPRING_CONFIG);
    } else if (direction === 'right') {
      translateX.value = withSpring(distance, SPRING_CONFIG);
    } else if (direction === 'up') {
      translateY.value = withSpring(-distance, SPRING_CONFIG);
    } else if (direction === 'down') {
      translateY.value = withSpring(distance, SPRING_CONFIG);
    }
  };

  return { animatedStyle, slideIn, slideOut };
};
