import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography, fontFamily } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';

const { width: screenWidth } = Dimensions.get('window');

export { screenWidth };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header - Vibrant Sport style
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
  },
  bgCircle: {
    position: 'absolute',
    width: screenWidth * 1.2,
    height: screenWidth * 1.2,
    borderRadius: screenWidth,
    top: '-5%',
    zIndex: -2,
    opacity: 0.15,
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

  // Action Controls - Vibrant Sport style
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing['2xl'],
    gap: spacing.lg,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  // Pass button
  passButton: {
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.card,
  },

  // Like button
  likeButton: {
    padding: 0,
    overflow: 'hidden',
    ...shadows.accentButton,
  },
  likeGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Super Like button
  superLikeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: spacing.lg,
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

  // Web desktop keyboard hint
  keyboardHint: {
    textAlign: 'center',
    fontFamily: fontFamily.body,
    fontSize: typography.bodySmall.fontSize,
    color: colors.textTertiary,
    marginTop: spacing.md,
    paddingBottom: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
