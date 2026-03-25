/**
 * BookingDetailScreen - Booking detail with court info, time slots, QR code, and actions
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

import { Button } from '../../../components/Button';
import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { showSuccess } from '../../../services/toast';
import { MOCK_BOOKINGS } from '@data/mockData';
import { createStyles } from './booking-detail-styles';
import { formatDate, formatPrice, getStatusInfo } from './booking-detail-helpers';

// InfoRow sub-component
const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
};

export const BookingDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  const { bookingId } = route.params || {};

  const booking =
    MOCK_BOOKINGS.find((b) => b.id === bookingId) || (__DEV__ ? MOCK_BOOKINGS[0] : null);
  if (!booking) {
    return null;
  }
  const statusInfo = getStatusInfo(booking.status, colors);

  const handleCancel = () => {
    Alert.alert('Hủy đặt sân', 'Bạn có chắc chắn muốn hủy lịch đặt sân này?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Hủy đặt sân',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showSuccess('Đã hủy đặt sân!');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Chi tiết đặt sân</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <Animated.View
            entering={getEntering(FadeIn.delay(100))}
            style={[styles.statusBanner, { backgroundColor: statusInfo.bg }]}
          >
            <Ionicons name={statusInfo.icon as any} size={24} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </Animated.View>

          {/* Court Card */}
          <Animated.View entering={getEntering(FadeInUp.delay(150))}>
            <Pressable
              style={({ pressed }) => [styles.courtCard, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate('CourtDetail', { courtId: booking.court.id })}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.08)' }}
            >
              <Image source={{ uri: booking.court.images[0] }} style={styles.courtImage} />
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{booking.court.name}</Text>
                <View style={styles.courtLocation}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.courtAddress} numberOfLines={1}>
                    {booking.court.address}
                  </Text>
                </View>
                <View style={styles.courtRating}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.ratingText}>{booking.court.rating}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Animated.View>

          {/* Booking Info */}
          <Animated.View entering={getEntering(FadeInUp.delay(200))} style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
            <View style={styles.infoCard}>
              <InfoRow icon="calendar-outline" label="Ngày" value={formatDate(booking.date)} />
              <InfoRow
                icon="time-outline"
                label="Thời gian"
                value={`${booking.start_time} - ${booking.end_time}`}
              />
              <InfoRow
                icon="card-outline"
                label="Thanh toán"
                value={booking.payment_method === 'credit_card' ? 'Thẻ tín dụng' : 'MoMo'}
              />
            </View>
          </Animated.View>

          {/* Slots Detail */}
          <Animated.View entering={getEntering(FadeInUp.delay(250))} style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết</Text>
            <View style={styles.slotsCard}>
              {booking.slots.map((slot: any, index: number) => (
                <View key={index} style={styles.slotRow}>
                  <Text style={styles.slotTime}>
                    {slot.start_time} - {slot.end_time}
                  </Text>
                  <Text style={styles.slotPrice}>{formatPrice(slot.price)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalPrice}>{formatPrice(booking.total_amount)}</Text>
              </View>
            </View>
          </Animated.View>

          {/* QR Code */}
          {booking.status === 'confirmed' && booking.qr_code && (
            <Animated.View entering={getEntering(FadeInUp.delay(300))} style={styles.section}>
              <Text style={styles.sectionTitle}>Mã QR check-in</Text>
              <View style={styles.qrCard}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={120} color={colors.textPrimary} />
                </View>
                <Text style={styles.qrHint}>Xuất trình mã này tại sân để check-in</Text>
              </View>
            </Animated.View>
          )}

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        {booking.status === 'confirmed' && (
          <View style={styles.footer}>
            <Button title="Hủy đặt sân" onPress={handleCancel} variant="secondary" fullWidth />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default BookingDetailScreen;
