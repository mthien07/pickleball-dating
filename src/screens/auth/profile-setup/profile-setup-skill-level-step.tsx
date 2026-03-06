/**
 * ProfileSetupSkillLevelStep
 *
 * Step 3 of profile setup wizard — skill level selection.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, typography, borderRadius } from '../../../theme/tokens';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import type { ThemeColors } from '../../../contexts/theme-colors';

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
  ({ skillLevel, onSkillLevelChange }) => {
    const styles = useThemedStyles(createStyles);
    const { getEntering } = useReducedMotion();
    return (
      <Animated.View entering={getEntering(FadeInUp)} style={styles.stepContent}>
        <Text style={styles.stepTitle}>Trình độ của bạn</Text>
        <Text style={styles.stepDescription}>Chọn trình độ phù hợp để tìm đối thủ ngang tay</Text>

        <View style={styles.skillGrid}>
          {SKILL_LEVELS.map((level) => (
            <Pressable
              key={level.id}
              style={({ pressed }) => [
                styles.skillCard,
                skillLevel === level.id && styles.skillCardSelected,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSkillLevelChange(level.id);
              }}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              <Text style={styles.skillEmoji}>{level.emoji}</Text>
              <Text
                style={[styles.skillLabel, skillLevel === level.id && styles.skillLabelSelected]}
              >
                {level.label}
              </Text>
              <Text style={styles.skillDesc}>{level.desc}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    );
  }
);

ProfileSetupSkillLevelStep.displayName = 'ProfileSetupSkillLevelStep';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
