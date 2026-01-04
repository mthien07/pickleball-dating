/**
 * useFlatListOptimization Hook
 *
 * Reusable hook for FlatList performance optimization
 *
 * Usage:
 * ```tsx
 * const optimizationProps = useFlatListOptimization(courts, 120);
 *
 * <FlatList
 *   data={courts}
 *   renderItem={renderItem}
 *   {...optimizationProps}
 * />
 * ```
 */

import { useMemo, useCallback } from 'react';

// ============================================
// TYPES
// ============================================

export interface UseFlatListOptimizationOptions {
  /**
   * Fixed item height (for getItemLayout)
   */
  itemHeight?: number;

  /**
   * Number of items to render per batch
   * @default 10
   */
  maxToRenderPerBatch?: number;

  /**
   * Window size (number of screens to render)
   * @default 5
   */
  windowSize?: number;

  /**
   * Initial number of items to render
   * @default 10
   */
  initialNumToRender?: number;
}

export interface UseFlatListOptimizationReturn {
  /**
   * Key extractor function
   */
  keyExtractor: (item: any) => string;

  /**
   * getItemLayout function (if itemHeight provided)
   */
  getItemLayout?: (data: ArrayLike<any> | null | undefined, index: number) => {
    length: number;
    offset: number;
    index: number;
  };

  /**
   * Remove clipped subviews
   */
  removeClippedSubviews: boolean;

  /**
   * Max items to render per batch
   */
  maxToRenderPerBatch: number;

  /**
   * Window size
   */
  windowSize: number;

  /**
   * Initial number to render
   */
  initialNumToRender: number;

  /**
   * Update cells batching period
   */
  updateCellsBatchingPeriod: number;
}

// ============================================
// HOOK
// ============================================

export const useFlatListOptimization = <T extends { id: string }>(
  data: T[],
  options: UseFlatListOptimizationOptions = {}
): UseFlatListOptimizationReturn => {
  const {
    itemHeight,
    maxToRenderPerBatch = 10,
    windowSize = 5,
    initialNumToRender = 10,
  } = options;

  // Memoize key extractor
  const keyExtractor = useCallback((item: T) => item.id, []);

  // Memoize getItemLayout if height provided
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;

    return (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  // Return optimization props
  return {
    keyExtractor,
    getItemLayout,
    removeClippedSubviews: true,
    maxToRenderPerBatch,
    windowSize,
    initialNumToRender,
    updateCellsBatchingPeriod: 50,
  };
};

export default useFlatListOptimization;
