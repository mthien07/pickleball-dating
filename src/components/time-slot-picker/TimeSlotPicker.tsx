import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './time-slot-styles';
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

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlotIds,
  onSlotSelect,
}) => {
  const morningSlots = slots.filter((s) => {
    const h = getHour(s);
    return h >= 6 && h < 12;
  });
  const afternoonSlots = slots.filter((s) => {
    const h = getHour(s);
    return h >= 12 && h < 18;
  });
  const eveningSlots = slots.filter((s) => {
    const h = getHour(s);
    return h >= 18 && h < 22;
  });

  const renderSection = (title: string, sectionSlots: TimeSlot[], startIndex: number) => {
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
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderSection('🌅 Buổi sáng', morningSlots, 0)}
      {renderSection('☀️ Buổi chiều', afternoonSlots, morningSlots.length)}
      {renderSection('🌙 Buổi tối', eveningSlots, morningSlots.length + afternoonSlots.length)}

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
