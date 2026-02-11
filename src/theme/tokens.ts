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
// COLOR PALETTE - SPORTS DATING BLUE + ROSE
// Primary: Electric Blue (energetic, sporty, trustworthy)
// Accent: Rose (dating/match, romantic, engaging)
// Style: Vibrant & Block-based + Motion-Driven
// Based on: design/design-system.md
// ============================================

export const colors = {
  // Primary Colors (Electric Blue - energetic, sporty)
  primary: '#2563EB', // Blue-600
  primaryGradientStart: '#2563EB',
  primaryGradientEnd: '#60A5FA', // Blue-400
  primaryDark: '#1D4ED8', // Blue-700
  primaryLight: '#60A5FA', // Blue-400

  // Secondary Colors (Emerald Green - courts, nature, success)
  secondary: '#10B981', // Emerald-500
  secondaryDark: '#059669', // Emerald-600
  secondaryLight: '#34D399', // Emerald-400

  // Accent Colors (Rose - dating/match feel, CTA)
  accent: '#F43F5E', // Rose-500 - CTA color
  accentLight: '#FB7185', // Rose-400
  accentDark: '#E11D48', // Rose-600

  // Vibrant Sport Colors
  lime: '#84CC16', // Lime-500 - Energy, vitality
  sportGreen: '#10B981', // Emerald-500 - Courts, success
  electric: '#8B5CF6', // Violet-500 - Premium, special
  energyOrange: '#F97316', // Orange-500 - Energy, excitement
  neonYellow: '#FACC15', // Yellow-400 - Highlight, attention

  // Background Colors - Clean, modern
  background: '#F8FAFC', // Slate-50
  backgroundDark: '#0F172A', // Slate-900
  surface: '#FFFFFF', // Pure White
  surfaceGlass: 'rgba(255, 255, 255, 0.72)', // Glass effect
  surfaceGlassDark: 'rgba(15, 23, 42, 0.72)', // Dark glass
  surfaceDark: '#1E293B', // Slate-800

  // Bento card backgrounds
  bentoLight: '#EFF6FF', // Blue-50
  bentoDark: '#1E3A8A', // Blue-900

  // Text Colors
  textPrimary: '#0F172A', // Slate-900
  textSecondary: '#475569', // Slate-600
  textTertiary: '#94A3B8', // Slate-400
  textInverse: '#F8FAFC', // Slate-50

  // Border Colors
  border: '#E2E8F0', // Slate-200
  borderDark: '#334155', // Slate-700
  borderGlass: 'rgba(226, 232, 240, 0.5)', // Slate-200/50

  // Status Colors
  success: '#10B981', // Emerald-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  info: '#38BDF8', // Sky-400

  // Skill Level Colors
  skillBeginner: '#10B981', // Emerald-500
  skillIntermediate: '#F59E0B', // Amber-500
  skillAdvanced: '#2563EB', // Blue-600
  skillPro: '#F43F5E', // Rose-500

  // Utility Colors
  black: '#000000',
  white: '#FFFFFF',

  // Transparent overlays
  overlay: 'rgba(15, 23, 42, 0.4)', // Slate-900
  overlayLight: 'rgba(15, 23, 42, 0.2)',
  overlayDark: 'rgba(15, 23, 42, 0.6)',

  // Glassmorphism specific
  glassBg: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(226, 232, 240, 0.5)', // Slate-200/50
  glassShadow: 'rgba(37, 99, 235, 0.15)', // Blue-600/15
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
  // Headings - Large type for Vibrant Sport style (32px+)
  hero: {
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 52,
    letterSpacing: -1,
    fontFamily: 'BarlowCondensed-Bold',
  },
  h1: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 42,
    letterSpacing: -0.5,
    fontFamily: 'Barlow-Bold',
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
    fontFamily: 'Barlow-Bold',
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
    fontFamily: 'Barlow-SemiBold',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontFamily: 'Barlow-SemiBold',
  },

  // Body Text
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: 0,
    fontFamily: 'Barlow-Regular',
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
    fontFamily: 'Barlow-Regular',
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
    fontFamily: 'Barlow-Regular',
  },

  // Special
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontFamily: 'Barlow-SemiBold',
    textTransform: 'uppercase' as const,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontFamily: 'Barlow-SemiBold',
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.8,
    fontFamily: 'Barlow-Medium',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
    fontFamily: 'Barlow-Medium',
  },
} as const;

// Font Families (Barlow - athletic, energetic, sports)
// Google Fonts: https://fonts.google.com/share?selection.family=Barlow+Condensed:wght@400;500;600;700|Barlow:wght@300;400;500;600;700
export const fontFamily = {
  heading: 'Barlow-Bold', // Athletic condensed headings
  headingCondensed: 'BarlowCondensed-Bold', // Extra impact for large titles
  body: 'Barlow-Regular', // Clean body text
  bodyMedium: 'Barlow-Medium', // Emphasis
  bodySemiBold: 'Barlow-SemiBold', // Strong emphasis
  primary: 'Barlow-Regular', // Default
  fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

// ============================================
// BORDER RADIUS - Modern larger radius for 2024-2026
// ============================================

export const borderRadius = {
  xs: 6, // Subtle rounding
  sm: 12, // Increased from 8
  md: 16, // Increased from 12
  lg: 20, // Increased from 16
  xl: 28, // Increased from 24
  '2xl': 32, // New - for bento cards
  '3xl': 40, // New - for large cards
  full: 9999, // For circular elements

  // Component-specific - more rounded for modern look
  button: 16, // Increased from 12
  input: 14, // Increased from 12
  card: 20, // Increased from 16 - bento style
  profileCard: 28, // Increased from 24
  avatar: 9999,
  bentoCard: 24, // New - for bento grid cards
  glass: 20, // New - for glass elements
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
