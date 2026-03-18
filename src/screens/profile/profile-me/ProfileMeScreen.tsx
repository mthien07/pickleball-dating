/**
 * ProfileMeScreen
 *
 * Tinder-style profile view: hero photo, stats grid, bio section.
 * Orchestrator — delegates rendering to profile-me-components.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ProfileHeroSection,
  StatCard,
  BioSection,
  LoadingState,
  EmptyProfileState,
  getPlayStyleLabel,
} from './profile-me-components';
import { createStyles } from './profile-me-styles';

export const ProfileMeScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
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

  const avatarUrls: string[] = profile.avatar_urls || [];

  // Derive age from date_of_birth
  const age = profile.date_of_birth
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : undefined;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <ProfileHeroSection
          displayName={profile.display_name}
          age={age}
          skillLevel={profile.skill_level}
          location={profile.preferred_address}
          avatarUrl={avatarUrls[0]}
          onSettingsPress={() => navigation.navigate('Settings')}
        />

        {/* Stats Grid — overlaps hero with negative margin */}
        <View style={styles.statsGrid}>
          <StatCard value={profile.matches_count || 0} label="Matches" />
          <StatCard value={profile.games_played || 0} label="Trận đấu" />
          <StatCard value={(profile.average_rating || 0).toFixed(1)} label="Đánh giá" />
        </View>

        {/* Bio Section */}
        <BioSection
          bio={profile.bio || 'Chưa có giới thiệu'}
          playStyle={profile.play_style}
          playStyleLabel={getPlayStyleLabel(profile.play_style)}
        />

        {/* Edit Profile Button */}
        <Pressable
          style={styles.editButtonContainer}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
};

export default ProfileMeScreen;
