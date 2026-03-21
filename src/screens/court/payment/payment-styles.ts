import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';
import { createBaseStyles } from '../../../theme/style-utils';

export const createStyles = (colors: ThemeColors) => {
  const base = createBaseStyles(colors);
  return StyleSheet.create({
    container: base.screenContainer,
    safeArea: base.flex1,
    header: base.navHeader,
    backButton: base.touchTarget,
    headerTitle: {
      ...typography.h4,
      color: colors.textPrimary,
    },
    content: base.contentPadded,
    summaryCard: {
      ...base.surfaceCard,
      marginTop: spacing.lg,
    },
    sectionTitle: base.sectionTitle,
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    summaryText: {
      ...typography.body,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.md,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    totalPrice: {
      ...typography.h3,
      color: colors.primary,
    },
    section: {
      marginTop: spacing.xl,
    },
    methodCard: {
      ...base.surfaceCard,
      ...base.rowCenter,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
    },
    methodCardSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    methodIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    methodIconSelected: {
      backgroundColor: colors.primary,
    },
    methodInfo: {
      flex: 1,
    },
    methodName: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    methodDescription: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterSelected: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    cardForm: {
      marginTop: spacing.lg,
    },
    cardPreview: {
      height: 180,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    cardChip: {
      width: 40,
      height: 28,
      borderRadius: 4,
      opacity: 0.8,
    },
    cardNumberPreview: {
      ...typography.h3,
      color: colors.white,
      letterSpacing: 2,
    },
    cardPreviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardLabel: {
      ...typography.bodySmall,
      color: 'rgba(255,255,255,0.6)',
      marginBottom: 2,
    },
    cardValue: {
      ...typography.body,
      color: colors.white,
    },
    formField: {
      marginBottom: spacing.md,
    },
    formRow: {
      flexDirection: 'row',
    },
    fieldLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    input: base.textInput,
    walletInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.lg,
    },
    walletInfoText: {
      ...typography.body,
      color: colors.textSecondary,
      flex: 1,
    },
    footer: base.stickyFooter,
  });
};
