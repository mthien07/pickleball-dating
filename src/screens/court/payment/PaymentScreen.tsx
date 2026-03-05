import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../../components/Button';
import { colors } from '../../../theme/tokens';
import { MOCK_COURTS } from '@data/mockData';
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { styles } from './payment-styles';
import { PaymentMethod, CardData, PaymentMethodCard, CreditCardForm } from './payment-form-section';

type PaymentRouteParams = {
  Payment: {
    courtId: string;
    date: string;
    slots: { startTime: string; endTime: string; price: number }[];
    totalPrice: number;
  };
};

export const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();
  const { courtId, date, slots = [], totalPrice = 0 } = route.params || {};
  const { theme } = useTheme();
  const themeColors = useThemeColors();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [processing, setProcessing] = useState(false);

  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
  const bookingDate = date ? new Date(date) : new Date();

  const handlePayment = async () => {
    setProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate('BookingConfirmation', {
        courtId,
        date,
        slots,
        totalPrice,
        bookingId: `BK-${Date.now()}`,
      });
    }, 2000);
  };

  const formatDate = (d: Date): string =>
    d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toan</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <Animated.View entering={FadeInUp} style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Chi tiet dat san</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.summaryText}>{court.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.summaryText}>{formatDate(bookingDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.summaryText}>
                {slots.length > 0
                  ? `${slots[0].startTime} - ${slots[slots.length - 1].endTime}`
                  : 'Chua chon gio'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tong cong</Text>
              <Text style={styles.totalPrice}>{(totalPrice / 1000).toFixed(0)}k VND</Text>
            </View>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Phuong thuc thanh toan</Text>
            <PaymentMethodCard
              method="card"
              isSelected={selectedMethod === 'card'}
              onSelect={() => setSelectedMethod('card')}
            />
            <PaymentMethodCard
              method="momo"
              isSelected={selectedMethod === 'momo'}
              onSelect={() => setSelectedMethod('momo')}
            />
            <PaymentMethodCard
              method="zalopay"
              isSelected={selectedMethod === 'zalopay'}
              onSelect={() => setSelectedMethod('zalopay')}
            />
          </Animated.View>

          {selectedMethod === 'card' && (
            <CreditCardForm
              onCardChange={setCardData}
              gradientColors={
                theme.isDark
                  ? [themeColors.surface, themeColors.background]
                  : ['#1A1A2E', '#16213E']
              }
              chipColor={themeColors.goldAccent}
            />
          )}

          {(selectedMethod === 'momo' || selectedMethod === 'zalopay') && (
            <Animated.View entering={FadeInUp.delay(100)} style={styles.walletInfo}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.walletInfoText}>
                Ban se duoc chuyen den ung dung {selectedMethod === 'momo' ? 'MoMo' : 'ZaloPay'} de
                hoan tat thanh toan.
              </Text>
            </Animated.View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={
              processing ? 'Dang xu ly...' : `Thanh toan ${(totalPrice / 1000).toFixed(0)}k VND`
            }
            onPress={handlePayment}
            variant="primary"
            loading={processing}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PaymentScreen;
