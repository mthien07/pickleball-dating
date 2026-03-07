/**
 * Button Component Tests
 *
 * Tests rendering, press callbacks, disabled/loading states, and variants.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

// ThemeProvider wrapper for components using useThemeColors
jest.mock('../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#60A5FA',
    secondary: '#F43F5E',
    secondaryDark: '#E11D48',
    accent: '#F43F5E',
    accentLight: '#FB7185',
    white: '#FFFFFF',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    error: '#EF4444',
    disabledGradientStart: '#CBD5E1',
    disabledGradientEnd: '#94A3B8',
  }),
}));

jest.mock('../../../hooks/useThemedStyles', () => ({
  useThemedStyles: (createFn: (...args: unknown[]) => unknown) =>
    createFn({
      primary: '#2563EB',
      white: '#FFFFFF',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      error: '#EF4444',
    }),
}));

jest.mock('../../../hooks/useAnimations', () => ({
  usePressAnimation: () => ({
    animatedStyle: {},
    handlePressIn: jest.fn(),
    handlePressOut: jest.fn(),
  }),
  useElevationAnimation: () => ({
    animatedStyle: {},
    handlePressIn: jest.fn(),
    handlePressOut: jest.fn(),
  }),
}));

jest.mock('../../../components/GradientBackground', () => ({
  createGradientColors: () => ({ primary: ['#2563EB', '#1D4ED8'] }),
}));

jest.mock('../button-styles', () => ({
  createStyles: () => ({
    base: {},
    primaryContainer: {},
    secondaryContainer: {},
    textContainer: {},
    iconContainer: {},
    gradientContainer: {},
    elevatedContainer: {},
    smallContainer: {},
    mediumContainer: {},
    largeContainer: {},
    fullWidth: {},
    disabledContainer: {},
    baseText: {},
    primaryText: {},
    secondaryText: {},
    textText: {},
    iconText: {},
    gradientText: {},
    elevatedText: {},
    smallText: {},
    mediumText: {},
    largeText: {},
    disabledText: {},
    loadingContainer: {},
    loadingText: {},
    contentWithIcon: {},
  }),
}));

describe('Button', () => {
  const defaultProps = {
    title: 'Press Me',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title text', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when loading', () => {
    const { getByTestId, UNSAFE_getByType } = render(<Button {...defaultProps} loading />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Loading" onPress={onPress} loading />);
    fireEvent.press(getByText('Loading'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders title alongside loading indicator', () => {
    const { getByText } = render(<Button title="Saving..." onPress={jest.fn()} loading />);
    expect(getByText('Saving...')).toBeTruthy();
  });

  it('renders primary variant by default', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders secondary variant', () => {
    const { getByText } = render(<Button {...defaultProps} variant="secondary" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders text variant', () => {
    const { getByText } = render(<Button {...defaultProps} variant="text" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders gradient variant', () => {
    const { getByText } = render(<Button {...defaultProps} variant="gradient" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders elevated variant', () => {
    const { getByText } = render(<Button {...defaultProps} variant="elevated" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('uses accessibilityLabel prop when provided', () => {
    const { getByLabelText } = render(
      <Button {...defaultProps} accessibilityLabel="Custom Label" />
    );
    expect(getByLabelText('Custom Label')).toBeTruthy();
  });

  it('uses title as default accessibilityLabel', () => {
    const { getByLabelText } = render(<Button {...defaultProps} />);
    expect(getByLabelText('Press Me')).toBeTruthy();
  });

  it('renders icon with title', () => {
    const icon = <></>;
    const { getByText } = render(<Button {...defaultProps} icon={icon} />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders icon-only button without title', () => {
    const icon = <></>;
    const { queryByText } = render(<Button onPress={jest.fn()} icon={icon} />);
    expect(queryByText('Press Me')).toBeNull();
  });
});
