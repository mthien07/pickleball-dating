/**
 * Design Tokens for PickleBall Dating App
 *
 * Based on design/uiuxguides.md
 * All tokens follow a consistent naming convention and type-safe structure
 *
 * Usage:
 * import { colors, spacing, typography, borderRadius } from '@/theme/tokens';
 * import { shadows } from '@/theme/shadows';
 */

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Primary Colors (21st.dev Orange Theme)
  primary: '#F97316', // Orange-500
  primaryGradientStart: '#F97316',
  primaryGradientEnd: '#FB923C', // Orange-400
  primaryDark: '#EA580C', // Orange-600
  primaryLight: '#FDBA74', // Orange-300

  // Secondary Colors (Green)
  secondary: '#22C55E', // Green-500 (Tailwind)
  secondaryDark: '#16A34A', // Green-600

  // Accent Colors
  accent: '#EAB308', // Yellow-500
  lime: '#84CC16', // Lime-500
  sportGreen: '#22C55E', // Green-500

  // Background Colors
  background: '#FFFFFF', // Clean White
  backgroundDark: '#0F172A', // Slate-950
  surface: '#F8FAFC', // Slate-50
  surfaceGlass: 'rgba(255, 255, 255, 0.90)',
  surfaceDark: '#1E293B', // Slate-800

  // Text Colors
  textPrimary: '#0F172A', // Slate-950
  textSecondary: '#64748B', // Slate-500
  textTertiary: '#94A3B8', // Slate-400
  textInverse: '#FFFFFF',

  // Border Colors
  border: '#E2E8F0', // Slate-200
  borderDark: '#334155', // Slate-700

  // Status Colors
  success: '#22C55E', // Green-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  info: '#3B82F6', // Blue-500

  // Skill Level Colors
  skillBeginner: '#22C55E', // Green
  skillIntermediate: '#EAB308', // Yellow
  skillAdvanced: '#F97316', // Orange
  skillPro: '#EF4444', // Red

  // Utility Colors
  black: '#000000',
  white: '#FFFFFF',

  // Transparent overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  overlayDark: 'rgba(15, 23, 42, 0.7)',
} as const;

// ============================================
// SPACING SYSTEM (Base unit: 4px)
// ============================================

export const spacing = {
  xs: 4, // Tight spacing, icon padding
  sm: 8, // Compact lists, small gaps
  md: 16, // Standard component padding
  lg: 24, // Section spacing
  xl: 32, // Major section breaks
  '2xl': 48, // Screen-level spacing
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.5,
  },

  // Body Text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Special
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} as const;

// Font Families
export const fontFamily = {
  primary: 'Inter',
  fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999, // For circular elements

  // Component-specific
  button: 12,
  input: 12,
  card: 16,
  profileCard: 24,
  avatar: 9999,
} as const;

// ============================================
// TOUCH TARGETS
// ============================================

export const touchTargets = {
  minimum: 44, // iOS HIG minimum
  recommended: 48, // Material Design recommendation
  icon: 48,
  button: 48,
} as const;

// ============================================
// BREAKPOINTS (for responsive design)
// ============================================

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1200,
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================

export const durations = {
  instant: 0,
  fast: 100,
  normal: 200,
  medium: 300,
  slow: 400,
  slower: 500,

  // Specific animations
  buttonPress: 100,
  buttonRelease: 150,
  pageTransition: 350,
  modalPresent: 300,
  modalDismiss: 250,
  cardSwipe: 300,
  pullToRefresh: 300,
  skeleton: 1500,
} as const;

// ============================================
// EASING FUNCTIONS
// ============================================

export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,

  // Custom easings
  entrance: [0.4, 0, 0.2, 1] as const, // ease-out
  exit: [0.4, 0, 1, 1] as const, // ease-in
  emphasis: [0.25, 0.46, 0.45, 0.94] as const, // ease-in-out
} as const;

// ============================================
// OPACITY VALUES
// ============================================

export const opacity = {
  disabled: 0.5,
  muted: 0.6,
  subtle: 0.7,
  medium: 0.8,
  high: 0.9,
  full: 1,

  // Overlay opacities
  backdropLight: 0.3,
  backdrop: 0.5,
  backdropDark: 0.7,
  backdropFull: 0.9,
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  max: 99,
} as const;

// ============================================
// AVATAR SIZES
// ============================================

export const avatarSizes = {
  xs: 32, // Group members
  sm: 48, // Chat list
  md: 56, // Match list
  lg: 80, // Profile preview
  xl: 120, // Full profile
} as const;

// ============================================
// ICON SIZES
// ============================================

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get responsive font size based on breakpoint
 */
export const getResponsiveFontSize = (
  baseFontSize: number,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
) => {
  const multipliers = {
    mobile: 1,
    tablet: 1.1,
    desktop: 1.2,
  };
  return baseFontSize * multipliers[breakpoint];
};

/**
 * Get color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Simple hex to rgba converter
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ============================================
// TYPE EXPORTS
// ============================================

export type Color = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type Duration = typeof durations;
export type Easing = typeof easing;
export type Opacity = typeof opacity;
export type ZIndex = typeof zIndex;
export type AvatarSize = typeof avatarSizes;
export type IconSize = typeof iconSizes;

// Default export removed to prevent circular dependency issues
// Use named imports instead: import { colors, spacing } from '@/theme/tokens';
