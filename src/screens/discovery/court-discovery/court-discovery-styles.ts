import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
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
    headerContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
      zIndex: 10,
    },
    screenTitle: {
      ...typography.h1,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.md,
    },
    toggleButtonActive: {
      backgroundColor: colors.primary,
      ...shadows.sm,
    },
    toggleText: {
      ...typography.button,
      color: colors.textSecondary,
      fontSize: 14,
    },
    toggleTextActive: {
      color: colors.white,
      fontWeight: '700',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      height: 48,
      ...shadows.sm,
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
    filterButton: {
      width: 48,
      height: 48,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    contentContainer: {
      flex: 1,
    },
    listContent: {
      padding: spacing.lg,
      paddingBottom: 100,
      gap: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      ...shadows.md,
      marginBottom: spacing.sm,
    },
    cardImageContainer: {
      height: 180,
      width: '100%',
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    priceBadge: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: colors.success,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    priceText: {
      ...typography.label,
      color: colors.white,
      fontWeight: '700',
    },
    cardContent: {
      padding: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing.sm,
    },
    distanceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      gap: spacing.xs,
    },
    distanceText: {
      ...typography.label,
      color: colors.primaryDark,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    locationText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      flex: 1,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
    },
    starContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    reviewCount: {
      ...typography.label,
      color: colors.textTertiary,
    },
    bookButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      ...shadows.sm,
    },
    bookButtonText: {
      ...typography.button,
      color: colors.white,
      fontSize: 14,
      fontWeight: '700',
    },
    mapPlaceholder: {
      flex: 1,
      margin: spacing.lg,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    mapGradient: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapText: {
      ...typography.h3,
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    mapSubtext: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.xs,
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
