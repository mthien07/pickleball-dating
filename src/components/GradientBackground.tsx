/**
 * Gradient Background Components
 *
 * Reusable gradient wrappers với màu theme của app (Red-Orange)
 * Converted from web gradient patterns
 *
 * Usage:
 * ```tsx
 * <GradientButton onPress={handlePress}>
 *   <Text>Click me</Text>
 * </GradientButton>
 *
 * <GradientCard>
 *   <Text>Content</Text>
 * </GradientCard>
 * ```
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

// ============================================
// GRADIENT COLORS (21st.dev Orange/Green Theme)
// ============================================

export const GRADIENT_COLORS = {
  // Primary gradient: Orange-500 to Orange-400
  primary: ['#F97316', '#FB923C'] as const,

  // Reversed: Orange-400 to Orange-500
  primaryReverse: ['#FB923C', '#F97316'] as const,

  // Subtle gradient with transparency (Orange)
  primarySubtle: ['rgba(249, 115, 22, 0.1)', 'rgba(251, 146, 60, 0.1)'] as const,

  // Dark gradient (Orange-600 to Orange-700)
  primaryDark: ['#EA580C', '#C2410C'] as const,

  // Light gradient (Orange-300 to Orange-200)
  primaryLight: ['#FDBA74', '#FED7AA'] as const,

  // Secondary gradient (Green-500 to Green-400)
  secondary: ['#22C55E', '#4ADE80'] as const,

  // Background gradients
  bgSubtle: ['rgba(249, 115, 22, 0.05)', 'rgba(34, 197, 94, 0.05)', 'rgba(249, 115, 22, 0.05)'] as const,
  bgMedium: ['rgba(249, 115, 22, 0.2)', 'rgba(34, 197, 94, 0.2)'] as const,
};

// ============================================
// GRADIENT DIRECTIONS
// ============================================

export const GRADIENT_DIRECTIONS = {
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  radial: { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } },
};

// ============================================
// GRADIENT VIEW
// ============================================

interface GradientViewProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientView: React.FC<GradientViewProps> = ({
  colors = GRADIENT_COLORS.primary,
  direction = 'horizontal',
  style,
  children,
}) => {
  const { start, end } = GRADIENT_DIRECTIONS[direction];

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradientContainer, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ============================================
// GRADIENT BUTTON
// ============================================

interface GradientButtonProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'primary' | 'subtle' | 'dark' | 'light';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  colors,
  direction = 'horizontal',
  style,
  children,
  variant = 'primary',
}) => {
  const getVariantColors = () => {
    if (colors) return colors;
    switch (variant) {
      case 'primary': return GRADIENT_COLORS.primary;
      case 'subtle': return GRADIENT_COLORS.primarySubtle;
      case 'dark': return GRADIENT_COLORS.primaryDark;
      case 'light': return GRADIENT_COLORS.primaryLight;
      default: return GRADIENT_COLORS.primary;
    }
  };
  const gradientColors = getVariantColors();
  const { start, end } = GRADIENT_DIRECTIONS[direction];

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.gradientButton, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ============================================
// GRADIENT CARD
// ============================================

interface GradientCardProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'subtle' | 'medium' | 'primary';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  colors,
  direction = 'diagonal',
  style,
  children,
  variant = 'subtle',
}) => {
  const gradientColors = colors ||
    (variant === 'subtle' ? GRADIENT_COLORS.primarySubtle :
     variant === 'medium' ? GRADIENT_COLORS.bgMedium :
     GRADIENT_COLORS.primary);

  const { start, end } = GRADIENT_DIRECTIONS[direction];

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ============================================
// GRADIENT OVERLAY
// ============================================

interface GradientOverlayProps {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'full';
  intensity?: 'light' | 'medium' | 'heavy';
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  position = 'bottom',
  intensity = 'medium',
  style,
  children,
}) => {
  const getColors = (): readonly [string, string] => {
    const alphaMap = {
      light: { from: 0, to: 0.3 },
      medium: { from: 0, to: 0.6 },
      heavy: { from: 0, to: 0.8 },
    };

    const alpha = alphaMap[intensity];

    return [
      `rgba(239, 68, 68, ${alpha.from})`,
      `rgba(249, 115, 22, ${alpha.to})`,
    ] as const;
  };

  const getDirection = () => {
    switch (position) {
      case 'top':
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 0.5 } };
      case 'bottom':
        return { start: { x: 0, y: 0.5 }, end: { x: 0, y: 1 } };
      case 'left':
        return { start: { x: 0, y: 0 }, end: { x: 0.5, y: 0 } };
      case 'right':
        return { start: { x: 0.5, y: 0 }, end: { x: 1, y: 0 } };
      case 'full':
      default:
        return GRADIENT_DIRECTIONS.diagonal;
    }
  };

  const { start, end } = getDirection();

  return (
    <View style={[styles.overlayContainer, style]}>
      {children}
      <LinearGradient
        colors={getColors()}
        start={start}
        end={end}
        style={styles.overlay}
        pointerEvents="none"
      />
    </View>
  );
};

// ============================================
// ANIMATED GRADIENT VIEW
// ============================================

interface AnimatedGradientViewProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: any; // AnimatedStyle from Reanimated
  children?: React.ReactNode;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const AnimatedGradientView: React.FC<AnimatedGradientViewProps> = ({
  colors = GRADIENT_COLORS.primary,
  direction = 'horizontal',
  style,
  children,
}) => {
  const { start, end } = GRADIENT_DIRECTIONS[direction];

  return (
    <AnimatedLinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradientContainer, style]}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

// ============================================
// GRADIENT BADGE
// ============================================

interface GradientBadgeProps {
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientBadge: React.FC<GradientBadgeProps> = ({
  colors = GRADIENT_COLORS.primary,
  style,
  children,
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientBadge, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  gradientButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316', // Orange-500
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)', // Orange-500/20
  },
  overlayContainer: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
});

// ============================================
// EXPORTS
// ============================================

export default {
  GradientView,
  GradientButton,
  GradientCard,
  GradientOverlay,
  AnimatedGradientView,
  GradientBadge,
  GRADIENT_COLORS,
  GRADIENT_DIRECTIONS,
};
