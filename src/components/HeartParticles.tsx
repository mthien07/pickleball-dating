/**
 * HeartParticles Component
 *
 * Burst of heart particles animation for like interactions
 * ANTIGRAVITY floating hearts! 💗
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

// ============================================
// TYPES
// ============================================

export interface HeartParticlesProps {
  /**
   * Trigger burst animation
   */
  trigger: boolean;

  /**
   * Number of particles
   * @default 8
   */
  count?: number;

  /**
   * Particle size
   * @default 16
   */
  size?: number;
}

// ============================================
// SINGLE PARTICLE
// ============================================

interface ParticleProps {
  index: number;
  total: number;
  size: number;
  trigger: boolean;
}

const Particle: React.FC<ParticleProps> = ({ index, total, size, trigger }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      // Calculate random direction
      const angle = (index / total) * Math.PI * 2;
      const distance = 40 + Math.random() * 20;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance - 20; // Slight upward bias (antigravity!)

      // Reset
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 0;
      opacity.value = 0;

      // Animate
      const delay = index * 30;

      scale.value = withDelay(
        delay,
        withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.back(1.5)),
        })
      );

      opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));

      translateX.value = withDelay(
        delay,
        withTiming(endX, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        })
      );

      translateY.value = withDelay(
        delay,
        withTiming(endY, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        })
      );

      // Fade out
      opacity.value = withDelay(
        delay + 400,
        withTiming(0, {
          duration: 200,
        })
      );

      scale.value = withDelay(
        delay + 400,
        withTiming(0, {
          duration: 200,
        })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          fontSize: size,
        },
        animatedStyle,
      ]}
    >
      💗
    </Animated.Text>
  );
};

// ============================================
// COMPONENT
// ============================================

export const HeartParticles: React.FC<HeartParticlesProps> = ({
  trigger,
  count = 8,
  size = 16,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <Particle key={index} index={index} total={count} size={size} trigger={trigger} />
      ))}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
});

export default HeartParticles;
