/**
 * BookingHistoryScreen - List of user's bookings with tabs: Upcoming, Completed, Cancelled
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '../../../theme/tokens';
import { MOCK_BOOKINGS } from '@data/mockData';
import { styles } from './booking-history-styles';
import { TabBar, BookingCard, EmptyState } from './booking-history-components';

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
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  // Memoize filtered list - avoids re-filtering on every render
  const filteredBookings = useMemo(
    () => MOCK_BOOKINGS.filter((booking) => booking.status === STATUS_MAP[activeTab]),
    [activeTab]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch đặt sân</Text>
          <View style={{ width: 44 }} />
        </View>

        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

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
