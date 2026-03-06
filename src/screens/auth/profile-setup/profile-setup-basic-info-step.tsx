/**
 * ProfileSetupBasicInfoStep
 *
 * Step 2 of profile setup wizard — name, birth date, and gender.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { spacing, typography, borderRadius } from '../../../theme/tokens';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import type { ThemeColors } from '../../../contexts/theme-colors';

export interface BasicInfoStepProps {
  name: string;
  onNameChange: (name: string) => void;
  birthDate: string;
  onBirthDateChange: (date: string) => void;
  gender: string;
  onGenderChange: (gender: string) => void;
}

export const ProfileSetupBasicInfoStep = React.memo<BasicInfoStepProps>(
  ({ name, onNameChange, birthDate, onBirthDateChange, gender, onGenderChange }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const { getEntering } = useReducedMotion();
    // Auto-format birth date as DD/MM/YYYY
    const handleBirthDateChange = (text: string) => {
      const numbersOnly = text.replace(/[^0-9]/g, '');
      let formatted = '';
      if (numbersOnly.length > 0) {
        formatted = numbersOnly.slice(0, 2);
      }
      if (numbersOnly.length > 2) {
        formatted += '/' + numbersOnly.slice(2, 4);
      }
      if (numbersOnly.length > 4) {
        formatted += '/' + numbersOnly.slice(4, 8);
      }
      onBirthDateChange(formatted);
    };

    return (
      <Animated.View entering={getEntering(FadeInUp)} style={styles.stepContent}>
        <Text style={styles.stepTitle}>Thông tin cơ bản</Text>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Tên hiển thị</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onNameChange}
            placeholder="Nguyễn Văn A"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Ngày sinh</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={handleBirthDateChange}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.hint}>Ví dụ: 15/03/1995</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Giới tính</Text>
          <View style={styles.optionRow}>
            {['Nam', 'Nữ', 'Khác'].map((option) => (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  styles.optionButton,
                  gender === option && styles.optionButtonSelected,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => onGenderChange(option)}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
              >
                <Text style={[styles.optionText, gender === option && styles.optionTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  }
);

ProfileSetupBasicInfoStep.displayName = 'ProfileSetupBasicInfoStep';

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
    formField: {
      marginBottom: spacing.lg,
    },
    fieldLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body,
      color: colors.textPrimary,
    },
    hint: {
      color: colors.textTertiary,
      fontSize: 12,
      marginTop: spacing.xs,
    },
    optionRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    optionButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    optionButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionText: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    optionTextSelected: {
      color: colors.white,
    },
  });
