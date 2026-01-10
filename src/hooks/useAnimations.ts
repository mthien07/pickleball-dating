/**
 * Enhanced Animation Hooks
 *
 * Reusable animation patterns converted from web animations
 * Using React Native Reanimated for smooth 60fps animations
 *
 * Patterns included:
 * - Press/Hover effects (scale, opacity, shadow)
 * - Spring animations
 * - Timing transitions
 * - Elevation changes
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// ============================================
// ANIMATION CONFIGS
// ============================================

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const TIMING_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1), // ease-in-out
};

// ============================================
// PRESS ANIMATION HOOK
// ============================================

/**
 * Button/Card press animation with scale effect
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();
 *
 * <Animated.View style={animatedStyle}>
 *   <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
 *     ...
 *   </TouchableOpacity>
 * </Animated.View>
 * ```
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

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};

// ============================================
// HOVER ELEVATION ANIMATION
// ============================================

/**
 * Elevation animation (shadow + scale)
 * Mimics web hover:shadow-xl effect
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, handlePressIn, handlePressOut } = useElevationAnimation();
 * ```
 */
export const useElevationAnimation = (config?: {
  elevationFrom?: number;
  elevationTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
}) => {
  const elevation = useSharedValue(config?.elevationFrom || 4);
  const scale = useSharedValue(config?.scaleFrom || 1);
  const translateY = useSharedValue(0); // ANTIGRAVITY: Vertical float

  const { elevationFrom = 4, elevationTo = 12, scaleFrom = 1, scaleTo = 1.02 } = config || {};

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }, // ANTIGRAVITY: Float up/down
    ],
    elevation: elevation.value,
    shadowOpacity: elevation.value / 20, // Dynamic shadow
    shadowRadius: elevation.value * 1.5, // ANTIGRAVITY: Bigger shadow when floating
    shadowOffset: {
      width: 0,
      height: elevation.value / 2, // ANTIGRAVITY: Shadow moves with button
    },
  }));

  const handlePressIn = () => {
    // ANTIGRAVITY: Button sinks down when pressed
    elevation.value = withSpring(elevationTo * 1.5, SPRING_CONFIG);
    scale.value = withSpring(scaleTo, SPRING_CONFIG);
    translateY.value = withSpring(3, SPRING_CONFIG); // Sink down
  };

  const handlePressOut = () => {
    // ANTIGRAVITY: Button floats back up
    elevation.value = withSpring(elevationFrom, SPRING_CONFIG);
    scale.value = withSpring(scaleFrom, SPRING_CONFIG);
    translateY.value = withSpring(-2, { ...SPRING_CONFIG, damping: 20 }); // Float up with overshoot

    // Return to rest position after brief hover
    setTimeout(() => {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }, 300);
  };

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};

// ============================================
// FADE ANIMATION
// ============================================

/**
 * Fade in/out animation
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, fadeIn, fadeOut } = useFadeAnimation();
 * ```
 */
export const useFadeAnimation = (config?: { initialOpacity?: number }) => {
  const opacity = useSharedValue(config?.initialOpacity || 0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeIn = (duration = 300) => {
    opacity.value = withTiming(1, { duration, easing: Easing.ease });
  };

  const fadeOut = (duration = 300) => {
    opacity.value = withTiming(0, { duration, easing: Easing.ease });
  };

  const setOpacity = (value: number) => {
    opacity.value = withTiming(value, TIMING_CONFIG);
  };

  return {
    animatedStyle,
    fadeIn,
    fadeOut,
    setOpacity,
  };
};

// ============================================
// RIPPLE EFFECT
// ============================================

/**
 * Ripple/Wave animation (like Material Design)
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, triggerRipple } = useRippleAnimation();
 *
 * <TouchableOpacity onPress={triggerRipple}>
 *   <Animated.View style={animatedStyle} />
 * </TouchableOpacity>
 * ```
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

  return {
    animatedStyle,
    triggerRipple,
  };
};

// ============================================
// BOUNCE ANIMATION
// ============================================

/**
 * Bounce animation for attention-grabbing effects
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, bounce } = useBounceAnimation();
 * ```
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

  return {
    animatedStyle,
    bounce,
  };
};

// ============================================
// SHIMMER/SKELETON ANIMATION
// ============================================

/**
 * Shimmer loading animation
 *
 * Usage:
 * ```tsx
 * const { animatedStyle } = useShimmerAnimation();
 * ```
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

  return {
    animatedStyle,
    startShimmer,
  };
};

// ============================================
// SLIDE ANIMATION
// ============================================

/**
 * Slide in/out animation
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, slideIn, slideOut } = useSlideAnimation('left');
 * ```
 */
export const useSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const slideIn = (distance = 100) => {
    if (direction === 'left') {
      translateX.value = withSpring(0, SPRING_CONFIG);
    }
    if (direction === 'right') {
      translateX.value = withSpring(0, SPRING_CONFIG);
    }
    if (direction === 'up') {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
    if (direction === 'down') {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  };

  const slideOut = (distance = 100) => {
    if (direction === 'left') {
      translateX.value = withSpring(-distance, SPRING_CONFIG);
    }
    if (direction === 'right') {
      translateX.value = withSpring(distance, SPRING_CONFIG);
    }
    if (direction === 'up') {
      translateY.value = withSpring(-distance, SPRING_CONFIG);
    }
    if (direction === 'down') {
      translateY.value = withSpring(distance, SPRING_CONFIG);
    }
  };

  return {
    animatedStyle,
    slideIn,
    slideOut,
  };
};
