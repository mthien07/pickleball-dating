import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, fontFamily } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { Match } from '@data/mockData';
import { Avatar } from './Avatar';

export interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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

export default MatchCard;
