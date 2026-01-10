/**
 * PaymentScreen
 *
 * Payment method selection and checkout
 * Supports Credit Card, MoMo, and ZaloPay
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_COURTS } from '@data/mockData';

// ============================================
// TYPES
// ============================================

type PaymentMethod = 'card' | 'momo' | 'zalopay';

type PaymentRouteParams = {
  Payment: {
    courtId: string;
    date: string;
    slots: { startTime: string; endTime: string; price: number }[];
    totalPrice: number;
  };
};

// ============================================
// PAYMENT METHOD CARD
// ============================================

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, isSelected, onSelect }) => {
  const methodInfo = {
    card: {
      icon: 'card-outline',
      name: 'Thẻ tín dụng / Ghi nợ',
      description: 'Visa, Mastercard, JCB',
    },
    momo: {
      icon: 'wallet-outline',
      name: 'Ví MoMo',
      description: 'Thanh toán nhanh chóng',
    },
    zalopay: {
      icon: 'phone-portrait-outline',
      name: 'ZaloPay',
      description: 'Thanh toán qua Zalo',
    },
  };

  const info = methodInfo[method];

  return (
    <TouchableOpacity
      style={[styles.methodCard, isSelected && styles.methodCardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={[styles.methodIcon, isSelected && styles.methodIconSelected]}>
        <Ionicons
          name={info.icon as any}
          size={24}
          color={isSelected ? colors.white : colors.primary}
        />
      </View>
      <View style={styles.methodInfo}>
        <Text style={styles.methodName}>{info.name}</Text>
        <Text style={styles.methodDescription}>{info.description}</Text>
      </View>
      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

// ============================================
// CREDIT CARD FORM
// ============================================

interface CreditCardFormProps {
  onCardChange: (card: CardData) => void;
}

interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onCardChange }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
    onCardChange({ number: formatted, expiry, cvv, name });
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setExpiry(formatted);
    onCardChange({ number: cardNumber, expiry: formatted, cvv, name });
  };

  return (
    <Animated.View entering={FadeInUp.delay(100)} style={styles.cardForm}>
      {/* Card Preview */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPreview}
      >
        <View style={styles.cardChip} />
        <Text style={styles.cardNumberPreview}>{cardNumber || '•••• •••• •••• ••••'}</Text>
        <View style={styles.cardPreviewRow}>
          <View>
            <Text style={styles.cardLabel}>Tên chủ thẻ</Text>
            <Text style={styles.cardValue}>{name || 'NGUYEN VAN A'}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Hết hạn</Text>
            <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Form Fields */}
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Số thẻ</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formField, { flex: 1, marginRight: spacing.sm }]}>
          <Text style={styles.fieldLabel}>Ngày hết hạn</Text>
          <TextInput
            style={styles.input}
            value={expiry}
            onChangeText={handleExpiryChange}
            placeholder="MM/YY"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={[styles.formField, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Tên chủ thẻ</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="NGUYEN VAN A"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="characters"
        />
      </View>
    </Animated.View>
  );
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();
  const { courtId, date, slots = [], totalPrice = 0 } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [processing, setProcessing] = useState(false);

  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
  const bookingDate = date ? new Date(date) : new Date();

  const handlePayment = async () => {
    setProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate payment processing
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

  const formatDate = (d: Date): string => {
    return d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <Animated.View entering={FadeInUp} style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Chi tiết đặt sân</Text>
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
                  : 'Chưa chọn giờ'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalPrice}>{(totalPrice / 1000).toFixed(0)}k VND</Text>
            </View>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
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

          {/* Card Form (only for card payment) */}
          {selectedMethod === 'card' && <CreditCardForm onCardChange={setCardData} />}

          {/* E-wallet info */}
          {(selectedMethod === 'momo' || selectedMethod === 'zalopay') && (
            <Animated.View entering={FadeInUp.delay(100)} style={styles.walletInfo}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.walletInfoText}>
                Bạn sẽ được chuyển đến ứng dụng {selectedMethod === 'momo' ? 'MoMo' : 'ZaloPay'} để
                hoàn tất thanh toán.
              </Text>
            </Animated.View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.footer}>
          <Button
            title={
              processing ? 'Đang xử lý...' : `Thanh toán ${(totalPrice / 1000).toFixed(0)}k VND`
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

  // Summary
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalPrice: {
    ...typography.h3,
    color: colors.primary,
  },

  // Section
  section: {
    marginTop: spacing.xl,
  },

  // Payment Method Card
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodIconSelected: {
    backgroundColor: colors.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  methodDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  // Card Form
  cardForm: {
    marginTop: spacing.lg,
  },
  cardPreview: {
    height: 180,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardChip: {
    width: 40,
    height: 28,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    opacity: 0.8,
  },
  cardNumberPreview: {
    ...typography.h3,
    color: colors.white,
    letterSpacing: 2,
  },
  cardPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  cardValue: {
    ...typography.body,
    color: colors.white,
  },
  formField: {
    marginBottom: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textPrimary,
  },

  // Wallet Info
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  walletInfoText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
});

export default PaymentScreen;
