import { StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Image Carousel
    imageContainer: {
      height: 300,
      position: 'relative',
    },
    image: {
      width: SCREEN_WIDTH,
      height: 300,
    },
    topGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageIndicators: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    indicatorActive: {
      backgroundColor: colors.white,
      width: 24,
    },

    // Content
    content: {
      flex: 1,
      marginTop: -20,
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },

    // Header Section
    headerSection: {
      marginBottom: spacing.lg,
    },
    partnerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    partnerText: {
      ...typography.label,
      color: colors.white,
    },
    courtName: {
      ...typography.h1,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginLeft: spacing.xs,
    },
    reviewCount: {
      ...typography.body,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textTertiary,
      marginHorizontal: spacing.sm,
    },
    courtType: {
      ...typography.body,
      color: colors.textSecondary,
    },

    // Sections
    section: {
      marginBottom: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.textPrimary,
    },
    address: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    mapButtonText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: '500',
    },

    // Amenities
    amenitiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    amenityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: borderRadius.sm,
    },
    amenityText: {
      ...typography.bodySmall,
      color: colors.textPrimary,
    },

    // Description
    description: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },

    // Hours
    hours: {
      ...typography.body,
      color: colors.textPrimary,
      fontWeight: '500',
    },

    // Reviews
    reviewCard: {
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    reviewerName: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    reviewRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    reviewRatingText: {
      ...typography.bodySmall,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    reviewComment: {
      ...typography.body,
      color: colors.textSecondary,
    },

    // Footer
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingBottom: spacing.xl,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadows.lg,
    },
    priceContainer: {
      flex: 1,
    },
    priceLabel: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    price: {
      ...typography.h2,
      color: colors.primary,
    },
    priceUnit: {
      ...typography.body,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    bookButton: {
      flex: 1,
      marginLeft: spacing.md,
    },
  });
