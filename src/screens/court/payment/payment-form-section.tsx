import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './payment-styles';

export type PaymentMethod = 'card' | 'momo' | 'zalopay';

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

// Payment method selection card
interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

const METHOD_INFO = {
  card: {
    icon: 'card-outline',
    name: 'The tin dung / Ghi no',
    description: 'Visa, Mastercard, JCB',
  },
  momo: { icon: 'wallet-outline', name: 'Vi MoMo', description: 'Thanh toan nhanh chong' },
  zalopay: { icon: 'phone-portrait-outline', name: 'ZaloPay', description: 'Thanh toan qua Zalo' },
};

export const PaymentMethodCard = React.memo(
  ({ method, isSelected, onSelect }: PaymentMethodCardProps) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const info = METHOD_INFO[method];
    return (
      <Pressable
        style={({ pressed }) => [
          styles.methodCard,
          isSelected && styles.methodCardSelected,
          pressed && { opacity: 0.8 },
        ]}
        onPress={onSelect}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
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
      </Pressable>
    );
  }
);

PaymentMethodCard.displayName = 'PaymentMethodCard';

// Credit card form with preview
interface CreditCardFormProps {
  onCardChange: (card: CardData) => void;
  gradientColors: readonly [string, string];
  chipColor: string;
}

export const CreditCardForm = React.memo(
  ({ onCardChange, gradientColors, chipColor }: CreditCardFormProps) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
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
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardPreview}
        >
          <View style={[styles.cardChip, { backgroundColor: chipColor }]} />
          <Text style={styles.cardNumberPreview}>
            {cardNumber ||
              '\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022'}
          </Text>
          <View style={styles.cardPreviewRow}>
            <View>
              <Text style={styles.cardLabel}>Ten chu the</Text>
              <Text style={styles.cardValue}>{name || 'NGUYEN VAN A'}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Het han</Text>
              <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>So the</Text>
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
            <Text style={styles.fieldLabel}>Ngay het han</Text>
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
          <Text style={styles.fieldLabel}>Ten chu the</Text>
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
  }
);

CreditCardForm.displayName = 'CreditCardForm';
