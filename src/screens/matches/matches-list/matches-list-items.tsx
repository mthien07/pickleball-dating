import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { Match } from '@data/mockData';
import { createStyles } from './matches-list-styles';

// ============================================
// NEW MATCH ITEM - Tinder circular avatar strip
// ============================================

interface NewMatchItemProps {
  match: Match;
  index: number;
  onPress: () => void;
}

export const NewMatchItem = React.memo<NewMatchItemProps>(({ match, index, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();

  return (
    <Animated.View entering={getEntering(FadeInRight.delay(index * 80).duration(250))}>
      <Pressable
        style={({ pressed }) => [styles.newMatchItem, pressed && { opacity: 0.7 }]}
        onPress={onPress}
      >
        <View style={styles.newMatchAvatarWrapper}>
          <Image
            source={{ uri: match.matched_user.avatar_urls[0] }}
            style={styles.newMatchAvatar}
            contentFit="cover"
            transition={150}
            accessibilityLabel={`${match.matched_user.display_name} profile photo`}
          />
          {match.matched_user.is_online && <View style={styles.onlineDot} />}
        </View>
        <Text style={styles.newMatchName} numberOfLines={1}>
          {match.matched_user.display_name.split(' ')[0]}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

NewMatchItem.displayName = 'NewMatchItem';

// ============================================
// CONVERSATION ITEM - Tinder messages style
// ============================================

interface ConversationItemProps {
  match: Match;
  index: number;
  onPress: () => void;
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'just now';
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  return `${diffDays}d`;
};

const handleLongPress = (match: Match) => {
  Alert.alert(match.matched_user.display_name, undefined, [
    { text: 'Archive', onPress: () => {} },
    { text: 'Delete', style: 'destructive', onPress: () => {} },
    { text: 'Block', style: 'destructive', onPress: () => {} },
    { text: 'Cancel', style: 'cancel' },
  ]);
};

export const ConversationItem = React.memo<ConversationItemProps>(({ match, index, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  const hasUnread = match.unread_count > 0;

  return (
    <Animated.View entering={getEntering(FadeInDown.delay(index * 40).duration(200))}>
      <Pressable
        style={({ pressed }) => [styles.conversationItem, pressed && { opacity: 0.6 }]}
        onPress={onPress}
        onLongPress={() => handleLongPress(match)}
        android_ripple={{ color: 'rgba(59, 89, 152, 0.1)' }}
      >
        {/* Avatar */}
        <View style={styles.conversationAvatarContainer}>
          <Image
            source={{ uri: match.matched_user.avatar_urls[0] }}
            style={styles.conversationAvatar}
            contentFit="cover"
            transition={150}
            accessibilityLabel={`${match.matched_user.display_name} profile photo`}
          />
          {match.matched_user.is_online && <View style={styles.conversationOnlineDot} />}
        </View>

        {/* Text content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationRow}>
            <Text
              style={[styles.conversationName, hasUnread && styles.conversationNameUnread]}
              numberOfLines={1}
            >
              {match.matched_user.display_name}
            </Text>
            <Text style={styles.conversationTime}>
              {match.last_message ? formatTime(match.last_message.sent_at) : ''}
            </Text>
          </View>
          <View style={styles.conversationPreviewRow}>
            <Text
              style={[styles.conversationMessage, hasUnread && styles.conversationMessageUnread]}
              numberOfLines={1}
            >
              {match.last_message?.content ?? 'Tap to start chatting'}
            </Text>
            {hasUnread && <View style={styles.unreadBadge} />}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

ConversationItem.displayName = 'ConversationItem';
