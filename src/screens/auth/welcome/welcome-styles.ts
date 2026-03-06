import { StyleSheet } from 'react-native';
import { spacing, borderRadius, fontFamily } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      justifyContent: 'space-between',
    },
    header: {
      marginTop: spacing.xl,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    appName: {
      fontSize: 24,
      fontFamily: fontFamily.heading,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.xl,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headline: {
      fontSize: 36,
      fontFamily: fontFamily.headingCondensed,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
      lineHeight: 42,
    },
    subheading: {
      fontSize: 18,
      fontFamily: fontFamily.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    buttonGroup: {
      gap: spacing.md,
    },
    button: {
      height: 52,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    buttonFilled: {
      backgroundColor: colors.surface,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: spacing.md,
    },
    buttonIcon: {
      marginRight: spacing.md,
      width: 24,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: fontFamily.bodySemiBold,
      color: colors.textPrimary,
    },
    buttonTextOutline: {
      color: colors.textPrimary,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.textSecondary,
      paddingHorizontal: spacing.md,
      fontSize: 14,
      fontFamily: fontFamily.bodySemiBold,
    },
    footer: {
      marginBottom: spacing.lg,
      alignItems: 'center',
      gap: spacing.lg,
    },
    signInContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontFamily: fontFamily.body,
    },
    signInLink: {
      color: colors.primary,
      fontFamily: fontFamily.bodySemiBold,
      fontSize: 15,
    },
    legalText: {
      fontSize: 12,
      fontFamily: fontFamily.body,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: '80%',
    },
    legalLink: {
      color: colors.primary,
      fontFamily: fontFamily.bodySemiBold,
    },
  });
