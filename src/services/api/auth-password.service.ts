/**
 * Auth Password Service
 *
 * Password reset and update operations.
 */

import { Platform } from 'react-native';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Request password reset email.
 * On web: redirects to the current origin's reset page.
 * On native: omits redirectTo so Supabase uses its configured default (Bug 3).
 */
export const resetPasswordForEmail = async (email: string): Promise<void> => {
  const redirectTo =
    Platform.OS === 'web' ? `${window.location.origin}/auth/reset-password` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
<<<<<<< Updated upstream
    redirectTo: 'pickleball-dating://auth/reset-password',
=======
    ...(redirectTo ? { redirectTo } : {}),
>>>>>>> Stashed changes
  });
  if (error) {
    throw error;
  }
};

/**
 * Update password (must be authenticated)
 */
export const updatePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw error;
  }
};

/**
 * Update user metadata
 */
export const updateUserMetadata = async (
  metadata: Record<string, unknown>
): Promise<User | null> => {
  const { data, error } = await supabase.auth.updateUser({ data: metadata });
  if (error) {
    throw error;
  }
  return data.user;
};
