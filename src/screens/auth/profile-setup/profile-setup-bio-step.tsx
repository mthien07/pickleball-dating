/**
 * ProfileSetupBioStep
 *
 * Step 5 of profile setup wizard — personal bio text input.
 */

import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors, spacing, typography, borderRadius } from '../../../theme/tokens';

export interface BioStepProps {
  bio: string;
  onBioChange: (bio: string) => void;
}

export const ProfileSetupBioStep = React.memo<BioStepProps>(({ bio, onBioChange }) => (
  <Animated.View entering={FadeInUp} style={styles.stepContent}>
    <Text style={styles.stepTitle}>Giới thiệu bản thân</Text>
    <Text style={styles.stepDescription}>Viết vài dòng về bản thân để người khác hiểu bạn hơn</Text>

    <TextInput
      style={[styles.input, styles.bioInput]}
      value={bio}
      onChangeText={onBioChange}
      placeholder="Tôi yêu pickleball vì..."
      placeholderTextColor={colors.textTertiary}
      multiline
      maxLength={300}
      textAlignVertical="top"
    />
    <Text style={styles.charCount}>{bio.length}/300</Text>
  </Animated.View>
));

ProfileSetupBioStep.displayName = 'ProfileSetupBioStep';

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
  bioInput: {
    height: 150,
    paddingTop: spacing.md,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
