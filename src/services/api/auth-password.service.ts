/**
 * Auth Password Service
 *
 * Password reset and update operations.
 */

import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Request password reset email
 */
export const resetPasswordForEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'pickleball-dating://auth/reset-password',
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
