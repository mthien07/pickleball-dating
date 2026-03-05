/**
 * BookingHistory - Reusable components: TabBar, BookingCard, EmptyState
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { colors } from '../../../theme/tokens';
import { MOCK_BOOKINGS, BookingStatus } from '@data/mockData';
import { styles } from './booking-history-styles';

// ============================================
// HELPERS
// ============================================

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export const getStatusColor = (status: BookingStatus): { bg: string; text: string } => {
  const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
    confirmed: { bg: `${colors.success}20`, text: colors.success },
    completed: { bg: colors.surface, text: colors.textSecondary },
    cancelled: { bg: `${colors.error}20`, text: colors.error },
  };
  return statusColors[status];
};

export const getStatusLabel = (status: BookingStatus): string => {
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

export const TabBar: React.FC<TabBarProps> = React.memo(({ tabs, activeTab, onTabChange }) => (
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
));

// ============================================
// BOOKING CARD
// ============================================

interface BookingCardProps {
  booking: (typeof MOCK_BOOKINGS)[0];
  index: number;
  onPress: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = React.memo(({ booking, index, onPress }) => {
  const statusStyle = getStatusColor(booking.status);

  return (
    <Animated.View entering={FadeInUp.delay(index * 100)} layout={Layout.springify()}>
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
});

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = React.memo(({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={64} color={colors.border} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
));
