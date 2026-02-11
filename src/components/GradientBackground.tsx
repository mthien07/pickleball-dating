import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { colors } from '../theme/tokens';

export const GRADIENT_COLORS = {
  // Primary gradient: Electric Blue (Vibrant Sport)
  primary: [colors.primaryGradientStart, colors.primaryGradientEnd] as const, // Blue-600 to Blue-400

  // Reversed Blue
  primaryReverse: [colors.primaryGradientEnd, colors.primaryGradientStart] as const,

  // Subtle blue gradient with transparency
  primarySubtle: ['rgba(37, 99, 235, 0.08)', 'rgba(96, 165, 250, 0.08)'] as const,

  // Dark blue gradient
  primaryDark: [colors.primaryDark, '#1E40AF'] as const, // Blue-700 to Blue-800

  // Light blue gradient (soft sky)
  primaryLight: ['#DBEAFE', '#EFF6FF'] as const, // Blue-100 to Blue-50

  // Secondary gradient: Emerald Green
  secondary: [colors.secondary, colors.secondaryLight] as const, // Emerald-500 to Emerald-400

  // Green subtle
  secondarySubtle: ['rgba(16, 185, 129, 0.08)', 'rgba(52, 211, 153, 0.08)'] as const,

  // Accent gradient (Rose - for like/match actions)
  accent: [colors.accent, colors.accentLight] as const, // Rose-500 to Rose-400

  // Accent subtle
  accentSubtle: ['rgba(244, 63, 94, 0.1)', 'rgba(251, 113, 133, 0.1)'] as const,

  // Vibrant sport gradient: Blue to Rose (brand combo)
  sport: ['#2563EB', '#F43F5E'] as const, // Blue to Rose
  sportSubtle: ['rgba(37, 99, 235, 0.1)', 'rgba(244, 63, 94, 0.1)'] as const,

  // Energy gradient (vibrant, energetic)
  sunset: ['#2563EB', '#8B5CF6', '#F43F5E'] as const,

  // Fresh gradient (sporty, active)
  fresh: ['#60A5FA', '#34D399', '#10B981'] as const,

  // Background gradients - vibrant sport glassmorphism
  bgSubtle: [
    'rgba(37, 99, 235, 0.03)',
    'rgba(16, 185, 129, 0.03)',
    'rgba(244, 63, 94, 0.03)',
  ] as const,
  bgMedium: ['rgba(37, 99, 235, 0.12)', 'rgba(244, 63, 94, 0.12)'] as const,

  // Glassmorphism backgrounds
  glass: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)'] as const,
  glassDark: ['rgba(29, 78, 216, 0.8)', 'rgba(29, 78, 216, 0.6)'] as const,

  // Bento card gradients - vibrant sport pastel
  bentoWarm: ['#FEE2E2', '#FEF2F2'] as const, // Rose-100 to Rose-50
  bentoCool: ['#DBEAFE', '#EFF6FF'] as const, // Blue-100 to Blue-50
  bentoNeutral: ['#D1FAE5', '#ECFDF5'] as const, // Emerald-100 to Emerald-50
};

export const GRADIENT_DIRECTIONS = {
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  radial: { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } },
};

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

const BUTTON_VARIANT_COLORS = {
  primary: GRADIENT_COLORS.primary,
  subtle: GRADIENT_COLORS.primarySubtle,
  dark: GRADIENT_COLORS.primaryDark,
  light: GRADIENT_COLORS.primaryLight,
} as const;

export const GradientButton: React.FC<GradientButtonProps> = ({
  colors,
  direction = 'horizontal',
  style,
  children,
  variant = 'primary',
}) => {
  const gradientColors = colors || BUTTON_VARIANT_COLORS[variant];
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
  const gradientColors =
    colors ||
    (variant === 'subtle'
      ? GRADIENT_COLORS.primarySubtle
      : variant === 'medium'
        ? GRADIENT_COLORS.bgMedium
        : GRADIENT_COLORS.primary);

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

    // Updated to Blue gradient for vibrant sport feel
    return [`rgba(37, 99, 235, ${alpha.from})`, `rgba(96, 165, 250, ${alpha.to})`] as const;
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

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  gradientButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20, // Modern rounded
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB', // Blue-600
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  gradientCard: {
    padding: 20,
    borderRadius: 24, // Bento style
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.12)', // Blue-600/12
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20, // More rounded
    alignSelf: 'flex-start',
  },
});

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
