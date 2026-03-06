import React from 'react';
import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { TimeSlot } from './TimeSlotPicker';
import { styles } from './time-slot-styles';

interface SlotProps {
  slot: TimeSlot;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const formatPrice = (price: number): string => `${(price / 1000).toFixed(0)}k`;

/** Single time slot cell with available/selected/booked states */
export const TimeSlotItem: React.FC<SlotProps> = React.memo(
  ({ slot, isSelected, onPress, index }) => {
    if (!slot.isAvailable) {
      return (
        <Animated.View
          entering={FadeInUp.delay(index * 30).duration(200)}
          style={[styles.slot, styles.slotBooked]}
        >
          <Text style={styles.slotTimeBooked}>{slot.startTime}</Text>
          <Text style={styles.slotPriceBooked}>Đã đặt</Text>
        </Animated.View>
      );
    }

    if (isSelected) {
      return (
        <Animated.View entering={FadeInUp.delay(index * 30).duration(200)}>
          <Pressable
            onPress={onPress}
            style={({ pressed }) => pressed && { opacity: 0.8 }}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={[styles.slot, styles.slotSelected]}
            >
              <Text style={styles.slotTimeSelected}>{slot.startTime}</Text>
              <Text style={styles.slotPriceSelected}>{formatPrice(slot.price)}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      );
    }

    return (
      <Animated.View entering={FadeInUp.delay(index * 30).duration(200)}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.slot, styles.slotAvailable, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
        >
          <Text style={styles.slotTimeAvailable}>{slot.startTime}</Text>
          <Text style={styles.slotPriceAvailable}>{formatPrice(slot.price)}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

TimeSlotItem.displayName = 'TimeSlotItem';
