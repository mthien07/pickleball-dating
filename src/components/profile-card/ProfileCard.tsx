import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { borderRadius } from '../../theme/tokens';
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { shadows } from '../../theme/shadows';
import { CARD_MAX_WIDTH, CARD_ASPECT_RATIO } from '../../theme/breakpoints';
import { User } from '@data/mockData';
import { createStyles } from './profile-card-styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
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
    const matchPercentage = user.preferences ? 85 : undefined;

    const cardStyle = {
      width,
      aspectRatio: CARD_ASPECT_RATIO,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.profileCard,
      ...shadows.matchCard,
      overflow: 'hidden' as const,
    };

    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
        style={[cardStyle, animatedStyle]}
      >
        <Image
          source={{ uri: user.avatar_urls[currentImageIndex] || user.avatar_urls[0] }}
          style={styles.profileImage}
          contentFit="cover"
          contentPosition="top center"
          transition={200}
          cachePolicy="memory-disk"
        />

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

        {showOnlineStatus && user.is_online && (
          <View style={styles.onlineStatusBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}

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

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.profileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={styles.profileInfo}>
          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoContent}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>{user.display_name}</Text>
                <Text style={styles.profileAge}>{age}</Text>
                {user.verification.phone_verified && <Text style={styles.verifiedBadge}>✓</Text>}
              </View>

              {user.preferred_location && (
                <View style={styles.profileDistance}>
                  <Ionicons name="location" size={16} color={colors.white} />
                  <Text style={styles.profileDistanceText}>{user.preferred_location.address}</Text>
                </View>
              )}

              {user.bio && (
                <Text style={styles.profileBio} numberOfLines={2}>
                  {user.bio}
                </Text>
              )}

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

            {onShowProfile && (
              <Pressable
                onPress={onShowProfile}
                style={({ pressed }) => [styles.profileInfoButton, pressed && { opacity: 0.8 }]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="information-circle" size={24} color={colors.white} />
              </Pressable>
            )}
          </View>
        </View>

        {showActionButtons && (
          <View style={styles.profileActionButtons}>
            {onPass && (
              <Pressable
                onPress={onPass}
                style={({ pressed }) => [styles.actionButtonReject, pressed && { opacity: 0.8 }]}
                android_ripple={{ color: 'rgba(239, 68, 68, 0.2)' }}
              >
                <Ionicons name="close" size={28} color={colors.error} />
              </Pressable>
            )}

            {onSuperLike && (
              <Pressable
                onPress={onSuperLike}
                style={({ pressed }) => pressed && { opacity: 0.8 }}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.2)' }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonSuper}
                >
                  <Ionicons name="star" size={28} color={colors.white} />
                </LinearGradient>
              </Pressable>
            )}

            {onLike && (
              <Pressable
                onPress={onLike}
                style={({ pressed }) => pressed && { opacity: 0.8 }}
                android_ripple={{ color: 'rgba(244, 63, 94, 0.2)' }}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonLike}
                >
                  <Ionicons name="heart" size={28} color={colors.white} />
                </LinearGradient>
              </Pressable>
            )}
          </View>
        )}
      </AnimatedPressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.currentImageIndex === nextProps.currentImageIndex &&
      prevProps.cardWidth === nextProps.cardWidth
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
