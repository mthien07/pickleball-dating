import { StyleSheet } from 'react-native';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerTitle: {
      fontFamily: 'Barlow-Bold',
      fontSize: 20,
      color: colors.textPrimary,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButtonText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 16,
      color: colors.primary,
    },

    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 20,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay-Regular',
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 12,
    },

    inputLabel: {
      fontFamily: 'Barlow-Medium',
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    inputField: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontFamily: 'Barlow-Regular',
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputFieldFocused: {
      borderColor: colors.primary,
    },
    bioInput: {
      minHeight: 100,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    charCounter: {
      fontFamily: 'Barlow-Regular',
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: 'right',
      marginTop: 4,
    },
    charCounterWarning: {
      color: colors.error,
    },

    segmentedControl: {
      flexDirection: 'row',
      borderRadius: 12,
      backgroundColor: colors.background,
      overflow: 'hidden',
      padding: 2,
    },
    segmentItem: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    segmentItemActive: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 13,
      color: colors.textSecondary,
    },
    segmentTextActive: {
      color: colors.white,
    },

    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    pill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 9999,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    pillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pillText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 13,
      color: colors.textSecondary,
    },
    pillTextActive: {
      color: colors.white,
    },

    saveButtonContainer: {
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 48,
      borderRadius: 16,
      overflow: 'hidden',
    },
    saveButtonGradient: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    saveButtonGradientText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 16,
      color: colors.white,
      letterSpacing: 0.5,
    },
  });
