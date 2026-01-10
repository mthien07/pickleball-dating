/**
 * Authentication Service
 *
 * Handles all authentication-related API calls:
 * - Email/Password signup and login
 * - Phone OTP signup and login
 * - OAuth (Google, Facebook, Apple)
 * - Session management
 * - Password reset
 *
 * @see docs/references/supabase-auth-api.md
 */

import { supabase } from '../supabase';
import type { User, Session } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export interface SignUpWithEmailParams {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInWithEmailParams {
  email: string;
  password: string;
}

export interface SignInWithPhoneParams {
  phone: string;
}

export interface VerifyOtpParams {
  phone: string;
  token: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
}

// =====================================================
// EMAIL AUTHENTICATION
// =====================================================

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async ({
  email,
  password,
  displayName,
}: SignUpWithEmailParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
      // Redirect URL for email confirmation (deep link)
      emailRedirectTo: 'myapp://auth/callback',
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async ({
  email,
  password,
}: SignInWithEmailParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// =====================================================
// PHONE AUTHENTICATION (OTP)
// =====================================================

/**
 * Request OTP code via SMS
 */
export const requestPhoneOtp = async ({ phone }: SignInWithPhoneParams): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    throw error;
  }
};

/**
 * Verify OTP code and sign in
 */
export const verifyPhoneOtp = async ({ phone, token }: VerifyOtpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// =====================================================
// OAUTH PROVIDERS
// =====================================================

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'myapp://auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return { url: data.url };
};

/**
 * Sign in with Facebook OAuth
 */
export const signInWithFacebook = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: 'myapp://auth/callback',
    },
  });

  if (error) {
    throw error;
  }

  return { url: data.url };
};

/**
 * Sign in with Apple
 */
export const signInWithApple = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'myapp://auth/callback',
    },
  });

  if (error) {
    throw error;
  }

  return { url: data.url };
};

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// =====================================================
// PASSWORD MANAGEMENT
// =====================================================

/**
 * Request password reset email
 */
export const resetPasswordForEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'myapp://auth/reset-password',
  });

  if (error) {
    throw error;
  }
};

/**
 * Update password (must be authenticated)
 */
export const updatePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
};

/**
 * Update user metadata
 */
export const updateUserMetadata = async (metadata: Record<string, any>): Promise<User | null> => {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error) {
    throw error;
  }

  return data.user;
};
