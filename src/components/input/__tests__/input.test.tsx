/**
 * Input Component Tests
 *
 * Tests rendering, text change, password visibility, and error state.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Import after mocks - Input selects NativeInput on non-web platform
import { Input } from '../input-base';

jest.mock('../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    border: '#E2E8F0',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    error: '#EF4444',
    white: '#FFFFFF',
  }),
}));

jest.mock('../../../hooks/useThemedStyles', () => ({
  useThemedStyles: (createFn: (...args: unknown[]) => unknown) =>
    createFn({
      primary: '#2563EB',
      border: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      textTertiary: '#94A3B8',
      error: '#EF4444',
    }),
}));

jest.mock('../input-styles', () => ({
  createStyles: () => ({
    wrapper: {},
    label: {},
    errorLabel: {},
    textContainer: {},
    searchContainer: {},
    focusedContainer: {},
    errorContainer: {},
    disabledContainer: {},
    leadingIconContainer: {},
    iconContainer: {},
    input: {},
    searchInput: {},
    disabledText: {},
    inputWithLeadingIcon: {},
    bottomRow: {},
    helperTextContainer: {},
    errorText: {},
    helperText: {},
    counter: {},
  }),
}));

jest.mock('../input-web', () => ({
  WebInput: () => null,
}));

jest.mock('lucide-react-native', () => ({
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  X: 'X',
}));

jest.mock('../../../theme/tokens', () => ({
  durations: { fast: 150, normal: 300 },
}));

describe('Input', () => {
  const baseProps = {
    value: '',
    onChangeText: jest.fn(),
    placeholder: 'Enter text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    const { getByPlaceholderText } = render(<Input {...baseProps} />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays label when provided', () => {
    const { getByText } = render(<Input {...baseProps} label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('calls onChangeText when text is typed', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input {...baseProps} onChangeText={onChangeText} />);
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('renders as secure text when type is password', () => {
    const { getByPlaceholderText } = render(
      <Input {...baseProps} type="password" placeholder="Password" />
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const rendered = render(
      <Input {...baseProps} type="password" placeholder="Password" value="secret" />
    );
    const input = rendered.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);

    // Eye icon pressable renders as accessible View — find by the Eye icon child
    const eyeIcon = rendered.UNSAFE_getByType('Eye' as any);
    fireEvent.press(eyeIcon.parent);

    expect(rendered.getByPlaceholderText('Password').props.secureTextEntry).toBe(false);
  });

  it('displays error text when error prop is provided', () => {
    const { getByText } = render(<Input {...baseProps} error="This field is required" />);
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('displays helper text when helperText prop is provided', () => {
    const { getByText } = render(<Input {...baseProps} helperText="Enter your email address" />);
    expect(getByText('Enter your email address')).toBeTruthy();
  });

  it('does not render error when error is undefined', () => {
    const { queryByText } = render(<Input {...baseProps} />);
    expect(queryByText('This field is required')).toBeNull();
  });

  it('shows character counter when showCounter and maxLength are provided', () => {
    const { getByText } = render(<Input {...baseProps} value="hi" showCounter maxLength={100} />);
    expect(getByText('2/100')).toBeTruthy();
  });

  it('is not editable when disabled', () => {
    const { getByPlaceholderText } = render(<Input {...baseProps} disabled />);
    expect(getByPlaceholderText('Enter text').props.editable).toBe(false);
  });

  it('uses email keyboard type for email input', () => {
    const { getByPlaceholderText } = render(
      <Input {...baseProps} type="email" placeholder="Email" />
    );
    expect(getByPlaceholderText('Email').props.keyboardType).toBe('email-address');
  });

  it('uses numeric keyboard type for number input', () => {
    const { getByPlaceholderText } = render(
      <Input {...baseProps} type="number" placeholder="Number" />
    );
    expect(getByPlaceholderText('Number').props.keyboardType).toBe('numeric');
  });
});
