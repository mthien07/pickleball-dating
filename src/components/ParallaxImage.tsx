/**
 * ParallaxImage Component
 *
 * Image with parallax scroll effect for depth
 * Perfect for hero images and court details
 */

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface ParallaxImageProps {
  /**
   * Image source
   */
  source: ImageSource;

  /**
   * Scroll position shared value
   */
  scrollY: SharedValue<number>;

  /**
   * Image height
   */
  height: number;

  /**
   * Parallax speed factor
   * @default 0.5 (image moves half the speed of scroll)
   */
  parallaxFactor?: number;

  /**
   * Enable zoom effect on scroll
   * @default true
   */
  enableZoom?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  source,
  scrollY,
  height,
  parallaxFactor = 0.5,
  enableZoom = true,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Parallax translateY (moves slower than scroll)
    const translateY = interpolate(
      scrollY.value,
      [-height, 0, height],
      [-height * parallaxFactor, 0, height * parallaxFactor],
      Extrapolate.CLAMP
    );

    // Zoom effect when scrolling up
    const scale = enableZoom
      ? interpolate(scrollY.value, [-height, 0], [1.5, 1], Extrapolate.CLAMP)
      : 1;

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, { height }, animatedStyle]}>
      <Image source={source} style={styles.image} contentFit="cover" transition={300} />
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ParallaxImage;
