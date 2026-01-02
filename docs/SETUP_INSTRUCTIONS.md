# Setup Instructions - PickleBall Dating App

**Last Updated**: 2026-01-02

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn >= 1.22.x
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

---

## 1. Initialize Expo Project

```bash
# Navigate to project directory
cd /Users/ht/Desktop/pickle-ball-starter

# Initialize Expo TypeScript project
npx create-expo-app@latest . --template expo-template-blank-typescript

# Answer prompts:
# - Overwrite existing files? Yes
# - Project name: PickleBallDating
```

---

## 2. Install Core Dependencies

### Navigation
```bash
npm install @react-navigation/native@^6.1.9
npm install @react-navigation/stack@^6.3.20
npm install @react-navigation/bottom-tabs@^6.5.11
npm install react-native-screens@^3.29.0
npm install react-native-safe-area-context@^4.8.2
npm install react-native-gesture-handler@^2.14.1
```

### Animation
```bash
npm install react-native-reanimated@^4.0.0
```

### UI/UX
```bash
npm install expo-image@^1.10.1
npm install @expo/vector-icons@^14.0.0
npm install expo-linear-gradient@^12.7.2
```

### State Management
```bash
npm install zustand@^4.4.7
npm install @tanstack/react-query@^5.17.9
```

### Forms & Validation
```bash
npm install react-hook-form@^7.49.2
npm install zod@^3.22.4
```

### Utilities
```bash
npm install date-fns@^3.0.6
```

### Maps (Optional for MVP)
```bash
npm install react-native-maps@^1.10.0
```

---

## 3. Configure Babel

Edit `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
```

---

## 4. Configure TypeScript

Edit `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@theme/*": ["src/theme/*"],
      "@data/*": ["data/*"]
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

## 5. Setup Project Structure

```bash
mkdir -p src/components
mkdir -p src/screens/auth
mkdir -p src/screens/home
mkdir -p src/screens/matches
mkdir -p src/screens/courts
mkdir -p src/screens/profile
mkdir -p src/navigation
mkdir -p src/theme
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/types
mkdir -p assets/images
```

---

## 6. Copy Existing Files

```bash
# Design tokens (already created)
# src/theme/tokens.ts

# Reusable components (already created)
# src/components/Button.tsx
# src/components/Input.tsx
# src/components/Card.tsx
# src/components/Avatar.tsx

# Mock data (already created)
# data/mockData.ts
```

---

## 7. Configure App.tsx

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 8. Run the App

```bash
# Start Expo dev server
npx expo start

# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator
npx expo start --android

# Run on physical device (scan QR code with Expo Go app)
npx expo start
```

---

## 9. Environment Setup (Optional)

Create `.env` file:

```bash
# API Configuration
API_BASE_URL=https://api.example.com
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API (for court discovery)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Install env package:
```bash
npm install react-native-dotenv
```

---

## 10. Troubleshooting

### Issue: Reanimated plugin not working
**Solution**: Ensure `react-native-reanimated/plugin` is the LAST plugin in babel.config.js, then:
```bash
npx expo start --clear
```

### Issue: Navigation types not working
**Solution**: Generate navigation types:
```bash
npx expo install expo-navigation-bar
```

### Issue: Metro bundler cache issues
**Solution**:
```bash
npx expo start --clear
rm -rf node_modules
npm install
```

### Issue: iOS build fails
**Solution**:
```bash
cd ios && pod install && cd ..
```

---

## 11. Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **React Native Tools**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Importer**

---

## 12. Useful Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clear": "expo start --clear",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Next Steps

1. Implement remaining screens (18 screens to build)
2. Connect to Supabase backend
3. Implement authentication flow
4. Add real-time features (chat, notifications)
5. Test on physical devices
6. Submit to App Store / Play Store

---

**Happy Coding! 🎾**
