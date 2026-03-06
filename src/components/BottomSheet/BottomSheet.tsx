/**
 * BottomSheet Component
 *
 * Wrapper around @gorhom/bottom-sheet with custom styling
 *
 * Usage:
 * ```tsx
 * const bottomSheetRef = useRef<BottomSheetRef>(null);
 *
 * <BottomSheet ref={bottomSheetRef} snapPoints={['25%', '50%', '90%']}>
 *   <FilterContent />
 * </BottomSheet>
 * ```
 */

import React, { forwardRef, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandle,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { spacing, borderRadius } from '../../theme/tokens';
import { useThemeColors } from '../../contexts/ThemeContext';

// ============================================
// TYPES
// ============================================

export interface BottomSheetProps {
  /**
   * Children content
   */
  children: React.ReactNode;

  /**
   * Snap points (e.g., ['25%', '50%', '90%'])
   * @default ['50%', '90%']
   */
  snapPoints?: (string | number)[];

  /**
   * Initial snap index
   * @default 0
   */
  initialSnapIndex?: number;

  /**
   * Enable pan down to close
   * @default true
   */
  enablePanDownToClose?: boolean;

  /**
   * Enable backdrop
   * @default true
   */
  enableBackdrop?: boolean;

  /**
   * Background color
   * @default colors.surface
   */
  backgroundColor?: string;

  /**
   * Callback when sheet changes
   */
  onChange?: (index: number) => void;

  /**
   * Callback when sheet is closed
   */
  onClose?: () => void;
}

export interface BottomSheetRef {
  /**
   * Snap to specific index
   */
  snapToIndex: (index: number) => void;

  /**
   * Snap to position
   */
  snapToPosition: (position: string | number) => void;

  /**
   * Expand to max snap point
   */
  expand: () => void;

  /**
   * Collapse to min snap point
   */
  collapse: () => void;

  /**
   * Close the bottom sheet
   */
  close: () => void;
}

// ============================================
// CUSTOM HANDLE
// ============================================

const CustomHandle: React.FC<BottomSheetHandleProps> = (props) => {
  return (
    <BottomSheetHandle {...props}>
      <View style={styles.handleContainer}>
        <View style={styles.handleIndicator} />
      </View>
    </BottomSheetHandle>
  );
};

// ============================================
// COMPONENT
// ============================================

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints = ['50%', '90%'],
      initialSnapIndex = 0,
      enablePanDownToClose = true,
      enableBackdrop = true,
      backgroundColor,
      onChange,
      onClose,
    },
    ref
  ) => {
    const colors = useThemeColors();
    const resolvedBackgroundColor = backgroundColor ?? colors.surface;
    // Memoize snap points
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    // Backdrop component
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) =>
        enableBackdrop ? (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
        ) : null,
      [enableBackdrop]
    );

    // Handle change
    const handleChange = useCallback(
      (index: number) => {
        if (index === -1 && onClose) {
          onClose();
        }
        onChange?.(index);
      },
      [onChange, onClose]
    );

    return (
      <GorhomBottomSheet
        ref={ref as any}
        index={initialSnapIndex}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        handleComponent={CustomHandle}
        backgroundStyle={{ backgroundColor: resolvedBackgroundColor }}
        onChange={handleChange}
      >
        <View style={styles.contentContainer}>{children}</View>
      </GorhomBottomSheet>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  handleContainer: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0', // border color
    borderRadius: borderRadius.sm,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

export default BottomSheet;
