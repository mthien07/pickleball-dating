/**
 * Web-specific Input variant
 * No animations / no Reanimated dependency
 */

import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { InputProps } from './input-types';
import { createStyles } from './input-styles';

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

export const WebInput: React.FC<InputProps> = ({
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
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureText, setIsSecureText] = useState(type === 'password');

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
          keyboardType={getKeyboardType(type)}
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
          <Pressable
            onPress={() => setIsSecureText(!isSecureText)}
            style={({ pressed }) => [styles.iconContainer, pressed && { opacity: 0.7 }]}
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
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
