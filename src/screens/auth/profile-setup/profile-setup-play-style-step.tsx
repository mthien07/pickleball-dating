/**
 * ProfileSetupPlayStyleStep
 *
 * Step 4 of profile setup wizard — play style and looking-for preferences.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors, spacing, typography, borderRadius } from '../../../theme/tokens';

const PLAY_STYLES = [
  { id: 'competitive', label: 'Cạnh tranh', emoji: '🔥' },
  { id: 'casual', label: 'Thư giãn', emoji: '😊' },
  { id: 'social', label: 'Giao lưu', emoji: '🤝' },
];

const LOOKING_FOR_OPTIONS = [
  { id: 'opponent', label: 'Đối thủ đơn' },
  { id: 'doubles_partner', label: 'Đối tác đôi' },
  { id: 'dating', label: 'Hẹn hò' },
];

export interface PlayStyleStepProps {
  playStyle: string;
  onPlayStyleChange: (style: string) => void;
  lookingFor: string[];
  onLookingForChange: (items: string[]) => void;
}

export const ProfileSetupPlayStyleStep = React.memo<PlayStyleStepProps>(
  ({ playStyle, onPlayStyleChange, lookingFor, onLookingForChange }) => {
    const toggleLookingFor = (id: string) => {
      if (lookingFor.includes(id)) {
        onLookingForChange(lookingFor.filter((i) => i !== id));
      } else {
        onLookingForChange([...lookingFor, id]);
      }
    };

    return (
      <Animated.View entering={FadeInUp} style={styles.stepContent}>
        <Text style={styles.stepTitle}>Phong cách chơi</Text>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Bạn thích chơi kiểu nào?</Text>
          <View style={styles.optionRow}>
            {PLAY_STYLES.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.styleCard, playStyle === option.id && styles.styleCardSelected]}
                onPress={() => onPlayStyleChange(option.id)}
              >
                <Text style={styles.styleEmoji}>{option.emoji}</Text>
                <Text
                  style={[styles.styleLabel, playStyle === option.id && styles.styleLabelSelected]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Bạn đang tìm kiếm?</Text>
          <View style={styles.chipGrid}>
            {LOOKING_FOR_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.chip, lookingFor.includes(option.id) && styles.chipSelected]}
                onPress={() => toggleLookingFor(option.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    lookingFor.includes(option.id) && styles.chipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  }
);

ProfileSetupPlayStyleStep.displayName = 'ProfileSetupPlayStyleStep';

const styles = StyleSheet.create({
  stepContent: {
    paddingTop: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  formField: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  styleCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  styleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  styleEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  styleLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  styleLabelSelected: {
    color: colors.primary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
