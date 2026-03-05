import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/tokens';
import { styles } from './styles';

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
  }) => (
    <TouchableOpacity onPress={() => onPress(star)} activeOpacity={0.7}>
      <Ionicons
        name={isSelected ? 'star' : 'star-outline'}
        size={size}
        color={isSelected ? colors.warning : colors.border}
      />
    </TouchableOpacity>
  )
);

StarButton.displayName = 'StarButton';

export const StarRating: React.FC<StarRatingProps> = React.memo(
  ({ value, onChange, size = 36 }) => {
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
