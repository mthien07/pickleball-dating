/**
 * BookingConfirmationScreen
 *
 * Success screen after booking with QR code
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
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

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_COURTS } from '@data/mockData';

// ============================================
// TYPES
// ============================================

type ConfirmationRouteParams = {
  BookingConfirmation: {
    courtId: string;
    date: string;
    slots: { startTime: string; endTime: string; price: number }[];
    totalPrice: number;
    bookingId: string;
  };
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const BookingConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ConfirmationRouteParams, 'BookingConfirmation'>>();
  const { courtId, date, slots = [], totalPrice = 0, bookingId } = route.params || {};

  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
  const bookingDate = date ? new Date(date) : new Date();

  // Pulse animation for QR code
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

  const formatDate = (d: Date): string => {
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          {/* Success Icon */}
          <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.successIcon}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color={colors.primary} />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text entering={FadeInUp.delay(400)} style={styles.title}>
            Đặt sân thành công!
          </Animated.Text>

          <Animated.Text entering={FadeInUp.delay(500)} style={styles.subtitle}>
            Mã đặt sân: {bookingId}
          </Animated.Text>

          {/* Booking Card */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.bookingCard}>
            {/* QR Code Placeholder */}
            <Animated.View style={[styles.qrContainer, pulseStyle]}>
              <View style={styles.qrCode}>
                <Ionicons name="qr-code" size={100} color={colors.textPrimary} />
              </View>
              <Text style={styles.qrHint}>Quét mã để check-in tại sân</Text>
            </Animated.View>

            {/* Booking Details */}
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

          {/* Actions */}
          <Animated.View entering={FadeIn.delay(800)} style={styles.actions}>
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
              onPress={() => {
                // Navigate to root of Courts tab
                navigation.popToTop();
              }}
              variant="primary"
              fullWidth
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  // Success Icon
  successIcon: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Title
  title: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Booking Card
  bookingCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },

  // QR Code
  qrContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrCode: {
    width: 140,
    height: 140,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  qrHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Details
  detailsContainer: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  detailText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  priceValue: {
    ...typography.h3,
    color: colors.primary,
  },

  // Actions
  actions: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export default BookingConfirmationScreen;
