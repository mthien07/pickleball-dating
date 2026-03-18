import { StyleSheet, Dimensions } from 'react-native';
import { spacing, borderRadius, typography, fontFamily } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import type { ThemeColors } from '../../../contexts/theme-colors';

const { width: screenWidth } = Dimensions.get('window');

export { screenWidth };

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      zIndex: 10,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      fontFamily: fontFamily.headingCondensed,
      fontSize: 26,
      letterSpacing: 1,
    },
    logoPrimary: {
      color: colors.primary,
    },
    logoAccent: {
      color: colors.accent,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerIconButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileButton: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.border,
      ...shadows.card,
    },

    // Card Area
    cardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginTop: -spacing.xl,
      paddingTop: spacing.sm,
    },
    bgCircle: {
      position: 'absolute',
      width: screenWidth * 1.2,
      height: screenWidth * 1.2,
      borderRadius: screenWidth,
      top: '-5%',
      zIndex: -2,
      opacity: 0.08,
    },
    cardWrapper: {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextCard: {
      transform: [{ scale: 0.95 }, { translateY: 12 }],
      opacity: 0.5,
      zIndex: -1,
    },

    // Action Controls
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: spacing['2xl'],
      gap: spacing.lg,
    },
    // Wrapper for button + label
    buttonGroup: {
      alignItems: 'center',
      gap: 6,
    },
    buttonLabel: {
      fontFamily: fontFamily.bodyMedium,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textTertiary,
    },
    controlButton: {
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
    },

    // Pass button — 68px
    passButton: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: colors.border,
      ...shadows.md,
    },

    // Like button — 72px with stronger glow
    likeButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      padding: 0,
      overflow: 'hidden',
      shadowColor: '#F43F5E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 8,
    },
    likeGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Super Like button — 56px
    superLikeButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: 6,
      padding: 0,
      overflow: 'hidden',
      ...shadows.button,
    },
    superLikeGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Web desktop keyboard hint — more subtle
    keyboardHint: {
      textAlign: 'center',
      fontFamily: fontFamily.body,
      fontSize: 10,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      paddingBottom: spacing.md,
      letterSpacing: 0.8,
      opacity: 0.6,
    },
  });
