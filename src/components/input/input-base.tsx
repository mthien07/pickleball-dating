/**
 * Base Input component
 * Native variant with Reanimated animations; selects WebInput on web platform.
 */

import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, Pressable, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { colors, durations } from '../../theme/tokens';
import { InputProps } from './input-types';
import { styles } from './input-styles';
import { WebInput } from './input-web';

const AnimatedView = Animated.createAnimatedComponent(View);

const getKeyboardType = (type: InputProps['type']): TextInputProps['keyboardType'] => {
  switch (type) {
    case 'email':
      return 'email-address';
    case 'number':
      return 'numeric';
    default:
      return 'default';
  }
};

const NativeInput: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChangeText,
  placeholder,
  label,
  helperText,
  error,
  disabled = false,
  leadingIcon,
  trailingIcon,
  clearable = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCounter = false,
  containerStyle,
  inputStyle,
  onClear,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureText, setIsSecureText] = useState(type === 'password');

  const borderScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0);
  const borderColorProgress = useSharedValue(0);
  const labelScale = useSharedValue(1);
  const helperOpacity = useSharedValue(0);

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? colors.error
      : borderColorProgress.value > 0
        ? colors.primary
        : colors.border;
    return { borderWidth: borderScale.value, borderColor };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    shadowColor: error ? colors.error : colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: shadowOpacity.value * 10,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderScale.value = withTiming(2, { duration: durations.normal });
    borderColorProgress.value = withTiming(1, { duration: durations.normal });
    shadowOpacity.value = withTiming(0.15, { duration: durations.normal });
    labelScale.value = withTiming(1.02, { duration: durations.fast });
    helperOpacity.value = withTiming(1, { duration: durations.normal });
    if (!disabled) {
      try {
        require('expo-haptics').impactAsync(require('expo-haptics').ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderScale.value = withTiming(1, { duration: durations.normal });
    borderColorProgress.value = withTiming(0, { duration: durations.normal });
    shadowOpacity.value = withTiming(0, { duration: durations.normal });
    labelScale.value = withTiming(1, { duration: durations.fast });
    if (!error && !helperText) {
      helperOpacity.value = withTiming(0, { duration: durations.fast });
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, error && styles.errorLabel]}>{label}</Text>}
      <AnimatedView
        style={[
          type === 'search' ? styles.searchContainer : styles.textContainer,
          isFocused && styles.focusedContainer,
          error && styles.errorContainer,
          disabled && styles.disabledContainer,
          borderAnimatedStyle,
          type === 'search' && shadowAnimatedStyle,
          containerStyle,
        ]}
      >
        {leadingIcon && <View style={styles.leadingIconContainer}>{leadingIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={getKeyboardType(type)}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          secureTextEntry={isSecureText}
          style={[
            styles.input,
            type === 'search' ? styles.searchInput : null,
            disabled ? styles.disabledText : null,
            leadingIcon ? styles.inputWithLeadingIcon : null,
            inputStyle,
          ]}
          {...textInputProps}
        />
        {type === 'password' && (
          <Pressable
            onPress={() => setIsSecureText(!isSecureText)}
            style={({ pressed }) => [styles.iconContainer, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isSecureText ? (
              <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
            )}
          </Pressable>
        )}
        {clearable && value.length > 0 && !disabled && type !== 'password' && (
          <Pressable
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            style={({ pressed }) => [styles.iconContainer, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
        )}
        {trailingIcon && type !== 'password' && (
          <View style={styles.iconContainer}>{trailingIcon}</View>
        )}
      </AnimatedView>
      <View style={styles.bottomRow}>
        <View style={styles.helperTextContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : helperText ? (
            <Text style={styles.helperText}>{helperText}</Text>
          ) : null}
        </View>
        {showCounter && maxLength && (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

// Export correct component based on platform
export const Input: React.FC<InputProps> = Platform.OS === 'web' ? WebInput : NativeInput;

export default Input;
