/**
 * ProfileMe reusable sub-components (Tinder-style redesign)
 * - ProfileHeroSection: full-width hero photo with gradient overlay
 * - SkillBadge: colored pill badge for skill level
 * - StatCard: bento-style stat display (value + label)
 * - BioSection: bio text + play style tags
 * - LoadingState, EmptyProfileState: utility states
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Button } from '../../../components/Button';
import { createStyles } from './profile-me-styles';
import type { ThemeColors } from '../../../contexts/theme-colors';

// ---- Helpers ----

export const getSkillLevelLabel = (level: string, colors: ThemeColors) => {
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

// ---- SkillBadge ----

const SKILL_COLORS: Record<string, string> = {
  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#2563EB',
  pro: '#F43F5E',
};

interface SkillBadgeProps {
  skillLevel: string;
  label: string;
}

const SkillBadge = React.memo<SkillBadgeProps>(({ skillLevel, label }) => {
  const styles = useThemedStyles(createStyles);
  const bgColor = SKILL_COLORS[skillLevel] || '#94A3B8';
  return (
    <View style={[styles.skillBadge, { backgroundColor: bgColor }]}>
      <Text style={styles.skillBadgeText}>{label}</Text>
    </View>
  );
});

// ---- ProfileHeroSection ----

interface ProfileHeroSectionProps {
  displayName: string;
  age?: number;
  skillLevel: string;
  location?: string;
  avatarUrl?: string;
  onSettingsPress: () => void;
}

export const ProfileHeroSection = React.memo<ProfileHeroSectionProps>(
  ({ displayName, age, skillLevel, location, avatarUrl, onSettingsPress }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const { label } = getSkillLevelLabel(skillLevel, colors);
    const nameDisplay = age ? `${displayName}, ${age}` : displayName;

    return (
      <View style={styles.heroContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.heroImage} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroGradient} />
        <View style={styles.heroContent}>
          <Text style={styles.heroNameText}>{nameDisplay}</Text>
          <SkillBadge skillLevel={skillLevel} label={label} />
          {location ? (
            <View style={styles.heroLocationRow}>
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroLocationText}>{location}</Text>
            </View>
          ) : null}
        </View>
        <Pressable
          style={({ pressed }) => [styles.settingsButton, pressed && { opacity: 0.8 }]}
          onPress={onSettingsPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
    );
  }
);

// ---- StatCard ----

interface StatCardProps {
  value: string | number;
  label: string;
}

export const StatCard = React.memo<StatCardProps>(({ value, label }) => {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
});

// ---- BioSection ----

interface BioSectionProps {
  bio: string;
  playStyle: string;
  playStyleLabel: string;
}

export const BioSection = React.memo<BioSectionProps>(({ bio, playStyle, playStyleLabel }) => {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.bioCard}>
      <Text style={styles.bioTitle}>Giới thiệu</Text>
      <Text style={styles.bioText}>{bio}</Text>
      {playStyle ? (
        <View style={styles.tagsRow}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>{playStyleLabel}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
});

// ---- LoadingState ----

export const LoadingState = React.memo(() => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, styles.centerContent]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
    </View>
  );
});

// ---- EmptyProfileState ----

interface EmptyProfileStateProps {
  user: any;
  onNavigateSettings: () => void;
  onNavigateSetup: () => void;
}

export const EmptyProfileState = React.memo<EmptyProfileStateProps>(
  ({ user, onNavigateSettings, onNavigateSetup }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    return (
      <View style={[styles.container, styles.centerContent]}>
        <SafeAreaView>
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
    );
  }
);
