# ⚡ Quick Start Guide
## Get PickleBall Dating App Running in 10 Minutes

**Fast-track setup** for developers who want to start coding immediately.

---

## 📋 Prerequisites Check

Before starting, make sure you have:

```bash
# Check Node.js (need v18+)
node --version  # Should show v18.x.x or higher

# Check npm
npm --version   # Should show v9.x.x or higher

# Check Git
git --version
```

**Don't have Node.js?**
- macOS: `brew install node@18`
- Windows: Download from https://nodejs.org
- Linux: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

---

## 🚀 Step 1: Clone & Install (2 minutes)

```bash
# 1. Clone repository
git clone https://github.com/mthien07/pickleball-dating.git
cd pickleball-dating

# 2. Install Expo CLI globally
npm install -g expo-cli eas-cli

# 3. Initialize Expo project
npx create-expo-app@latest . --template expo-template-blank-typescript

# Answer prompts:
# "Directory not empty, continue?" → YES
# This will create app.json, package.json, and App.tsx

# 4. Install all dependencies
npm install @supabase/supabase-js \
  @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  zustand @tanstack/react-query \
  react-hook-form zod @hookform/resolvers \
  react-native-reanimated react-native-gesture-handler \
  react-native-paper \
  date-fns

# Install Expo managed packages
npx expo install expo-image expo-image-picker expo-secure-store @react-native-async-storage/async-storage @expo/vector-icons expo-constants

# Install dev dependencies
npm install --save-dev @types/react @types/react-native typescript
```

---

## ⚙️ Step 2: Configure Project (3 minutes)

### A. Update app.json

Replace content of `app.json` with:

```json
{
  "expo": {
    "name": "PickleBall Dating",
    "slug": "pickleball-dating",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.pickleballdating"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourname.pickleballdating"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "will-be-generated-later"
      }
    }
  }
}
```

### B. Configure Babel for Reanimated

Create `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### C. Setup Environment Variables

```bash
# .env file already created with your Supabase URL
# Just need to add Supabase anon key

# Open .env file and update:
# EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-actual-anon-key-here>
```

To get your Supabase anon key:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API → Copy "anon public" key
4. Paste into `.env` file

---

## 🗄️ Step 3: Setup Supabase Backend (3 minutes)

### A. Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Run each migration file:

```bash
# Run these in order:
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_functions.sql
supabase/migrations/004_seed_data.sql
```

Copy content from each file and click "Run" in SQL Editor.

### B. Setup Storage Buckets

In SQL Editor, run:
```bash
# Content from:
supabase/storage/buckets.sql
supabase/storage/policies.sql
```

### C. Verify Setup

Go to **Table Editor** - you should see 14 tables:
- users
- swipes
- matches
- conversations
- messages
- courts
- court_time_slots
- bookings
- booking_slots
- coaches
- reviews
- notifications
- user_blocks
- user_reports

---

## 🎯 Step 4: Run Development Server (2 minutes)

```bash
# Start Expo development server
npx expo start

# You'll see QR code and options:
# Press 'i' for iOS Simulator (macOS only)
# Press 'a' for Android Emulator
# Or scan QR code with Expo Go app on physical device
```

### First Time Setup:

**iOS (macOS only):**
```bash
# Install Xcode from App Store first
# Then:
npx expo start --ios
```

**Android:**
```bash
# Install Android Studio first
# Create AVD (Android Virtual Device)
# Then:
npx expo start --android
```

**Physical Device:**
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code shown in terminal
3. App will load on your device

---

## ✅ Verify Everything Works

### Test Supabase Connection

Update `App.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabase = createClient(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL!,
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [courtCount, setCourtCount] = useState(0);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*', { count: 'exact' });

      if (error) throw error;

      setConnected(true);
      setCourtCount(data?.length || 0);
    } catch (error) {
      console.error('Supabase connection failed:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.text}>Connecting to Supabase...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎾 PickleBall Dating</Text>

      {connected ? (
        <>
          <Text style={styles.success}>✅ Supabase Connected!</Text>
          <Text style={styles.text}>Found {courtCount} courts in database</Text>
        </>
      ) : (
        <Text style={styles.error}>❌ Supabase Connection Failed</Text>
      )}

      <Text style={styles.info}>Ready to start coding!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  success: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: '#F44336',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },
});
```

**Expected Result:**
- ✅ "Supabase Connected!"
- ✅ "Found 4 courts in database" (from seed data)

---

## 🎉 You're Ready!

Your development environment is fully set up. You can now:

### Next Steps:

1. **Read Documentation:**
   ```
   - FRONTEND_SPEC.md → Frontend architecture
   - design/uiuxguides.md → Design system
   - docs/BACKEND_INTEGRATION.md → Integration guide
   ```

2. **Start Implementing Screens:**
   ```
   - Use src/components/ for reusable components
   - Follow src/theme/tokens.ts for design tokens
   - Reference design/screens/ for screen specs
   ```

3. **Test with Mock Data:**
   ```
   - Use data/mockData.ts for testing
   - Later replace with real Supabase queries
   ```

---

## 🚨 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
npx expo start --clear
```

### Issue: "Metro bundler error"
```bash
# Clear cache
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Supabase connection fails
1. Check `.env` file has correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Verify migrations ran successfully in Supabase Dashboard
3. Check internet connection

### Issue: App crashes on startup
```bash
# Check console for errors
# Usually missing dependency or syntax error
npm install  # Reinstall dependencies
```

---

## 📚 Additional Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **Reanimated:** https://docs.swmansion.com/react-native-reanimated/

---

## ⏱️ Total Setup Time: ~10 minutes

- ✅ Step 1: Clone & Install (2 min)
- ✅ Step 2: Configure Project (3 min)
- ✅ Step 3: Setup Supabase (3 min)
- ✅ Step 4: Run Dev Server (2 min)

**Happy Coding!** 🚀
