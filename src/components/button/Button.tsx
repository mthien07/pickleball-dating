import React, { useMemo } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';
import { usePressAnimation, useElevationAnimation } from '../../hooks/useAnimations';
import { GRADIENT_COLORS } from '../GradientBackground';
import { styles } from './button-styles';

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const useElevated = variant === 'elevated';
  const elevationAnim = useElevationAnimation({
    elevationFrom: 4,
    elevationTo: 12,
    scaleFrom: 1,
    scaleTo: 1.02,
  });
  const pressAnim = usePressAnimation({ scaleValue: 0.98 });

  const { animatedStyle, handlePressIn, handlePressOut } = useElevated ? elevationAnim : pressAnim;

  const handlePress = () => {
    if (!disabled && !loading) {
      if (Platform.OS !== 'web') {
        try {
          require('expo-haptics').impactAsync(require('expo-haptics').ImpactFeedbackStyle.Light);
        } catch {}
      }
      onPress();
    }
  };

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

  const spinnerColor = variant === 'primary' ? colors.white : colors.primary;

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
      return icon;
    }

    if (icon && title) {
      return (
        <View style={styles.contentWithIcon}>
          {iconPosition === 'left' && icon}
          <Text style={labelStyle}>{title}</Text>
          {iconPosition === 'right' && icon}
        </View>
      );
    }

    return <Text style={labelStyle}>{title}</Text>;
  };

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        style={[styles.base, fullWidth && styles.fullWidth, style, animatedStyle]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        <LinearGradient
          colors={disabled ? ['#D1D5DB', '#9CA3AF'] : GRADIENT_COLORS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientContainer, styles[`${size}Container`]]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={!disabled && !loading ? handlePressIn : undefined}
      onPressOut={!disabled && !loading ? handlePressOut : undefined}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
      style={[containerStyle, animatedStyle]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {renderContent()}
    </AnimatedPressable>
  );
};

export default Button;
