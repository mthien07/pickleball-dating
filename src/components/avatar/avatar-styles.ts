import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';

export const styles = StyleSheet.create({
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

/** Consistent avatar colors derived from name hash */
export const AVATAR_COLORS = [
  '#5B9FE3',
  '#A8C8E8',
  '#FFD700',
  '#4CAF50',
  '#2196F3',
  '#9C27B0',
  '#FF9800',
];
