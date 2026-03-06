import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { createStyles } from './styles';
import { StarRating } from './StarRating';

export interface RatingCategoryProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  delay?: number;
}

export const RatingCategory: React.FC<RatingCategoryProps> = React.memo(
  ({ icon, label, value, onChange, delay = 0 }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const { getEntering } = useReducedMotion();
    return (
      <Animated.View entering={getEntering(FadeInUp.delay(delay))} style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Ionicons name={icon as any} size={24} color={colors.primary} />
          <Text style={styles.categoryLabel}>{label}</Text>
        </View>
        <StarRating value={value} onChange={onChange} size={28} />
      </Animated.View>
    );
  }
);

RatingCategory.displayName = 'RatingCategory';
