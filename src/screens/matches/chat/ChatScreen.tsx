/**
 * ChatScreen
 *
 * Real-time chat conversation screen with simulated messaging features:
 * - Diverse auto-replies (10 contextual Vietnamese messages)
 * - Periodic background messages simulating real-time activity
 * - Message status progression: sending → sent → delivered → read
 * - Online/offline status simulation
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Avatar } from '../../../components/Avatar';
import { MessageBubble, TypingIndicator, Message } from '../../../components/MessageBubble';
import { MessageInput } from '../../../components/MessageInput';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { MOCK_MATCHES, MOCK_MESSAGES, getUserById } from '@data/mockData';
import { createStyles } from './chat-screen-styles';
import { getRandomReply } from './chat-mock-replies';

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
// CONSTANTS
// ============================================

const CURRENT_USER_ID = 'current-user';
const MAX_AUTO_MESSAGES = 3;
const AUTO_MSG_INTERVAL_MIN = 20000;
const AUTO_MSG_INTERVAL_RANGE = 20000;
const STATUS_SENT_DELAY = 500;
const STATUS_DELIVERED_DELAY = 2000;
const STATUS_READ_DELAY = 5000;
const TYPING_BEFORE_REPLY = 1000;
const TYPING_DURATION = 2000;
const ONLINE_CHECK_INTERVAL = 60000;
const OFFLINE_DURATION_MIN = 10000;
const OFFLINE_DURATION_RANGE = 10000;

// ============================================
// SCREEN COMPONENT
// ============================================

export const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ChatRouteParams, 'Chat'>>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { matchId, userId } = route.params || {};

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(true);

  // Get match and user data
  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  const otherUser = match?.matched_user || getUserById(userId);

  const storageKey = `chat_messages_${matchId || userId}`;

  // ---- Message status update helper ----
  const updateMessageStatus = useCallback((id: string, status: Message['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

  // ---- Load persisted + mock messages on mount ----
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const persisted: Message[] = stored ? JSON.parse(stored) : [];

        const mockMessages = match?.conversation_id
          ? MOCK_MESSAGES.filter((m) => m.conversation_id === match.conversation_id).sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
          : [];

        const merged = [...persisted];
        for (const m of mockMessages) {
          if (!merged.find((p) => p.id === m.id)) {
            merged.push(m);
          }
        }
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setMessages(merged);

        if (match && match.unread_count > 0) {
          match.unread_count = 0;
        }
      } catch {
        if (match?.conversation_id) {
          const conversationMessages = MOCK_MESSAGES.filter(
            (m) => m.conversation_id === match.conversation_id
          ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setMessages(conversationMessages);
        }
      }
    };
    loadMessages();
  }, [matchId, userId]);

  // ---- Persist user-sent messages ----
  const persistMessages = useCallback(
    async (msgs: Message[]) => {
      try {
        const userMessages = msgs.filter((m) => m.sender_id === CURRENT_USER_ID);
        await AsyncStorage.setItem(storageKey, JSON.stringify(userMessages));
      } catch {
        // ignore storage errors
      }
    },
    [storageKey]
  );

  // ---- Periodic simulated messages (mock real-time) ----
  useEffect(() => {
    let autoMsgCount = 0;

    const interval = setInterval(
      () => {
        if (autoMsgCount >= MAX_AUTO_MESSAGES) {
          return;
        }

        setMessages((prev) => {
          // Only auto-message if the current user sent the last message
          if (prev.length === 0 || prev[0].sender_id !== CURRENT_USER_ID) {
            return prev;
          }

          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const reply = getRandomReply();
            const msg: Message = {
              id: `auto-${Date.now()}`,
              content: reply,
              type: 'text',
              sender_id: userId,
              status: 'read',
              created_at: new Date().toISOString(),
            };
            setMessages((innerPrev) => [msg, ...innerPrev]);
            autoMsgCount += 1;
          }, TYPING_DURATION);

          return prev;
        });
      },
      AUTO_MSG_INTERVAL_MIN + Math.random() * AUTO_MSG_INTERVAL_RANGE
    );

    return () => clearInterval(interval);
  }, [userId]);

  // ---- Online status simulation ----
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly go offline for 10-20s then come back
      const goOffline = Math.random() < 0.5;
      if (!goOffline) {
        return;
      }

      setIsOtherUserOnline(false);
      const offlineDuration = OFFLINE_DURATION_MIN + Math.random() * OFFLINE_DURATION_RANGE;
      setTimeout(() => setIsOtherUserOnline(true), offlineDuration);
    }, ONLINE_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // ---- Send message with status progression ----
  const handleSendMessage = useCallback(
    (text: string) => {
      const id = `msg-${Date.now()}`;
      const newMessage: Message = {
        id,
        content: text,
        type: 'text',
        sender_id: CURRENT_USER_ID,
        status: 'sending',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [newMessage, ...prev];
        persistMessages(updated);
        return updated;
      });

      // Status progression: sending → sent → delivered → read
      setTimeout(() => updateMessageStatus(id, 'sent'), STATUS_SENT_DELAY);
      setTimeout(() => updateMessageStatus(id, 'delivered'), STATUS_DELIVERED_DELAY);
      setTimeout(() => updateMessageStatus(id, 'read'), STATUS_READ_DELAY);

      // Auto-reply
      setTimeout(() => setIsTyping(true), TYPING_BEFORE_REPLY);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: `msg-${Date.now()}-reply`,
          content: getRandomReply(),
          type: 'text',
          sender_id: userId,
          status: 'read',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [replyMessage, ...prev]);
      }, TYPING_BEFORE_REPLY + TYPING_DURATION);
    },
    [userId, updateMessageStatus, persistMessages]
  );

  // ---- Image attachment ----
  const handleAttachment = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const id = `msg-${Date.now()}`;
      const newMessage: Message = {
        id,
        type: 'image',
        image_url: result.assets[0].uri,
        sender_id: CURRENT_USER_ID,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [newMessage, ...prev]);
      setTimeout(() => updateMessageStatus(id, 'sent'), STATUS_DELIVERED_DELAY);
    }
  }, [updateMessageStatus]);

  // ---- Camera ----
  const handleCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });

    if (!result.canceled && result.assets[0]) {
      const id = `msg-${Date.now()}`;
      const newMessage: Message = {
        id,
        type: 'image',
        image_url: result.assets[0].uri,
        sender_id: CURRENT_USER_ID,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [newMessage, ...prev]);
      setTimeout(() => updateMessageStatus(id, 'sent'), STATUS_DELIVERED_DELAY);
    }
  }, [updateMessageStatus]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isMe={item.sender_id === CURRENT_USER_ID}
      showTimestamp={index === 0 || index % 5 === 0}
      showStatus={item.sender_id === CURRENT_USER_ID}
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

  const statusText = isOtherUserOnline ? 'Online' : 'Offline';
  const statusStyle = isOtherUserOnline ? styles.onlineText : styles.offlineText;

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
              isOnline={isOtherUserOnline}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{otherUser.display_name}</Text>
              <Text style={statusStyle}>{statusText}</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.moreButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() =>
              Alert.alert(otherUser?.display_name ?? 'Chat', undefined, [
                { text: 'Chặn người dùng', style: 'destructive', onPress: () => {} },
                { text: 'Báo cáo', style: 'destructive', onPress: () => {} },
                { text: 'Xóa cuộc trò chuyện', style: 'destructive', onPress: () => {} },
                { text: 'Hủy', style: 'cancel' },
              ])
            }
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

export default ChatScreen;
