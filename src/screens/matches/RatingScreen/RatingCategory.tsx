import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../../theme/tokens';
import { styles } from './styles';
import { StarRating } from './StarRating';

export interface RatingCategoryProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  delay?: number;
}

export const RatingCategory: React.FC<RatingCategoryProps> = ({
  icon,
  label,
  value,
  onChange,
  delay = 0,
}) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.categoryCard}>
    <View style={styles.categoryHeader}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
    <StarRating value={value} onChange={onChange} size={28} />
  </Animated.View>
);
