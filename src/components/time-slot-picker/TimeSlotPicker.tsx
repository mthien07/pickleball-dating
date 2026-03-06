import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createStyles } from './time-slot-styles';
import { TimeSlotItem } from './TimeSlotItem';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotIds: string[];
  onSlotSelect: (slotId: string) => void;
  allowMultiple?: boolean;
}

const getHour = (slot: TimeSlot) => parseInt(slot.startTime.split(':')[0], 10);

interface SlotSectionProps {
  title: string;
  sectionSlots: TimeSlot[];
  startIndex: number;
  selectedSlotIds: string[];
  onSlotSelect: (slotId: string) => void;
}

/** Memoized section to avoid re-rendering unaffected time periods */
const SlotSection = React.memo(
  ({ title, sectionSlots, startIndex, selectedSlotIds, onSlotSelect }: SlotSectionProps) => {
    const styles = useThemedStyles(createStyles);
    if (sectionSlots.length === 0) {
      return null;
    }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.slotsGrid}>
          {sectionSlots.map((slot, idx) => (
            <TimeSlotItem
              key={slot.id}
              slot={slot}
              isSelected={selectedSlotIds.includes(slot.id)}
              onPress={() => onSlotSelect(slot.id)}
              index={startIndex + idx}
            />
          ))}
        </View>
      </View>
    );
  }
);

SlotSection.displayName = 'SlotSection';

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlotIds,
  onSlotSelect,
}) => {
  const styles = useThemedStyles(createStyles);
  // Memoize slot groups - avoids re-filtering on every render
  const morningSlots = useMemo(
    () =>
      slots.filter((s) => {
        const h = getHour(s);
        return h >= 6 && h < 12;
      }),
    [slots]
  );

  const afternoonSlots = useMemo(
    () =>
      slots.filter((s) => {
        const h = getHour(s);
        return h >= 12 && h < 18;
      }),
    [slots]
  );

  const eveningSlots = useMemo(
    () =>
      slots.filter((s) => {
        const h = getHour(s);
        return h >= 18 && h < 22;
      }),
    [slots]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SlotSection
        title="🌅 Buổi sáng"
        sectionSlots={morningSlots}
        startIndex={0}
        selectedSlotIds={selectedSlotIds}
        onSlotSelect={onSlotSelect}
      />
      <SlotSection
        title="☀️ Buổi chiều"
        sectionSlots={afternoonSlots}
        startIndex={morningSlots.length}
        selectedSlotIds={selectedSlotIds}
        onSlotSelect={onSlotSelect}
      />
      <SlotSection
        title="🌙 Buổi tối"
        sectionSlots={eveningSlots}
        startIndex={morningSlots.length + afternoonSlots.length}
        selectedSlotIds={selectedSlotIds}
        onSlotSelect={onSlotSelect}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendAvailable]} />
          <Text style={styles.legendText}>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendSelected]} />
          <Text style={styles.legendText}>Đã chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendBooked]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TimeSlotPicker;
