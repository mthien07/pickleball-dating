import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    ...typography.h1,
    fontSize: 32,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  headline: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subheadline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  socialSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  socialButton: {
    width: '100%',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  traditionalSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  traditionalButton: {
    width: '100%',
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signInLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  legalSection: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  legalText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
