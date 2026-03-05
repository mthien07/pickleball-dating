import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  titleBadge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  titleText: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
    letterSpacing: 2,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    marginHorizontal: spacing.sm,
  },
  heartIcon: {
    marginHorizontal: spacing.md,
  },
  heartGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartEmoji: {
    fontSize: 32,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  sendMessageButton: {
    width: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  sendMessageText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
