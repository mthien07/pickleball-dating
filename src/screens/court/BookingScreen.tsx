/**
 * BookingScreen
 *
 * Court booking flow with calendar and time slot selection
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { CalendarPicker } from '../../components/CalendarPicker';
import { TimeSlotPicker, TimeSlot } from '../../components/TimeSlotPicker';
import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_COURTS } from '@data/mockData';

// ============================================
// TYPES
// ============================================

type BookingRouteParams = {
  Booking: {
    courtId: string;
  };
};

// ============================================
// MOCK TIME SLOTS
// ============================================

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const basePrice = 150000; // VND

  for (let hour = 6; hour < 22; hour++) {
    const isPeakHour = hour >= 17 && hour <= 20;
    const isBooked = Math.random() > 0.7;

    slots.push({
      id: `slot-${hour}`,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      price: isPeakHour ? basePrice * 1.5 : basePrice,
      isAvailable: !isBooked,
    });
  }

  return slots;
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BookingRouteParams, 'Booking'>>();
  const { courtId } = route.params || {};

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  // Get court data
  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];

  // Generate slots for selected date
  const timeSlots = useMemo(() => {
    return selectedDate ? generateTimeSlots(selectedDate) : [];
  }, [selectedDate]);

  // Calculate total price
  const selectedSlots = timeSlots.filter((s) => selectedSlotIds.includes(s.id));
  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const totalHours = selectedSlots.length;

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotIds((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      }
      return [...prev, slotId];
    });
  };

  const handleContinue = () => {
    navigation.navigate('PaymentMethod', {
      courtId: court.id,
      date: selectedDate?.toISOString(),
      slots: selectedSlots,
      totalPrice,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Đặt sân</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {court.name}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Select Date */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.sectionTitle}>Chọn ngày</Text>
            </View>
            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              minDate={new Date()}
            />
          </Animated.View>

          {/* Step 2: Select Time Slots */}
          {selectedDate && (
            <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Chọn giờ</Text>
                  <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
                </View>
              </View>
              <TimeSlotPicker
                slots={timeSlots}
                selectedSlotIds={selectedSlotIds}
                onSlotSelect={handleSlotSelect}
              />
            </Animated.View>
          )}

          <View style={{ height: 140 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {totalHours > 0 ? `${totalHours} giờ chơi` : 'Chưa chọn giờ'}
              </Text>
              <Text style={styles.summaryPrice}>
                {totalPrice > 0 ? `${(totalPrice / 1000).toFixed(0)}k VND` : '--'}
              </Text>
            </View>
          </View>
          <Button
            title="Tiếp tục"
            onPress={handleContinue}
            variant="primary"
            disabled={selectedSlotIds.length === 0}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Sections
  section: {
    marginTop: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.white,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  selectedDateText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  summaryContainer: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryPrice: {
    ...typography.h3,
    color: colors.primary,
  },
});

export default BookingScreen;
