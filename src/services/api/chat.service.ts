/**
 * Chat/Messaging Service
 *
 * Handles messaging operations:
 * - Send text/image messages
 * - Get conversation messages
 * - Mark messages as read
 * - Get unread count
 */

import { supabase } from '../supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image';
  image_url?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  created_at: string;
  read_at?: string;
}

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (
  conversationId: string,
  limit: number = 30,
  offset: number = 0
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data as Message[];
};

/**
 * Send text message
 */
export const sendTextMessage = async (
  conversationId: string,
  content: string
): Promise<Message> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      message_type: 'text',
      status: 'sent',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Message;
};

/**
 * Send image message
 */
export const sendImageMessage = async (
  conversationId: string,
  imageUrl: string
): Promise<Message> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message_type: 'image',
      image_url: imageUrl,
      status: 'sent',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Message;
};

/**
 * Mark messages as read
 */
export const markMessagesRead = async (conversationId: string): Promise<number> => {
  const { data, error } = await supabase.rpc('mark_messages_read', {
    conversation_id_param: conversationId,
  });

  if (error) {
    throw error;
  }

  return data as number;
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (): Promise<number> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .neq('sender_id', user.id)
    .eq('status', 'sent');

  if (error) {
    throw error;
  }

  return count || 0;
};
