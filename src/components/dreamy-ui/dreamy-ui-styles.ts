/**
 * Shared styles, colors, and constants for DreamyUI components
 */

import { StyleSheet, Dimensions } from 'react-native';
import { spacing, borderRadius, typography } from '../../theme/tokens';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// DREAMY COLOR PALETTE
// ============================================
export const dreamyColors = {
  // Pink shades
  pink50: '#FDF2F8',
  pink100: '#FCE7F3',
  pink200: '#FBCFE8',
  pink300: '#F9A8D4',
  pink400: '#F472B6',
  pink500: '#EC4899',

  // Purple shades
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple200: '#E9D5FF',
  purple300: '#D8B4FE',
  purple400: '#C084FC',
  purple500: '#A855F7',
  purple600: '#9333EA',
  purple700: '#7E22CE',
  purple900: '#581C87',

  // Text colors
  textPrimary: '#581C87', // purple-900
  textSecondary: 'rgba(126, 34, 206, 0.7)', // purple-700/70
  textMuted: 'rgba(126, 34, 206, 0.6)', // purple-700/60

  // Background
  bgGradientStart: '#FCE7F3', // pink-100
  bgGradientMid: '#F3E8FF', // purple-100
  bgGradientEnd: '#FDF2F8', // pink-50

  // Glass effects
  glassWhite: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(251, 207, 232, 0.5)', // pink-200/50
} as const;

// ============================================
// SHARED STYLES
// ============================================
export const sharedStyles = StyleSheet.create({
  // Badge
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeText: {
    ...typography.body,
    fontWeight: '500',
  },

  // Tab Bar
  tabBarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  tabBarBlur: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
  },
  tabBarInner: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tabButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  activeTabBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  tabText: {
    ...typography.body,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#7E22CE',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#A855F7',
  },

  // Feature Card
  featureCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  featureCardGradient: {
    padding: spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    ...typography.h3,
    color: '#581C87',
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.body,
    color: 'rgba(126, 34, 206, 0.7)',
    lineHeight: 22,
  },

  // Hero Card
  heroCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
  heroCardGradient: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EC4899',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.bodyLarge,
    color: 'rgba(126, 34, 206, 0.7)',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.xl,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  secondaryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  secondaryButtonText: {
    ...typography.button,
    color: '#7E22CE',
    fontSize: 18,
  },
});
