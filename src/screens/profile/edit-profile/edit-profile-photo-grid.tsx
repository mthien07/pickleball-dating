import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../../../theme/tokens';
import { styles } from './edit-profile-styles';

interface PhotoGridProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export const PhotoGrid = React.memo(({ photos, onAdd, onRemove, isUploading }: PhotoGridProps) => (
  <View style={styles.photoGrid}>
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <TouchableOpacity
        key={index}
        style={[styles.photoSlot, index === 0 && styles.primaryPhotoSlot]}
        onPress={() => (photos[index] ? onRemove(index) : onAdd())}
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
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name="add" size={32} color={colors.textTertiary} />
            )}
            {index === 0 && <Text style={styles.primaryLabel}>Anh chinh</Text>}
          </>
        )}
      </TouchableOpacity>
    ))}
  </View>
));

PhotoGrid.displayName = 'PhotoGrid';
