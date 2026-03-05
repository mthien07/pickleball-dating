/**
 * ProfileSetupSkillLevelStep
 *
 * Step 3 of profile setup wizard — skill level selection.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, typography, borderRadius } from '../../../theme/tokens';

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Mới bắt đầu', emoji: '🌱', desc: 'Đang học cơ bản' },
  { id: 'intermediate', label: 'Trung bình', emoji: '🎯', desc: 'Chơi được 1-2 năm' },
  { id: 'advanced', label: 'Nâng cao', emoji: '⚡', desc: 'Chơi ổn định, biết chiến thuật' },
  { id: 'pro', label: 'Chuyên nghiệp', emoji: '🏆', desc: 'Thi đấu chuyên nghiệp' },
];

export interface SkillLevelStepProps {
  skillLevel: string;
  onSkillLevelChange: (level: string) => void;
}

export const ProfileSetupSkillLevelStep = React.memo<SkillLevelStepProps>(
  ({ skillLevel, onSkillLevelChange }) => (
    <Animated.View entering={FadeInUp} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Trình độ của bạn</Text>
      <Text style={styles.stepDescription}>Chọn trình độ phù hợp để tìm đối thủ ngang tay</Text>

      <View style={styles.skillGrid}>
        {SKILL_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[styles.skillCard, skillLevel === level.id && styles.skillCardSelected]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSkillLevelChange(level.id);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.skillEmoji}>{level.emoji}</Text>
            <Text style={[styles.skillLabel, skillLevel === level.id && styles.skillLabelSelected]}>
              {level.label}
            </Text>
            <Text style={styles.skillDesc}>{level.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
);

ProfileSetupSkillLevelStep.displayName = 'ProfileSetupSkillLevelStep';

const styles = StyleSheet.create({
  stepContent: {
    paddingTop: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  skillGrid: {
    gap: spacing.sm,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  skillCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  skillEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  skillLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  skillLabelSelected: {
    color: colors.primary,
  },
  skillDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
});
