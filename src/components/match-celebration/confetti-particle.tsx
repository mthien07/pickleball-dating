import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiParticleProps {
  delay: number;
  color: string;
}

export const ConfettiParticle: React.FC<ConfettiParticleProps> = React.memo(({ delay, color }) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const startX = (Math.random() - 0.5) * SCREEN_WIDTH * 0.4;
    const endX = startX + (Math.random() - 0.5) * 200;
    const duration = 2000 + Math.random() * 1000;

    translateX.value = startX;
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));

    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT, { duration, easing: Easing.out(Easing.quad) })
    );

    translateX.value = withDelay(delay, withTiming(endX, { duration }));

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
          duration: 1000 + Math.random() * 1000,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confettiParticle, { backgroundColor: color }, animatedStyle]} />
  );
});

ConfettiParticle.displayName = 'ConfettiParticle';

const styles = StyleSheet.create({
  confettiParticle: {
    position: 'absolute',
    top: 0,
    left: SCREEN_WIDTH / 2,
    width: 8,
    height: 12,
    borderRadius: 2,
  },
});
