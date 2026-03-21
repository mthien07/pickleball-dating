/**
 * ChatScreen
 *
 * Dual-mode chat:
 * - Real mode: Supabase real-time via useChatMessages hook (when authenticated + conversationId present)
 * - Mock mode: AsyncStorage + simulated replies for prototype testing
 *
 * Features:
 * - Typing indicators (broadcast to Supabase in real mode, simulated in mock mode)
 * - Message status progression: sending → sent → delivered → read
 * - Online/offline status display
 * - Image/camera attachment
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
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAuthStore } from '../../../stores/auth-store';
import { useChatMessages } from '../../../hooks/use-chat-messages';
import { sendTypingIndicator } from '../../../services/realtime';
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
    conversationId?: string;
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
const TYPING_STOP_DEBOUNCE = 2000;

// ============================================
// MOCK MODE HOOK (extracted for clarity)
// ============================================

const useMockChat = (
  matchId: string | undefined,
  userId: string | undefined,
  storageKey: string
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const updateMessageStatus = useCallback((id: string, status: Message['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

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

  // Load persisted + mock messages on mount
  useEffect(() => {
    const match = MOCK_MATCHES.find((m) => m.id === matchId);
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
          const fallback = MOCK_MESSAGES.filter(
            (m) => m.conversation_id === match.conversation_id
          ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setMessages(fallback);
        }
      }
    };
    loadMessages();
  }, [matchId, storageKey]);

  // Periodic simulated messages — side effects run outside setMessages updater
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let autoMsgCount = 0;
    const interval = setInterval(
      () => {
        if (autoMsgCount >= MAX_AUTO_MESSAGES) {
          return;
        }
        const prev = messagesRef.current;
        if (prev.length === 0 || prev[0].sender_id !== CURRENT_USER_ID) {
          return;
        }
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const msg: Message = {
            id: `auto-${Date.now()}`,
            content: getRandomReply(),
            type: 'text',
            sender_id: userId ?? 'other',
            status: 'read',
            created_at: new Date().toISOString(),
          };
          setMessages((innerPrev) => [msg, ...innerPrev]);
          autoMsgCount += 1;
        }, TYPING_DURATION);
      },
      AUTO_MSG_INTERVAL_MIN + Math.random() * AUTO_MSG_INTERVAL_RANGE
    );
    return () => clearInterval(interval);
  }, [userId]);

  const sendMessage = useCallback(
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
      setTimeout(() => updateMessageStatus(id, 'sent'), STATUS_SENT_DELAY);
      setTimeout(() => updateMessageStatus(id, 'delivered'), STATUS_DELIVERED_DELAY);
      setTimeout(() => updateMessageStatus(id, 'read'), STATUS_READ_DELAY);
      // Auto-reply
      setTimeout(() => setIsTyping(true), TYPING_BEFORE_REPLY);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: `msg-${Date.now()}-reply`,
          content: getRandomReply(),
          type: 'text',
          sender_id: userId ?? 'other',
          status: 'read',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [reply, ...prev]);
      }, TYPING_BEFORE_REPLY + TYPING_DURATION);
    },
    [userId, updateMessageStatus, persistMessages]
  );

  const sendImage = useCallback(
    (imageUrl: string) => {
      const id = `msg-${Date.now()}`;
      const newMessage: Message = {
        id,
        type: 'image',
        image_url: imageUrl,
        sender_id: CURRENT_USER_ID,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [newMessage, ...prev]);
      setTimeout(() => updateMessageStatus(id, 'sent'), STATUS_DELIVERED_DELAY);
    },
    [updateMessageStatus]
  );

  return { messages, isTyping, sendMessage, sendImage };
};

// ============================================
// SCREEN COMPONENT
// ============================================

const ChatScreenComponent = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ChatRouteParams, 'Chat'>>();
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { matchId, userId, conversationId: routeConversationId } = route.params || {};
  // Use Zustand store directly - no provider needed, safe in tests
  const authUser = useAuthStore((s) => s.user);

  const flatListRef = useRef<FlatList>(null);
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(true);

  // Determine mode: real Supabase when user is authenticated + conversationId present
  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  const otherUser = match?.matched_user || getUserById(userId);
  const storageKey = `chat_messages_${matchId || userId}`;

  // Use match's conversation_id or route param
  const conversationId = routeConversationId ?? match?.conversation_id ?? '';
  const isRealMode = !!authUser?.id && !!conversationId;

  // Real mode: Supabase hook
  const supaChat = useChatMessages(
    isRealMode ? conversationId : '',
    isRealMode ? authUser!.id! : '',
    isRealMode
  );

  // Mock mode: local state hook
  const mockChat = useMockChat(matchId, userId, storageKey);

  // Unified interface
  const messages = isRealMode ? supaChat.messages : mockChat.messages;
  const isTyping = isRealMode ? supaChat.isTyping : mockChat.isTyping;

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isRealMode) {
        await supaChat.sendMessage(text);
      } else {
        mockChat.sendMessage(text);
      }
    },
    [isRealMode, supaChat, mockChat]
  );

  // Typing indicator broadcast in real mode
  const handleTypingChange = useCallback(
    (hasText: boolean) => {
      if (!isRealMode || !authUser?.id) {
        return;
      }
      sendTypingIndicator(conversationId, authUser!.id!, hasText);
      if (hasText) {
        // Auto-stop typing after debounce
        if (typingStopTimer.current) {
          clearTimeout(typingStopTimer.current);
        }
        typingStopTimer.current = setTimeout(() => {
          sendTypingIndicator(conversationId, authUser!.id!, false);
        }, TYPING_STOP_DEBOUNCE);
      }
    },
    [isRealMode, conversationId, authUser?.id]
  );

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingStopTimer.current) {
        clearTimeout(typingStopTimer.current);
      }
    };
  }, []);

  // Online status simulation (mock mode only)
  useEffect(() => {
    if (isRealMode) {
      return;
    }
    const interval = setInterval(() => {
      const goOffline = Math.random() < 0.5;
      if (!goOffline) {
        return;
      }
      setIsOtherUserOnline(false);
      const offlineDuration = OFFLINE_DURATION_MIN + Math.random() * OFFLINE_DURATION_RANGE;
      setTimeout(() => setIsOtherUserOnline(true), offlineDuration);
    }, ONLINE_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [isRealMode]);

  // Image attachment
  const handleAttachment = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (isRealMode) {
        await supaChat.sendImage(uri);
      } else {
        mockChat.sendImage(uri);
      }
    }
  }, [isRealMode, supaChat, mockChat]);

  // Camera
  const handleCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (isRealMode) {
        await supaChat.sendImage(uri);
      } else {
        mockChat.sendImage(uri);
      }
    }
  }, [isRealMode, supaChat, mockChat]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isMe={item.sender_id === (isRealMode ? authUser!.id : CURRENT_USER_ID)}
      showTimestamp={index === 0 || index % 5 === 0}
      showStatus={item.sender_id === (isRealMode ? authUser!.id : CURRENT_USER_ID)}
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
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
            onChangeText={handleTypingChange}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export const ChatScreen = React.memo(ChatScreenComponent);
export default ChatScreen;
