import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { styles } from './message-bubble-styles';

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

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showTimestamp = false,
  showStatus = true,
  onImagePress,
  animationDelay = 0,
}) => {
  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

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

      <View style={[styles.meta, isMe ? styles.metaMe : styles.metaOther]}>
        {showTimestamp && <Text style={styles.timestamp}>{formatTime(message.created_at)}</Text>}
        {showStatus && isMe && <StatusIcon status={message.status} />}
      </View>
    </Animated.View>
  );
};

export default MessageBubble;
