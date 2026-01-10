/**
 * BookingDetailScreen
 *
 * Booking detail with court info, time slots, QR code, and actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { showSuccess } from '../../services/toast';
import { MOCK_BOOKINGS, BookingStatus } from '@data/mockData';

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('vi-VN', options);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const getStatusInfo = (status: BookingStatus) => {
  const info: Record<BookingStatus, { label: string; color: string; bg: string; icon: string }> = {
    confirmed: { label: 'Đã xác nhận', color: colors.success, bg: `${colors.success}20`, icon: 'checkmark-circle' },
    completed: { label: 'Hoàn thành', color: colors.textSecondary, bg: colors.surface, icon: 'checkmark-done' },
    cancelled: { label: 'Đã hủy', color: colors.error, bg: `${colors.error}20`, icon: 'close-circle' },
  };
  return info[status];
};

// ============================================
// INFO ROW COMPONENT
// ============================================

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
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

// ============================================
// SCREEN COMPONENT
// ============================================

export const BookingDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId } = route.params || {};

  const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId) || MOCK_BOOKINGS[0];
  const statusInfo = getStatusInfo(booking.status);

  const handleCancel = () => {
    Alert.alert(
      'Hủy đặt sân',
      'Bạn có chắc chắn muốn hủy lịch đặt sân này?',
      [
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
      ]
    );
  };

  const handleViewCourt = () => {
    navigation.navigate('CourtDetail', { courtId: booking.court.id });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đặt sân</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <Animated.View
            entering={FadeIn.delay(100)}
            style={[styles.statusBanner, { backgroundColor: statusInfo.bg }]}
          >
            <Ionicons name={statusInfo.icon as any} size={24} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </Animated.View>

          {/* Court Card */}
          <Animated.View entering={FadeInUp.delay(150)}>
            <TouchableOpacity style={styles.courtCard} onPress={handleViewCourt} activeOpacity={0.8}>
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
            </TouchableOpacity>
          </Animated.View>

          {/* Booking Info */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
            <View style={styles.infoCard}>
              <InfoRow
                icon="calendar-outline"
                label="Ngày"
                value={formatDate(booking.date)}
              />
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

          {/* Time Slots */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết</Text>
            <View style={styles.slotsCard}>
              {booking.slots.map((slot, index) => (
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

          {/* QR Code (if confirmed) */}
          {booking.status === 'confirmed' && booking.qr_code && (
            <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>Mã QR check-in</Text>
              <View style={styles.qrCard}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={120} color={colors.textPrimary} />
                </View>
                <Text style={styles.qrHint}>
                  Xuất trình mã này tại sân để check-in
                </Text>
              </View>
            </Animated.View>
          )}

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        {/* Footer Actions */}
        {booking.status === 'confirmed' && (
          <View style={styles.footer}>
            <Button title="Hủy đặt sân" onPress={handleCancel} variant="secondary" fullWidth />
          </View>
        )}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Status Banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  statusText: {
    ...typography.body,
    fontWeight: '600',
  },

  // Court Card
  courtCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  courtImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  courtInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  courtName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  courtLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  courtAddress: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  courtRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  // Section
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Slots Card
  slotsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  slotTime: {
    ...typography.body,
    color: colors.textPrimary,
  },
  slotPrice: {
    ...typography.body,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  totalLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalPrice: {
    ...typography.h4,
    color: colors.primary,
  },

  // QR Card
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  qrPlaceholder: {
    padding: spacing.md,
  },
  qrHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default BookingDetailScreen;
