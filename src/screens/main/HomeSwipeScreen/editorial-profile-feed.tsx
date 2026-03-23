/**
 * Editorial profile feed — vertical scrollable profile with section-level likes.
 * Replaces the swipe card stack with Hinge-style editorial layout.
 */
import React, { memo, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { EditorialPhotoSection } from '../../../components/editorial-profile-card/editorial-photo-section';
import { EditorialPromptSection } from '../../../components/editorial-profile-card/editorial-prompt-section';
import { EditorialInfoPills } from '../../../components/editorial-profile-card/editorial-info-pills';
import { ProfileActionBar } from './profile-action-bar';

interface ProfilePrompt {
  label: string;
  response: string;
}

interface DiscoveryProfile {
  name: string;
  age?: number;
  photos: string[];
  bio?: string;
  skillLevel?: string;
  playStyle?: string;
  distance?: number;
  prompts?: ProfilePrompt[];
}

interface EditorialProfileFeedProps {
  profile: DiscoveryProfile | null;
  onPass: () => void;
  onLike: () => void;
  onLikePhoto?: (index: number) => void;
  onLikePrompt?: (index: number) => void;
}

export const EditorialProfileFeed = memo(
  ({ profile, onPass, onLike, onLikePhoto, onLikePrompt }: EditorialProfileFeedProps) => {
    const colors = useThemeColors();
    const scrollRef = useRef<ScrollView>(null);

    if (!profile) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No more profiles</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Check back later for new players
          </Text>
        </View>
      );
    }

    const photos = profile.photos || [];
    const prompts: ProfilePrompt[] = profile.prompts || [];
    const location = profile.distance ? `${profile.distance} km away` : undefined;

    // Build interleaved sections: first photo → name/info → alternate prompts & remaining photos
    const sections: React.ReactNode[] = [];

    if (photos[0]) {
      sections.push(
        <EditorialPhotoSection
          key="photo-0"
          imageUri={photos[0]}
          onLike={onLikePhoto ? () => onLikePhoto(0) : undefined}
        />
      );
    }

    sections.push(
      <View key="info" style={styles.infoSection}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {profile.name}
          {profile.age ? `, ${profile.age}` : ''}
        </Text>
        {profile.bio && (
          <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text>
        )}
        <EditorialInfoPills location={location} skillLevel={profile.skillLevel} />
      </View>
    );

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
          />
        );
      }
      if (remainingPhotos[i]) {
        sections.push(
          <EditorialPhotoSection
            key={`photo-${i + 1}`}
            imageUri={remainingPhotos[i]}
            onLike={onLikePhoto ? () => onLikePhoto(i + 1) : undefined}
          />
        );
      }
    }

    return (
      <ScrollView
        ref={scrollRef}
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileContainer}>
          {sections}
          <ProfileActionBar onPass={onPass} onLike={onLike} />
        </View>
      </ScrollView>
    );
  }
);

EditorialProfileFeed.displayName = 'EditorialProfileFeed';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  profileContainer: {
    paddingHorizontal: spacing.md,
  },
  infoSection: {
    marginBottom: spacing.md,
  },
  name: {
    ...typography.editorialH1,
    marginBottom: spacing.xs,
  },
  bio: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.editorialH2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
});
