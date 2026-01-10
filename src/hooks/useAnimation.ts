/**
 * useAnimation Hook
 *
 * Simplified animation hook with common patterns
 *
 * Usage:
 * ```tsx
 * const { animatedStyle, fadeIn, fadeOut } = useAnimation();
 *
 * useEffect(() => {
 *   fadeIn();
 * }, []);
 *
 * <Animated.View style={animatedStyle} />
 * ```
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { timingConfig, springConfig } from '../animations/presets';
import * as Haptics from 'expo-haptics';

// ============================================
// TYPES
// ============================================

export interface UseAnimationOptions {
  /**
   * Initial opacity
   * @default 0
   */
  initialOpacity?: number;

  /**
   * Initial scale
   * @default 1
   */
  initialScale?: number;

  /**
   * Initial translateY
   * @default 0
   */
  initialTranslateY?: number;

  /**
   * Initial translateX
   * @default 0
   */
  initialTranslateX?: number;

  /**
   * Enable haptic feedback
   * @default false
   */
  enableHaptic?: boolean;

  /**
   * Callback after animation completes
   */
  onComplete?: () => void;
}

// ============================================
// HOOK
// ============================================

export const useAnimation = (options: UseAnimationOptions = {}) => {
  const {
    initialOpacity = 0,
    initialScale = 1,
    initialTranslateY = 0,
    initialTranslateX = 0,
    enableHaptic = false,
    onComplete,
  } = options;

  // Shared values
  const opacity = useSharedValue(initialOpacity);
  const scale = useSharedValue(initialScale);
  const translateY = useSharedValue(initialTranslateY);
  const translateX = useSharedValue(initialTranslateX);
  const rotate = useSharedValue(0);

  // Trigger haptic if enabled
  const triggerHaptic = useCallback(() => {
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [enableHaptic]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // Animation methods
  const fadeIn = useCallback(
    (duration?: number) => {
      opacity.value = withTiming(
        1,
        {
          ...timingConfig.normal,
          ...(duration && { duration }),
        },
        onComplete ? () => runOnJS(onComplete)() : undefined
      );

      if (enableHaptic) {
        runOnJS(triggerHaptic)();
      }
    },
    [enableHaptic, onComplete]
  );

  const fadeOut = useCallback(
    (duration?: number) => {
      opacity.value = withTiming(
        0,
        {
          ...timingConfig.normal,
          ...(duration && { duration }),
        },
        onComplete ? () => runOnJS(onComplete)() : undefined
      );
    },
    [onComplete]
  );

  const scaleIn = useCallback(() => {
    scale.value = withSpring(
      1,
      springConfig.normal,
      onComplete ? () => runOnJS(onComplete)() : undefined
    );
    if (enableHaptic) {
      runOnJS(triggerHaptic)();
    }
  }, [enableHaptic, onComplete]);

  const scaleOut = useCallback(() => {
    scale.value = withSpring(
      0,
      springConfig.normal,
      onComplete ? () => runOnJS(onComplete)() : undefined
    );
  }, [onComplete]);

  const scalePop = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.1, springConfig.bouncy),
      withSpring(1, springConfig.normal)
    );
    if (enableHaptic) {
      runOnJS(triggerHaptic)();
    }
  }, [enableHaptic]);

  const slideUp = useCallback((distance: number = 50) => {
    translateY.value = withSpring(translateY.value - distance, springConfig.normal);
  }, []);

  const slideDown = useCallback((distance: number = 50) => {
    translateY.value = withSpring(translateY.value + distance, springConfig.normal);
  }, []);

  const slideLeft = useCallback((distance: number = 50) => {
    translateX.value = withSpring(translateX.value - distance, springConfig.normal);
  }, []);

  const slideRight = useCallback((distance: number = 50) => {
    translateX.value = withSpring(translateX.value + distance, springConfig.normal);
  }, []);

  const reset = useCallback(() => {
    opacity.value = withTiming(initialOpacity, timingConfig.fast);
    scale.value = withSpring(initialScale, springConfig.stiff);
    translateY.value = withSpring(initialTranslateY, springConfig.stiff);
    translateX.value = withSpring(initialTranslateX, springConfig.stiff);
    rotate.value = withTiming(0, timingConfig.fast);
  }, [initialOpacity, initialScale, initialTranslateY, initialTranslateX]);

  const shake = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    if (enableHaptic) {
      runOnJS(triggerHaptic)();
    }
  }, [enableHaptic]);

  const pulse = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  }, []);

  const spin = useCallback(() => {
    rotate.value = withTiming(rotate.value + 360, { duration: 1000 });
  }, []);

  return {
    // Shared values (for custom animations)
    opacity,
    scale,
    translateY,
    translateX,
    rotate,

    // Animated style
    animatedStyle,

    // Animation methods
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    scalePop,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    reset,
    shake,
    pulse,
    spin,
  };
};

export default useAnimation;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic fade in
const FadeInComponent = () => {
  const { animatedStyle, fadeIn } = useAnimation({ initialOpacity: 0 });

  useEffect(() => {
    fadeIn();
  }, []);

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};

// Scale pop on press
const PopButton = () => {
  const { animatedStyle, scalePop } = useAnimation();

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={scalePop}>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Shake on error
const ShakingInput = ({ hasError }) => {
  const { animatedStyle, shake } = useAnimation({ enableHaptic: true });

  useEffect(() => {
    if (hasError) {
      shake();
    }
  }, [hasError]);

  return <Animated.View style={animatedStyle}><Input /></Animated.View>;
};

// Complex animation sequence
const ComplexAnimation = () => {
  const { animatedStyle, fadeIn, scaleIn, slideUp } = useAnimation({
    initialOpacity: 0,
    initialScale: 0,
    initialTranslateY: 50,
  });

  useEffect(() => {
    fadeIn();
    scaleIn();
    slideUp(50);
  }, []);

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};

// With callback
const AnimationWithCallback = () => {
  const { animatedStyle, fadeOut } = useAnimation({
    onComplete: () => {
      console.log('Animation completed!');
      navigation.goBack();
    },
  });

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};
*/
