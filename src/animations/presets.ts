/**
 * Animation Presets
 *
 * Reusable animation configurations for consistent animations across app
 *
 * Usage:
 * ```tsx
 * import { fadeIn, slideUp } from '@/animations/presets';
 *
 * const animatedStyle = useAnimatedStyle(() => fadeIn(opacity.value));
 * ```
 */

import {
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';
import { durations } from '../theme/tokens';

// ============================================
// TIMING CONFIGS
// ============================================

export const timingConfig = {
  fast: {
    duration: durations.fast,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  normal: {
    duration: durations.normal,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  medium: {
    duration: durations.medium,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,

  slow: {
    duration: durations.slow,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,

  // Специальные easings
  smooth: {
    duration: durations.normal,
    easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design standard
  } as WithTimingConfig,

  bounce: {
    duration: durations.medium,
    easing: Easing.bounce,
  } as WithTimingConfig,
};

// ============================================
// SPRING CONFIGS
// ============================================

export const springConfig = {
  gentle: {
    damping: 20,
    stiffness: 90,
  } as WithSpringConfig,

  normal: {
    damping: 15,
    stiffness: 150,
  } as WithSpringConfig,

  bouncy: {
    damping: 10,
    stiffness: 100,
  } as WithSpringConfig,

  stiff: {
    damping: 30,
    stiffness: 400,
  } as WithSpringConfig,
};

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = (value: number = 0) => {
  'worklet';
  return withTiming(1, timingConfig.normal);
};

export const fadeOut = (value: number = 1) => {
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
  return withSequence(
    withSpring(1.1, springConfig.bouncy),
    withSpring(1, springConfig.normal)
  );
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

export const slideUp = (distance: number = 100) => {
  'worklet';
  return withTiming(-distance, timingConfig.smooth);
};

export const slideDown = (distance: number = 100) => {
  'worklet';
  return withTiming(distance, timingConfig.smooth);
};

export const slideLeft = (distance: number = 100) => {
  'worklet';
  return withTiming(-distance, timingConfig.smooth);
};

export const slideRight = (distance: number = 100) => {
  'worklet';
  return withTiming(distance, timingConfig.smooth);
};

export const slideInFromBottom = (distance: number = 100) => {
  'worklet';
  return withSpring(0, springConfig.normal);
};

export const slideInFromTop = (distance: number = 100) => {
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

export const rotateOut = (degrees: number = 90) => {
  'worklet';
  return withTiming(degrees, timingConfig.normal);
};

// ============================================
// SHAKE ANIMATION
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

// ============================================
// PULSE ANIMATION
// ============================================

export const pulse = () => {
  'worklet';
  return withSequence(
    withTiming(1.05, { duration: 150 }),
    withTiming(1, { duration: 150 })
  );
};

// ============================================
// BOUNCE ANIMATION
// ============================================

export const bounceIn = () => {
  'worklet';
  return withSequence(
    withSpring(1.2, { damping: 8, stiffness: 100 }),
    withSpring(1, springConfig.normal)
  );
};

// ============================================
// STAGGER ANIMATION
// ============================================

export const stagger = (delay: number, animation: any) => {
  'worklet';
  return withDelay(delay, animation);
};

// ============================================
// COMBO ANIMATIONS
// ============================================

/**
 * Fade + Scale In
 */
export const fadeScaleIn = () => {
  'worklet';
  return {
    opacity: fadeIn(),
    transform: [{ scale: scaleIn() }],
  };
};

/**
 * Fade + Slide Up
 */
export const fadeSlideUp = (distance: number = 50) => {
  'worklet';
  return {
    opacity: fadeIn(),
    transform: [{ translateY: slideUp(distance) }],
  };
};

/**
 * Scale + Rotate (Like button)
 */
export const likeAnimation = () => {
  'worklet';
  return withSequence(
    withSpring(1.3, { damping: 10, stiffness: 300 }),
    withSpring(1, springConfig.normal)
  );
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
      return {
        opacity: fadeIn(),
        transform: [{ scale: scaleIn() }],
      };
    },
    exiting: () => {
      'worklet';
      return {
        opacity: fadeOut(),
        transform: [{ scale: scaleOut() }],
      };
    },
  },
};

// Default export
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
