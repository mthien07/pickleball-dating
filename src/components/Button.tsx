import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { usePressAnimation, useElevationAnimation } from '../hooks/useAnimations';
import { GRADIENT_COLORS } from './GradientBackground';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon' | 'gradient' | 'elevated';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  // Use enhanced animations based on variant
  const useElevated = variant === 'elevated';
  const elevationAnim = useElevationAnimation({
    elevationFrom: 4,
    elevationTo: 12,
    scaleFrom: 1,
    scaleTo: 1.02,
  });
  const pressAnim = usePressAnimation({ scaleValue: 0.98 });

  // Choose animation based on variant
  const { animatedStyle, handlePressIn, handlePressOut } = useElevated ? elevationAnim : pressAnim;

  const handlePress = () => {
    if (!disabled && !loading) {
      // Haptic feedback - skip on web
      if (Platform.OS !== 'web') {
        try {
          require('expo-haptics').impactAsync(require('expo-haptics').ImpactFeedbackStyle.Light);
        } catch {}
      }
      onPress();
    }
  };

  // Memoize computed styles for performance optimization
  const containerStyle = useMemo<ViewStyle[]>(
    () =>
      [
        styles.base,
        styles[`${variant}Container`],
        styles[`${size}Container`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabledContainer,
        style,
      ].filter(Boolean) as ViewStyle[],
    [variant, size, fullWidth, disabled, style]
  );

  const labelStyle = useMemo<TextStyle[]>(
    () =>
      [
        styles.baseText,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
        textStyle,
      ].filter(Boolean) as TextStyle[],
    [variant, size, disabled, textStyle]
  );

  // Render spinner color based on variant
  const spinnerColor = variant === 'primary' ? colors.white : colors.primary;

  // Determine button content
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={spinnerColor} />
          {title && <Text style={[...labelStyle, styles.loadingText]}>{title}</Text>}
        </View>
      );
    }

    if (icon && !title) {
      // Icon-only button
      return icon;
    }

    if (icon && title) {
      // Icon + Text button
      return (
        <View style={styles.contentWithIcon}>
          {iconPosition === 'left' && icon}
          <Text style={labelStyle}>{title}</Text>
          {iconPosition === 'right' && icon}
        </View>
      );
    }

    // Text-only button
    return <Text style={labelStyle}>{title}</Text>;
  };

  // Render gradient button if variant is 'gradient'
  if (variant === 'gradient') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.base, fullWidth && styles.fullWidth, style, animatedStyle]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
      >
        <LinearGradient
          colors={disabled ? ['#D1D5DB', '#9CA3AF'] : GRADIENT_COLORS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientContainer, styles[`${size}Container`]]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // Regular button
  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={!disabled && !loading ? handlePressIn : undefined}
      onPressOut={!disabled && !loading ? handlePressOut : undefined}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[containerStyle, animatedStyle]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  // Base styles - Modern 2024
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button, // 16px - more rounded
  },

  baseText: {
    ...typography.button,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Barlow-SemiBold',
  },

  // Variant: Primary - Blue with glow
  primaryContainer: {
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  primaryText: {
    color: colors.white,
    textTransform: 'uppercase',
  },

  // Variant: Secondary - Green outline
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.secondary, // Green
    ...shadows.buttonSecondary,
  },
  secondaryText: {
    color: colors.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Variant: Text (Tertiary) - Clean, no bg
  textContainer: {
    backgroundColor: 'transparent',
  },
  textText: {
    color: colors.primary, // Orange
  },

  // Variant: Icon - Glassmorphism style
  iconContainer: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.full,
    width: 52,
    height: 52,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  iconText: {
    color: colors.textPrimary,
  },

  // Variant: Gradient - Blue to Rose sport gradient
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Modern rounded
    ...shadows.button,
  },
  gradientText: {
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: 'Barlow-Bold',
  },

  // Variant: Elevated - Neomorphism style
  elevatedContainer: {
    backgroundColor: colors.surface,
    ...shadows.neoLight,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  elevatedText: {
    color: colors.textPrimary,
  },

  // Sizes - slightly larger for modern touch targets
  smallContainer: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  smallText: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
  },

  mediumContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
  },

  largeContainer: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Barlow-Bold',
  },

  // States - softer disabled
  disabledContainer: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.border,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textTertiary,
  },

  // Layout
  fullWidth: {
    width: '100%',
  },

  // Loading state
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    opacity: 0.6,
  },

  // Icon with text
  contentWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Slightly more space
  },
});

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const TextButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="text" />
);

export const IconButton: React.FC<Omit<ButtonProps, 'variant' | 'title'>> = (props) => (
  <Button {...props} variant="icon" />
);

export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="gradient" />
);

export const ElevatedButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="elevated" />
);

export default Button;
