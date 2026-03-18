/**
 * useChatMessages Hook
 *
 * Encapsulates Supabase real-time chat logic:
 * - Load initial messages from Supabase
 * - Subscribe to new messages, status updates, and typing indicators
 * - Optimistic updates for sent messages
 */

import { useState, useEffect, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  getConversationMessages,
  sendTextMessage,
  sendImageMessage,
} from '../services/api/chat.service';
import type { Message as ServiceMessage } from '../services/api/chat.service';
import {
  subscribeToMessages,
  subscribeToMessageUpdates,
  listenToTyping,
  unsubscribeChannel,
} from '../services/realtime';
import type { Message as UIMessage } from '../components/MessageBubble';

// -------------------------------------------------------
// Type adapter: chat.service Message → UI Message
// -------------------------------------------------------

const toUIMessage = (m: ServiceMessage): UIMessage => ({
  id: m.id,
  content: m.content,
  type: m.message_type === 'image' ? 'image' : 'text',
  image_url: m.image_url,
  sender_id: m.sender_id,
  status: m.status,
  created_at: m.created_at,
});

// -------------------------------------------------------
// Hook interface
// -------------------------------------------------------

export interface UseChatMessagesReturn {
  messages: UIMessage[];
  isLoading: boolean;
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  sendImage: (imageUrl: string) => Promise<void>;
}

// -------------------------------------------------------
// Hook
// -------------------------------------------------------

export const useChatMessages = (
  conversationId: string,
  currentUserId: string,
  enabled: boolean = true
): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    try {
      const msgs = await getConversationMessages(conversationId);
      setMessages(msgs.map(toUIMessage));
    } catch (error) {
      console.error('[useChatMessages] Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, enabled]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Subscribe to new messages from other users
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const channel = subscribeToMessages(conversationId, (rawMsg) => {
      const msg = rawMsg as unknown as ServiceMessage;
      if (msg.sender_id !== currentUserId) {
        setMessages((prev) => [toUIMessage(msg), ...prev]);
      }
    });
    return () => unsubscribeChannel(channel);
  }, [conversationId, currentUserId, enabled]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!enabled) {
      return;
    }
    let typingTimeout: ReturnType<typeof setTimeout>;
    const channel = listenToTyping(conversationId, (data) => {
      if (data.user_id !== currentUserId) {
        setIsTyping(data.is_typing);
        if (data.is_typing) {
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => setIsTyping(false), 3000);
        }
      }
    });
    return () => {
      clearTimeout(typingTimeout);
      unsubscribeChannel(channel);
    };
  }, [conversationId, currentUserId, enabled]);

  // Subscribe to message status updates (read receipts)
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const channel = subscribeToMessageUpdates(conversationId, (rawMsg) => {
      const updated = rawMsg as unknown as ServiceMessage;
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, ...toUIMessage(updated) } : m))
      );
    });
    return () => unsubscribeChannel(channel);
  }, [conversationId, enabled]);

  // Send text message with optimistic update
  const sendMessage = useCallback(
    async (text: string) => {
      const tempId = `temp-${Date.now()}`;
      const tempMsg: UIMessage = {
        id: tempId,
        content: text,
        type: 'text',
        sender_id: currentUserId,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [tempMsg, ...prev]);

      try {
        const sent = await sendTextMessage(conversationId, text);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? toUIMessage(sent) : m)));
      } catch (error) {
        console.error('[useChatMessages] sendMessage failed:', error);
        // Remove failed message so user can retry without stale 'sending' state
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [conversationId, currentUserId]
  );

  // Send image message with optimistic update
  const sendImage = useCallback(
    async (imageUrl: string) => {
      const tempId = `temp-img-${Date.now()}`;
      const tempMsg: UIMessage = {
        id: tempId,
        type: 'image',
        image_url: imageUrl,
        sender_id: currentUserId,
        status: 'sending',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [tempMsg, ...prev]);

      try {
        const sent = await sendImageMessage(conversationId, imageUrl);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? toUIMessage(sent) : m)));
      } catch (error) {
        console.error('[useChatMessages] sendImage failed:', error);
        // Remove failed message so user can retry without stale 'sending' state
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [conversationId, currentUserId]
  );

  return { messages, isLoading, isTyping, sendMessage, sendImage };
};
