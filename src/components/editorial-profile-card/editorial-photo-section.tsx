/**
 * Photo section for editorial profile card — full-width image with inline like button
 */
import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { borderRadius, spacing } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { useThemeColors } from '../../contexts/ThemeContext';
import { OptimizedImage } from '../OptimizedImage';

interface PhotoSectionProps {
  imageUri: string;
  onLike?: () => void;
  isLiked?: boolean;
}

export const EditorialPhotoSection = memo(({ imageUri, onLike, isLiked }: PhotoSectionProps) => {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <OptimizedImage source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
      {onLike && (
        <Pressable
          onPress={onLike}
          style={[
            styles.likeButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Heart
            size={20}
            color={isLiked ? colors.accent : colors.textTertiary}
            fill={isLiked ? colors.accent : 'none'}
          />
        </Pressable>
      )}
    </View>
  );
});

EditorialPhotoSection.displayName = 'EditorialPhotoSection';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.sm,
  },
});
