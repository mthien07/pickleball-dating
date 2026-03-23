import { StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, borderRadius } from '../../../theme/tokens';
import type { ThemeColors } from '../../../contexts/theme-colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Base
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.md,
    },

    // Empty State
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    emptyText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },

    // Hero Section
    heroContainer: {
      height: SCREEN_HEIGHT * 0.6,
      width: '100%',
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      overflow: 'hidden',
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
    },
    heroGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
    },
    heroContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
    },
    heroNameText: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 28,
      color: colors.white,
    },
    heroLocationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    heroLocationText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },

    // Settings Button
    settingsButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },

    // Skill Badge
    skillBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 9999,
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    skillBadgeText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 12,
      color: colors.white,
      letterSpacing: 0.5,
    },

    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      marginTop: -30,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    statValue: {
      fontFamily: 'Barlow-Bold',
      fontSize: 24,
      color: colors.primary,
    },
    statLabel: {
      fontFamily: 'Barlow-Medium',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginTop: 4,
    },

    // Bio Card
    bioCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 20,
    },
    bioTitle: {
      ...typography.h4,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    bioText: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    tagPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 9999,
      backgroundColor: colors.backgroundCircle,
    },
    tagPillText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 12,
      color: colors.primary,
    },

    // Edit Button
    editButtonContainer: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      overflow: 'hidden',
    },
    editButtonGradient: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    editButtonText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 16,
      color: colors.white,
      letterSpacing: 0.5,
    },
  });
