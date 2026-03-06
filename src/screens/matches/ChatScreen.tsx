/**
 * ChatScreen
 *
 * Real-time chat conversation screen
 * Features message bubbles, keyboard handling, and image support
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Avatar } from '../../components/Avatar';
import { MessageBubble, TypingIndicator, Message } from '../../components/MessageBubble';
import { MessageInput } from '../../components/MessageInput';
import { colors, spacing, typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_MATCHES, MOCK_MESSAGES, getUserById } from '@data/mockData';

// ============================================
// TYPES
// ============================================

type ChatRouteParams = {
  Chat: {
    matchId: string;
    userId: string;
  };
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ChatRouteParams, 'Chat'>>();
  const { matchId, userId } = route.params || {};

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Get match and user data
  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  const otherUser = match?.matched_user || getUserById(userId);
  const currentUserId = 'current-user'; // Would come from auth context

  // Load messages and mark as read
  useEffect(() => {
    if (match?.conversation_id) {
      const conversationMessages = MOCK_MESSAGES.filter(
        (m) => m.conversation_id === match.conversation_id
      ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setMessages(conversationMessages);

      // Mark messages as read (in real app, call API here)
      // This updates the local state to show as read
      if (match.unread_count > 0) {
        match.unread_count = 0;
      }
    }
  }, [match]);

  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content: text,
        type: 'text',
        sender_id: currentUserId,
        status: 'sending',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [newMessage, ...prev]);

      // Simulate message being sent
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'sent' } : m))
        );
      }, 500);

      // Simulate typing and reply
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: `msg-${Date.now()}-reply`,
          content: 'Nghe hay đó! Bạn rảnh lúc nào đi chơi? 🎾',
          type: 'text',
          sender_id: userId,
          status: 'read',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [replyMessage, ...prev]);
      }, 3000);
    },
    [userId]
  );

  const handleAttachment = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        type: 'image',
        image_url: result.assets[0].uri,
        sender_id: currentUserId,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [newMessage, ...prev]);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'sent' } : m))
        );
      }, 1000);
    }
  }, []);

  const handleCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        type: 'image',
        image_url: result.assets[0].uri,
        sender_id: currentUserId,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [newMessage, ...prev]);
    }
  }, []);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isMe={item.sender_id === currentUserId}
      showTimestamp={index === 0 || index % 5 === 0}
      showStatus={item.sender_id === currentUserId}
      animationDelay={0}
    />
  );

  if (!otherUser) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.headerProfile, pressed && { opacity: 0.8 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
          >
            <Avatar
              size="sm"
              imageUrl={otherUser.avatar_urls[0]}
              name={otherUser.display_name}
              isOnline={otherUser.is_online}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{otherUser.display_name}</Text>
              <Text style={styles.headerStatus}>{otherUser.is_online ? 'Online' : 'Offline'}</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.moreButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
          />

          {/* Input */}
          <MessageInput
            onSend={handleSendMessage}
            onAttachment={handleAttachment}
            onCamera={handleCamera}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  headerInfo: {
    marginLeft: spacing.sm,
  },
  headerName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  headerStatus: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Messages
  messagesList: {
    paddingVertical: spacing.md,
  },
});

export default ChatScreen;
