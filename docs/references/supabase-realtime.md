# Supabase Realtime in React Native (2025)

**Source**: [Supabase Realtime React Native](https://www.restack.io/docs/supabase-knowledge-supabase-realtime-react-native) | [React Native Supabase Migration Guide](https://medium.com/@Amanda10/react-native-supabase-in-2025-the-no-drama-migration-guide-bbce7ac6dfea)

**Last Updated**: 2026-01-02

---

## Overview

Supabase Realtime allows you to listen to database changes, broadcast messages, and track presence in real-time - all powered by PostgreSQL's logical replication.

**Features**:
- **Postgres Changes**: Listen to INSERT, UPDATE, DELETE on tables
- **Broadcast**: Send ephemeral messages (typing indicators, etc.)
- **Presence**: Track who's online in real-time

---

## Setup

### 1. Enable Realtime on Tables

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Enable realtime for tables you want to subscribe to (e.g., `messages`, `matches`)

### 2. Client Configuration

Realtime is already configured when you create the Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit
    },
  },
});
```

---

## Postgres Changes (Database Events)

### Subscribe to INSERT

Listen for new messages in a conversation:

```typescript
const subscribeToMessages = (conversationId: string, callback: (message: any) => void) => {
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
        console.log('New message:', payload.new);
        callback(payload.new);
      }
    )
    .subscribe();
};
```

**Usage**:
```typescript
const subscription = subscribeToMessages('conv-uuid', (newMessage) => {
  setMessages(prev => [...prev, newMessage]);
});

// Cleanup
subscription.unsubscribe();
```

---

### Subscribe to UPDATE

Listen for message status changes (read receipts):

```typescript
supabase
  .channel(`conversation:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      console.log('Message updated:', payload.new.status);
      // Update message status in UI
    }
  )
  .subscribe();
```

---

### Subscribe to All Events

Listen to INSERT, UPDATE, DELETE:

```typescript
supabase
  .channel('all-messages')
  .on(
    'postgres_changes',
    {
      event: '*', // All events
      schema: 'public',
      table: 'messages',
    },
    (payload) => {
      console.log('Event:', payload.eventType);
      console.log('Old:', payload.old);
      console.log('New:', payload.new);
    }
  )
  .subscribe();
```

---

### Multiple Filters on Same Channel

Listen to matches for a specific user:

```typescript
const subscribeToMatches = (userId: string, callback: (match: any) => void) => {
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
    (payload) => callback(payload.new)
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
    (payload) => callback(payload.new)
  );

  channel.subscribe();

  return channel;
};
```

---

## Broadcast (Ephemeral Messages)

Send and receive messages without saving to database (e.g., typing indicators).

### Send Broadcast

```typescript
const sendTypingIndicator = (conversationId: string, userId: string, isTyping: boolean) => {
  const channel = supabase.channel(`typing:${conversationId}`);

  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: userId, is_typing: isTyping },
  });

  return channel;
};
```

### Listen to Broadcast

```typescript
const listenToTyping = (conversationId: string, callback: (data: any) => void) => {
  return supabase
    .channel(`typing:${conversationId}`)
    .on('broadcast', { event: 'typing' }, (payload) => {
      console.log('User typing:', payload.payload);
      callback(payload.payload);
    })
    .subscribe();
};
```

**Full Example**:
```typescript
// Component
const [otherUserTyping, setOtherUserTyping] = useState(false);

useEffect(() => {
  const channel = supabase.channel(`typing:${conversationId}`);

  // Listen
  channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
    if (payload.user_id !== currentUserId) {
      setOtherUserTyping(payload.is_typing);
    }
  }).subscribe();

  // Send when user types
  const handleTyping = () => {
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId, is_typing: true },
    });
  };

  return () => {
    channel.unsubscribe();
  };
}, [conversationId]);
```

---

## Presence (Track Online Users)

Track which users are currently online/active.

### Track Your Presence

```typescript
const trackPresence = async (userId: string) => {
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
```

### Listen to Presence Changes

```typescript
const listenToPresence = (callback: (onlineUsers: any[]) => void) => {
  const presenceChannel = supabase.channel('online-users');

  presenceChannel.on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    const onlineUsers = Object.values(state).flat();
    console.log('Online users:', onlineUsers);
    callback(onlineUsers);
  });

  presenceChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
    console.log('User joined:', newPresences);
  });

  presenceChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
    console.log('User left:', leftPresences);
  });

  presenceChannel.subscribe();

  return presenceChannel;
};
```

---

## React Native Best Practices

### 1. Handle Stale Closures with useRef

**Problem**: React state doesn't update properly inside subscription callbacks.

❌ **Bad**:
```typescript
const [messages, setMessages] = useState([]);

useEffect(() => {
  const subscription = supabase
    .channel('messages')
    .on('postgres_changes', { ... }, (payload) => {
      // ❌ 'messages' is stale here!
      setMessages([...messages, payload.new]);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

✅ **Good**:
```typescript
const [messages, setMessages] = useState([]);
const messagesRef = useRef(messages);

useEffect(() => {
  messagesRef.current = messages;
}, [messages]);

useEffect(() => {
  const subscription = supabase
    .channel('messages')
    .on('postgres_changes', { ... }, (payload) => {
      // ✅ Use ref to get current state
      setMessages([...messagesRef.current, payload.new]);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

**Better**: Use functional setState:
```typescript
.on('postgres_changes', { ... }, (payload) => {
  setMessages(prev => [...prev, payload.new]);
})
```

---

### 2. Unsubscribe on Component Unmount

Always clean up subscriptions to prevent memory leaks:

```typescript
useEffect(() => {
  const channel = supabase.channel('my-channel');
  channel.on(...).subscribe();

  return () => {
    channel.unsubscribe();
  };
}, []);
```

---

### 3. Subscribe Sparingly

❌ **Bad**: Subscribe to entire table
```typescript
// This subscribes to ALL messages in the database!
supabase.channel('all-messages').on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'messages' },
  callback
).subscribe();
```

✅ **Good**: Use filters to narrow down subscriptions
```typescript
// Only subscribe to messages in current conversation
supabase.channel('my-conversation').on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`,
  },
  callback
).subscribe();
```

---

### 4. Debounce Rapid Updates

For fast-updating data (e.g., typing indicators):

```typescript
import { debounce } from 'lodash';

const sendTyping = debounce((isTyping: boolean) => {
  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: currentUserId, is_typing: isTyping },
  });
}, 300);
```

---

### 5. Use Single Channel for Related Events

Instead of multiple channels:
```typescript
// ❌ Bad: Multiple channels
const messagesChannel = supabase.channel('messages');
const typingChannel = supabase.channel('typing');
const presenceChannel = supabase.channel('presence');
```

Use one channel:
```typescript
// ✅ Good: Single channel
const conversationChannel = supabase.channel(`conversation:${conversationId}`);

conversationChannel
  .on('postgres_changes', { event: 'INSERT', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, handleNewMessage)
  .on('broadcast', { event: 'typing' }, handleTyping)
  .on('presence', { event: 'sync' }, handlePresence)
  .subscribe();
```

---

## Complete Example: Chat Screen

```typescript
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/services/supabase';

function ChatScreen({ conversationId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    // Create channel
    const channel = supabase.channel(`conversation:${conversationId}`);

    // Listen to new messages
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    );

    // Listen to message updates (read receipts)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        setMessages(prev =>
          prev.map(msg => (msg.id === payload.new.id ? payload.new : msg))
        );
      }
    );

    // Listen to typing indicators
    channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.user_id !== currentUserId) {
        setTyping(payload.is_typing);
      }
    });

    // Subscribe
    channel.subscribe();

    channelRef.current = channel;

    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  const sendTypingIndicator = (isTyping: boolean) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId, is_typing: isTyping },
    });
  };

  return (
    <View>
      {/* Messages UI */}
      {typing && <Text>Other user is typing...</Text>}
      <TextInput
        onFocus={() => sendTypingIndicator(true)}
        onBlur={() => sendTypingIndicator(false)}
      />
    </View>
  );
}
```

---

## Performance Tips

1. **Limit subscriptions**: Only subscribe to what you need
2. **Use filters**: Always filter by relevant IDs
3. **Unsubscribe properly**: Prevent memory leaks
4. **Debounce broadcasts**: Don't spam typing indicators
5. **Batch state updates**: Use functional setState

---

## Sources

- [Supabase Realtime in React Native](https://www.restack.io/docs/supabase-knowledge-supabase-realtime-react-native)
- [React Native → Supabase in 2025: The No-Drama Migration Guide](https://medium.com/@Amanda10/react-native-supabase-in-2025-the-no-drama-migration-guide-bbce7ac6dfea)
- [Supabase From Super Base! With a Real Time ChatRoom App!](https://medium.com/@itsuki.enjoy/supabase-from-super-base-with-a-real-time-chatroom-app-21ce7c552ae8)
- [Using Supabase - Expo Documentation](https://docs.expo.dev/guides/using-supabase/)
