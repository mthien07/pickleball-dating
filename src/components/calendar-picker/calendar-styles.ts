import { StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, borderRadius } from '../../theme/tokens';
import type { ThemeColors } from '../../contexts/theme-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const DAY_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 12) / 7;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    navButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
    },
    navButtonDisabled: {
      opacity: 0.5,
    },
    monthTitle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 18,
      color: colors.textPrimary,
    },
    weekdaysRow: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    weekdayCell: {
      flex: 1,
      alignItems: 'center',
    },
    weekdayText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    },
    day: {
      width: DAY_SIZE,
      height: DAY_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.full,
    },
    dayToday: {
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    dayDisabled: {
      opacity: 0.4,
    },
    daySelected: {
      width: DAY_SIZE,
      height: DAY_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.full,
    },
    dayText: {
      ...typography.body,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    dayTextToday: {
      color: colors.primary,
      fontWeight: '600',
    },
    dayTextDisabled: {
      color: colors.textTertiary,
    },
    dayTextSelected: {
      color: colors.white,
      fontWeight: '600',
    },
  });
