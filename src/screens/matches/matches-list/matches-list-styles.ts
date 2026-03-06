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

    // Header - Instagram style
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Search Bar
    searchContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 10,
      paddingHorizontal: spacing.sm,
      paddingVertical: 8,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      padding: 0,
    },

    // Stories Section (New Matches)
    storiesSection: {
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
      paddingBottom: spacing.md,
    },
    storiesList: {
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },
    storyItem: {
      alignItems: 'center',
      width: 76,
    },
    storyRing: {
      width: 68,
      height: 68,
      borderRadius: 34,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyAvatarWrapper: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: colors.surface,
      padding: 2,
    },
    storyAvatar: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
    },
    storyOnline: {
      position: 'absolute',
      bottom: 18,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.success,
      borderWidth: 3,
      borderColor: colors.surface,
    },
    storyName: {
      fontSize: 12,
      color: colors.textPrimary,
      marginTop: 6,
      textAlign: 'center',
    },

    // Tin Nhắn Header
    messagesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    messagesTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    requestsLink: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },

    // Conversation Item
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
    },
    conversationAvatarContainer: {
      position: 'relative',
    },
    conversationAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    conversationOnline: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.success,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    conversationContent: {
      flex: 1,
      marginLeft: 12,
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    conversationName: {
      fontSize: 15,
      color: colors.textPrimary,
      flex: 1,
    },
    conversationNameBold: {
      fontWeight: '600',
    },
    conversationTime: {
      fontSize: 14,
      color: colors.textTertiary,
      marginLeft: 8,
    },
    conversationPreview: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    conversationMessage: {
      fontSize: 14,
      color: colors.textTertiary,
      flex: 1,
    },
    conversationMessageBold: {
      color: colors.textPrimary,
      fontWeight: '500',
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    cameraButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // List
    listContent: {
      paddingBottom: spacing['2xl'],
    },
  });
