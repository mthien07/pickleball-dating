import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../contexts/ThemeContext';
import { createGradientColors, GRADIENT_DIRECTIONS } from './gradient-constants';
import { styles } from './gradient-styles';

// ---- GradientView ----

interface GradientViewProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientView: React.FC<GradientViewProps> = ({
  colors: colorsProp,
  direction = 'horizontal',
  style,
  children,
}) => {
  const themeColors = useThemeColors();
  const gradientColors = createGradientColors(themeColors);
  const resolvedColors = colorsProp || gradientColors.primary;
  const { start, end } = GRADIENT_DIRECTIONS[direction];
  return (
    <LinearGradient
      colors={resolvedColors}
      start={start}
      end={end}
      style={[styles.gradientContainer, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ---- GradientButton ----

interface GradientButtonProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'primary' | 'subtle' | 'dark' | 'light';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  colors: colorsProp,
  direction = 'horizontal',
  style,
  children,
  variant = 'primary',
}) => {
  const themeColors = useThemeColors();
  const gc = createGradientColors(themeColors);
  const variantColors = {
    primary: gc.primary,
    subtle: gc.primarySubtle,
    dark: gc.primaryDark,
    light: gc.primaryLight,
  };
  const resolvedColors = colorsProp || variantColors[variant];
  const { start, end } = GRADIENT_DIRECTIONS[direction];
  return (
    <LinearGradient
      colors={resolvedColors}
      start={start}
      end={end}
      style={[styles.gradientButton, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ---- GradientCard ----

interface GradientCardProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'subtle' | 'medium' | 'primary';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  colors: colorsProp,
  direction = 'diagonal',
  style,
  children,
  variant = 'subtle',
}) => {
  const themeColors = useThemeColors();
  const gc = createGradientColors(themeColors);
  const gradientColors =
    colorsProp ||
    (variant === 'subtle' ? gc.primarySubtle : variant === 'medium' ? gc.bgMedium : gc.primary);
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

// ---- GradientOverlay ----

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
  const alphaMap = {
    light: { from: 0, to: 0.3 },
    medium: { from: 0, to: 0.6 },
    heavy: { from: 0, to: 0.8 },
  };
  const alpha = alphaMap[intensity];
  const overlayColors: [string, string] = [
    `rgba(37, 99, 235, ${alpha.from})`,
    `rgba(96, 165, 250, ${alpha.to})`,
  ];

  const directionMap: Record<
    string,
    { start: { x: number; y: number }; end: { x: number; y: number } }
  > = {
    top: { start: { x: 0, y: 0 }, end: { x: 0, y: 0.5 } },
    bottom: { start: { x: 0, y: 0.5 }, end: { x: 0, y: 1 } },
    left: { start: { x: 0, y: 0 }, end: { x: 0.5, y: 0 } },
    right: { start: { x: 0.5, y: 0 }, end: { x: 1, y: 0 } },
    full: GRADIENT_DIRECTIONS.diagonal,
  };

  const { start, end } = directionMap[position];

  return (
    <View style={[styles.overlayContainer, style]}>
      {children}
      <LinearGradient
        colors={overlayColors}
        start={start}
        end={end}
        style={styles.overlay}
        pointerEvents="none"
      />
    </View>
  );
};

// ---- AnimatedGradientView ----

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedGradientViewProps {
  colors?: readonly [string, string, ...string[]];
  direction?: keyof typeof GRADIENT_DIRECTIONS;
  style?: any;
  children?: React.ReactNode;
}

export const AnimatedGradientView: React.FC<AnimatedGradientViewProps> = ({
  colors: colorsProp,
  direction = 'horizontal',
  style,
  children,
}) => {
  const themeColors = useThemeColors();
  const gc = createGradientColors(themeColors);
  const colors = colorsProp || gc.primary;
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

// ---- GradientBadge ----

interface GradientBadgeProps {
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientBadge: React.FC<GradientBadgeProps> = ({
  colors: colorsProp,
  style,
  children,
}) => {
  const themeColors = useThemeColors();
  const gc = createGradientColors(themeColors);
  const colors = colorsProp || gc.primary;
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

export default {
  GradientView,
  GradientButton,
  GradientCard,
  GradientOverlay,
  AnimatedGradientView,
  GradientBadge,
  createGradientColors,
  GRADIENT_DIRECTIONS,
};
