import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
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
      <Pressable
        key={index}
        style={({ pressed }) => [
          styles.photoSlot,
          index === 0 && styles.primaryPhotoSlot,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => (photos[index] ? onRemove(index) : onAdd())}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
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
      </Pressable>
    ))}
  </View>
));

PhotoGrid.displayName = 'PhotoGrid';
