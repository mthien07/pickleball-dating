/**
 * Card Component
 *
 * Versatile card component with multiple variants for different use cases.
 * Implements design system from design/uiuxguides.md
 *
 * Variants:
 * - ProfileCard: For swipe cards (dating profiles)
 * - CourtCard: For court listings
 * - MatchCard: For chat/match lists
 *
 * Usage:
 * ```tsx
 * <ProfileCard user={user} onLike={handleLike} onPass={handlePass} />
 * <CourtCard court={court} onPress={handlePress} />
 * <MatchCard match={match} onPress={handlePress} />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/tokens';
import { User, Court, Match } from '../../data/mockData';
import { Avatar } from './Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface ProfileCardProps {
  user: User;
  onLike?: () => void;
  onPass?: () => void;
  onPress?: () => void;
}

export interface CourtCardProps {
  court: Court;
  onPress?: () => void;
  onBookPress?: () => void;
}

export interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

// ============================================
// PROFILE CARD (Swipe Card)
// ============================================

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onLike,
  onPass,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const age = new Date().getFullYear() - new Date(user.date_of_birth).getFullYear();

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
      style={[styles.profileCard, animatedStyle]}
    >
      {/* Main Photo */}
      <Image
        source={{ uri: user.avatar_urls[0] }}
        style={styles.profileImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <View style={styles.profileGradient} />

      {/* User Info */}
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>
            {user.display_name}, {age}
          </Text>
          {user.verification.phone_verified && (
            <Text style={styles.verifiedBadge}>✓</Text>
          )}
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.skillBadge}>{user.skill_level}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{user.preferred_location?.address}</Text>
        </View>

        {user.bio && (
          <Text style={styles.profileBio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
      </View>
    </AnimatedTouchable>
  );
};

// ============================================
// COURT CARD (List Item)
// ============================================

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  onPress,
  onBookPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
      style={[styles.courtCard, animatedStyle]}
    >
      {/* Court Image */}
      <View style={styles.courtImageContainer}>
        <Image
          source={{ uri: court.images[0] }}
          style={styles.courtImage}
          resizeMode="cover"
        />
        {court.is_partner && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerBadgeText}>Partner</Text>
          </View>
        )}
      </View>

      {/* Court Info */}
      <View style={styles.courtInfo}>
        <Text style={styles.courtName} numberOfLines={1}>
          {court.name}
        </Text>
        <Text style={styles.courtAddress} numberOfLines={2}>
          {court.address}
        </Text>

        <View style={styles.courtMeta}>
          <Text style={styles.courtDistance}>📍 {court.distance_km} km</Text>
          <Text style={styles.courtRating}>
            ⭐ {court.rating} ({court.review_count})
          </Text>
        </View>

        <View style={styles.courtFooter}>
          <Text style={styles.courtPrice}>
            {(court.price_per_hour / 1000).toFixed(0)}k VND/giờ
          </Text>
          {onBookPress && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onBookPress();
              }}
              style={styles.bookButton}
            >
              <Text style={styles.bookButtonText}>Đặt ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// ============================================
// MATCH CARD (Chat List Item)
// ============================================

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
      style={[styles.matchCard, animatedStyle]}
    >
      {/* Avatar */}
      <Avatar
        size="md"
        imageUrl={match.matched_user.avatar_urls[0]}
        isOnline={match.matched_user.is_online}
        name={match.matched_user.display_name}
      />

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text
            style={[
              styles.matchName,
              match.unread_count > 0 && styles.matchNameUnread,
            ]}
            numberOfLines={1}
          >
            {match.matched_user.display_name}
          </Text>
          {match.last_message && (
            <Text style={styles.matchTime}>
              {formatTime(match.last_message.sent_at)}
            </Text>
          )}
        </View>

        <View style={styles.matchMessageRow}>
          <Text
            style={styles.matchMessage}
            numberOfLines={1}
          >
            {match.last_message?.content || 'New match!'}
          </Text>
          {match.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {match.unread_count > 9 ? '9+' : match.unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Profile Card (Swipe)
  profileCard: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.profileCard,
    ...shadows.profileCard,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  profileName: {
    ...typography.h2,
    color: colors.white,
    marginRight: spacing.xs,
  },
  verifiedBadge: {
    fontSize: 20,
    color: colors.secondary,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  skillBadge: {
    ...typography.label,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    textTransform: 'capitalize',
  },
  metaText: {
    ...typography.body,
    color: colors.white,
    marginHorizontal: spacing.xs,
  },
  profileBio: {
    ...typography.body,
    color: colors.white,
  },

  // Court Card (List)
  courtCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    ...shadows.card,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
  },
  courtImageContainer: {
    position: 'relative',
    width: 120,
    height: 90,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.sm + 4,
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
  partnerBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partnerBadgeText: {
    ...typography.bodySmall,
    color: colors.white,
    fontSize: 10,
  },
  courtInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  courtName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  courtAddress: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  courtMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  courtDistance: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  courtRating: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtPrice: {
    ...typography.h4,
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  bookButtonText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
  },

  // Match Card (Chat List)
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matchInfo: {
    flex: 1,
    marginLeft: spacing.sm + 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
  },
  matchNameUnread: {
    fontWeight: '600',
  },
  matchTime: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  matchMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchMessage: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadBadgeText: {
    ...typography.label,
    fontSize: 10,
    color: colors.white,
  },
});

// Default export
export default {
  ProfileCard,
  CourtCard,
  MatchCard,
};
