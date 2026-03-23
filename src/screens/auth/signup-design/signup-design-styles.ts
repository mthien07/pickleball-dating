import { StyleSheet } from 'react-native';
import { fontFamily, spacing, borderRadius } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
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
      fontSize: 22,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    content: {
      padding: spacing.lg,
    },
    formGroup: {
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    roleContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    roleCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
      gap: spacing.sm,
      ...shadows.card,
    },
    roleCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.backgroundCircle,
    },
    roleCardText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    roleCardTextSelected: {
      color: colors.primary,
      fontFamily: 'Barlow-SemiBold',
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    termsTextContainer: {
      flex: 1,
    },
    termsText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textPrimary,
    },
    linkText: {
      fontFamily: 'Barlow-SemiBold',
      color: colors.accent,
    },
    button: {
      marginBottom: spacing.lg,
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textSecondary,
    },
    // Desktop split layout styles
    desktopWrapper: {
      flexDirection: 'row' as const,
      flex: 1,
      ...(typeof window !== 'undefined' ? { minHeight: '100vh' as any } : {}),
    },
    brandPanel: {
      flex: 0.45,
    },
    formPanel: {
      flex: 0.55,
      backgroundColor: colors.background,
    },
  });
