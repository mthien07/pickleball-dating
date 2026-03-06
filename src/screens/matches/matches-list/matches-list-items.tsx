import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { colors } from '../../../theme/tokens';
import { Match } from '@data/mockData';
import { styles } from './matches-list-styles';

// ============================================
// STORY-STYLE MATCH ITEM (Instagram Stories)
// ============================================

interface StoryMatchItemProps {
  match: Match;
  index: number;
  onPress: () => void;
}

export const StoryMatchItem = React.memo<StoryMatchItemProps>(({ match, index, onPress }) => (
  <Animated.View entering={FadeInRight.delay(index * 80).duration(250)}>
    <Pressable
      style={({ pressed }) => [styles.storyItem, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
    >
      <LinearGradient
        colors={
          match.is_new
            ? [colors.accent, colors.primary, colors.primaryLight]
            : [colors.border, colors.border]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.storyRing}
      >
        <View style={styles.storyAvatarWrapper}>
          <Image
            source={{ uri: match.matched_user.avatar_urls[0] }}
            style={styles.storyAvatar}
            contentFit="cover"
            transition={150}
          />
        </View>
      </LinearGradient>
      {match.matched_user.is_online && <View style={styles.storyOnline} />}
      <Text style={styles.storyName} numberOfLines={1}>
        {match.matched_user.display_name.split(' ')[0]}
      </Text>
    </Pressable>
  </Animated.View>
));

StoryMatchItem.displayName = 'StoryMatchItem';

// ============================================
// CONVERSATION ITEM (Instagram DM Style)
// ============================================

interface ConversationItemProps {
  match: Match;
  index: number;
  onPress: () => void;
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) {
    return 'vừa xong';
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  return `${diffDays}d`;
};

export const ConversationItem = React.memo<ConversationItemProps>(({ match, index, onPress }) => {
  const hasUnread = match.unread_count > 0;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(200)}>
      <Pressable
        style={({ pressed }) => [styles.conversationItem, pressed && { opacity: 0.6 }]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
      >
        {/* Avatar */}
        <View style={styles.conversationAvatarContainer}>
          <Image
            source={{ uri: match.matched_user.avatar_urls[0] }}
            style={styles.conversationAvatar}
            contentFit="cover"
            transition={150}
          />
          {match.matched_user.is_online && <View style={styles.conversationOnline} />}
        </View>

        {/* Content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text
              style={[styles.conversationName, hasUnread && styles.conversationNameBold]}
              numberOfLines={1}
            >
              {match.matched_user.display_name}
            </Text>
            <Text style={styles.conversationTime}>
              {match.last_message ? formatTime(match.last_message.sent_at) : ''}
            </Text>
          </View>
          <View style={styles.conversationPreview}>
            <Text
              style={[styles.conversationMessage, hasUnread && styles.conversationMessageBold]}
              numberOfLines={1}
            >
              {match.last_message?.content || 'Nhấn để bắt đầu trò chuyện'}
            </Text>
            {hasUnread && <View style={styles.unreadDot} />}
          </View>
        </View>

        {/* Camera icon like Instagram */}
        <Pressable
          style={({ pressed }) => [styles.cameraButton, pressed && { opacity: 0.6 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="camera-outline" size={24} color={colors.textTertiary} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
});

ConversationItem.displayName = 'ConversationItem';
