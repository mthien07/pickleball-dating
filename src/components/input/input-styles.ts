/**
 * Input component shared StyleSheet
 */

import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../../theme/tokens';
import type { ThemeColors } from '../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.md,
    },

    // Label
    label: {
      ...typography.label,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    errorLabel: {
      color: colors.error,
    },

    // Text Input Container
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.input,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: 56,
    },

    // Search Input Container (pill shape)
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 0,
      borderRadius: 24,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 4,
      minHeight: 48,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0,
      shadowRadius: 8,
      elevation: 0,
    },

    // Focused state
    focusedContainer: {
      borderColor: colors.primaryLight,
      backgroundColor: colors.white,
    },

    // Error state
    errorContainer: {
      borderColor: colors.error,
      borderWidth: 2,
    },

    // Disabled state
    disabledContainer: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
    },

    // Input text
    input: {
      flex: 1,
      ...typography.bodyLarge,
      color: colors.textPrimary,
      padding: 0,
    },
    searchInput: {
      paddingLeft: spacing.sm,
    },
    inputWithLeadingIcon: {
      paddingLeft: spacing.sm,
    },
    disabledText: {
      color: colors.textTertiary,
    },

    // Icons
    leadingIconContainer: {
      marginRight: spacing.sm,
    },
    iconContainer: {
      marginLeft: spacing.sm,
      padding: spacing.xs,
    },

    // Bottom row (helper text + counter)
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xs,
      minHeight: 18,
    },
    helperTextContainer: {
      flex: 1,
    },
    helperText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    errorText: {
      ...typography.bodySmall,
      color: colors.error,
    },
    counter: {
      ...typography.bodySmall,
      color: colors.textTertiary,
      marginLeft: spacing.sm,
    },
  });
