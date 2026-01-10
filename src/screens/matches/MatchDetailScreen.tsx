/**
 * MatchDetailScreen
 *
 * View matched user's full profile with photos, info, and actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_MATCHES, MOCK_USERS } from '@data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// HELPER FUNCTIONS
// ============================================

const getSkillLevelLabel = (level: string) => {
  const labels: Record<string, { label: string; emoji: string }> = {
    beginner: { label: 'Mới bắt đầu', emoji: '🌱' },
    intermediate: { label: 'Trung bình', emoji: '🎯' },
    advanced: { label: 'Nâng cao', emoji: '⚡' },
    pro: { label: 'Chuyên nghiệp', emoji: '🏆' },
  };
  return labels[level] || { label: level, emoji: '🎾' };
};

const getPlayStyleLabel = (style: string) => {
  const labels: Record<string, string> = {
    competitive: 'Cạnh tranh 🔥',
    casual: 'Thư giãn 😊',
    social: 'Giao lưu 🤝',
  };
  return labels[style] || style;
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const MatchDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { matchId } = route.params || {};

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Get match and user data
  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  const user = match?.matched_user || MOCK_USERS[1]; // Fallback to first user for demo

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const skillInfo = getSkillLevelLabel(user.skill_level);
  const age = calculateAge(user.date_of_birth);

  const handleChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Chat', { matchId });
  };

  const handleRate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Rating', { userId: user.id, userName: user.display_name });
  };

  const handleUnmatch = () => {
    Alert.alert(
      'Bỏ kết nối',
      `Bạn có chắc chắn muốn bỏ kết nối với ${user.display_name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bỏ kết nối',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Photo Carousel */}
      <View style={styles.photoContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPhotoIndex(index);
          }}
        >
          {user.avatar_urls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.photo} />
          ))}
        </ScrollView>

        {/* Photo Indicators */}
        <View style={styles.photoIndicators}>
          {user.avatar_urls.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, currentPhotoIndex === index && styles.indicatorActive]}
            />
          ))}
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Name & Age */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.nameSection}>
            <Text style={styles.displayName}>
              {user.display_name}, {age}
            </Text>
            {user.is_online && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </Animated.View>

          {/* Skill & Style */}
          <Animated.View entering={FadeInUp.delay(150)} style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoEmoji}>{skillInfo.emoji}</Text>
              <Text style={styles.infoText}>{skillInfo.label}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>{getPlayStyleLabel(user.play_style)}</Text>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.matches_count}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.games_played}</Text>
              <Text style={styles.statLabel}>Trận</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.average_rating.toFixed(1)}⭐</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
          </Animated.View>

          {/* Bio */}
          {user.bio && (
            <Animated.View entering={FadeInUp.delay(250)} style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </Animated.View>
          )}

          {/* Looking For */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Đang tìm kiếm</Text>
            <View style={styles.tagRow}>
              {user.looking_for.map((item) => {
                const labels: Record<string, string> = {
                  opponent: 'Đối thủ đơn',
                  doubles_partner: 'Partner đôi',
                  dating: 'Hẹn hò',
                };
                return (
                  <View key={item} style={styles.tag}>
                    <Text style={styles.tagText}>{labels[item] || item}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleUnmatch}>
            <Ionicons name="close-circle" size={28} color={colors.error} />
          </TouchableOpacity>
          <Button title="Nhắn tin" onPress={handleChat} variant="primary" style={styles.chatButton} />
          <TouchableOpacity style={styles.actionButton} onPress={handleRate}>
            <Ionicons name="star" size={28} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>
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

  // Photo
  photoContainer: {
    height: SCREEN_WIDTH * 0.9,
    position: 'relative',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.9,
  },
  photoIndicators: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.white,
    width: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Name
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  displayName: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  onlineText: {
    ...typography.bodySmall,
    color: colors.success,
  },

  // Info
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  infoEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },

  // Bio
  bioSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  bio: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Tags
  section: {
    marginBottom: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...typography.body,
    color: colors.primary,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    flex: 1,
  },
});

export default MatchDetailScreen;
