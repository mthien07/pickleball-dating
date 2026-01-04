/**
 * useBottomSheet Hook
 *
 * Manage bottom sheet state and interactions
 *
 * Usage:
 * ```tsx
 * const { bottomSheetRef, open, close, isOpen } = useBottomSheet();
 *
 * <Button onPress={open} />
 * <BottomSheet ref={bottomSheetRef}>
 *   <Content />
 * </BottomSheet>
 * ```
 */

import { useRef, useCallback, useState } from 'react';
import { BottomSheetRef } from '../components/BottomSheet/BottomSheet';

// ============================================
// HOOK
// ============================================

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  }, []);

  const snapTo = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleChange = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  return {
    bottomSheetRef,
    open,
    close,
    snapTo,
    isOpen,
    handleChange,
  };
};

export default useBottomSheet;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
const FilterSheet = () => {
  const { bottomSheetRef, open, close, isOpen } = useBottomSheet();

  return (
    <>
      <Button onPress={open} title="Open Filters" />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['40%', '90%']}
        onChange={handleChange}
      >
        <FilterContent />
        <Button onPress={close} title="Close" />
      </BottomSheet>
    </>
  );
};

// With snap to index
const { snapTo } = useBottomSheet();

<Button onPress={() => snapTo(0)} title="Half" />
<Button onPress={() => snapTo(1)} title="Full" />

// Check if open
const { isOpen } = useBottomSheet();

{isOpen && <Overlay />}
*/
