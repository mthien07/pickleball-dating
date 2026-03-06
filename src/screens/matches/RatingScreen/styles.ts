import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      ...typography.h4,
      color: colors.textPrimary,
    },

    // Content
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },

    // User Section
    userSection: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    userName: {
      ...typography.h3,
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    ratingPrompt: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },

    // Overall Rating
    overallSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    overallLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      textTransform: 'uppercase',
    },
    starRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    ratingText: {
      ...typography.body,
      color: colors.textPrimary,
      marginTop: spacing.sm,
    },

    // Categories
    categories: {
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    categoryCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    categoryLabel: {
      ...typography.body,
      color: colors.textPrimary,
    },

    // Comment
    commentSection: {
      marginBottom: spacing.lg,
    },
    commentLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
    commentInput: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body,
      color: colors.textPrimary,
      height: 100,
    },
    charCount: {
      ...typography.bodySmall,
      color: colors.textTertiary,
      textAlign: 'right',
      marginTop: spacing.xs,
    },

    // Footer
    footer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
