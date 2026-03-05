import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../../theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  heroBadge: {
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 56,
  },
  gradientTextWrapper: {
    borderRadius: 8,
  },
  heroTitleGradient: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '800',
    color: 'transparent',
  },
  heroSubtitle: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  heroButtons: {
    width: '100%',
    gap: spacing.md,
  },
  counterBadge: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    width: '48%',
  },
  featureCardInner: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  featureIconContainer: {
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h4,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },

  // Showcase Section
  showcaseSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  showcaseCard: {
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  showcaseContent: {
    gap: spacing.lg,
  },
  showcaseTitle: {
    ...typography.h2,
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  showcaseDescription: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  showcaseGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  showcaseItem: {
    flex: 1,
    gap: spacing.sm,
  },
  showcaseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseItemTitle: {
    ...typography.bodySmall,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  showcaseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginLeft: -8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0a0a0a',
    marginLeft: -8,
  },
  userCount: {
    ...typography.bodySmall,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userCountBold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Buttons Section
  buttonsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  buttonsGrid: {
    gap: spacing.md,
  },

  // Footer
  footer: {
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
