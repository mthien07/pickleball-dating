# Supabase React Native Setup Guide (2025)

**Source**: [Supabase Auth with React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native) | [Expo React Native Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

**Last Updated**: 2026-01-02

---

## Installation

Navigate to your Expo app and install required dependencies:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

**Required Packages**:
- `@supabase/supabase-js` - Supabase client library
- `@react-native-async-storage/async-storage` - Secure session storage
- `react-native-url-polyfill` - URL polyfill for React Native

---

## Environment Configuration

Create `.env` file in project root:

```bash
# Expo requires EXPO_PUBLIC_ prefix for client-accessible variables
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**:
- Environment variables MUST be prefixed with `EXPO_PUBLIC_` to be accessible in Expo apps
- These variables are SAFE to expose since Supabase has Row Level Security (RLS) enabled
- Get these values from Supabase Dashboard → Settings → API

---

## Client Initialization

Create `src/services/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native (no browser URL)
  },
});
```

**Key Options**:
- `storage: AsyncStorage` - Use React Native's AsyncStorage for session persistence
- `autoRefreshToken: true` - Automatically refresh expired tokens
- `persistSession: true` - Persist session across app restarts
- `detectSessionInUrl: false` - Disable browser-only URL session detection

---

## Latest SDK Information

**Supabase-js Version**: Latest (as of Dec 2025)

**Key Features**:
- Unified client for Database, Auth, Realtime, Storage, Edge Functions
- TypeScript support with auto-generated types
- React Native polyfills included
- Optimized for mobile performance

**Breaking Changes** (2025):
- Supabase is changing the way keys work for improved security
- Old `service_role` key is being renamed to `secret` key
- Anon key renamed to `public` key (for new projects)

---

## Authentication Example

### Email/Password Login

```typescript
async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### Session Management

```typescript
// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user);
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

## Database Queries Example

```typescript
// Select data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert({ display_name: 'John Doe', email: 'john@example.com' });

// Update data
const { data, error } = await supabase
  .from('users')
  .update({ bio: 'Updated bio' })
  .eq('id', userId);

// Delete data
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

---

## Sources

- [Use Supabase Auth with React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Build a User Management App with Expo React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Using Supabase - Expo Documentation](https://docs.expo.dev/guides/using-supabase/)
- [Use Supabase with Expo React Native](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
