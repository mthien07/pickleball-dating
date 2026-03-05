/**
 * ProfileMe reusable sub-components
 * - StatCard: animated stat display (icon + value + label)
 * - ProfileHeader: top bar with title and settings button
 * - ProfileCard: avatar, name, skill badge, play style
 * - EmptyProfileState: prompt when no profile exists
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Avatar } from '../../../components/Avatar';
import { Button } from '../../../components/Button';
import { colors, spacing } from '../../../theme/tokens';
import { styles } from './profile-me-styles';

// ---- Helpers ----

export const getSkillLevelLabel = (level: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    beginner: { label: 'Mới bắt đầu', color: colors.skillBeginner },
    intermediate: { label: 'Trung bình', color: colors.skillIntermediate },
    advanced: { label: 'Nâng cao', color: colors.skillAdvanced },
    pro: { label: 'Chuyên nghiệp', color: colors.skillPro },
  };
  return labels[level] || { label: level, color: colors.textSecondary };
};

export const getPlayStyleLabel = (style: string) => {
  const labels: Record<string, string> = {
    competitive: 'Cạnh tranh 🔥',
    casual: 'Thư giãn 😊',
    social: 'Giao lưu 🤝',
  };
  return labels[style] || style;
};

// ---- StatCard ----

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  delay?: number;
}

export const StatCard = React.memo<StatCardProps>(({ icon, value, label, delay = 0 }) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.statCard}>
    <Ionicons name={icon as any} size={24} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Animated.View>
));

// ---- LoadingState ----

export const LoadingState = React.memo(() => (
  <View style={[styles.container, styles.centerContent]}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
  </View>
));

// ---- EmptyProfileState ----

interface EmptyProfileStateProps {
  user: any;
  onNavigateSettings: () => void;
  onNavigateSetup: () => void;
}

export const EmptyProfileState = React.memo<EmptyProfileStateProps>(
  ({ user, onNavigateSettings, onNavigateSetup }) => (
    <View style={[styles.container, styles.centerContent]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity onPress={onNavigateSettings} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>Chưa có hồ sơ</Text>
          <Text style={styles.emptyText}>
            {user ? 'Hoàn tất hồ sơ để bắt đầu' : 'Đăng nhập để xem hồ sơ'}
          </Text>
          <Button
            title="Tạo hồ sơ"
            onPress={onNavigateSetup}
            variant="primary"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
);

// ---- PhotosSection ----

interface PhotosSectionProps {
  avatarUrls: string[];
  onEditPress: () => void;
}

export const PhotosSection = React.memo<PhotosSectionProps>(({ avatarUrls, onEditPress }) => {
  if (avatarUrls.length === 0) {
    return null;
  }
  return (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ảnh</Text>
        <TouchableOpacity onPress={onEditPress}>
          <Text style={styles.editLink}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.photoRow}>
          {avatarUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.photo} />
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
});

// ---- ProfileCard ----

interface ProfileCardProps {
  displayName: string;
  skillInfo: { label: string; color: string };
  playStyleLabel: string;
  avatarUrl?: string;
  onEditPress: () => void;
}

export const ProfileCard = React.memo<ProfileCardProps>(
  ({ displayName, skillInfo, playStyleLabel, avatarUrl, onEditPress }) => (
    <Animated.View entering={FadeIn.delay(100)} style={styles.profileCard}>
      <View style={styles.avatarSection}>
        <Avatar
          size="xl"
          imageUrl={avatarUrl}
          name={displayName}
          showBorder
          borderColor={colors.primary}
        />
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="pencil" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.displayName}>{displayName}</Text>
      <View style={styles.skillBadge}>
        <View style={[styles.skillDot, { backgroundColor: skillInfo.color }]} />
        <Text style={[styles.skillText, { color: skillInfo.color }]}>{skillInfo.label}</Text>
      </View>
      <Text style={styles.playStyle}>{playStyleLabel}</Text>
    </Animated.View>
  )
);
