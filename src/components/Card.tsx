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
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { User, Court, Match } from '@data/mockData';
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
  onSuperLike?: () => void;
  onShowProfile?: () => void;
  showMatchPercentage?: boolean;
  showOnlineStatus?: boolean;
  showImageIndicators?: boolean;
  showInterests?: boolean;
  showActionButtons?: boolean;
  currentImageIndex?: number;
  onImageIndexChange?: (index: number) => void;
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

export const ProfileCard = React.memo<ProfileCardProps>(({
  user,
  onLike,
  onPass,
  onPress,
  onSuperLike,
  onShowProfile,
  showMatchPercentage = false,
  showOnlineStatus = false,
  showImageIndicators = false,
  showInterests = false,
  showActionButtons = false,
  currentImageIndex = 0,
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

  // Calculate match percentage (mock - would come from backend)
  const matchPercentage = user.preferences ? 85 : undefined;

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
        source={{ uri: user.avatar_urls[currentImageIndex] || user.avatar_urls[0] }}
        style={styles.profileImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Top Gradient Overlay (subtle) */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.3)', 'transparent', 'rgba(249, 115, 22, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileTopGradient}
      />

      {/* Match Percentage Badge */}
      {showMatchPercentage && matchPercentage && (
        <LinearGradient
          colors={['#EF4444', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.matchBadge}
        >
          <Text style={styles.matchBadgeText}>Match {matchPercentage}%</Text>
        </LinearGradient>
      )}

      {/* Online Status */}
      {showOnlineStatus && user.is_online && (
        <View style={styles.onlineStatusBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      )}

      {/* Image Indicators */}
      {showImageIndicators && user.avatar_urls.length > 1 && (
        <View style={styles.imageIndicatorsContainer}>
          {user.avatar_urls.map((_, index) => (
            <View key={index} style={styles.imageIndicatorTrack}>
              {index === currentImageIndex && (
                <LinearGradient
                  colors={['#EF4444', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.imageIndicatorFill}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.profileGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* User Info */}
      <View style={styles.profileInfo}>
        <View style={styles.profileInfoRow}>
          <View style={styles.profileInfoContent}>
            {/* Name and Age */}
            <View style={styles.profileHeader}>
              <Text style={styles.profileName}>{user.display_name}</Text>
              <Text style={styles.profileAge}>{age}</Text>
              {user.verification.phone_verified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>

            {/* Distance */}
            {user.preferred_location && (
              <View style={styles.profileDistance}>
                <Ionicons name="location" size={16} color="#FFFFFF" />
                <Text style={styles.profileDistanceText}>
                  {user.preferred_location.address}
                </Text>
              </View>
            )}

            {/* Bio */}
            {user.bio && (
              <Text style={styles.profileBio} numberOfLines={2}>
                {user.bio}
              </Text>
            )}

            {/* Interests */}
            {showInterests && user.preferences?.interests && (
              <View style={styles.profileInterests}>
                {user.preferences.interests.slice(0, 3).map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Info Button */}
          {onShowProfile && (
            <TouchableOpacity
              onPress={onShowProfile}
              style={styles.profileInfoButton}
              activeOpacity={0.8}
            >
              <Ionicons name="information-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      {showActionButtons && (
        <View style={styles.profileActionButtons}>
          {/* Reject (X) */}
          {onPass && (
            <TouchableOpacity
              onPress={onPass}
              style={styles.actionButtonReject}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={32} color="#EF4444" />
            </TouchableOpacity>
          )}

          {/* Super Like (Star) */}
          {onSuperLike && (
            <TouchableOpacity onPress={onSuperLike} activeOpacity={0.8}>
              <LinearGradient
                colors={['#A855F7', '#9333EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonSuper}
              >
                <Ionicons name="star" size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Like (Heart) */}
          {onLike && (
            <TouchableOpacity onPress={onLike} activeOpacity={0.8}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonLike}
              >
                <Ionicons name="heart" size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
}, (prevProps, nextProps) => {
  // Only re-render if user.id or currentImageIndex changes
  return prevProps.user.id === nextProps.user.id &&
         prevProps.currentImageIndex === nextProps.currentImageIndex;
});

// ============================================
// COURT CARD (List Item)
// ============================================

export const CourtCard = React.memo<CourtCardProps>(({
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
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
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
}, (prevProps, nextProps) => {
  // Only re-render if court.id changes
  return prevProps.court.id === nextProps.court.id;
});

// ============================================
// MATCH CARD (Chat List Item)
// ============================================

export const MatchCard = React.memo<MatchCardProps>(({
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
}, (prevProps, nextProps) => {
  // Only re-render if match.id or unread_count changes
  return prevProps.match.id === nextProps.match.id &&
         prevProps.match.unread_count === nextProps.match.unread_count;
});

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
  profileTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  profileGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 10,
  },

  // Match Badge
  matchBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20,
  },
  matchBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Online Status
  onlineStatusBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 20,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  onlineText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // Image Indicators
  imageIndicatorsContainer: {
    position: 'absolute',
    top: 96,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 8,
    zIndex: 20,
  },
  imageIndicatorTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  imageIndicatorFill: {
    width: '100%',
    height: '100%',
  },

  // Profile Info
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    zIndex: 20,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  profileInfoContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  profileName: {
    ...typography.h1,
    fontSize: 36,
    color: colors.white,
    fontWeight: '700',
  },
  profileAge: {
    ...typography.h2,
    fontSize: 32,
    color: colors.white,
    fontWeight: '400',
  },
  verifiedBadge: {
    fontSize: 20,
    color: colors.secondary,
  },
  profileDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  profileDistanceText: {
    ...typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
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
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 12,
  },
  profileInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestTagText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.white,
  },

  // Info Button
  profileInfoButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Action Buttons
  profileActionButtons: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    zIndex: 30,
  },
  actionButtonReject: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonSuper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonLike: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
