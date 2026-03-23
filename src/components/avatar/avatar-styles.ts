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

/** Consistent avatar colors — Hinge muted palette */
export const AVATAR_COLORS = [
  '#3B5998', // Muted Blue (primary)
  '#7B9FD4', // Light Blue (primaryLight)
  '#E5627D', // Soft Rose (accent)
  '#F0899D', // Light Rose (accentLight)
  '#2D4373', // Dark Blue (primaryDark)
  '#5B8C6A', // Sage Green (secondary)
  '#7C6FAE', // Muted Violet
];
