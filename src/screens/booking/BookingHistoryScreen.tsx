/**
 * BookingHistoryScreen
 *
 * List of user's bookings with tabs: Upcoming, Completed, Cancelled
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_BOOKINGS, BookingStatus } from '@data/mockData';

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  return date.toLocaleDateString('vi-VN', options);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const getStatusColor = (status: BookingStatus) => {
  const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
    confirmed: { bg: `${colors.success}20`, text: colors.success },
    completed: { bg: colors.surface, text: colors.textSecondary },
    cancelled: { bg: `${colors.error}20`, text: colors.error },
  };
  return statusColors[status];
};

const getStatusLabel = (status: BookingStatus) => {
  const labels: Record<BookingStatus, string> = {
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  return labels[status];
};

// ============================================
// TAB BAR
// ============================================

interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => (
  <View style={styles.tabBar}>
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab.id}
        style={[styles.tab, activeTab === tab.id && styles.tabActive]}
        onPress={() => onTabChange(tab.id)}
      >
        <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ============================================
// BOOKING CARD
// ============================================

interface BookingCardProps {
  booking: typeof MOCK_BOOKINGS[0];
  index: number;
  onPress: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, onPress }) => {
  const statusStyle = getStatusColor(booking.status);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity style={styles.bookingCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: booking.court.images[0] }} style={styles.courtImage} />

        <View style={styles.bookingInfo}>
          <Text style={styles.courtName}>{booking.court.name}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>{formatDate(booking.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {booking.start_time} - {booking.end_time}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>{formatPrice(booking.total_amount)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {getStatusLabel(booking.status)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={64} color={colors.border} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const BookingHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'upcoming', label: 'Sắp tới' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const filterBookings = () => {
    return MOCK_BOOKINGS.filter((booking) => {
      switch (activeTab) {
        case 'upcoming':
          return booking.status === 'confirmed';
        case 'completed':
          return booking.status === 'completed';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const filteredBookings = filterBookings();

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch đặt sân</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Tabs */}
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                index={index}
                onPress={() => handleBookingPress(booking.id)}
              />
            ))
          ) : (
            <EmptyState
              message={
                activeTab === 'upcoming'
                  ? 'Chưa có lịch đặt sân nào'
                  : activeTab === 'completed'
                  ? 'Chưa có lịch hoàn thành'
                  : 'Không có lịch đã hủy'
              }
            />
          )}

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
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

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  // Booking Card
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  courtImage: {
    width: 100,
    height: 120,
  },
  bookingInfo: {
    flex: 1,
    padding: spacing.md,
  },
  courtName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});

export default BookingHistoryScreen;
