import { StyleSheet } from 'react-native';
import { typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import type { ThemeColors } from '../../contexts/theme-colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      ...shadows.sm,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 9999,
    },
    fallback: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    initials: {
      ...typography.h3,
      color: colors.white,
      textAlign: 'center',
      fontWeight: '600',
    },
  });

/** Consistent avatar colors — blue + rose palette */
export const AVATAR_COLORS = [
  '#2563EB', // Blue-600 (primary)
  '#60A5FA', // Blue-400 (primaryLight)
  '#F43F5E', // Rose-500 (accent)
  '#FB7185', // Rose-400 (accentLight)
  '#1D4ED8', // Blue-700 (primaryDark)
  '#3B82F6', // Blue-500
  '#E11D48', // Rose-600 (accentDark)
];
