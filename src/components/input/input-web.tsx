/**
 * Web-specific Input variant
 * No animations / no Reanimated dependency
 */

import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { InputProps } from './input-types';
import { styles } from './input-styles';

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
