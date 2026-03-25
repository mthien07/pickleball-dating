/**
 * Supabase Client Configuration
 *
 * This file initializes the Supabase client for use throughout the app.
 * It handles authentication, database, storage, and realtime connections.
 *
 * @see docs/references/supabase-react-native-setup.md
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database.types';

// Environment variables (from .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Throw at module load time if env vars are missing — an empty string
// would silently create a broken client that accepts any request.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase environment variables.\n' +
      'Required: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase Client
 *
 * Configuration:
 * - Auth: Uses AsyncStorage for session persistence
 * - Auto-refresh: Automatically refreshes expired tokens
 * - Realtime: Rate-limited to 10 events/second
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use React Native's AsyncStorage for session persistence
    storage: AsyncStorage,

    // Automatically refresh tokens when they expire
    autoRefreshToken: true,

    // Persist session across app restarts
    persistSession: true,

    // Disable URL-based session detection (not applicable in React Native)
    detectSessionInUrl: false,
  },

  // Realtime configuration
  realtime: {
    params: {
      // Limit events per second to prevent overwhelming the client
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Helper function to get current user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
};

/**
 * Helper function to sign out
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Type exports for TypeScript
 *
 * Note: Generate types from your Supabase schema using:
 * supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
 */
export type { User, Session } from '@supabase/supabase-js';
