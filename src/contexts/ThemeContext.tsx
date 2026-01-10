/**
 * Theme Context for Dark Mode Support
 *
 * Provides theme state management with system preference detection
 * and persistent storage of user preference.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// TYPES
// ============================================

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeColors {
  // Primary
  primary: string;
  primaryGradientStart: string;
  primaryGradientEnd: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary
  secondary: string;
  secondaryDark: string;

  // Accent
  accent: string;
  lime: string;
  sportGreen: string;

  // Background
  background: string;
  surface: string;
  surfaceGlass: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Border
  border: string;

  // Status
  success: string;
  error: string;
  warning: string;
  info: string;

  // Skill Levels
  skillBeginner: string;
  skillIntermediate: string;
  skillAdvanced: string;
  skillPro: string;

  // Utility
  black: string;
  white: string;
  overlay: string;
  overlayLight: string;
  overlayDark: string;
}

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// ============================================
// THEME DEFINITIONS
// ============================================

export const lightColors: ThemeColors = {
  // Primary Colors (Orange Theme)
  primary: '#F97316',
  primaryGradientStart: '#F97316',
  primaryGradientEnd: '#FB923C',
  primaryDark: '#EA580C',
  primaryLight: '#FDBA74',

  // Secondary Colors (Green)
  secondary: '#22C55E',
  secondaryDark: '#16A34A',

  // Accent Colors
  accent: '#EAB308',
  lime: '#84CC16',
  sportGreen: '#22C55E',

  // Background Colors
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceGlass: 'rgba(255, 255, 255, 0.90)',

  // Text Colors
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Border Colors
  border: '#E2E8F0',

  // Status Colors
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Skill Level Colors
  skillBeginner: '#22C55E',
  skillIntermediate: '#EAB308',
  skillAdvanced: '#F97316',
  skillPro: '#EF4444',

  // Utility Colors
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  overlayDark: 'rgba(15, 23, 42, 0.7)',
};

export const darkColors: ThemeColors = {
  // Primary Colors (Orange Theme - stays vibrant in dark mode)
  primary: '#FB923C',
  primaryGradientStart: '#FB923C',
  primaryGradientEnd: '#FDBA74',
  primaryDark: '#F97316',
  primaryLight: '#FED7AA',

  // Secondary Colors (Green)
  secondary: '#4ADE80',
  secondaryDark: '#22C55E',

  // Accent Colors
  accent: '#FACC15',
  lime: '#A3E635',
  sportGreen: '#4ADE80',

  // Background Colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceGlass: 'rgba(30, 41, 59, 0.90)',

  // Text Colors
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#0F172A',

  // Border Colors
  border: '#334155',

  // Status Colors
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',

  // Skill Level Colors
  skillBeginner: '#4ADE80',
  skillIntermediate: '#FACC15',
  skillAdvanced: '#FB923C',
  skillPro: '#F87171',

  // Utility Colors
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

// ============================================
// STORAGE KEY
// ============================================

const THEME_STORAGE_KEY = '@pickleball_theme_mode';

// ============================================
// CONTEXT
// ============================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const currentIsDark =
      themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
    setThemeMode(currentIsDark ? 'light' : 'dark');
  };

  // Compute actual dark mode state
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Create theme object
  const theme: Theme = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark]
  );

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      setThemeMode,
      toggleTheme,
    }),
    [theme, themeMode, isDark]
  );

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============================================
// HOOK
// ============================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ============================================
// CONVENIENCE HOOK - Just Colors
// ============================================

export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();
  return theme.colors;
};
