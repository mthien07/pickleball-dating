# Development Setup Guide
## PickleBall Dating App

**Complete step-by-step guide** để setup development environment và bắt đầu code.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Install Development Tools](#install-development-tools)
3. [Clone & Setup Project](#clone--setup-project)
4. [Setup Supabase Backend](#setup-supabase-backend)
5. [Initialize Expo Project](#initialize-expo-project)
6. [Install Dependencies](#install-dependencies)
7. [Configure Environment](#configure-environment)
8. [Run Development Server](#run-development-server)
9. [Verify Setup](#verify-setup)
10. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### System Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | macOS, Windows 10+, or Linux |
| **RAM** | 8GB minimum, 16GB recommended |
| **Disk Space** | 10GB free space |
| **Internet** | Stable connection for dependencies |

### Required Accounts

- ✅ **GitHub Account** (already have - you're here!)
- ✅ **Supabase Account** - Sign up at https://supabase.com
- ⏳ **Expo Account** - Sign up at https://expo.dev (optional for development)

---

## 2. Install Development Tools

### A. Install Node.js

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node@18

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

**Windows:**
1. Download from https://nodejs.org (LTS version 18.x)
2. Run installer
3. Verify in Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### B. Install Git

**macOS:**
```bash
# Git usually pre-installed, or:
brew install git
```

**Windows:**
Download from https://git-scm.com/download/win

**Linux:**
```bash
sudo apt-get install git
```

Verify:
```bash
git --version
```

### C. Install Expo CLI & EAS CLI

```bash
# Install globally
npm install -g expo-cli eas-cli

# Verify
expo --version
eas --version
```

### D. Install Code Editor

**VS Code** (Recommended):
- Download: https://code.visualstudio.com
- Install extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript + JavaScript
  - Prettier - Code formatter
  - ESLint
  - React Native Tools
  - Expo Tools

### E. Install iOS Simulator (macOS only)

```bash
# Install Xcode from App Store (13GB+)
# After installation:
xcode-select --install

# Open Xcode once to agree to terms
# Then open Simulator:
open -a Simulator
```

### F. Install Android Studio (All platforms)

1. Download from https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio → More Actions → SDK Manager
4. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
5. Create AVD (Android Virtual Device):
   - Tools → Device Manager → Create Device
   - Choose Pixel 5 or similar
   - Download system image (API 33 recommended)

**Setup environment variables (Windows):**
```cmd
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
```

**Setup environment variables (macOS/Linux):**
```bash
# Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 3. Clone & Setup Project

### Clone Repository

```bash
# Navigate to your projects folder
cd ~/Projects  # or wherever you keep projects

# Clone repository
git clone https://github.com/mthien07/pickleball-dating.git

# Navigate into project
cd pickleball-dating

# Verify files
ls -la
```

You should see:
- `PRD.md`
- `FRONTEND_SPEC.md`
- `design/`
- `docs/`
- `src/`
- `supabase/`
- etc.

---

## 4. Setup Supabase Backend

### A. Create Supabase Project

1. **Go to** https://supabase.com
2. **Sign in** with GitHub or email
3. **Create new project**:
   - Organization: Personal (or create new)
   - Name: `pickleball-dating`
   - Database Password: **SAVE THIS!** (generate strong password)
   - Region: **Southeast Asia (Singapore)** (closest to Vietnam)
   - Pricing Plan: Free tier is fine for development

4. **Wait 2-3 minutes** for project to be created

### B. Get API Credentials

1. Go to **Project Settings** (⚙️ icon in sidebar)
2. Click **API** tab
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOi...` (long token)
   - **service_role key**: `eyJhbGciOi...` (different token - keep secret!)

### C. Enable Extensions

1. Go to **Database** → **Extensions** (in sidebar)
2. Enable these extensions:
   - ✅ `uuid-ossp` (UUID generation)
   - ✅ `postgis` (Geo-spatial queries)
   - ✅ `pg_trgm` (Full-text search)
   - ✅ `pgcrypto` (Encryption)

Or run in **SQL Editor**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### D. Run Database Migrations

1. Go to **SQL Editor**
2. Click **New query**
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Repeat for:
   - `002_rls_policies.sql`
   - `003_functions.sql`
   - `004_seed_data.sql`

**Verify:**
- Go to **Table Editor**
- You should see 14 tables created

### E. Setup Storage Buckets

1. Go to **Storage**
2. Click **New bucket**
3. Create 4 buckets (run SQL from `supabase/storage/buckets.sql`):
   - `profile-photos` (public)
   - `court-images` (public)
   - `message-images` (public)
   - `review-images` (public)

4. Set policies (run `supabase/storage/policies.sql` in SQL Editor)

### F. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable:
   - ✅ Email (enabled by default)
   - ✅ Phone (requires Twilio setup - optional)
   - ✅ Google OAuth
   - ✅ Facebook OAuth
   - ✅ Apple OAuth

**For OAuth providers**, you'll need:
- Client IDs and secrets from each provider
- Configure redirect URLs
- See `docs/SUPABASE_SETUP.md` for detailed OAuth setup

---

## 5. Initialize Expo Project

### A. Initialize Expo with TypeScript

```bash
# Make sure you're in project directory
cd ~/Projects/pickleball-dating

# Initialize Expo project
npx create-expo-app@latest . --template expo-template-blank-typescript

# This will:
# - Create app.json, package.json
# - Create App.tsx (main entry)
# - Install basic dependencies
```

**When prompted:**
- ✅ Overwrite existing files? → Yes (we'll merge later)

### B. Update app.json

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
    "assetBundlePatterns": [
      "**/*"
    ],
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
    }
  }
}
```

---

## 6. Install Dependencies

### A. Install Core Dependencies

```bash
# Supabase client
npm install @supabase/supabase-js

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# State management
npm install zustand @tanstack/react-query

# Forms
npm install react-hook-form zod @hookform/resolvers

# Animation
npx expo install react-native-reanimated react-native-gesture-handler

# UI Components
npm install react-native-paper

# Icons
npx expo install @expo/vector-icons

# Image handling
npx expo install expo-image expo-image-picker

# Utilities
npm install date-fns

# Storage
npx expo install expo-secure-store @react-native-async-storage/async-storage
```

### B. Install Dev Dependencies

```bash
npm install --save-dev @types/react @types/react-native typescript
```

### C. Configure Babel (for Reanimated)

Create/update `babel.config.js`:

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

### D. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@theme/*": ["src/theme/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

---

## 7. Configure Environment

### A. Create .env file

```bash
# Copy example
cp .env.example .env

# Edit .env (use your Supabase credentials)
```

Content of `.env`:
```
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase

# App
APP_ENV=development
```

**IMPORTANT:** Replace with YOUR actual Supabase credentials from Step 4.B!

### B. Setup Environment Variables in Code

Install dotenv:
```bash
npm install dotenv
npx expo install expo-constants
```

Update `app.json` to include env vars:
```json
{
  "expo": {
    ...
    "extra": {
      "supabaseUrl": process.env.SUPABASE_URL,
      "supabaseAnonKey": process.env.SUPABASE_ANON_KEY
    }
  }
}
```

---

## 8. Run Development Server

### A. Start Expo Development Server

```bash
# Start Expo
npx expo start

# Or with specific options:
npx expo start --clear  # Clear cache
```

You should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### B. Run on iOS Simulator (macOS only)

```bash
# Press 'i' in terminal
# Or:
npx expo start --ios
```

### C. Run on Android Emulator

```bash
# Start Android Emulator first (or press 'a' after starting expo)
npx expo start --android
```

### D. Run on Physical Device

1. **Install Expo Go app**:
   - iOS: App Store → Search "Expo Go"
   - Android: Play Store → Search "Expo Go"

2. **Scan QR code** shown in terminal
3. App will load on your device

---

## 9. Verify Setup

### A. Test Supabase Connection

Create test file `src/test-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('✅ Supabase connected!', data);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}
```

Update `App.tsx`:
```typescript
import { useEffect } from 'react';
import { testConnection } from './src/test-supabase';

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text>PickleBall Dating App</Text>
    </View>
  );
}
```

### B. Check Console

After running app, check terminal/console:
- ✅ Should see: "Supabase connected!" with court data
- ❌ If errors, check .env credentials

---

## 10. Troubleshooting

### Common Issues

#### Issue: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

#### Issue: "Unable to resolve module"
```bash
# Check babel.config.js includes reanimated plugin
# Restart metro bundler
npx expo start --clear
```

#### Issue: Supabase connection fails
- ✅ Check .env has correct credentials
- ✅ Verify Supabase project is running
- ✅ Check internet connection
- ✅ Verify migrations ran successfully

#### Issue: iOS Simulator not opening
```bash
# Reset simulator
xcrun simctl erase all

# Restart
npx expo start --ios
```

#### Issue: Android Emulator not starting
- Open Android Studio → AVD Manager
- Start emulator manually
- Then `npx expo start --android`

### Get Help

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **Project Issues:** https://github.com/mthien07/pickleball-dating/issues
- **Stack Overflow:** Tag with [expo] or [react-native]

---

## ✅ Setup Complete!

You should now have:
- ✅ All development tools installed
- ✅ Project cloned and dependencies installed
- ✅ Supabase backend configured
- ✅ Expo development server running
- ✅ App running on simulator/device
- ✅ Supabase connection verified

---

## 🎯 Next Steps

1. **Read Documentation:**
   - `FRONTEND_SPEC.md` - Frontend architecture
   - `docs/BACKEND_INTEGRATION.md` - Integration guide

2. **Start Coding:**
   - Implement screens from `design/screens/`
   - Use components from `src/components/`
   - Follow design system in `src/theme/tokens.ts`

3. **Test Features:**
   - Authentication flow
   - Profile creation
   - Mock data integration

---

**Happy Coding!** 🚀
