# Backend Integration Guide

**Version**: 1.0
**Created**: 2026-01-02
**Purpose**: Guide to integrate Supabase backend with React Native frontend

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Replace Mock Data](#4-replace-mock-data)
5. [Authentication Flow](#5-authentication-flow)
6. [Data Fetching Patterns](#6-data-fetching-patterns)
7. [Error Handling](#7-error-handling)
8. [Loading States](#8-loading-states)
9. [Optimistic UI Updates](#9-optimistic-ui-updates)
10. [Testing](#10-testing)

---

## 1. Overview

This guide shows how to replace mock data from `data/mockData.ts` with real API calls to Supabase.

**Integration Strategy**:
- ✅ Backend is ready (database, RLS, storage, functions)
- ✅ API services created (`src/services/api/`)
- 🔄 Replace mock imports with API calls
- 🔄 Add error handling & loading states
- 🔄 Implement real-time subscriptions
- 🔄 Test end-to-end flows

---

## 2. Prerequisites

### 2.1 Complete Backend Setup

Ensure you've completed `docs/SUPABASE_SETUP.md`:
- ✅ Supabase project created
- ✅ Database migrations run
- ✅ RLS policies enabled
- ✅ Storage buckets configured
- ✅ Auth providers enabled

### 2.2 Environment Variables

Create `.env` file from `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Restart Expo dev server after adding `.env`.

---

## 3. Installation

### 3.1 Install Dependencies

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### 3.2 Verify Installation

Test Supabase connection:

```typescript
import { supabase } from '@/services/supabase';

// In a useEffect
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log('Session:', data.session);
  });
}, []);
```

---

## 4. Replace Mock Data

### 4.1 Authentication Screens

#### Before (Mock):
```typescript
// screens/LoginScreen.tsx
import { MOCK_USERS } from '@/data/mockData';

const handleLogin = async (email: string, password: string) => {
  // Mock login
  const user = MOCK_USERS.find(u => u.email === email);
  if (user) {
    navigation.navigate('Home');
  }
};
```

#### After (Real API):
```typescript
import { signInWithEmail } from '@/services/api/auth.service';

const handleLogin = async (email: string, password: string) => {
  try {
    setLoading(true);
    const { user, session } = await signInWithEmail({ email, password });

    if (session) {
      navigation.navigate('Home');
    }
  } catch (error: any) {
    Alert.alert('Login Failed', error.message);
  } finally {
    setLoading(false);
  }
};
```

### 4.2 Profile Screen

#### Before (Mock):
```typescript
import { getCurrentUser } from '@/data/mockData';

const ProfileScreen = () => {
  const user = getCurrentUser();

  return <Text>{user.display_name}</Text>;
};
```

#### After (Real API with TanStack Query):
```typescript
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/services/api/profile.service';

const ProfileScreen = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading profile</Text>;
  if (!user) return <Text>No profile found</Text>;

  return <Text>{user.display_name}</Text>;
};
```

### 4.3 Swipe Screen

#### Before (Mock):
```typescript
import { getSwipeProfiles } from '@/data/mockData';

const [profiles, setProfiles] = useState(getSwipeProfiles());
```

#### After (Real API):
```typescript
import { supabase } from '@/services/supabase';

const fetchProfiles = async () => {
  const { data, error } = await supabase.rpc('get_swipe_profiles', {
    limit_count: 20,
    max_distance_km: 50,
  });

  if (error) throw error;
  return data;
};

const { data: profiles, isLoading } = useQuery({
  queryKey: ['swipe', 'profiles'],
  queryFn: fetchProfiles,
});
```

### 4.4 Chat Screen

#### Before (Mock):
```typescript
import { getMessagesByConversation } from '@/data/mockData';

const [messages, setMessages] = useState(
  getMessagesByConversation(conversationId)
);
```

#### After (Real API + Realtime):
```typescript
import { getConversationMessages, sendTextMessage } from '@/services/api/chat.service';
import { subscribeToMessages } from '@/services/realtime';

const ChatScreen = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);

  // Fetch initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const data = await getConversationMessages(conversationId);
      setMessages(data.reverse()); // Oldest first
    };
    loadMessages();
  }, [conversationId]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = subscribeToMessages(conversationId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => channel.unsubscribe();
  }, [conversationId]);

  const handleSend = async (text: string) => {
    await sendTextMessage(conversationId, text);
  };

  return <ChatUI messages={messages} onSend={handleSend} />;
};
```

---

## 5. Authentication Flow

### 5.1 AuthContext Architecture

Authentication is managed centrally via `AuthContext` with the following responsibilities:

**File**: `src/contexts/AuthContext.tsx`

```typescript
interface AuthContextType {
  isAuthenticated: boolean;      // Auth state (true/false)
  isLoading: boolean;            // Initial auth check in progress
  user: User | null;             // Supabase user object
  session: Session | null;       // Auth session
  profile: UserProfile | null;   // User profile from DB
  profileLoading: boolean;       // Profile fetch in progress
  profileError: Error | null;    // Profile load errors
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

**Key Design Pattern**: Profile loading is **non-blocking** to enable immediate navigation after auth. Profile errors are tracked separately via `profileError` state.

### 5.2 Authentication Flow with Navigation

```typescript
// 1. App startup - check session
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;  // Session check in progress
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

// 2. During session check
useEffect(() => {
  // Get initial session when app loads
  supabase.auth.getSession().then(({ data: { session } }) => {
    setAuthState(session);  // Sets isAuthenticated and isLoading

    // Load profile in background (non-blocking)
    if (session) {
      loadProfile().catch(err => console.error(err));
    }
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    setAuthState(session);
    if (session) {
      loadProfile().catch(err => console.error(err));
    }
  });
}, []);

// 3. Components can check profile status
const MyScreen = () => {
  const { profile, profileLoading, profileError } = useAuth();

  if (profileLoading) return <Skeleton />;
  if (profileError) return <ErrorMessage error={profileError} />;
  return <ProfileView user={profile} />;
};
```

### 5.3 Profile Completion Check

After login, screens should check profile completion status:

```typescript
// In profile-dependent screens
const { profile, profileError } = useAuth();

if (profileError) {
  // Surface error via UI
  Alert.alert('Profile Load Failed', profileError.message);
}

if (!profile?.profile_complete) {
  // Navigate to profile setup if needed
  navigation.navigate('ProfileSetup');
}
```

### 5.4 Helper Functions

**setAuthState()** - DRY pattern for setting authentication state:
- Sets session, user, isAuthenticated, isLoading based on session param
- Clears profile data when logging out
- Reduces code duplication across effect hooks

**loadProfile()** - Non-blocking background profile fetch:
- Called after session established
- Sets profileLoading state for UI feedback
- Surfaces profileError if fetch fails
- Does not block navigation or app functionality

---

## 6. Data Fetching Patterns

### 6.1 Setup TanStack Query

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
```

### 6.2 Query Pattern

```typescript
// Fetch data
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['courts', { maxDistance: 25 }],
  queryFn: () => fetchCourts({ maxDistance: 25 }),
});

// Mutation pattern (create/update/delete)
const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});
```

---

## 7. Error Handling

### 7.1 Create Error Boundary

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}
```

### 7.2 Handle API Errors

```typescript
const handleApiError = (error: any) => {
  // Supabase auth errors
  if (error.message === 'Invalid login credentials') {
    return 'Email or password is incorrect';
  }

  // Network errors
  if (error.message.includes('fetch')) {
    return 'Network error. Please check your connection';
  }

  // RLS policy errors
  if (error.code === '42501') {
    return 'You do not have permission to perform this action';
  }

  // Default
  return error.message || 'An unexpected error occurred';
};
```

---

## 8. Loading States

### 8.1 Global Loading Indicator

```typescript
// Store loading state globally
import create from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Use in API calls
const handleLogin = async () => {
  useLoadingStore.getState().setLoading(true);
  try {
    await signInWithEmail({ email, password });
  } finally {
    useLoadingStore.getState().setLoading(false);
  }
};
```

### 8.2 Skeleton Screens

```typescript
const ProfileScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return <ProfileSkeleton />; // Placeholder UI
  }

  return <ProfileView user={data} />;
};
```

---

## 9. Optimistic UI Updates

### 9.1 Optimistic Swipe

```typescript
const handleSwipeRight = async (userId: string) => {
  // Optimistically remove card
  setProfiles(prev => prev.filter(p => p.id !== userId));

  try {
    const { data } = await supabase
      .from('swipes')
      .insert({ swiped_id: userId, direction: 'right' })
      .select()
      .single();

    // Check if match
    if (data.is_match) {
      showMatchModal(data.match);
    }
  } catch (error) {
    // Rollback on error
    refetch();
  }
};
```

### 9.2 Optimistic Message Send

```typescript
const handleSend = async (text: string) => {
  const tempMessage = {
    id: `temp-${Date.now()}`,
    content: text,
    sender_id: currentUserId,
    status: 'sending',
    created_at: new Date().toISOString(),
  };

  // Add to UI immediately
  setMessages(prev => [...prev, tempMessage]);

  try {
    const message = await sendTextMessage(conversationId, text);

    // Replace temp with real message
    setMessages(prev =>
      prev.map(m => (m.id === tempMessage.id ? message : m))
    );
  } catch (error) {
    // Mark as failed
    setMessages(prev =>
      prev.map(m =>
        m.id === tempMessage.id ? { ...m, status: 'failed' } : m
      )
    );
  }
};
```

---

## 10. Testing

### 10.1 Test Authentication

```typescript
// Test signup
await signUpWithEmail({
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User',
});

// Test login
const { session } = await signInWithEmail({
  email: 'test@example.com',
  password: 'password123',
});
expect(session).toBeTruthy();

// Test logout
await signOut();
const { data: { session: afterLogout } } = await supabase.auth.getSession();
expect(afterLogout).toBeNull();
```

### 10.2 Test Data Flow

```typescript
// Create profile
const profile = await createProfile({
  displayName: 'Test User',
  dateOfBirth: '1995-01-01',
  gender: 'male',
  avatarUrls: ['https://...'],
  skillLevel: 'intermediate',
  playStyle: 'casual',
  lookingFor: ['opponent'],
});

expect(profile.display_name).toBe('Test User');

// Fetch profile
const fetchedProfile = await getMyProfile();
expect(fetchedProfile.id).toBe(profile.id);
```

---

## Checklist: Backend Integration

- [ ] `.env` configured with Supabase credentials
- [ ] Supabase client initialized (`src/services/supabase.ts`)
- [ ] Auth flow integrated (signup, login, logout)
- [ ] Profile creation/update working
- [ ] Mock data imports replaced with API calls
- [ ] Loading states added to all screens
- [ ] Error handling implemented
- [ ] TanStack Query setup for data fetching
- [ ] Realtime subscriptions working (messages, matches)
- [ ] Storage uploads working (profile photos)
- [ ] All screens functional end-to-end
- [ ] Tested on iOS + Android

---

## Resources

- [Supabase React Native Docs](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- `docs/references/supabase-*.md` - Local reference guides
- `design/api/endpoints.md` - API endpoints spec

---

**Document End**
