/**
 * Action bar with Pass (X) and Like (heart) buttons for editorial feed
 */
import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { X, Heart } from 'lucide-react-native';
import { spacing, borderRadius } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';
import { useThemeColors } from '../../../contexts/ThemeContext';

interface ProfileActionBarProps {
  onPass: () => void;
  onLike: () => void;
}

export const ProfileActionBar = memo(({ onPass, onLike }: ProfileActionBarProps) => {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPass}
        style={({ pressed }) => [
          styles.actionButton,
          styles.passButton,
          { borderColor: colors.border, backgroundColor: colors.surface },
          pressed && { opacity: 0.7 },
        ]}
      >
        <X size={28} color={colors.textSecondary} />
      </Pressable>
      <Pressable
        onPress={onLike}
        style={({ pressed }) => [
          styles.actionButton,
          styles.likeButton,
          { backgroundColor: colors.accent },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Heart size={28} color="#FFFFFF" fill="#FFFFFF" />
      </Pressable>
    </View>
  );
});

ProfileActionBar.displayName = 'ProfileActionBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  passButton: {
    borderWidth: 1.5,
  },
  likeButton: {},
});
