/**
 * ProfileMeScreen
 *
 * Current user's profile view with stats, photos, and navigation to edit/settings
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_USERS, CURRENT_USER_ID } from '@data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// HELPER FUNCTIONS
// ============================================

const getSkillLevelLabel = (level: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    beginner: { label: 'Mới bắt đầu', color: colors.skillBeginner },
    intermediate: { label: 'Trung bình', color: colors.skillIntermediate },
    advanced: { label: 'Nâng cao', color: colors.skillAdvanced },
    pro: { label: 'Chuyên nghiệp', color: colors.skillPro },
  };
  return labels[level] || { label: level, color: colors.textSecondary };
};

const getPlayStyleLabel = (style: string) => {
  const labels: Record<string, string> = {
    competitive: 'Cạnh tranh 🔥',
    casual: 'Thư giãn 😊',
    social: 'Giao lưu 🤝',
  };
  return labels[style] || style;
};

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, delay = 0 }) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.statCard}>
    <Ionicons name={icon as any} size={24} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Animated.View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const ProfileMeScreen = () => {
  const navigation = useNavigation<any>();
  const currentUser = MOCK_USERS.find((u) => u.id === CURRENT_USER_ID);

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const skillInfo = getSkillLevelLabel(currentUser.skill_level);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <Avatar
                size="xl"
                imageUrl={currentUser.avatar_urls[0]}
                name={currentUser.display_name}
                showBorder
                borderColor={colors.primary}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Ionicons name="pencil" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.displayName}>{currentUser.display_name}</Text>

            <View style={styles.skillBadge}>
              <View style={[styles.skillDot, { backgroundColor: skillInfo.color }]} />
              <Text style={[styles.skillText, { color: skillInfo.color }]}>{skillInfo.label}</Text>
            </View>

            <Text style={styles.playStyle}>{getPlayStyleLabel(currentUser.play_style)}</Text>
          </Animated.View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              icon="heart"
              value={currentUser.stats.matches_count}
              label="Matches"
              delay={200}
            />
            <StatCard
              icon="trophy"
              value={currentUser.stats.games_played}
              label="Trận đấu"
              delay={250}
            />
            <StatCard
              icon="star"
              value={currentUser.stats.average_rating.toFixed(1)}
              label="Đánh giá"
              delay={300}
            />
          </View>

          {/* Bio */}
          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.bio}>{currentUser.bio || 'Chưa có giới thiệu'}</Text>
          </Animated.View>

          {/* Photos */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ảnh</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editLink}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photoRow}>
                {currentUser.avatar_urls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.photo}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInUp.delay(450)} style={styles.actions}>
            <Button
              title="Chỉnh sửa hồ sơ"
              onPress={() => navigation.navigate('EditProfile')}
              variant="primary"
              fullWidth
            />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('AnimationDemo')}
            >
              <Text style={styles.linkText}>Xem Demo Animation</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Profile Card
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  displayName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  skillText: {
    ...typography.body,
    fontWeight: '600',
  },
  playStyle: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  editLink: {
    ...typography.body,
    color: colors.primary,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Photos
  photoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },

  // Actions
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.body,
    color: colors.primary,
  },
});

export default ProfileMeScreen;
