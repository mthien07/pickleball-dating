/**
 * BookingHistoryScreen - List of user's bookings with tabs: Upcoming, Completed, Cancelled
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useBookings } from '../../../hooks/use-bookings';
import { createStyles } from './booking-history-styles';
import { TabBar, BookingCard, EmptyState } from './booking-history-components';
import { SkeletonList } from '../../../components/SkeletonLoaders';

const TABS = [
  { id: 'upcoming', label: 'Sắp tới' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
];

const EMPTY_MESSAGES: Record<string, string> = {
  upcoming: 'Chưa có lịch đặt sân nào',
  completed: 'Chưa có lịch hoàn thành',
  cancelled: 'Không có lịch đã hủy',
};

const STATUS_MAP: Record<string, string> = {
  upcoming: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
};

export const BookingHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const { bookings, isLoading, refresh } = useBookings();

  // Memoize filtered list - avoids re-filtering on every render
  const filteredBookings = useMemo(
    () => bookings.filter((booking) => booking.status === STATUS_MAP[activeTab]),
    [bookings, activeTab]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

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
            <Ionicons name="chevron-back" size={28} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>Lịch đặt sân</Text>
          <View style={{ width: 44 }} />
        </View>

        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading ? (
            <SkeletonList type="court" count={4} />
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                index={index}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
              />
            ))
          ) : (
            <EmptyState message={EMPTY_MESSAGES[activeTab]} />
          )}

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BookingHistoryScreen;
