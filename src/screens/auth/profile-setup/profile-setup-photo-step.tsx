/**
 * ProfileSetupPhotoStep
 *
 * Step 1 of profile setup wizard — photo upload grid.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

import { colors, spacing, typography, borderRadius } from '../../../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface PhotoStepProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  isUploading: boolean;
}

export const ProfileSetupPhotoStep = React.memo<PhotoStepProps>(
  ({ photos, onAddPhoto, onRemovePhoto, isUploading }) => (
    <Animated.View entering={FadeInUp} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Thêm ảnh của bạn</Text>
      <Text style={styles.stepDescription}>
        Thêm ít nhất 2 ảnh để bắt đầu. Ảnh đầu tiên sẽ là ảnh đại diện.
      </Text>

      <View style={styles.photoGrid}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity
            key={index}
            style={[styles.photoSlot, index === 0 && styles.primaryPhotoSlot]}
            onPress={() => (photos[index] ? onRemovePhoto(index) : onAddPhoto())}
            activeOpacity={0.8}
            disabled={isUploading}
          >
            {photos[index] ? (
              <>
                <Animated.Image
                  entering={FadeIn}
                  source={{ uri: photos[index] }}
                  style={styles.photoImage}
                />
                <View style={styles.photoRemove}>
                  <Ionicons name="close" size={16} color={colors.white} />
                </View>
              </>
            ) : (
              <>
                {isUploading && index === photos.length ? (
                  <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                  <Ionicons name="add" size={32} color={colors.textTertiary} />
                )}
                {index === 0 && <Text style={styles.primaryLabel}>Ảnh chính</Text>}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
);

ProfileSetupPhotoStep.displayName = 'ProfileSetupPhotoStep';

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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryPhotoSlot: {
    borderColor: colors.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoRemove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 4,
  },
});
