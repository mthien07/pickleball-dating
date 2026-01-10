/**
 * Button Component
 *
 * A versatile button component with multiple variants and states.
 * Implements design system from design/uiuxguides.md
 * Uses React Native Reanimated v4 for smooth animations
 *
 * Usage:
 * ```tsx
 * <Button
 *   variant="primary"
 *   title="Continue"
 *   onPress={handlePress}
 *   loading={isLoading}
 * />
 * ```
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, durations } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { usePressAnimation, useElevationAnimation } from '../hooks/useAnimations';
import { GRADIENT_COLORS } from './GradientBackground';

// ============================================
// TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon' | 'gradient' | 'elevated';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  /**
   * Button text label
   */
  title?: string;

  /**
   * Press handler
   */
  onPress: () => void;

  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Icon component (optional)
   * Can be used with or without title
   */
  icon?: React.ReactNode;

  /**
   * Icon position relative to text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom style override
   */
  style?: ViewStyle;

  /**
   * Custom text style override
   */
  textStyle?: TextStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

// ============================================
// COMPONENT
// ============================================

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
      // Haptic feedback for better tactile response
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Determine styles based on variant and state
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    ...(fullWidth ? [styles.fullWidth] : []),
    ...(disabled ? [styles.disabledContainer] : []),
    ...(style ? [style] : []),
  ].filter(Boolean);

  const labelStyle: TextStyle[] = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    ...(disabled ? [styles.disabledText] : []),
    ...(textStyle ? [textStyle] : []),
  ].filter(Boolean);

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

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Base styles
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
  },

  baseText: {
    ...typography.button,
    textAlign: 'center',
  },

  // Variant: Primary
  primaryContainer: {
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  primaryText: {
    color: colors.white,
  },

  // Variant: Secondary
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  secondaryText: {
    color: colors.secondary,
  },

  // Variant: Text (Tertiary)
  textContainer: {
    backgroundColor: 'transparent',
  },
  textText: {
    color: colors.primary,
  },

  // Variant: Icon
  iconContainer: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.full,
    width: 48,
    height: 48,
    padding: spacing.sm,
  },
  iconText: {
    color: colors.textPrimary,
  },

  // Variant: Gradient
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    shadowColor: '#F97316', // Orange-500
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientText: {
    color: colors.white,
  },

  // Variant: Elevated
  elevatedContainer: {
    backgroundColor: colors.surface,
    ...shadows.elevated,
  },
  elevatedText: {
    color: colors.textPrimary,
  },

  // Sizes
  smallContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  smallText: {
    fontSize: 14,
  },

  mediumContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  mediumText: {
    fontSize: 16,
  },

  largeContainer: {
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
  },
  largeText: {
    fontSize: 18,
  },

  // States
  disabledContainer: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.border,
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
    opacity: 0.5,
  },

  // Icon with text
  contentWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

// ============================================
// COMPONENT VARIATIONS EXAMPLES
// ============================================

/**
 * Primary Button (Default)
 * Use for main CTAs
 */
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

/**
 * Secondary Button
 * Use for secondary actions
 */
export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

/**
 * Text Button
 * Use for tertiary actions or inline links
 */
export const TextButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="text" />
);

/**
 * Icon Button
 * Use for icon-only actions (no text label)
 */
export const IconButton: React.FC<Omit<ButtonProps, 'variant' | 'title'>> = (props) => (
  <Button {...props} variant="icon" />
);

/**
 * Gradient Button
 * Use for high-emphasis CTAs with gradient background (Red to Orange)
 */
export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="gradient" />
);

/**
 * Elevated Button
 * Use for buttons with dynamic elevation/shadow effects on press
 */
export const ElevatedButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="elevated" />
);

// Default export
export default Button;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
<Button
  title="Continue"
  onPress={() => console.log('Pressed')}
/>

// Primary button (default)
<Button
  variant="primary"
  title="Match Now"
  onPress={handleMatch}
  fullWidth
/>

// Secondary button
<Button
  variant="secondary"
  title="Skip"
  onPress={handleSkip}
/>

// Text button
<Button
  variant="text"
  title="Learn More"
  onPress={handleLearnMore}
/>

// Loading state
<Button
  title="Booking..."
  loading={isBooking}
  onPress={handleBook}
/>

// Disabled state
<Button
  title="Submit"
  disabled={!isValid}
  onPress={handleSubmit}
/>

// With icon
<Button
  title="Send Message"
  icon={<MessageIcon />}
  iconPosition="left"
  onPress={handleSend}
/>

// Icon-only button
<Button
  icon={<HeartIcon />}
  variant="icon"
  onPress={handleLike}
/>

// Full-width button
<Button
  title="Continue to Payment"
  onPress={handlePayment}
  fullWidth
/>

// Custom styling
<Button
  title="Custom"
  onPress={handleCustom}
  style={{ marginTop: 20 }}
  textStyle={{ fontSize: 18 }}
/>
*/
