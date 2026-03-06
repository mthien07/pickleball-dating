/**
 * ProfileMeScreen
 *
 * Current user's profile view - loads from Supabase database.
 * Orchestrator: delegates rendering to sub-components.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Button } from '../../../components/Button';
import { spacing, colors } from '../../../theme/tokens';
import { useAuth } from '../../../contexts/AuthContext';
import {
  StatCard,
  LoadingState,
  EmptyProfileState,
  PhotosSection,
  ProfileCard,
  getSkillLevelLabel,
  getPlayStyleLabel,
} from './profile-me-components';
import { styles } from './profile-me-styles';

export const ProfileMeScreen = () => {
  const navigation = useNavigation<any>();
  const { profile, profileLoading, user } = useAuth();

  if (profileLoading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <EmptyProfileState
        user={user}
        onNavigateSettings={() => navigation.navigate('Settings')}
        onNavigateSetup={() => navigation.navigate('ProfileSetup')}
      />
    );
  }

  const skillInfo = getSkillLevelLabel(profile.skill_level);
  const avatarUrls = profile.avatar_urls || [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ProfileCard
            displayName={profile.display_name}
            skillInfo={skillInfo}
            playStyleLabel={getPlayStyleLabel(profile.play_style)}
            avatarUrl={avatarUrls[0]}
            onEditPress={() => navigation.navigate('EditProfile')}
          />

          <View style={styles.statsRow}>
            <StatCard icon="heart" value={profile.matches_count || 0} label="Matches" delay={200} />
            <StatCard
              icon="trophy"
              value={profile.games_played || 0}
              label="Trận đấu"
              delay={250}
            />
            <StatCard
              icon="star"
              value={(profile.average_rating || 0).toFixed(1)}
              label="Đánh giá"
              delay={300}
            />
          </View>

          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.bio}>{profile.bio || 'Chưa có giới thiệu'}</Text>
          </Animated.View>

          <PhotosSection
            avatarUrls={avatarUrls}
            onEditPress={() => navigation.navigate('EditProfile')}
          />

          <Animated.View entering={FadeInUp.delay(450)} style={styles.actions}>
            <Button
              title="Chỉnh sửa hồ sơ"
              onPress={() => navigation.navigate('EditProfile')}
              variant="primary"
              fullWidth
            />
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileMeScreen;
