/**
 * Toast Notification Service
 *
 * Centralized toast notification helpers using react-native-toast-message
 *
 * Usage:
 * ```tsx
 * import { showSuccess, showError, showInfo } from '@/services/toast';
 *
 * showSuccess('Booking confirmed!');
 * showError('Failed to load courts');
 * ```
 */

import Toast from 'react-native-toast-message';

// ============================================
// TOAST CONFIGURATION
// ============================================

const DEFAULT_DURATION = 2000; // 2 seconds
const DEFAULT_POSITION = 'bottom' as const;

// ============================================
// TOAST HELPERS
// ============================================

/**
 * Show success toast
 */
export const showSuccess = (message: string, title?: string) => {
  Toast.show({
    type: 'success',
    text1: title || 'Success',
    text2: message,
    position: DEFAULT_POSITION,
    visibilityTime: DEFAULT_DURATION,
    autoHide: true,
  });
};

/**
 * Show error toast
 */
export const showError = (message: string, title?: string) => {
  Toast.show({
    type: 'error',
    text1: title || 'Error',
    text2: message,
    position: DEFAULT_POSITION,
    visibilityTime: DEFAULT_DURATION + 1000, // Errors show slightly longer
    autoHide: true,
  });
};

/**
 * Show info toast
 */
export const showInfo = (message: string, title?: string) => {
  Toast.show({
    type: 'info',
    text1: title || 'Info',
    text2: message,
    position: DEFAULT_POSITION,
    visibilityTime: DEFAULT_DURATION,
    autoHide: true,
  });
};

/**
 * Show warning toast
 */
export const showWarning = (message: string, title?: string) => {
  Toast.show({
    type: 'error', // Use error style for warnings
    text1: title || 'Warning',
    text2: message,
    position: DEFAULT_POSITION,
    visibilityTime: DEFAULT_DURATION + 500,
    autoHide: true,
  });
};

/**
 * Hide current toast
 */
export const hideToast = () => {
  Toast.hide();
};

/**
 * Custom toast with full control
 */
export const showToast = (options: {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
}) => {
  Toast.show({
    type: options.type,
    text1: options.title,
    text2: options.message,
    position: options.position || DEFAULT_POSITION,
    visibilityTime: options.duration || DEFAULT_DURATION,
    autoHide: true,
    onPress: options.onPress,
  });
};

// ============================================
// COMMON TOAST MESSAGES
// ============================================

export const ToastMessages = {
  // Auth
  loginSuccess: () => showSuccess('Welcome back!', 'Login Successful'),
  loginError: () => showError('Invalid credentials', 'Login Failed'),
  signupSuccess: () => showSuccess('Account created!', 'Signup Successful'),
  logoutSuccess: () => showSuccess('See you soon!', 'Logged Out'),

  // Booking
  bookingSuccess: () => showSuccess('Court booked successfully!', 'Booking Confirmed'),
  bookingError: () => showError('Unable to book court', 'Booking Failed'),
  bookingCancelled: () => showInfo('Booking cancelled', 'Cancelled'),

  // Match
  matchSuccess: () => showSuccess("It's a match! 🎉", 'New Match'),
  unmatchSuccess: () => showInfo('Unmatched successfully', 'Unmatched'),

  // Profile
  profileUpdated: () => showSuccess('Profile updated!', 'Success'),
  profileError: () => showError('Failed to update profile', 'Error'),

  // Network
  networkError: () => showError('Check your connection', 'No Internet'),
  serverError: () => showError('Something went wrong', 'Server Error'),

  // Generic
  saveSuccess: () => showSuccess('Saved successfully!'),
  saveError: () => showError('Failed to save'),
  deleteSuccess: () => showSuccess('Deleted successfully!'),
  deleteError: () => showError('Failed to delete'),
  copySuccess: () => showSuccess('Copied to clipboard!'),
};

// Default export
export default {
  show: showToast,
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  hide: hideToast,
  messages: ToastMessages,
};
