import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../theme/tokens';
import type { ThemeColors } from '../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    slotsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    slot: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slotAvailable: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    slotTimeAvailable: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    slotPriceAvailable: {
      ...typography.bodySmall,
      color: colors.primary,
      marginTop: 2,
    },
    slotSelected: {
      borderWidth: 0,
    },
    slotTimeSelected: {
      ...typography.body,
      fontWeight: '600',
      color: colors.white,
    },
    slotPriceSelected: {
      ...typography.bodySmall,
      color: colors.white,
      opacity: 0.9,
      marginTop: 2,
    },
    slotBooked: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      opacity: 0.5,
    },
    slotTimeBooked: {
      ...typography.body,
      color: colors.textTertiary,
      textDecorationLine: 'line-through',
    },
    slotPriceBooked: {
      ...typography.bodySmall,
      color: colors.textTertiary,
      marginTop: 2,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.lg,
      paddingVertical: spacing.lg,
      marginTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    legendAvailable: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    legendSelected: {
      backgroundColor: colors.primary,
    },
    legendBooked: {
      backgroundColor: colors.textTertiary,
      opacity: 0.5,
    },
    legendText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
  });
