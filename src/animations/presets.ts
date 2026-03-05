/**
 * Animation Presets
 *
 * Reusable animation configurations for consistent animations across app.
 * Configs are in animation-configs.ts, this file contains animation functions.
 *
 * Usage:
 * ```tsx
 * import { fadeIn, slideUp } from '@/animations/presets';
 * const animatedStyle = useAnimatedStyle(() => fadeIn(opacity.value));
 * ```
 */

import { withTiming, withSpring, withSequence, withDelay, Easing } from 'react-native-reanimated';
import { timingConfig, springConfig } from './animation-configs';

// Re-export configs
export { timingConfig, springConfig };

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = (_value: number = 0) => {
  'worklet';
  return withTiming(1, timingConfig.normal);
};
export const fadeOut = (_value: number = 1) => {
  'worklet';
  return withTiming(0, timingConfig.normal);
};
export const fadeInSlow = () => {
  'worklet';
  return withTiming(1, timingConfig.slow);
};
export const fadeOutFast = () => {
  'worklet';
  return withTiming(0, timingConfig.fast);
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn = () => {
  'worklet';
  return withSpring(1, springConfig.normal);
};
export const scaleOut = () => {
  'worklet';
  return withSpring(0, springConfig.normal);
};
export const scalePop = () => {
  'worklet';
  return withSequence(withSpring(1.1, springConfig.bouncy), withSpring(1, springConfig.normal));
};
export const scalePress = () => {
  'worklet';
  return withSpring(0.95, springConfig.stiff);
};
export const scaleRelease = () => {
  'worklet';
  return withSpring(1, springConfig.stiff);
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideUp = (distance = 100) => {
  'worklet';
  return withTiming(-distance, timingConfig.smooth);
};
export const slideDown = (distance = 100) => {
  'worklet';
  return withTiming(distance, timingConfig.smooth);
};
export const slideLeft = (distance = 100) => {
  'worklet';
  return withTiming(-distance, timingConfig.smooth);
};
export const slideRight = (distance = 100) => {
  'worklet';
  return withTiming(distance, timingConfig.smooth);
};
export const slideInFromBottom = (_distance = 100) => {
  'worklet';
  return withSpring(0, springConfig.normal);
};
export const slideInFromTop = (_distance = 100) => {
  'worklet';
  return withSpring(0, springConfig.normal);
};

// ============================================
// ROTATION ANIMATIONS
// ============================================

export const rotate360 = () => {
  'worklet';
  return withTiming(360, { duration: 1000, easing: Easing.linear });
};
export const rotateIn = () => {
  'worklet';
  return withSpring(0, springConfig.bouncy);
};
export const rotateOut = (degrees = 90) => {
  'worklet';
  return withTiming(degrees, timingConfig.normal);
};

// ============================================
// SPECIAL ANIMATIONS
// ============================================

export const shake = () => {
  'worklet';
  return withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

export const pulse = () => {
  'worklet';
  return withSequence(withTiming(1.05, { duration: 150 }), withTiming(1, { duration: 150 }));
};

export const bounceIn = () => {
  'worklet';
  return withSequence(
    withSpring(1.2, { damping: 8, stiffness: 100 }),
    withSpring(1, springConfig.normal)
  );
};

export const stagger = (delay: number, animation: any) => {
  'worklet';
  return withDelay(delay, animation);
};

export const likeAnimation = () => {
  'worklet';
  return withSequence(
    withSpring(1.3, { damping: 10, stiffness: 300 }),
    withSpring(1, springConfig.normal)
  );
};

// ============================================
// COMBO ANIMATIONS
// ============================================

export const fadeScaleIn = () => {
  'worklet';
  return { opacity: fadeIn(), transform: [{ scale: scaleIn() }] };
};

export const fadeSlideUp = (distance = 50) => {
  'worklet';
  return { opacity: fadeIn(), transform: [{ translateY: slideUp(distance) }] };
};

// ============================================
// PAGE TRANSITION ANIMATIONS
// ============================================

export const pageTransitions = {
  slideLeft: {
    entering: () => {
      'worklet';
      return { transform: [{ translateX: withSpring(0, springConfig.normal) }] };
    },
    exiting: () => {
      'worklet';
      return { transform: [{ translateX: withTiming(-100, timingConfig.fast) }] };
    },
  },
  fade: {
    entering: () => {
      'worklet';
      return { opacity: fadeIn() };
    },
    exiting: () => {
      'worklet';
      return { opacity: fadeOut() };
    },
  },
  modal: {
    entering: () => {
      'worklet';
      return { opacity: fadeIn(), transform: [{ scale: scaleIn() }] };
    },
    exiting: () => {
      'worklet';
      return { opacity: fadeOut(), transform: [{ scale: scaleOut() }] };
    },
  },
};

export default {
  timingConfig,
  springConfig,
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  scalePop,
  slideUp,
  slideDown,
  rotate360,
  shake,
  pulse,
  bounceIn,
  stagger,
  pageTransitions,
};
