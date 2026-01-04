/**
 * Toast Configuration
 *
 * Custom toast styling to match our design system
 * Import this in App.tsx
 */

import React from 'react';
import { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import { colors, typography, spacing, borderRadius } from '../theme/tokens';

// ============================================
// TOAST CONFIG
// ============================================

export const toastConfig = {
  /*
    Success Toast
  */
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,
        borderLeftWidth: 6,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        ...typography.h4,
        color: colors.textPrimary,
      }}
      text2Style={{
        ...typography.body,
        color: colors.textSecondary,
      }}
    />
  ),

  /*
    Error Toast
  */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error,
        borderLeftWidth: 6,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        ...typography.h4,
        color: colors.textPrimary,
      }}
      text2Style={{
        ...typography.body,
        color: colors.textSecondary,
      }}
    />
  ),

  /*
    Info Toast
  */
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.info,
        borderLeftWidth: 6,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        ...typography.h4,
        color: colors.textPrimary,
      }}
      text2Style={{
        ...typography.body,
        color: colors.textSecondary,
      }}
    />
  ),
};
