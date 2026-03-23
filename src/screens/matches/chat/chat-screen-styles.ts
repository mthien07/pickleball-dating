/**
 * chat-screen-styles
 *
 * Styles for ChatScreen extracted for file size management
 */

import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
      ...shadows.sm,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerProfile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.xs,
    },
    headerInfo: {
      marginLeft: spacing.sm,
    },
    headerName: {
      ...typography.h4,
      color: colors.textPrimary,
      fontFamily: 'PlayfairDisplay-Bold',
    },
    headerStatus: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    moreButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Messages
    messagesList: {
      paddingVertical: spacing.md,
    },

    // Online indicator
    onlineText: {
      ...typography.bodySmall,
      color: colors.success,
    },
    offlineText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
  });
