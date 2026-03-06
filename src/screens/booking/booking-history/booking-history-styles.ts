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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
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
    tabBar: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...typography.body,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    bookingCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginBottom: spacing.md,
    },
    courtImage: {
      width: 100,
      height: 120,
    },
    bookingInfo: {
      flex: 1,
      padding: spacing.md,
    },
    courtName: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    infoText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    price: {
      ...typography.body,
      fontWeight: '700',
      color: colors.primary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    statusText: {
      ...typography.bodySmall,
      fontWeight: '500',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing['2xl'],
    },
    emptyText: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.md,
    },
  });
