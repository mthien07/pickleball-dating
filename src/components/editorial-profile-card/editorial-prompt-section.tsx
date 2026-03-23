/**
 * Prompt section — serif prompt label + response text with inline like
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { typography, spacing, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { useThemeColors } from '../../contexts/ThemeContext';

interface PromptSectionProps {
  promptLabel: string;
  promptResponse: string;
  onLike?: () => void;
  isLiked?: boolean;
}

export const EditorialPromptSection = memo(
  ({ promptLabel, promptResponse, onLike, isLiked }: PromptSectionProps) => {
    const colors = useThemeColors();
    return (
      <View style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>{promptLabel}</Text>
        <Text style={[styles.response, { color: colors.textPrimary }]}>{promptResponse}</Text>
        {onLike && (
          <Pressable
            onPress={onLike}
            style={[
              styles.likeButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Heart
              size={18}
              color={isLiked ? colors.accent : colors.textTertiary}
              fill={isLiked ? colors.accent : 'none'}
            />
          </Pressable>
        )}
      </View>
    );
  }
);

EditorialPromptSection.displayName = 'EditorialPromptSection';

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  label: {
    ...typography.prompt,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  response: {
    ...typography.editorialH2,
    fontSize: 20,
    lineHeight: 28,
  },
  likeButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.sm,
  },
});
