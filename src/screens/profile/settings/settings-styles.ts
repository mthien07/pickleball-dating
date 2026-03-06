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
    backButton: {
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

    // Section
    section: {
      marginTop: spacing.lg,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
      textTransform: 'uppercase',
    },
    sectionContent: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },

    // Row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    rowLabel: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    rowValue: {
      ...typography.body,
      color: colors.textSecondary,
      marginRight: spacing.xs,
    },
  });
