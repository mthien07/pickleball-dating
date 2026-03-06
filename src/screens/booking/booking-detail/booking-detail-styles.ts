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
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    statusBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    statusText: {
      ...typography.body,
      fontWeight: '600',
    },
    courtCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginTop: spacing.lg,
    },
    courtImage: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.md,
    },
    courtInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    courtName: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    courtLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: 2,
    },
    courtAddress: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      flex: 1,
    },
    courtRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    ratingText: {
      ...typography.bodySmall,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    section: {
      marginTop: spacing.lg,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    infoValue: {
      ...typography.body,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    slotsCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
    },
    slotRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    slotTime: {
      ...typography.body,
      color: colors.textPrimary,
    },
    slotPrice: {
      ...typography.body,
      color: colors.textSecondary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: spacing.md,
    },
    totalLabel: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    totalPrice: {
      ...typography.h4,
      color: colors.primary,
    },
    qrCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      alignItems: 'center',
    },
    qrPlaceholder: {
      padding: spacing.md,
    },
    qrHint: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginTop: spacing.md,
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
