import { StyleSheet, Dimensions } from 'react-native';
import { spacing, borderRadius, typography } from '../../theme/tokens';
import type { ThemeColors } from '../../contexts/theme-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.75;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.xs,
      marginHorizontal: spacing.md,
    },
    containerMe: {
      alignItems: 'flex-end',
    },
    containerOther: {
      alignItems: 'flex-start',
    },
    bubble: {
      maxWidth: MAX_BUBBLE_WIDTH,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.lg,
    },
    bubbleMe: {
      borderBottomRightRadius: 4,
    },
    bubbleOther: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    imageBubble: {
      padding: 4,
      overflow: 'hidden',
    },
    messageText: {
      ...typography.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    messageTextMe: {
      color: colors.white,
    },
    imageMessage: {
      width: MAX_BUBBLE_WIDTH - spacing.md,
      height: 200,
      borderRadius: borderRadius.md,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    metaMe: {
      justifyContent: 'flex-end',
    },
    metaOther: {
      justifyContent: 'flex-start',
    },
    timestamp: {
      ...typography.bodySmall,
      fontSize: 11,
      color: colors.textTertiary,
    },
    typingContainer: {
      alignItems: 'flex-start',
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
    },
    typingBubble: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderBottomLeftRadius: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typingDots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textTertiary,
    },
    typingDot1: { opacity: 0.4 },
    typingDot2: { opacity: 0.6 },
    typingDot3: { opacity: 0.8 },
  });
