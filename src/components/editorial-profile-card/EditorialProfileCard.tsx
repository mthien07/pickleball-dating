/**
 * EditorialProfileCard — Hinge-style vertical profile card.
 * Displays photos + prompts interspersed, with section-level like buttons.
 * Designed for use in a vertical FlatList feed.
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing, borderRadius } from '../../theme/tokens';
import { useThemeColors } from '../../contexts/ThemeContext';
import { EditorialPhotoSection } from './editorial-photo-section';
import { EditorialPromptSection } from './editorial-prompt-section';
import { EditorialInfoPills } from './editorial-info-pills';

export interface ProfilePrompt {
  label: string;
  response: string;
}

export interface EditorialProfileCardProps {
  name: string;
  age?: number;
  location?: string;
  skillLevel?: string;
  photos: string[];
  prompts?: ProfilePrompt[];
  onLikePhoto?: (index: number) => void;
  onLikePrompt?: (index: number) => void;
  likedPhotos?: number[];
  likedPrompts?: number[];
}

export const EditorialProfileCard = memo(
  ({
    name,
    age,
    location,
    skillLevel,
    photos,
    prompts = [],
    onLikePhoto,
    onLikePrompt,
    likedPhotos = [],
    likedPrompts = [],
  }: EditorialProfileCardProps) => {
    const colors = useThemeColors();

    // Interleave photos and prompts for editorial layout
    const sections: React.ReactNode[] = [];

    // First photo
    if (photos[0]) {
      sections.push(
        <EditorialPhotoSection
          key="photo-0"
          imageUri={photos[0]}
          onLike={onLikePhoto ? () => onLikePhoto(0) : undefined}
          isLiked={likedPhotos.includes(0)}
        />
      );
    }

    // Name + info pills after first photo
    sections.push(
      <View key="info" style={styles.infoSection}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {name}
          {age ? `, ${age}` : ''}
        </Text>
        <EditorialInfoPills location={location} skillLevel={skillLevel} />
      </View>
    );

    // Alternate remaining photos and prompts
    const remainingPhotos = photos.slice(1);
    const maxSections = Math.max(remainingPhotos.length, prompts.length);

    for (let i = 0; i < maxSections; i++) {
      if (prompts[i]) {
        sections.push(
          <EditorialPromptSection
            key={`prompt-${i}`}
            promptLabel={prompts[i].label}
            promptResponse={prompts[i].response}
            onLike={onLikePrompt ? () => onLikePrompt(i) : undefined}
            isLiked={likedPrompts.includes(i)}
          />
        );
      }
      if (remainingPhotos[i]) {
        sections.push(
          <EditorialPhotoSection
            key={`photo-${i + 1}`}
            imageUri={remainingPhotos[i]}
            onLike={onLikePhoto ? () => onLikePhoto(i + 1) : undefined}
            isLiked={likedPhotos.includes(i + 1)}
          />
        );
      }
    }

    return <View style={[styles.container, { borderBottomColor: colors.border }]}>{sections}</View>;
  }
);

EditorialProfileCard.displayName = 'EditorialProfileCard';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
  },
  infoSection: {
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.editorialH1,
    marginBottom: spacing.sm,
  },
});
