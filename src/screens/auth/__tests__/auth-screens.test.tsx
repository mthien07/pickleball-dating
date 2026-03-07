/**
 * Auth Screen Tests
 *
 * Tests LoginScreen and EmailSignupScreen rendering, form validation,
 * and user interaction using @testing-library/react-native v13.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { LoginScreen } from '../login/LoginScreen';
import { EmailSignupScreen } from '../email-signup/EmailSignupScreen';
import { showError } from '../../../services/toast';
import { supabase } from '../../../services/supabase';

// Navigation mock
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));
jest.mock('@react-navigation/stack', () => ({}));

// lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  ArrowLeft: 'ArrowLeft',
  Building2: 'Building2',
  Users: 'Users',
  GraduationCap: 'GraduationCap',
  Check: 'Check',
}));

// Theme
jest.mock('../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    surface: '#FFFFFF',
    background: '#F8FAFC',
    white: '#FFFFFF',
    backgroundCircle: '#EFF6FF',
  }),
}));
jest.mock('../../../hooks/useThemedStyles', () => ({
  useThemedStyles: (fn: any) => fn({}),
}));

// KeyboardView wraps children transparently
jest.mock('../../../components/KeyboardView', () => ({
  KeyboardView: ({ children }: any) => children,
}));

// Input components with stable testIDs
jest.mock('../../../components/Input', () => ({
  EmailInput: ({ value, onChangeText }: any) => {
    const { TextInput } = require('react-native');
    return (
      <TextInput
        testID="email-input"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    );
  },
  PasswordInput: ({ value, onChangeText, testID: tid }: any) => {
    const { TextInput } = require('react-native');
    return (
      <TextInput
        testID={tid || 'password-input'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry
      />
    );
  },
}));

// Button - stores disabled state in accessibilityState
jest.mock('../../../components/Button', () => ({
  Button: ({ title, onPress, loading, disabled }: any) => {
    const { Pressable, Text } = require('react-native');
    const isDisabled = !!(disabled || loading);
    return (
      <Pressable
        testID={`btn-${title}`}
        onPress={isDisabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled }}
      >
        <Text>{loading ? 'Loading...' : title}</Text>
      </Pressable>
    );
  },
}));

// Services
jest.mock('../../../services/toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));
jest.mock('../../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

const mockShowError = showError as jest.Mock;
const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
const mockSignUp = supabase.auth.signUp as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── LoginScreen ──────────────────────────────────────────────────────────────

describe('LoginScreen', () => {
  it('renders email input', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('email-input')).toBeTruthy();
  });

  it('renders password input', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('password-input')).toBeTruthy();
  });

  it('renders login button', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('btn-ĐĂNG NHẬP')).toBeTruthy();
  });

  it('shows error when submitting with empty fields', async () => {
    const { getByTestId } = render(<LoginScreen />);
    // Button has no disabled guard for empty check — it always calls handleLogin
    fireEvent.press(getByTestId('btn-ĐĂNG NHẬP'));
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Please enter email and password');
    });
  });

  it('calls signInWithPassword with entered credentials', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('btn-ĐĂNG NHẬP'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows Supabase error message on login failure', async () => {
    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrongpassword');
    fireEvent.press(getByTestId('btn-ĐĂNG NHẬP'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('shows generic error on network exception', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Network error'));
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('btn-ĐĂNG NHẬP'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Login failed. Please try again.');
    });
  });

  it('renders forgot password link', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Quên mật khẩu?')).toBeTruthy();
  });

  it('renders sign up navigation link', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Đăng ký')).toBeTruthy();
  });
});

// ─── EmailSignupScreen ────────────────────────────────────────────────────────

describe('EmailSignupScreen', () => {
  it('renders email input', () => {
    const { getByTestId } = render(<EmailSignupScreen />);
    expect(getByTestId('email-input')).toBeTruthy();
  });

  it('renders role selection cards', () => {
    const { getByText } = render(<EmailSignupScreen />);
    expect(getByText('Chủ sân')).toBeTruthy();
    expect(getByText('Người chơi')).toBeTruthy();
    expect(getByText('HLV')).toBeTruthy();
  });

  it('renders terms checkbox text', () => {
    const { getByText } = render(<EmailSignupScreen />);
    expect(getByText(/Điều khoản sử dụng/)).toBeTruthy();
  });

  it('register button is disabled by default (no role selected, not agreed)', () => {
    const { getByTestId } = render(<EmailSignupScreen />);
    const btn = getByTestId('btn-ĐĂNG KÝ');
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('shows error when submitting empty form (all fields missing)', async () => {
    const { getByTestId, getByText } = render(<EmailSignupScreen />);
    // Enable the button by selecting role and agreeing to terms
    fireEvent.press(getByText('Người chơi'));
    fireEvent.press(getByText(/Điều khoản sử dụng/));
    // Now button is enabled — press it with empty fields
    fireEvent.press(getByTestId('btn-ĐĂNG KÝ'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Please fill in all fields');
    });
  });

  it('shows email validation error when email is invalid (missing @)', async () => {
    const { getByTestId, getByText, getAllByTestId } = render(<EmailSignupScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'invalidemail');
    const pwInputs = getAllByTestId('password-input');
    fireEvent.changeText(pwInputs[0], 'pass1234');
    fireEvent.changeText(pwInputs[1], 'pass1234');
    fireEvent.press(getByText('Người chơi'));
    fireEvent.press(getByText(/Điều khoản sử dụng/));
    fireEvent.press(getByTestId('btn-ĐĂNG KÝ'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(expect.stringContaining('Email'));
    });
  });

  it('shows error when passwords do not match', async () => {
    const { getByTestId, getAllByTestId, getByText } = render(<EmailSignupScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    const pwInputs = getAllByTestId('password-input');
    fireEvent.changeText(pwInputs[0], 'password123');
    fireEvent.changeText(pwInputs[1], 'differentpassword');
    fireEvent.press(getByText('Người chơi'));
    fireEvent.press(getByText(/Điều khoản sử dụng/));
    fireEvent.press(getByTestId('btn-ĐĂNG KÝ'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('calls supabase.auth.signUp with valid credentials', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: 'new-user' }, session: { access_token: 'tok' } },
      error: null,
    });
    const { getByTestId, getAllByTestId, getByText } = render(<EmailSignupScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'new@example.com');
    const pwInputs = getAllByTestId('password-input');
    fireEvent.changeText(pwInputs[0], 'pass1234');
    fireEvent.changeText(pwInputs[1], 'pass1234');
    fireEvent.press(getByText('Người chơi'));
    fireEvent.press(getByText(/Điều khoản sử dụng/));
    fireEvent.press(getByTestId('btn-ĐĂNG KÝ'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          password: 'pass1234',
        })
      );
    });
  });

  it('renders login navigation link', () => {
    const { getByText } = render(<EmailSignupScreen />);
    expect(getByText('Đăng nhập')).toBeTruthy();
  });
});
