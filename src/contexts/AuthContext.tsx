/**
 * Auth Context - Thin backward-compatibility wrapper around useAuthStore.
 * New code should use useAuthStore() directly for selective subscriptions.
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore, initAuthListener } from '../stores/auth-store';
import type { AuthContextType } from './auth-context.types';

export type { AuthContextType };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, []);

  const {
    isAuthenticated,
    isLoading,
    user,
    session,
    profile,
    profileLoading,
    profileError,
    logout,
    refreshProfile,
  } = useAuthStore();

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    profile,
    profileLoading,
    profileError,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
