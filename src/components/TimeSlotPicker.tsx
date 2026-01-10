/**
 * TimeSlotPicker Component
 *
 * Grid of time slots for court booking
 * Shows available/booked/selected states with pricing
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export interface TimeSlot {
  id: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  price: number; // VND
  isAvailable: boolean;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotIds: string[];
  onSlotSelect: (slotId: string) => void;
  allowMultiple?: boolean;
}

// ============================================
// SLOT COMPONENT
// ============================================

interface SlotProps {
  slot: TimeSlot;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const Slot: React.FC<SlotProps> = ({ slot, isSelected, onPress, index }) => {
  const formatPrice = (price: number): string => {
    return `${(price / 1000).toFixed(0)}k`;
  };

  if (!slot.isAvailable) {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 30).duration(200)}
        style={[styles.slot, styles.slotBooked]}
      >
        <Text style={styles.slotTimeBooked}>{slot.startTime}</Text>
        <Text style={styles.slotPriceBooked}>Đã đặt</Text>
      </Animated.View>
    );
  }

  if (isSelected) {
    return (
      <Animated.View entering={FadeInUp.delay(index * 30).duration(200)}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={[styles.slot, styles.slotSelected]}
          >
            <Text style={styles.slotTimeSelected}>{slot.startTime}</Text>
            <Text style={styles.slotPriceSelected}>{formatPrice(slot.price)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(index * 30).duration(200)}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.slot, styles.slotAvailable]}
        activeOpacity={0.7}
      >
        <Text style={styles.slotTimeAvailable}>{slot.startTime}</Text>
        <Text style={styles.slotPriceAvailable}>{formatPrice(slot.price)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// COMPONENT
// ============================================

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlotIds,
  onSlotSelect,
  allowMultiple = true,
}) => {
  // Group slots by time of day
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 6 && hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 18;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 18 && hour < 22;
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
            <Slot
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

      {/* Legend */}
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

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  // Slot Base
  slot: {
    width: 80,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Available
  slotAvailable: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotTimeAvailable: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  slotPriceAvailable: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 2,
  },

  // Selected
  slotSelected: {
    borderWidth: 0,
  },
  slotTimeSelected: {
    ...typography.body,
    fontWeight: '600',
    color: colors.white,
  },
  slotPriceSelected: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },

  // Booked
  slotBooked: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.5,
  },
  slotTimeBooked: {
    ...typography.body,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  slotPriceBooked: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendAvailable: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendSelected: {
    backgroundColor: colors.primary,
  },
  legendBooked: {
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default TimeSlotPicker;
