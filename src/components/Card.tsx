import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, fontFamily } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { CARD_MAX_WIDTH, CARD_ASPECT_RATIO } from '../theme/breakpoints';
import { User, Court, Match } from '@data/mockData';
import { Avatar } from './Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, CARD_MAX_WIDTH);

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
  /** Card width - pass from parent for responsive sizing */
  cardWidth?: number;
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ProfileCard = React.memo<ProfileCardProps>(
  ({
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
    cardWidth,
  }) => {
    // Use passed width or default
    const width = cardWidth || DEFAULT_CARD_WIDTH;
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

    // Dynamic card style with responsive width
    // Uses matchCard shadow (Rose glow) for dating vibe - Vibrant Sport theme
    const cardStyle = {
      width,
      aspectRatio: CARD_ASPECT_RATIO,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.profileCard,
      ...shadows.matchCard, // Rose shadow for dating/match cards
      overflow: 'hidden' as const,
    };

    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[cardStyle, animatedStyle]}
      >
        {/* Main Photo - Focus on face (top center) */}
        <Image
          source={{ uri: user.avatar_urls[currentImageIndex] || user.avatar_urls[0] }}
          style={styles.profileImage}
          contentFit="cover"
          contentPosition="top center"
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* Top Gradient Overlay - removed for cleaner look */}

        {/* Match Percentage Badge - Updated to new design system colors */}
        {showMatchPercentage && matchPercentage && (
          <LinearGradient
            colors={[colors.accent, colors.accentLight || '#FB7185']}
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

        {/* Image Indicators - Updated to primary blue */}
        {showImageIndicators && user.avatar_urls.length > 1 && (
          <View style={styles.imageIndicatorsContainer}>
            {user.avatar_urls.map((_, index) => (
              <View key={index} style={styles.imageIndicatorTrack}>
                {index === currentImageIndex && (
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.imageIndicatorFill}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Bottom Gradient Overlay - Cleaner, less aggressive */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
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
                {user.verification.phone_verified && <Text style={styles.verifiedBadge}>✓</Text>}
              </View>

              {/* Distance */}
              {user.preferred_location && (
                <View style={styles.profileDistance}>
                  <Ionicons name="location" size={16} color={colors.white} />
                  <Text style={styles.profileDistanceText}>{user.preferred_location.address}</Text>
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
                <Ionicons name="information-circle" size={24} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons - Modern colored gradients */}
        {showActionButtons && (
          <View style={styles.profileActionButtons}>
            {/* Reject (X) */}
            {onPass && (
              <TouchableOpacity
                onPress={onPass}
                style={styles.actionButtonReject}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={28} color={colors.error} />
              </TouchableOpacity>
            )}

            {/* Super Like (Star) - Orange gradient */}
            {onSuperLike && (
              <TouchableOpacity onPress={onSuperLike} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonSuper}
                >
                  <Ionicons name="star" size={28} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Like (Heart) - Green gradient */}
            {onLike && (
              <TouchableOpacity onPress={onLike} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonLike}
                >
                  <Ionicons name="heart" size={28} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      </AnimatedTouchable>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if user.id, currentImageIndex, or cardWidth changes
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.currentImageIndex === nextProps.currentImageIndex &&
      prevProps.cardWidth === nextProps.cardWidth
    );
  }
);
ProfileCard.displayName = 'ProfileCard';

export const CourtCard = React.memo<CourtCardProps>(
  ({ court, onPress, onBookPress }) => {
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
  },
  (prevProps, nextProps) => {
    // Only re-render if court.id changes
    return prevProps.court.id === nextProps.court.id;
  }
);
CourtCard.displayName = 'CourtCard';

export const MatchCard = React.memo<MatchCardProps>(
  ({ match, onPress }) => {
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

      if (diffMins < 60) {
        return `${diffMins}m`;
      }
      if (diffHours < 24) {
        return `${diffHours}h`;
      }
      if (diffDays < 7) {
        return `${diffDays}d`;
      }
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
              style={[styles.matchName, match.unread_count > 0 && styles.matchNameUnread]}
              numberOfLines={1}
            >
              {match.matched_user.display_name}
            </Text>
            {match.last_message && (
              <Text style={styles.matchTime}>{formatTime(match.last_message.sent_at)}</Text>
            )}
          </View>

          <View style={styles.matchMessageRow}>
            <Text style={styles.matchMessage} numberOfLines={1}>
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
  },
  (prevProps, nextProps) => {
    // Only re-render if match.id or unread_count changes
    return (
      prevProps.match.id === nextProps.match.id &&
      prevProps.match.unread_count === nextProps.match.unread_count
    );
  }
);
MatchCard.displayName = 'MatchCard';

const styles = StyleSheet.create({
  // Profile Card - Modern glassmorphism
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    zIndex: 10,
  },
  matchBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24, // More rounded - bento style
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 20,
  },
  matchBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  onlineStatusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Glassmorphism effect
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    zIndex: 20,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary, // Green for online
  },
  onlineText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  imageIndicatorsContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 6,
    zIndex: 20,
  },
  imageIndicatorTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  imageIndicatorFill: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
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
    gap: 10,
    marginBottom: 6,
  },
  profileName: {
    ...typography.h2,
    fontSize: 26,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontFamily: fontFamily.heading,
  },
  profileAge: {
    ...typography.h3,
    fontSize: 22,
    color: colors.white,
    fontWeight: '300', // Lighter weight for modern look
  },
  verifiedBadge: {
    fontSize: 18,
    color: colors.secondary, // Green checkmark
  },
  profileDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  profileDistanceText: {
    ...typography.body,
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
  },
  profileBio: {
    ...typography.body,
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
    lineHeight: 20,
    marginBottom: 10,
  },
  profileInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20, // Pill shape
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestTagText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  profileInfoButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileActionButtons: {
    position: 'absolute',
    bottom: 88,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 20,
    zIndex: 30,
  },
  // Modern action buttons with colored shadows
  actionButtonReject: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonSuper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary, // Orange glow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  actionButtonLike: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary, // Green glow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  // Court Card - Bento style with green shadow
  courtCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.bentoCard, // 24px - bento style
    ...shadows.courtCard,
    padding: 14,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courtImageContainer: {
    position: 'relative',
    width: 110,
    height: 85,
    borderRadius: borderRadius.md, // 16px
    overflow: 'hidden',
    marginRight: 14,
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
  partnerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.secondary, // Green
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  partnerBadgeText: {
    ...typography.bodySmall,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  courtInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  courtName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 3,
    fontWeight: '600',
    fontFamily: fontFamily.bodySemiBold,
  },
  courtAddress: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  courtMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
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
    color: colors.primary, // Blue
    fontWeight: '700',
    fontFamily: fontFamily.heading,
  },
  bookButton: {
    backgroundColor: colors.primary, // Blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12, // More rounded
    ...shadows.button,
  },
  bookButtonText: {
    ...typography.button,
    fontSize: 13,
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: fontFamily.heading,
  },

  // Match Card - Rose shadow for dating vibe
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.matchCard,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 14,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  matchName: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '500',
    fontFamily: fontFamily.bodyMedium,
  },
  matchNameUnread: {
    fontWeight: '700',
    fontFamily: fontFamily.heading,
  },
  matchTime: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontSize: 12,
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
    backgroundColor: colors.accent, // Rose for CTA
    borderRadius: borderRadius.full,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadBadgeText: {
    ...typography.label,
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
  },
});

// Default export
export default {
  ProfileCard,
  CourtCard,
  MatchCard,
};
