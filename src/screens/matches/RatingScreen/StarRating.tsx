import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './styles';

const STARS = [1, 2, 3, 4, 5];

export interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

/** Individual star button - memoized to avoid re-rendering unaffected stars */
const StarButton = React.memo(
  ({
    star,
    isSelected,
    size,
    onPress,
  }: {
    star: number;
    isSelected: boolean;
    size: number;
    onPress: (star: number) => void;
  }) => {
    const colors = useThemeColors();
    return (
      <Pressable
        onPress={() => onPress(star)}
        style={({ pressed }) => pressed && { opacity: 0.7 }}
        android_ripple={{ color: 'rgba(59, 89, 152, 0.15)' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isSelected ? 'star' : 'star-outline'}
          size={size}
          color={isSelected ? colors.starColor : colors.border}
        />
      </Pressable>
    );
  }
);

StarButton.displayName = 'StarButton';

export const StarRating: React.FC<StarRatingProps> = React.memo(
  ({ value, onChange, size = 36 }) => {
    const styles = useThemedStyles(createStyles);
    // Stable handler - avoids creating new function on every render
    const handlePress = useCallback(
      (star: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(star);
      },
      [onChange]
    );

    return (
      <View style={styles.starRow}>
        {STARS.map((star) => (
          <StarButton
            key={star}
            star={star}
            isSelected={star <= value}
            size={size}
            onPress={handlePress}
          />
        ))}
      </View>
    );
  }
);

StarRating.displayName = 'StarRating';
