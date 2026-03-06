import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      zIndex: 10,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    screenTitle: {
      ...typography.h1,
      color: colors.textPrimary,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      height: 50,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...typography.body,
      color: colors.textPrimary,
      height: '100%',
    },
    listContent: {
      padding: spacing.lg,
      paddingBottom: 100,
      gap: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      ...shadows.card,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardContent: {
      padding: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.border,
    },
    headerInfo: {
      flex: 1,
      marginLeft: spacing.md,
      justifyContent: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.xs,
    },
    name: {
      ...typography.h3,
      color: colors.textPrimary,
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.xs,
    },
    ratingText: {
      ...typography.label,
      color: colors.textPrimary,
      fontWeight: '700',
    },
    reviewCount: {
      ...typography.bodySmall,
      color: colors.textTertiary,
    },
    skillBadge: {
      backgroundColor: colors.lime,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    skillText: {
      ...typography.label,
      color: colors.black,
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    detailsRow: {
      flexDirection: 'row',
      marginBottom: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      ...typography.label,
      color: colors.textTertiary,
      fontSize: 10,
      marginBottom: 2,
    },
    detailValue: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
    },
    priceLabel: {
      ...typography.label,
      color: colors.textTertiary,
      fontSize: 10,
    },
    priceValue: {
      ...typography.h3,
      color: colors.primary,
      fontSize: 18,
    },
    currency: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    bookButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.button,
      ...shadows.sm,
    },
    bookButtonText: {
      ...typography.button,
      color: colors.white,
      fontSize: 14,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing['2xl'],
    },
    emptyText: {
      ...typography.h4,
      color: colors.textTertiary,
      marginTop: spacing.md,
    },
  });
