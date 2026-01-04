/**
 * GlassView Component
 *
 * A reusable glassmorphism container using expo-blur.
 * Provides a frosted glass effect with optional gradient overlay.
 *
 * Usage:
 * ```tsx
 * <GlassView intensity={50} style={styles.container}>
 *   <Text>Content on Glass</Text>
 * </GlassView>
 * ```
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export interface GlassViewProps extends React.PropsWithChildren {
  /**
   * Blur intensity (0-100)
   * @default 50
   */
  intensity?: number;

  /**
   * Tint of the blur effect
   * @default 'default'
   */
  tint?: BlurViewProps['tint'];

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Border radius
   * @default borderRadius.md
   */
  borderRadius?: number;

  /**
   * Show a subtle gradient overlay for better depth
   * @default true
   */
  showGradient?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  intensity = 50,
  tint = 'light',
  style,
  borderRadius: radius = borderRadius.md,
  showGradient = true,
}) => {
  // On Android, BlurView support varies. Expo Blur works well on newer versions.
  // We can add a fallback background color transparency for safety.

  const containerStyle: ViewStyle = {
    borderRadius: radius,
    overflow: 'hidden',
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.5)', // Fallback for android if blur fails or looks weird
      web: 'rgba(255, 255, 255, 0.5)', // Web fallback
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      {showGradient && (
        <LinearGradient
          colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  content: {
    // Ensure content sits above the blur layers
    zIndex: 1,
  },
});

export default GlassView;

