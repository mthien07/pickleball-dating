/**
 * BookingScreen - Court booking flow with calendar and time slot selection
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { CalendarPicker } from '../../../components/CalendarPicker';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { TimeSlotPicker, TimeSlot } from '../../../components/TimeSlotPicker';
import { Button } from '../../../components/Button';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { MOCK_COURTS } from '@data/mockData';
import { createStyles } from './booking-screen-styles';

type BookingRouteParams = {
  Booking: { courtId: string };
};

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const basePrice = 150000;

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

export const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BookingRouteParams, 'Booking'>>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  const { courtId } = route.params || {};

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];

  const timeSlots = useMemo(
    () => (selectedDate ? generateTimeSlots(selectedDate) : []),
    [selectedDate]
  );

  const selectedSlots = timeSlots.filter((s) => selectedSlotIds.includes(s.id));
  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const totalHours = selectedSlots.length;

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotIds((prev) =>
      prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]
    );
  };

  const handleContinue = () => {
    navigation.navigate('PaymentMethod', {
      courtId: court.id,
      date: selectedDate?.toISOString(),
      slots: selectedSlots,
      totalPrice,
    });
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Đặt sân</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {court.name}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={getEntering(FadeInUp.delay(100))} style={styles.section}>
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

          {selectedDate && (
            <Animated.View entering={getEntering(FadeInUp.delay(200))} style={styles.section}>
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

export default BookingScreen;
