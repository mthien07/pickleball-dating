/** Types for authentication service */
import type { User, Session } from '@supabase/supabase-js';

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
