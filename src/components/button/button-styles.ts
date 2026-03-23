import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import type { ThemeColors } from '../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.button,
    },
    baseText: {
      ...typography.button,
      textAlign: 'center',
      fontWeight: '600',
      fontFamily: 'Barlow-SemiBold',
    },

    // Variant: Primary
    primaryContainer: {
      backgroundColor: colors.primary,
      ...shadows.button,
    },
    primaryText: {
      color: colors.white,
    },

    // Variant: Secondary
    secondaryContainer: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.secondary,
      ...shadows.buttonSecondary,
    },
    secondaryText: {
      color: colors.secondary,
      fontWeight: '600',
    },

    // Variant: Text
    textContainer: {
      backgroundColor: 'transparent',
    },
    textText: {
      color: colors.primary,
    },

    // Variant: Icon
    iconContainer: {
      backgroundColor: colors.surfaceGlass,
      borderRadius: borderRadius.full,
      width: 52,
      height: 52,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.borderGlass,
    },
    iconText: {
      color: colors.textPrimary,
    },

    // Variant: Gradient
    gradientContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.button,
      ...shadows.button,
    },
    gradientText: {
      color: colors.white,
      fontWeight: '700',
      fontFamily: 'Barlow-SemiBold',
    },

    // Variant: Elevated
    elevatedContainer: {
      backgroundColor: colors.surface,
      ...shadows.neoLight,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    elevatedText: {
      color: colors.textPrimary,
    },

    // Sizes
    smallContainer: {
      paddingVertical: 10,
      paddingHorizontal: 18,
    },
    smallText: {
      fontSize: 14,
      fontFamily: 'Barlow-SemiBold',
    },
    mediumContainer: {
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
    },
    mediumText: {
      fontSize: 16,
      fontFamily: 'Barlow-SemiBold',
    },
    largeContainer: {
      paddingVertical: 18,
      paddingHorizontal: spacing.xl,
    },
    largeText: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'Barlow-Bold',
    },

    // States
    disabledContainer: {
      backgroundColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
      borderColor: colors.border,
      opacity: 0.6,
    },
    disabledText: {
      color: colors.textTertiary,
    },

    // Layout
    fullWidth: {
      width: '100%',
    },

    // Loading
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    loadingText: {
      opacity: 0.6,
    },

    // Icon with text
    contentWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
