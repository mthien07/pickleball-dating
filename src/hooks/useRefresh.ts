/**
 * useRefresh Hook
 *
 * Reusable hook for pull-to-refresh functionality
 *
 * Usage:
 * ```tsx
 * const { refreshing, onRefresh, refreshControlProps } = useRefresh(async () => {
 *   await fetchData();
 * });
 *
 * <FlatList
 *   data={data}
 *   refreshControl={<RefreshControl {...refreshControlProps} />}
 * />
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import { RefreshControlProps } from 'react-native';
import { colors } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export interface UseRefreshOptions {
  /**
   * Custom tint color for iOS
   */
  tintColor?: string;

  /**
   * Custom colors for Android
   */
  colors?: string[];

  /**
   * Enable/disable refresh
   */
  enabled?: boolean;
}

export interface UseRefreshReturn {
  /**
   * Is currently refreshing
   */
  refreshing: boolean;

  /**
   * Trigger refresh manually
   */
  onRefresh: () => Promise<void>;

  /**
   * RefreshControl props ready to spread
   */
  refreshControlProps: RefreshControlProps;

  /**
   * Set refreshing state manually
   */
  setRefreshing: (value: boolean) => void;
}

// ============================================
// HOOK
// ============================================

export const useRefresh = (
  refreshFunction: () => Promise<void>,
  options?: UseRefreshOptions
): UseRefreshReturn => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (options?.enabled === false) return;

    setRefreshing(true);
    try {
      await refreshFunction();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction, options?.enabled]);

  const refreshControlProps: RefreshControlProps = useMemo(
    () => ({
      refreshing,
      onRefresh,
      tintColor: options?.tintColor || colors.primary,
      colors: options?.colors || [colors.primary, colors.secondary],
      enabled: options?.enabled !== false,
    }),
    [refreshing, onRefresh, options?.tintColor, options?.colors, options?.enabled]
  );

  return {
    refreshing,
    onRefresh,
    refreshControlProps,
    setRefreshing,
  };
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
const CourtListScreen = () => {
  const [courts, setCourts] = useState([]);

  const { refreshControlProps } = useRefresh(async () => {
    const data = await fetchCourts();
    setCourts(data);
  });

  return (
    <FlatList
      data={courts}
      renderItem={renderItem}
      refreshControl={<RefreshControl {...refreshControlProps} />}
    />
  );
};

// With custom colors
const { refreshControlProps } = useRefresh(
  async () => await fetchData(),
  {
    tintColor: '#5B9FE3',
    colors: ['#5B9FE3', '#A8C8E8'],
  }
);

// Programmatic refresh
const { onRefresh, refreshing } = useRefresh(fetchData);

// Trigger refresh manually
<Button onPress={onRefresh} loading={refreshing} />

// Conditional refresh
const { refreshControlProps } = useRefresh(
  fetchData,
  { enabled: isOnline }
);
*/

export default useRefresh;
