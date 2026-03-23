import { StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export { SCREEN_WIDTH };

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Photo
    photoContainer: {
      height: SCREEN_WIDTH * 0.9,
      position: 'relative',
    },
    photo: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.9,
    },
    photoIndicators: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    indicatorActive: {
      backgroundColor: colors.white,
      width: 20,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: spacing.md,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Content
    content: {
      flex: 1,
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      marginTop: -20,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },

    // Name
    nameSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    displayName: {
      ...typography.h2,
      color: colors.textPrimary,
      flex: 1,
      fontFamily: 'PlayfairDisplay-Bold',
    },
    onlineBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${colors.success}20`,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    onlineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
      marginRight: spacing.xs,
    },
    onlineText: {
      ...typography.bodySmall,
      color: colors.success,
    },

    // Info
    infoRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    infoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    infoEmoji: {
      fontSize: 16,
      marginRight: spacing.xs,
    },
    infoText: {
      ...typography.body,
      color: colors.textPrimary,
    },

    // Stats
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      ...typography.h4,
      color: colors.textPrimary,
    },
    statLabel: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.border,
    },

    // Bio
    bioSection: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      fontFamily: 'PlayfairDisplay-Regular',
    },
    bio: {
      ...typography.body,
      color: colors.textPrimary,
      lineHeight: 22,
    },

    // Tags
    section: {
      marginBottom: spacing.lg,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    tagText: {
      ...typography.body,
      color: colors.primary,
    },

    // Actions
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    actionButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatButton: {
      flex: 1,
    },
  });
