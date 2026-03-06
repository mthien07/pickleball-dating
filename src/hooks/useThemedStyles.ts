/**
 * useThemedStyles - Creates memoized styles from a factory function using current theme colors.
 *
 * Usage:
 * ```tsx
 * import { createStyles } from './my-styles';
 * const styles = useThemedStyles(createStyles);
 * ```
 */

import { useMemo } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import type { ThemeColors } from '../contexts/theme-colors';

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const colors = useThemeColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
