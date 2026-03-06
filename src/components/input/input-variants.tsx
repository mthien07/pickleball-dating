/**
 * Specialized Input preset components
 * SearchInput, EmailInput, PasswordInput, TextArea
 */

import React from 'react';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../contexts/ThemeContext';
import { InputProps } from './input-types';
import { Input } from './input-base';

/**
 * Search Input
 * Pre-configured search input with pill shape and search icon
 */
export const SearchInput: React.FC<Omit<InputProps, 'type'>> = (props) => {
  const colors = useThemeColors();
  return (
    <Input
      {...props}
      type="search"
      clearable
      leadingIcon={<Search size={20} color={colors.textSecondary} strokeWidth={2} />}
    />
  );
};

/**
 * Email Input
 * Pre-configured for email entry
 */
export const EmailInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input
    {...props}
    type="email"
    placeholder={props.placeholder ?? 'email@example.com'}
    autoCapitalize="none"
    keyboardType="email-address"
  />
);

/**
 * Password Input
 * Pre-configured for password entry with show/hide toggle
 */
export const PasswordInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input {...props} type="password" placeholder={props.placeholder ?? 'Enter password'} />
);

/**
 * Text Area
 * Multi-line text input
 */
export const TextArea: React.FC<Omit<InputProps, 'multiline'> & { numberOfLines?: number }> = ({
  numberOfLines = 4,
  ...props
}) => <Input {...props} multiline numberOfLines={numberOfLines} />;
