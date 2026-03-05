/**
 * Authentication Service
 *
 * Handles all authentication-related API calls:
 * - Email/Password signup and login
 * - Phone OTP signup and login
 * - OAuth (Google, Facebook, Apple)
 * - Session management
 *
 * @see docs/references/supabase-auth-api.md
 */

import { supabase } from '../supabase';
import type { User, Session } from '@supabase/supabase-js';
import type {
  SignUpWithEmailParams,
  SignInWithEmailParams,
  SignInWithPhoneParams,
  VerifyOtpParams,
  AuthResponse,
} from './auth.types';

// Re-export types and password functions
export type {
  SignUpWithEmailParams,
  SignInWithEmailParams,
  SignInWithPhoneParams,
  VerifyOtpParams,
  AuthResponse,
};
export { resetPasswordForEmail, updatePassword, updateUserMetadata } from './auth-password.service';

// =====================================================
// EMAIL AUTHENTICATION
// =====================================================

export const signUpWithEmail = async ({
  email,
  password,
  displayName,
}: SignUpWithEmailParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: 'myapp://auth/callback',
    },
  });
  if (error) {
    throw error;
  }
  return { user: data.user, session: data.session };
};

export const signInWithEmail = async ({
  email,
  password,
}: SignInWithEmailParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return { user: data.user, session: data.session };
};

// =====================================================
// PHONE AUTHENTICATION (OTP)
// =====================================================

export const requestPhoneOtp = async ({ phone }: SignInWithPhoneParams): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    throw error;
  }
};

export const verifyPhoneOtp = async ({ phone, token }: VerifyOtpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) {
    throw error;
  }
  return { user: data.user, session: data.session };
};

// =====================================================
// OAUTH PROVIDERS
// =====================================================

export const signInWithGoogle = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'myapp://auth/callback',
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) {
    throw error;
  }
  return { url: data.url };
};

export const signInWithFacebook = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: 'myapp://auth/callback' },
  });
  if (error) {
    throw error;
  }
  return { url: data.url };
};

export const signInWithApple = async (): Promise<{ url: string | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: 'myapp://auth/callback' },
  });
  if (error) {
    throw error;
  }
  return { url: data.url };
};

// =====================================================
// SESSION MANAGEMENT
// =====================================================

export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => {
    subscription.unsubscribe();
  };
};
