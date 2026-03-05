/**
 * Input component shared types and interfaces
 */

import { ViewStyle, TextStyle, TextInputProps } from 'react-native';

export type InputType = 'text' | 'search' | 'email' | 'password' | 'number';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input type @default 'text' */
  type?: InputType;
  /** Input value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text (appears above input) */
  label?: string;
  /** Helper text (appears below input) */
  helperText?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Disabled state @default false */
  disabled?: boolean;
  /** Leading icon (left side) */
  leadingIcon?: React.ReactNode;
  /** Trailing icon (right side) */
  trailingIcon?: React.ReactNode;
  /** Show clear button when text exists @default false */
  clearable?: boolean;
  /** Multiline mode @default false */
  multiline?: boolean;
  /** Number of lines (for multiline) @default 1 */
  numberOfLines?: number;
  /** Max length */
  maxLength?: number;
  /** Show character counter @default false */
  showCounter?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
  /** On clear handler (when clear button pressed) */
  onClear?: () => void;
}
