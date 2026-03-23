/**
 * Info pills row — age, location, skill level badges
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing, borderRadius } from '../../theme/tokens';
import { useThemeColors } from '../../contexts/ThemeContext';

interface InfoPillsProps {
  age?: number;
  location?: string;
  skillLevel?: string;
}

export const EditorialInfoPills = memo(({ age, location, skillLevel }: InfoPillsProps) => {
  const colors = useThemeColors();
  const pills = [age && `${age}`, location, skillLevel].filter(Boolean);

  return (
    <View style={styles.container}>
      {pills.map((pill, i) => (
        <View key={i} style={[styles.pill, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.pillText, { color: colors.textSecondary }]}>{pill}</Text>
        </View>
      ))}
    </View>
  );
});

EditorialInfoPills.displayName = 'EditorialInfoPills';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  pillText: {
    ...typography.bodySmall,
    fontFamily: 'Barlow-Medium',
  },
});
