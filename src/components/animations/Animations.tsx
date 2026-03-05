import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { springConfig, timingConfig } from '../../animations/presets';
import { AnimationProps, SlideProps, StaggerContainerProps } from './animation-types';

// ---- FadeIn ----

export const FadeIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
  visible = true,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delay, withTiming(1, { ...timingConfig.normal, duration }));
    } else {
      opacity.value = withTiming(0, { ...timingConfig.normal, duration });
    }
  }, [visible, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ---- SlideIn ----

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
    let startVal = distance;
    if (direction === 'top' || direction === 'left') {
      startVal = -distance;
    }

    if (visible) {
      translate.value = withDelay(delay, withSpring(0, springConfig.gentle));
      opacity.value = withDelay(delay, withTiming(1, { ...timingConfig.normal, duration }));
    } else {
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
    return { opacity: opacity.value, transform };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ---- ZoomIn ----

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
      scale.value = withDelay(delay, withSpring(1, springConfig.normal));
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

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ---- StaggerContainer ----

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerTime = 100,
  style,
}) => (
  <View style={style}>
    {React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        const existingDelay = (child.props as any).delay || 0;
        return React.cloneElement(child, { delay: existingDelay + index * staggerTime } as any);
      }
      return child;
    })}
  </View>
);

export default { FadeIn, SlideIn, ZoomIn, StaggerContainer };
