/**
 * MessageBubble Component
 *
 * Chat message bubble with sent/received variants
 * Supports text, images, and read receipts
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.75;

// ============================================
// TYPES
// ============================================

export interface Message {
  id: string;
  content?: string;
  type: 'text' | 'image';
  image_url?: string;
  sender_id: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  created_at: string;
}

export interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  onImagePress?: (imageUrl: string) => void;
  animationDelay?: number;
}

// ============================================
// STATUS ICON
// ============================================

const StatusIcon = ({ status }: { status: Message['status'] }) => {
  switch (status) {
    case 'sending':
      return <Ionicons name="time-outline" size={14} color={colors.textTertiary} />;
    case 'sent':
      return <Ionicons name="checkmark" size={14} color={colors.textTertiary} />;
    case 'delivered':
      return <Ionicons name="checkmark-done" size={14} color={colors.textTertiary} />;
    case 'read':
      return <Ionicons name="checkmark-done" size={14} color={colors.primary} />;
    default:
      return null;
  }
};

// ============================================
// COMPONENT
// ============================================

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showTimestamp = false,
  showStatus = true,
  onImagePress,
  animationDelay = 0,
}) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (message.type === 'image' && message.image_url) {
      return (
        <TouchableOpacity onPress={() => onImagePress?.(message.image_url!)} activeOpacity={0.9}>
          <Image
            source={{ uri: message.image_url }}
            style={styles.imageMessage}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{message.content}</Text>
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(300)}
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
    >
      {isMe ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleMe, message.type === 'image' && styles.imageBubble]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.bubble,
            styles.bubbleOther,
            message.type === 'image' && styles.imageBubble,
          ]}
        >
          {renderContent()}
        </View>
      )}

      {/* Timestamp and Status */}
      <View style={[styles.meta, isMe ? styles.metaMe : styles.metaOther]}>
        {showTimestamp && <Text style={styles.timestamp}>{formatTime(message.created_at)}</Text>}
        {showStatus && isMe && <StatusIcon status={message.status} />}
      </View>
    </Animated.View>
  );
};

// ============================================
// TYPING INDICATOR
// ============================================

export const TypingIndicator: React.FC = () => {
  return (
    <Animated.View entering={FadeInUp.duration(200)} style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot, styles.typingDot1]} />
          <Animated.View style={[styles.typingDot, styles.typingDot2]} />
          <Animated.View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
  },
  containerMe: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },

  // Bubble
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageBubble: {
    padding: 4,
    overflow: 'hidden',
  },

  // Text
  messageText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  messageTextMe: {
    color: colors.white,
  },

  // Image
  imageMessage: {
    width: MAX_BUBBLE_WIDTH - spacing.md,
    height: 200,
    borderRadius: borderRadius.md,
  },

  // Meta
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaMe: {
    justifyContent: 'flex-end',
  },
  metaOther: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.textTertiary,
  },

  // Typing Indicator
  typingContainer: {
    alignItems: 'flex-start',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  typingBubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
});

export default MessageBubble;
