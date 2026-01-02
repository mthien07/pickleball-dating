/**
 * Realtime Service
 *
 * Provides real-time subscription helpers for:
 * - New messages (Postgres changes)
 * - Typing indicators (Broadcast)
 * - Online presence (Presence)
 *
 * @see docs/references/supabase-realtime.md
 */

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// =====================================================
// POSTGRES CHANGES (Database Events)
// =====================================================

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (
  conversationId: string,
  onNewMessage: (message: any) => void
): RealtimeChannel => {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new);
      }
    )
    .subscribe();
};

/**
 * Subscribe to message status updates (read receipts)
 */
export const subscribeToMessageUpdates = (
  conversationId: string,
  onMessageUpdate: (message: any) => void
): RealtimeChannel => {
  return supabase
    .channel(`conversation:${conversationId}:updates`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessageUpdate(payload.new);
      }
    )
    .subscribe();
};

/**
 * Subscribe to new matches for a user
 */
export const subscribeToMatches = (
  userId: string,
  onNewMatch: (match: any) => void
): RealtimeChannel => {
  const channel = supabase.channel(`user:${userId}:matches`);

  // Listen to matches where user is user_id_1
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'matches',
      filter: `user_id_1=eq.${userId}`,
    },
    (payload) => onNewMatch(payload.new)
  );

  // Listen to matches where user is user_id_2
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'matches',
      filter: `user_id_2=eq.${userId}`,
    },
    (payload) => onNewMatch(payload.new)
  );

  channel.subscribe();

  return channel;
};

// =====================================================
// BROADCAST (Ephemeral Messages)
// =====================================================

/**
 * Send typing indicator
 */
export const sendTypingIndicator = (
  conversationId: string,
  userId: string,
  isTyping: boolean
): RealtimeChannel => {
  const channel = supabase.channel(`typing:${conversationId}`);

  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: userId, is_typing: isTyping },
  });

  return channel;
};

/**
 * Listen to typing indicators
 */
export const listenToTyping = (
  conversationId: string,
  onTyping: (data: { user_id: string; is_typing: boolean }) => void
): RealtimeChannel => {
  return supabase
    .channel(`typing:${conversationId}`)
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      onTyping(payload);
    })
    .subscribe();
};

// =====================================================
// PRESENCE (Track Online Users)
// =====================================================

/**
 * Track user's presence
 */
export const trackPresence = async (
  userId: string
): Promise<RealtimeChannel> => {
  const presenceChannel = supabase.channel('online-users');

  presenceChannel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      });
    }
  });

  return presenceChannel;
};

/**
 * Listen to presence changes
 */
export const listenToPresence = (
  onPresenceChange: (onlineUsers: any[]) => void
): RealtimeChannel => {
  const presenceChannel = supabase.channel('online-users');

  presenceChannel.on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    const onlineUsers = Object.values(state).flat();
    onPresenceChange(onlineUsers);
  });

  presenceChannel.subscribe();

  return presenceChannel;
};

// =====================================================
// HELPER: Unsubscribe from channel
// =====================================================

/**
 * Unsubscribe from a channel
 */
export const unsubscribeChannel = (channel: RealtimeChannel): void => {
  channel.unsubscribe();
};
