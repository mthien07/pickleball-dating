/**
 * FloatingElement - Animated floating/bobbing effect wrapper
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3000,
  style,
}) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    // Floating up/down animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        true
      )
    );

    // Subtle rotation
    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(5, { duration: duration / 4 }),
          withTiming(0, { duration: duration / 4 }),
          withTiming(-5, { duration: duration / 4 }),
          withTiming(0, { duration: duration / 4 })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, translateY, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }] as const,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
