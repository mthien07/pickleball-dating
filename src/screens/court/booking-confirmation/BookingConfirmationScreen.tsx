/**
 * BookingConfirmationScreen - Success screen after booking with QR code
 */

import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

import { Button } from '../../../components/Button';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { MOCK_COURTS } from '@data/mockData';
import { createStyles } from './booking-confirmation-styles';

type ConfirmationRouteParams = {
  BookingConfirmation: {
    courtId: string;
    date: string;
    slots: { startTime: string; endTime: string; price: number }[];
    totalPrice: number;
    bookingId: string;
  };
};

const formatDate = (d: Date): string =>
  d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const BookingConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ConfirmationRouteParams, 'BookingConfirmation'>>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { courtId, date, slots = [], totalPrice = 0, bookingId } = route.params || {};

  const court = MOCK_COURTS.find((c) => c.id === courtId) || (__DEV__ ? MOCK_COURTS[0] : null);
  const bookingDate = date ? new Date(date) : new Date();

  const { getEntering } = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    pulse.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!court) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={getEntering(ZoomIn.delay(200).springify())}
            style={styles.successIcon}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color={colors.primary} />
            </View>
          </Animated.View>

          <Animated.Text entering={getEntering(FadeInUp.delay(400))} style={styles.title}>
            Đặt sân thành công!
          </Animated.Text>
          <Animated.Text entering={getEntering(FadeInUp.delay(500))} style={styles.subtitle}>
            Mã đặt sân: {bookingId}
          </Animated.Text>

          <Animated.View entering={getEntering(FadeInUp.delay(600))} style={styles.bookingCard}>
            <Animated.View style={[styles.qrContainer, pulseStyle]}>
              <View style={styles.qrCode}>
                <Ionicons name="qr-code" size={100} color={colors.textPrimary} />
              </View>
              <Text style={styles.qrHint}>Quét mã để check-in tại sân</Text>
            </Animated.View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Địa điểm</Text>
                  <Text style={styles.detailValue}>{court.name}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Ngày</Text>
                  <Text style={styles.detailValue}>{formatDate(bookingDate)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Giờ</Text>
                  <Text style={styles.detailValue}>
                    {slots.length > 0
                      ? `${slots[0].startTime} - ${slots[slots.length - 1].endTime}`
                      : '07:00 - 09:00'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tổng thanh toán</Text>
                <Text style={styles.priceValue}>{(totalPrice / 1000).toFixed(0)}k VND</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={getEntering(FadeIn.delay(800))} style={styles.actions}>
            <Button
              title="Thêm vào Calendar"
              onPress={() => {}}
              variant="secondary"
              icon={<Ionicons name="calendar-outline" size={20} color={colors.primary} />}
              fullWidth
              style={styles.actionButton}
            />
            <Button
              title="Về trang chủ"
              onPress={() => navigation.navigate('Home')}
              variant="primary"
              fullWidth
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default BookingConfirmationScreen;
