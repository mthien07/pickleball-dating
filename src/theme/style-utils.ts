/**
 * Shared base style factories.
 * Usage: const base = createBaseStyles(colors);
 *        StyleSheet.create({ card: { ...base.surfaceCard, padding: 20 } });
 */

import { spacing, typography, borderRadius } from './tokens';
import { shadows } from './shadows';
import type { ThemeColors } from '../contexts/theme-colors';

export const createBaseStyles = (colors: ThemeColors) => ({
  flex1: { flex: 1 },
  row: { flexDirection: 'row' as const },
  rowCenter: { flexDirection: 'row' as const, alignItems: 'center' as const },
  rowSpaceBetween: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  center: { alignItems: 'center' as const, justifyContent: 'center' as const },
  screenContainer: { flex: 1, backgroundColor: colors.background },
  contentPadded: { flex: 1, paddingHorizontal: spacing.lg },
  surfaceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevatedCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden' as const,
    ...shadows.md,
  },
  sectionDivider: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  stickyFooter: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  navHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  touchTarget: {
    width: 44,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing['2xl'],
  },
});
