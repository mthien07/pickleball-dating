/**
 * ProgressBar Component
 *
 * A reusable progress bar with animation support.
 *
 * Usage:
 * ```tsx
 * <ProgressBar progress={0.5} color={colors.primary} />
 * ```
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { borderRadius, spacing } from '../theme/tokens';
import { useThemeColors } from '../contexts/ThemeContext';

// ============================================
// TYPES
// ============================================

export interface ProgressBarProps {
  /**
   * Progress value between 0 and 1
   */
  progress: number;

  /**
   * Bar color
   * @default colors.primary
   */
  color?: string;

  /**
   * Track (background) color
   * @default colors.border
   */
  trackColor?: string;

  /**
   * Height of the progress bar
   * @default 8
   */
  height?: number;

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Animated change
   * @default true
   */
  animated?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  trackColor,
  height = 8,
  style,
  animated = true,
}) => {
  const colors = useThemeColors();
  const resolvedColor = color ?? colors.primary;
  const resolvedTrackColor = trackColor ?? colors.border;
  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const widthValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      widthValue.value = withTiming(clampedProgress, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      widthValue.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${widthValue.value * 100}%` as DimensionValue,
    backgroundColor: resolvedColor,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: resolvedTrackColor,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          {
            height,
            borderRadius: height / 2,
          },
          progressStyle,
        ]}
      />
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;
