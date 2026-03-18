import React from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import type { ThemeColors } from '../../../contexts/theme-colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLOT_SIZE = (SCREEN_WIDTH - 48) / 3;

interface PhotoGridProps {
  photos: string[];
  onAddPhoto: (index: number) => void;
  onRemovePhoto: (index: number) => void;
  maxPhotos?: number;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 16,
    },
    slot: {
      width: SLOT_SIZE,
      aspectRatio: 1,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    emptySlot: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filledSlot: {
      borderWidth: 0,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    removeButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainBadge: {
      position: 'absolute',
      top: 6,
      left: 6,
      backgroundColor: colors.primary,
      borderRadius: 9999,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    mainBadgeText: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 10,
      color: colors.white,
    },
  });

export const PhotoGrid = React.memo(
  ({ photos, onAddPhoto, onRemovePhoto, maxPhotos = 9 }: PhotoGridProps) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const slots = Array.from({ length: maxPhotos }, (_, i) => i);

    return (
      <View style={styles.grid}>
        {slots.map((index) => {
          const hasPhoto = !!photos[index];
          return (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.slot,
                hasPhoto ? styles.filledSlot : styles.emptySlot,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => (hasPhoto ? onRemovePhoto(index) : onAddPhoto(index))}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              {hasPhoto ? (
                <>
                  <Image source={{ uri: photos[index] }} style={styles.photo} contentFit="cover" />
                  <View style={styles.removeButton}>
                    <Ionicons name="close" size={14} color={colors.white} />
                  </View>
                  {index === 0 && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>Main</Text>
                    </View>
                  )}
                </>
              ) : (
                <Ionicons name="add" size={32} color={colors.textTertiary} />
              )}
            </Pressable>
          );
        })}
      </View>
    );
  }
);

PhotoGrid.displayName = 'PhotoGrid';
