/**
 * Theme color definitions for light and dark modes
 */

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
  accentLight: string;
  accentDark: string;
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

  // Additional Theme Tokens
  starColor: string;
  goldAccent: string;
  redAccent: string;
  overlayGradientStart: string;
  overlayGradientEnd: string;
  backgroundCircle: string;
  searchBackground: string;
  disabledBackground: string;
  disabledGradientStart: string;
  disabledGradientEnd: string;
  onboardingOverlay: string;

  // Border
  borderGlass: string;

  // Utility
  black: string;
  white: string;
  overlay: string;
  overlayLight: string;
  overlayDark: string;
}

export const lightColors: ThemeColors = {
  primary: '#2563EB',
  primaryGradientStart: '#2563EB',
  primaryGradientEnd: '#60A5FA',
  primaryDark: '#1D4ED8',
  primaryLight: '#60A5FA',
  secondary: '#10B981',
  secondaryDark: '#059669',
  accent: '#F43F5E',
  accentLight: '#FB7185',
  accentDark: '#E11D48',
  lime: '#84CC16',
  sportGreen: '#10B981',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#F8FAFC',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#38BDF8',
  skillBeginner: '#10B981',
  skillIntermediate: '#F59E0B',
  skillAdvanced: '#2563EB',
  skillPro: '#F43F5E',
  starColor: '#F59E0B',
  goldAccent: '#FCD34D',
  redAccent: '#F43F5E',
  overlayGradientStart: 'rgba(37, 99, 235, 0.2)',
  overlayGradientEnd: 'rgba(16, 185, 129, 0.2)',
  backgroundCircle: '#EFF6FF',
  searchBackground: '#F1F5F9',
  disabledBackground: '#F8FAFC',
  disabledGradientStart: '#CBD5E1',
  disabledGradientEnd: '#94A3B8',
  onboardingOverlay: 'rgba(255, 255, 255, 0.15)',
  borderGlass: 'rgba(226, 232, 240, 0.5)',
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.4)',
  overlayLight: 'rgba(15, 23, 42, 0.2)',
  overlayDark: 'rgba(15, 23, 42, 0.6)',
};

export const darkColors: ThemeColors = {
  primary: '#60A5FA',
  primaryGradientStart: '#60A5FA',
  primaryGradientEnd: '#93C5FD',
  primaryDark: '#2563EB',
  primaryLight: '#93C5FD',
  secondary: '#34D399',
  secondaryDark: '#10B981',
  accent: '#FB7185',
  accentLight: '#FDA4AF',
  accentDark: '#F43F5E',
  lime: '#A3E635',
  sportGreen: '#34D399',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceGlass: 'rgba(30, 41, 59, 0.72)',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textInverse: '#0F172A',
  border: '#334155',
  success: '#34D399',
  error: '#F87171',
  warning: '#FCD34D',
  info: '#7DD3FC',
  skillBeginner: '#34D399',
  skillIntermediate: '#FCD34D',
  skillAdvanced: '#60A5FA',
  skillPro: '#FB7185',
  starColor: '#FCD34D',
  goldAccent: '#FDE68A',
  redAccent: '#FB7185',
  overlayGradientStart: 'rgba(96, 165, 250, 0.25)',
  overlayGradientEnd: 'rgba(52, 211, 153, 0.25)',
  backgroundCircle: '#1E293B',
  searchBackground: '#1E293B',
  disabledBackground: '#1E293B',
  disabledGradientStart: '#475569',
  disabledGradientEnd: '#334155',
  onboardingOverlay: 'rgba(0, 0, 0, 0.4)',
  borderGlass: 'rgba(51, 65, 85, 0.5)',
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};
