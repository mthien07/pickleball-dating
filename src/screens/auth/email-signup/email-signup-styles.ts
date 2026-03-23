import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../../../theme/tokens';
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
    },

    // Header - Vibrant Sport style
    header: {
      marginBottom: spacing.lg,
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
      gap: spacing.md,
    },
    inputContainer: {
      gap: spacing.xs,
    },
    labelSecondary: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },

    // Role Selection
    sectionLabel: {
      fontFamily: 'PlayfairDisplay-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    rolesContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    roleCardTouchable: {
      flex: 1,
    },
    roleCardGradient: {
      borderRadius: borderRadius.md,
      borderWidth: 2,
      overflow: 'hidden',
    },
    roleCard: {
      aspectRatio: 1,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      ...shadows.card,
    },
    roleCardSelected: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
    },
    roleLabel: {
      fontFamily: 'Barlow-Medium',
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    roleLabelSelected: {
      fontFamily: 'Barlow-SemiBold',
      color: colors.primary,
    },

    // Terms Checkbox
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.textTertiary,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    checkboxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    termsText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    link: {
      fontFamily: 'Barlow-SemiBold',
      color: colors.accent,
    },
    submitButton: {
      marginTop: spacing.md,
      backgroundColor: colors.accent,
      ...shadows.accentButton,
    },
    submitButtonText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 16,
      color: colors.white,
      letterSpacing: 0.5,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing['2xl'],
      marginBottom: spacing.lg,
    },
    footerText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
