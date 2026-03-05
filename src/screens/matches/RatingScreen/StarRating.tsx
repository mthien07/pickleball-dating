import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/tokens';
import { styles } from './styles';

export interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 36 }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(star);
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={star <= value ? 'star' : 'star-outline'}
          size={size}
          color={star <= value ? colors.warning : colors.border}
        />
      </TouchableOpacity>
    ))}
  </View>
);
