import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerImage: {
      height: 200,
      position: 'relative',
    },
    coverImage: {
      width: '100%',
      height: '100%',
    },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerActions: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.md,
      marginTop: spacing.sm,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      marginTop: -20,
      paddingHorizontal: spacing.lg,
    },
    profileCard: {
      alignItems: 'center',
      paddingTop: spacing.lg,
      marginTop: -50,
    },
    coachName: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 24,
      color: colors.textPrimary,
      marginTop: spacing.sm,
    },
    price: {
      ...typography.body,
      color: colors.primary,
      fontWeight: '600',
      marginTop: spacing.xs,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      ...typography.h4,
      color: colors.textPrimary,
      marginTop: spacing.xs,
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
    section: {
      marginTop: spacing.xl,
    },
    sectionTitle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      letterSpacing: 0.3,
    },
    bio: {
      ...typography.body,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    certList: {
      gap: spacing.sm,
    },
    certItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    certText: {
      ...typography.body,
      color: colors.textPrimary,
    },
    locationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    locationText: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    galleryRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    galleryImage: {
      width: 150,
      height: 100,
      borderRadius: borderRadius.md,
    },
    contactRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    contactButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emailButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerPrice: {
      marginRight: spacing.lg,
    },
    footerPriceLabel: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    footerPriceValue: {
      ...typography.h4,
      color: colors.textPrimary,
    },
    bookButton: {
      flex: 1,
    },
  });
