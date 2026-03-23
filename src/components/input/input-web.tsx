/**
 * Web-specific Input variant
 * Uses native HTML <input> elements to fix browser-specific issues:
 * - Controlled value handling (no concatenation)
 * - SecureTextEntry toggle (password visibility)
 * - Password manager compatibility (<form> context)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { InputProps } from './input-types';
import { createStyles } from './input-styles';

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
  // Strip RN-only props not applicable to HTML inputs
  autoCapitalize: _autoCapitalize,
  keyboardType: _keyboardType,
  secureTextEntry: _secureTextEntry,
}) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Derive HTML input type
  const htmlInputType =
    type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type === 'email'
        ? 'email'
        : type === 'number'
          ? 'number'
          : 'text';

  // Use native onChange to get e.target.value — prevents concatenation on web
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangeText(e.target.value);
    },
    [onChangeText]
  );

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
  }, [onChangeText, onClear]);

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  // Base inline styles mirroring the StyleSheet values for the native HTML element
  const nativeInputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 15,
    color: disabled ? colors.textSecondary : colors.textPrimary,
    fontFamily: 'inherit',
    padding: 0,
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const containerViewStyle: ViewStyle[] = [
    styles.textContainer,
    isFocused && styles.focusedContainer,
    error ? styles.errorContainer : undefined,
    disabled ? styles.disabledContainer : undefined,
    containerStyle,
  ].filter(Boolean) as ViewStyle[];

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, error && styles.errorLabel]}>{label}</Text>}
      <View style={containerViewStyle}>
        {leadingIcon && <View style={styles.leadingIconContainer}>{leadingIcon}</View>}

        {multiline ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={numberOfLines}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              ...nativeInputStyle,
              resize: 'none',
              // Cast inputStyle values relevant to textarea
              ...(inputStyle as React.CSSProperties),
            }}
          />
        ) : (
          <input
            type={htmlInputType}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={
              type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              ...nativeInputStyle,
              ...(inputStyle as React.CSSProperties),
            }}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            disabled={disabled}
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.5 : 1,
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
            )}
          </button>
        )}

        {clearable && value.length > 0 && !disabled && type !== 'password' && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Clear input"
          >
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </button>
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
