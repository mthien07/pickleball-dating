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
// COLOR PALETTE - HINGE EDITORIAL STYLE
// Primary: Muted Slate Blue (sophisticated, trustworthy)
// Accent: Soft Rose (dating/match, elegant)
// Style: Editorial, 90% neutral + 10% accent
// Ref: Hinge design language
// ============================================

export const colors = {
  // Primary Colors (Muted Slate Blue - sophisticated)
  primary: '#3B5998',
  primaryGradientStart: '#3B5998',
  primaryGradientEnd: '#7B9FD4',
  primaryDark: '#2D4373',
  primaryLight: '#7B9FD4',

  // Secondary Colors (Sage Green - courts, nature)
  secondary: '#5B8C6A',
  secondaryDark: '#4A7358',
  secondaryLight: '#7DAE8B',

  // Accent Colors (Soft Rose - dating/match, elegant)
  accent: '#E5627D',
  accentLight: '#F0899D',
  accentDark: '#C94A63',

  // Muted Sport Colors
  lime: '#8FA85E',
  sportGreen: '#5B8C6A',
  electric: '#7C6FAE',
  energyOrange: '#D4845A',
  neonYellow: '#D4B85A',

  // Background Colors - Warm, editorial
  background: '#FAF9F7',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',
  surfaceGlassDark: 'rgba(18, 18, 18, 0.72)',
  surfaceDark: '#1E1E1E',

  // Secondary surfaces
  surfaceSecondary: '#F5F3F0',
  surfaceTertiary: '#EDEBE8',
  bentoLight: '#F5F3F0',
  bentoDark: '#2A2A2A',

  // Text Colors - Warmer tones
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FAF9F7',

  // Border Colors - Warm gray
  border: '#E8E6E1',
  borderDark: '#2C2C2C',
  borderGlass: 'rgba(232, 230, 225, 0.5)',

  // Status Colors
  success: '#5B8C6A',
  error: '#D9534F',
  warning: '#D4A054',
  info: '#7B9FD4',

  // Skill Level Colors
  skillBeginner: '#5B8C6A',
  skillIntermediate: '#D4A054',
  skillAdvanced: '#3B5998',
  skillPro: '#E5627D',

  // Utility Colors
  black: '#000000',
  white: '#FFFFFF',

  // Transparent overlays
  overlay: 'rgba(26, 26, 46, 0.4)',
  overlayLight: 'rgba(26, 26, 46, 0.2)',
  overlayDark: 'rgba(26, 26, 46, 0.6)',

  // Glassmorphism specific
  glassBg: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(232, 230, 225, 0.5)',
  glassShadow: 'rgba(59, 89, 152, 0.1)',
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
  // Headings - Barlow sans-serif for structured headings
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

  // Editorial serif headings - Hinge-style prompts & headlines
  editorialHero: {
    fontSize: 42,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  editorialH1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.3,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  editorialH2: {
    fontSize: 24,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: 0,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 28,
    letterSpacing: 0,
    fontFamily: 'PlayfairDisplay-Italic',
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

// Font Families - Serif + Sans-Serif pairing (Hinge editorial style)
export const fontFamily = {
  // Sans-serif (Barlow) — body, metadata, UI
  heading: 'Barlow-Bold',
  headingCondensed: 'BarlowCondensed-Bold',
  body: 'Barlow-Regular',
  bodyMedium: 'Barlow-Medium',
  bodySemiBold: 'Barlow-SemiBold',
  primary: 'Barlow-Regular',
  // Serif (PlayfairDisplay) — editorial headlines, prompts
  serif: 'PlayfairDisplay-Regular',
  serifBold: 'PlayfairDisplay-Bold',
  serifItalic: 'PlayfairDisplay-Italic',
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
