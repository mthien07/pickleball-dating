import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: spacing.lg,
      paddingTop: spacing.md,
      flex: 1,
    },

    // Header - Vibrant Sport style
    header: {
      marginBottom: spacing['2xl'],
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    },
    headerTitle: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 24,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },

    // Form
    form: {
      flex: 1,
      paddingTop: spacing.xl,
      gap: spacing.lg,
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    labelAccent: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    labelSecondary: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.lg,
      marginTop: spacing.xs,
    },
    forgotPasswordText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 14,
      color: colors.accent,
    },

    // Submit Button - Vibrant Sport CTA style
    submitButton: {
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.accent,
      marginTop: spacing.md,
      ...shadows.accentButton,
    },
    submitButtonText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 16,
      color: colors.white,
      letterSpacing: 0.5,
    },

    // Footer
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 'auto',
      marginBottom: spacing.xl,
    },
    footerText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textSecondary,
    },
    link: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 14,
      color: colors.accent,
    },
  });
