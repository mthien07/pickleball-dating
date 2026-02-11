/**
 * Input Component
 *
 * A versatile text input component with multiple types and states.
 * Implements design system from design/uiuxguides.md
 * Supports validation, error states, icons, and search functionality
 *
 * Usage:
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 *   value={name}
 *   onChangeText={setName}
 *   error="Name is required"
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Eye, EyeOff, X, Search } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, durations } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export type InputType = 'text' | 'search' | 'email' | 'password' | 'number';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Input value
   */
  value: string;

  /**
   * Change handler
   */
  onChangeText: (text: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Label text (appears above input)
   */
  label?: string;

  /**
   * Helper text (appears below input)
   */
  helperText?: string;

  /**
   * Error message (shows error state)
   */
  error?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Leading icon (left side)
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon (right side)
   */
  trailingIcon?: React.ReactNode;

  /**
   * Show clear button when text exists
   * @default false
   */
  clearable?: boolean;

  /**
   * Multiline mode
   * @default false
   */
  multiline?: boolean;

  /**
   * Number of lines (for multiline)
   * @default 1
   */
  numberOfLines?: number;

  /**
   * Max length
   */
  maxLength?: number;

  /**
   * Show character counter
   * @default false
   */
  showCounter?: boolean;

  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;

  /**
   * Custom input style
   */
  inputStyle?: TextStyle;

  /**
   * On clear handler (when clear button pressed)
   */
  onClear?: () => void;
}

// ============================================
// COMPONENT
// ============================================

const isWeb = Platform.OS === 'web';

// Simple Web Input - no animations, no Reanimated
const WebInput: React.FC<InputProps> = ({
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

  const getKeyboardType = (): TextInputProps['keyboardType'] => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, error && styles.errorLabel]}>{label}</Text>}
      <View
        style={[
          styles.textContainer,
          isFocused && styles.focusedContainer,
          error && styles.errorContainer,
          disabled && styles.disabledContainer,
          containerStyle,
        ]}
      >
        {leadingIcon && <View style={styles.leadingIconContainer}>{leadingIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={getKeyboardType()}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          secureTextEntry={isSecureText}
          style={[
            styles.input,
            disabled && styles.disabledText,
            inputStyle,
            { outline: 'none' } as any,
          ]}
          {...textInputProps}
        />
        {type === 'password' && (
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
            style={styles.iconContainer}
          >
            {isSecureText ? (
              <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
        {clearable && value.length > 0 && !disabled && type !== 'password' && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            style={styles.iconContainer}
          >
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        )}
        {trailingIcon && type !== 'password' && (
          <View style={styles.iconContainer}>{trailingIcon}</View>
        )}
      </View>
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

// Native Input with animations
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

  // Animation values
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

  const getKeyboardType = (): TextInputProps['keyboardType'] => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const AnimatedView = Animated.createAnimatedComponent(View);

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
          keyboardType={getKeyboardType()}
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
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
            style={styles.iconContainer}
          >
            {isSecureText ? (
              <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
        {clearable && value.length > 0 && !disabled && type !== 'password' && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            style={styles.iconContainer}
          >
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
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
export const Input: React.FC<InputProps> = isWeb ? WebInput : NativeInput;

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },

  // Label
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  errorLabel: {
    color: colors.error,
  },

  // Text Input Container
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },

  // Search Input Container (pill shape)
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
    borderRadius: 24, // pill shape
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4, // 12px
    minHeight: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 0,
  },

  // Focused state
  focusedContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },

  // Error state
  errorContainer: {
    borderColor: colors.error,
    borderWidth: 2,
  },

  // Disabled state
  disabledContainer: {
    backgroundColor: '#FAFAFA',
    borderColor: colors.border,
  },

  // Input text
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    padding: 0, // Remove default padding
  },
  searchInput: {
    paddingLeft: spacing.sm,
  },
  inputWithLeadingIcon: {
    paddingLeft: spacing.sm,
  },
  disabledText: {
    color: colors.textTertiary,
  },

  // Icons
  leadingIconContainer: {
    marginRight: spacing.sm,
  },
  iconContainer: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },

  // Bottom row (helper text + counter)
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    minHeight: 18, // Prevent layout shift
  },
  helperTextContainer: {
    flex: 1,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  counter: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});

// ============================================
// SPECIALIZED INPUT COMPONENTS
// ============================================

/**
 * Search Input
 * Pre-configured search input with pill shape and search icon
 */
export const SearchInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input
    {...props}
    type="search"
    clearable
    leadingIcon={<Search size={20} color={colors.textSecondary} strokeWidth={2} />}
  />
);

/**
 * Email Input
 * Pre-configured for email entry
 */
export const EmailInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input
    {...props}
    type="email"
    placeholder="email@example.com"
    autoCapitalize="none"
    keyboardType="email-address"
  />
);

/**
 * Password Input
 * Pre-configured for password entry with show/hide toggle
 */
export const PasswordInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input {...props} type="password" placeholder="Enter password" />
);

/**
 * Text Area
 * Multi-line text input
 */
export const TextArea: React.FC<Omit<InputProps, 'multiline'> & { numberOfLines?: number }> = ({
  numberOfLines = 4,
  ...props
}) => <Input {...props} multiline numberOfLines={numberOfLines} />;

// Default export
export default Input;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic text input
<Input
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
/>

// Input with label
<Input
  label="Display Name"
  value={name}
  onChangeText={setName}
  placeholder="What should we call you?"
/>

// Input with error
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error="Invalid email format"
/>

// Input with helper text
<Input
  label="Bio"
  value={bio}
  onChangeText={setBio}
  helperText="Tell us a bit about yourself"
  maxLength={500}
  showCounter
/>

// Search input
<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search courts, players..."
/>

// Email input
<EmailInput
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>

// Password input
<PasswordInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  error={passwordError}
/>

// Text area (multiline)
<TextArea
  label="Bio"
  value={bio}
  onChangeText={setBio}
  placeholder="Tell us about yourself..."
  maxLength={500}
  showCounter
  numberOfLines={5}
/>

// Input with icons
<Input
  value={location}
  onChangeText={setLocation}
  leadingIcon={<LocationIcon />}
  trailingIcon={<GPSIcon />}
  placeholder="Select location"
/>

// Clearable input
<Input
  value={query}
  onChangeText={setQuery}
  placeholder="Type to search..."
  clearable
  onClear={() => console.log('Cleared')}
/>

// Disabled input
<Input
  value={fixedValue}
  onChangeText={() => {}}
  disabled
/>
*/
