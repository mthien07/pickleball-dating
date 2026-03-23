/**
 * Theme color definitions for light and dark modes
 * Style: Hinge Editorial — 90% neutral, 10% accent
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
  surfaceSecondary: string;
  surfaceTertiary: string;

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
  // Muted Slate Blue — sophisticated, trustworthy
  primary: '#3B5998',
  primaryGradientStart: '#3B5998',
  primaryGradientEnd: '#7B9FD4',
  primaryDark: '#2D4373',
  primaryLight: '#7B9FD4',

  // Sage Green — courts, nature
  secondary: '#5B8C6A',
  secondaryDark: '#4A7358',

  // Soft Rose — dating/match, elegant
  accent: '#E5627D',
  accentLight: '#F0899D',
  accentDark: '#C94A63',
  lime: '#8FA85E',
  sportGreen: '#5B8C6A',

  // Warm off-white backgrounds
  background: '#FAF9F7',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',
  surfaceSecondary: '#F5F3F0',
  surfaceTertiary: '#EDEBE8',

  // Warmer text tones
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FAF9F7',

  // Warm gray border
  border: '#E8E6E1',

  // Muted status colors
  success: '#5B8C6A',
  error: '#D9534F',
  warning: '#D4A054',
  info: '#7B9FD4',

  // Skill levels
  skillBeginner: '#5B8C6A',
  skillIntermediate: '#D4A054',
  skillAdvanced: '#3B5998',
  skillPro: '#E5627D',

  // Additional tokens
  starColor: '#D4A054',
  goldAccent: '#D4B85A',
  redAccent: '#E5627D',
  overlayGradientStart: 'rgba(59, 89, 152, 0.15)',
  overlayGradientEnd: 'rgba(91, 140, 106, 0.15)',
  backgroundCircle: '#F5F3F0',
  searchBackground: '#F5F3F0',
  disabledBackground: '#FAF9F7',
  disabledGradientStart: '#C4C1BC',
  disabledGradientEnd: '#9CA3AF',
  onboardingOverlay: 'rgba(255, 255, 255, 0.15)',
  borderGlass: 'rgba(232, 230, 225, 0.5)',
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(26, 26, 46, 0.4)',
  overlayLight: 'rgba(26, 26, 46, 0.2)',
  overlayDark: 'rgba(26, 26, 46, 0.6)',
};

export const darkColors: ThemeColors = {
  // Muted blue for dark mode
  primary: '#7B9FD4',
  primaryGradientStart: '#7B9FD4',
  primaryGradientEnd: '#A3BFE5',
  primaryDark: '#3B5998',
  primaryLight: '#A3BFE5',

  // Lighter sage for dark
  secondary: '#7DAE8B',
  secondaryDark: '#5B8C6A',

  // Softer rose for dark
  accent: '#F0899D',
  accentLight: '#F5ADB9',
  accentDark: '#E5627D',
  lime: '#B0C87A',
  sportGreen: '#7DAE8B',

  // True dark backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  surfaceGlass: 'rgba(30, 30, 30, 0.72)',
  surfaceSecondary: '#252525',
  surfaceTertiary: '#2C2C2C',

  // Light text on dark
  textPrimary: '#F5F3F0',
  textSecondary: '#B0ADA8',
  textTertiary: '#6B6966',
  textInverse: '#1A1A2E',

  // Dark border
  border: '#2C2C2C',

  // Brighter status for dark
  success: '#7DAE8B',
  error: '#E87B78',
  warning: '#E0B86E',
  info: '#A3BFE5',

  // Skill levels for dark
  skillBeginner: '#7DAE8B',
  skillIntermediate: '#E0B86E',
  skillAdvanced: '#7B9FD4',
  skillPro: '#F0899D',

  // Additional tokens
  starColor: '#E0B86E',
  goldAccent: '#E0C87A',
  redAccent: '#F0899D',
  overlayGradientStart: 'rgba(123, 159, 212, 0.2)',
  overlayGradientEnd: 'rgba(125, 174, 139, 0.2)',
  backgroundCircle: '#252525',
  searchBackground: '#252525',
  disabledBackground: '#1E1E1E',
  disabledGradientStart: '#4A4A4A',
  disabledGradientEnd: '#3A3A3A',
  onboardingOverlay: 'rgba(0, 0, 0, 0.4)',
  borderGlass: 'rgba(44, 44, 44, 0.5)',
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};
