/**
 * Animation Components Library
 *
 * A collection of reusable animated components using Reanimated.
 * Simplifies common animations like FadeIn, SlideIn, etc.
 * Uses shared configurations from ../animations/presets
 *
 * Usage:
 * ```tsx
 * <FadeIn delay={200}>
 *   <Text>Fades in after 200ms</Text>
 * </FadeIn>
 *
 * <SlideIn direction="up">
 *   <Button title="Slide Up" />
 * </SlideIn>
 * ```
 */

import React, { useEffect } from 'react';
import { View, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { springConfig, timingConfig } from '../animations/presets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface AnimationProps extends React.PropsWithChildren {
  /**
   * Delay in ms before starting animation
   * @default 0
   */
  delay?: number;

  /**
   * Duration in ms (for timing animations)
   * @default 500
   */
  duration?: number;

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Run animation on mount
   * @default true
   */
  visible?: boolean;
}

export interface SlideProps extends AnimationProps {
  /**
   * Direction to slide from
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Distance to slide
   * @default 50
   */
  distance?: number;
}

// ============================================
// FADE IN
// ============================================

export const FadeIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 500, // kept for backward compatibility override
  style,
  visible = true,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(
        delay,
        withTiming(1, { ...timingConfig.normal, duration })
      );
    } else {
      opacity.value = withTiming(0, { ...timingConfig.normal, duration });
    }
  }, [visible, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// SLIDE IN
// ============================================

export const SlideIn: React.FC<SlideProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'bottom',
  distance = 50,
  style,
  visible = true,
}) => {
  const opacity = useSharedValue(0);
  const translate = useSharedValue(distance);

  useEffect(() => {
    // Determine start value based on direction
    let startVal = distance;
    if (direction === 'top' || direction === 'left') {
      startVal = -distance;
    }

    if (visible) {
      // Reset to start position if not visible initially (conceptually)
      // For entering:
      translate.value = withDelay(
        delay,
        withSpring(0, springConfig.gentle)
      );
      opacity.value = withDelay(delay, withTiming(1, { ...timingConfig.normal, duration }));
    } else {
      // Exit
      translate.value = withTiming(startVal, { ...timingConfig.normal, duration });
      opacity.value = withTiming(0, { ...timingConfig.normal, duration });
    }
  }, [visible, delay, duration, direction, distance]);

  const animatedStyle = useAnimatedStyle(() => {
    const transform = [];

    if (direction === 'left' || direction === 'right') {
      transform.push({ translateX: translate.value });
    } else {
      transform.push({ translateY: translate.value });
    }

    return {
      opacity: opacity.value,
      transform,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// ZOOM IN
// ============================================

export const ZoomIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
  visible = true,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withDelay(
        delay,
        withSpring(1, springConfig.normal)
      );
      opacity.value = withDelay(delay, withTiming(1, { ...timingConfig.normal, duration }));
    } else {
      scale.value = withTiming(0.8, { ...timingConfig.normal, duration });
      opacity.value = withTiming(0, { ...timingConfig.normal, duration });
    }
  }, [visible, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// STAGGER CONTAINER
// ============================================

interface StaggerContainerProps extends AnimationProps {
  staggerTime?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerTime = 100,
  style,
}) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // Check if child accepts delay prop (like our components above)
          // We cast to any to check prop existence safely in JS/TS
          const existingDelay = (child.props as any).delay || 0;
          return React.cloneElement(child, {
             delay: existingDelay + index * staggerTime,
          } as any);
        }
        return child;
      })}
    </View>
  );
};

export default {
  FadeIn,
  SlideIn,
  ZoomIn,
  StaggerContainer,
};
