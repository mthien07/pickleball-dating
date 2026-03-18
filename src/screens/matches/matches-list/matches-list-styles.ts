import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    safeArea: {
      flex: 1,
    },

    // ── Header ────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
      fontFamily: 'Barlow-Bold',
    },
    headerButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ── New Matches Strip ──────────────────────────────────────
    newMatchesSection: {
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
      paddingBottom: spacing.md,
      paddingTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textTertiary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      fontFamily: 'Barlow-SemiBold',
    },
    newMatchesList: {
      paddingHorizontal: spacing.md,
      gap: 16,
    },
    newMatchItem: {
      alignItems: 'center',
      width: 72,
    },
    newMatchAvatarWrapper: {
      position: 'relative',
      width: 64,
      height: 64,
    },
    newMatchAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.border,
    },
    onlineDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    newMatchName: {
      fontSize: 12,
      color: colors.textPrimary,
      marginTop: 6,
      textAlign: 'center',
      fontFamily: 'Barlow-Regular',
    },

    // ── Messages Section Label ─────────────────────────────────
    messagesHeader: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    messagesTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textTertiary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      fontFamily: 'Barlow-SemiBold',
    },

    // ── Conversation Item ──────────────────────────────────────
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    conversationAvatarContainer: {
      position: 'relative',
      width: 56,
      height: 56,
    },
    conversationAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.border,
    },
    conversationOnlineDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    conversationContent: {
      flex: 1,
      marginLeft: 12,
    },
    conversationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    conversationName: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textPrimary,
      flex: 1,
      fontFamily: 'Barlow-Regular',
    },
    conversationNameUnread: {
      fontWeight: '700',
      fontFamily: 'Barlow-Bold',
    },
    conversationTime: {
      fontSize: 12,
      color: colors.textTertiary,
      marginLeft: spacing.sm,
    },
    conversationPreviewRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    conversationMessage: {
      fontSize: 14,
      color: colors.textTertiary,
      flex: 1,
    },
    conversationMessageUnread: {
      color: colors.textPrimary,
      fontWeight: '500',
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: spacing.sm,
    },

    // ── List ───────────────────────────────────────────────────
    listContent: {
      paddingBottom: spacing['2xl'],
    },
  });
