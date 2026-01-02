# 📱 Test App Trên Phone - Guide Siêu Nhanh
## PickleBall Dating App

**Thời gian**: 15 phút | **Cách dễ nhất** để test app!

---

## 🎯 Bước 1: Chuẩn Bị Phone (2 phút)

### Download Expo Go App

**iPhone:**
1. Mở **App Store**
2. Tìm **"Expo Go"**
3. Download & Install
4. Mở app lên 1 lần để setup

**Android:**
1. Mở **Play Store**
2. Tìm **"Expo Go"**
3. Download & Install
4. Mở app lên 1 lần để setup

**LƯU Ý:** Phone phải **cùng WiFi** với laptop/máy tính!

---

## 💻 Bước 2: Setup Máy Tính (3 phút)

### A. Check Node.js

```bash
# Open Terminal và chạy:
node --version
```

**Nếu show v18.x.x hoặc cao hơn** → ✅ OK, skip xuống B

**Nếu không có hoặc version thấp:**

**macOS:**
```bash
# Install Homebrew (nếu chưa có)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js 18
brew install node@18

# Verify
node --version
```

**Windows:**
- Download: https://nodejs.org (chọn LTS 18.x)
- Chạy installer
- Restart Terminal
- Verify: `node --version`

### B. Install Expo CLI

```bash
npm install -g expo-cli

# Verify
expo --version
```

---

## 🚀 Bước 3: Initialize Project (2 phút)

```bash
# Navigate to project
cd /Users/ht/Desktop/pickle-ball-starter

# Initialize Expo
npx create-expo-app@latest . --template expo-template-blank-typescript

# When asked "Directory not empty, continue?" → Type: y (YES)
# Press Enter

# Wait ~30 seconds...
```

**Expected output:**
```
✔ Downloaded and extracted project files.
✔ Installed JavaScript dependencies.

Your project is ready!
```

---

## 📦 Bước 4: Install Dependencies (3 phút)

```bash
# Copy toàn bộ command này và paste vào terminal:

npm install @supabase/supabase-js @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs zustand @tanstack/react-query react-hook-form zod @hookform/resolvers react-native-paper date-fns && npx expo install react-native-screens react-native-safe-area-context react-native-reanimated react-native-gesture-handler expo-image expo-image-picker expo-secure-store @react-native-async-storage/async-storage @expo/vector-icons expo-constants

# Wait 2-3 minutes for installation...
```

**Expected:**
```
added 500+ packages in 2m
```

---

## ⚙️ Bước 5: Configure Files (1 phút)

### A. Update app.json

```bash
# Open app.json in any editor (VS Code, nano, etc.)
# Replace ENTIRE content with:
```

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
      "bundleIdentifier": "com.test.pickleballdating"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.test.pickleballdating"
    }
  }
}
```

### B. Create babel.config.js

```bash
# If file exists, replace content. If not, create new file.
```

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

---

## 🗄️ Bước 6: Setup Supabase Database (4 phút)

### Run Migrations

1. **Mở browser** → https://supabase.com/dashboard
2. **Login** và chọn project **pickleball-dating**
3. **Sidebar** → Click **SQL Editor**
4. **Click** "New query" button

**Chạy 4 migrations theo thứ tự:**

#### Migration 1: Initial Schema

```bash
# On your computer, open file:
# supabase/migrations/001_initial_schema.sql

# Copy TOÀN BỘ nội dung
# Paste vào Supabase SQL Editor
# Click "Run" button
# Wait ~10 seconds
# Should see: "Success. No rows returned"
```

#### Migration 2: RLS Policies

```bash
# Open: supabase/migrations/002_rls_policies.sql
# Copy all → Paste → Run
# Success!
```

#### Migration 3: Functions

```bash
# Open: supabase/migrations/003_functions.sql
# Copy all → Paste → Run
# Success!
```

#### Migration 4: Seed Data

```bash
# Open: supabase/migrations/004_seed_data.sql
# Copy all → Paste → Run
# Success!
```

### Verify Tables Created

1. **Supabase Dashboard** → **Table Editor**
2. Should see **14 tables**
3. Click **courts** table → Should see **4 rows** (seed data)
4. Click **coaches** table → Should see **3 rows** (seed data)

✅ **If you see tables and data** → Perfect! Continue!

---

## 🎨 Bước 7: Create Test App (1 phút)

### Replace App.tsx

```bash
# Open App.tsx file
# DELETE everything
# Replace with code below:
```

```typescript
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ytwcalyalpnmnqsmoilt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0d2NhbHlhbHBubW5xc21vaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDY2MzgsImV4cCI6MjA4Mjg4MjYzOH0.h4izbxyGU07sw6SeBCKI58K4rckjo66-Ow0Ml5u78T0'
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [courts, setCourts] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    testSupabase();
  }, []);

  async function testSupabase() {
    try {
      const { data: courtsData, error: courtsError } = await supabase
        .from('courts')
        .select('*');

      if (courtsError) throw courtsError;

      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('*');

      if (coachesError) throw coachesError;

      setCourts(courtsData || []);
      setCoaches(coachesData || []);
      setConnected(true);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
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
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>🎾 PickleBall Dating</Text>
        <Text style={styles.subtitle}>Test App</Text>

        {connected ? (
          <>
            <View style={styles.success}>
              <Text style={styles.successText}>✅ Connected!</Text>
            </View>

            <Text style={styles.section}>📍 Courts ({courts.length})</Text>
            {courts.map((c, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{c.name}</Text>
                <Text style={styles.cardText}>{c.address}</Text>
                <Text style={styles.cardText}>₫{c.price_per_hour}/giờ</Text>
              </View>
            ))}

            <Text style={styles.section}>👨‍🏫 Coaches ({coaches.length})</Text>
            {coaches.map((c, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{c.name}</Text>
                <Text style={styles.cardText}>⭐ {c.rating} - {c.experience_years} years</Text>
                <Text style={styles.cardText}>₫{c.price_per_hour}/giờ</Text>
              </View>
            ))}

            <View style={styles.footer}>
              <Text style={styles.footerText}>🚀 Ready to code!</Text>
            </View>
          </>
        ) : (
          <View style={styles.error}>
            <Text style={styles.errorText}>❌ Failed</Text>
            <Text style={styles.errorDetail}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#2D2D2D' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#6B6B6B' },
  text: { marginTop: 16, fontSize: 16, color: '#6B6B6B' },
  success: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 2, borderColor: '#4CAF50' },
  successText: { fontSize: 20, fontWeight: '600', color: '#2E7D32', textAlign: 'center' },
  error: { backgroundColor: '#FFEBEE', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 2, borderColor: '#F44336' },
  errorText: { fontSize: 20, fontWeight: '600', color: '#C62828', textAlign: 'center', marginBottom: 12 },
  errorDetail: { fontSize: 14, color: '#D32F2F' },
  section: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 12, color: '#2D2D2D' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#2D2D2D' },
  cardText: { fontSize: 14, color: '#6B6B6B', marginBottom: 2 },
  footer: { marginTop: 24, padding: 20, backgroundColor: '#FFF3E0', borderRadius: 12, borderWidth: 2, borderColor: '#FFD23F' },
  footerText: { fontSize: 16, textAlign: 'center', color: '#2D2D2D' },
});
```

**Save file!**

---

## 🚀 Bước 8: Start Expo! (1 phút)

```bash
# In terminal:
npx expo start

# Or if error, clear cache:
npx expo start --clear
```

**You should see:**

```
› Metro waiting on exp://192.168.1.x:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)

  ▄▄▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄▄▄
  █ ▄▄▄ █ ▀▀█ █ █ ▄▄▄ █
  █ ███ █ ██▄██ █ ███ █
  █▄▄▄▄▄█ ▄ ▄ ▄ █▄▄▄▄▄█
  ▄▄▄ ▄▄▄▄▄██▄▄▄ ▄▄  ▄
  ... (QR code) ...

› Press s │ switch to development build
› Press r │ reload app
```

**Keep this terminal open!**

---

## 📱 Bước 9: Scan QR Code (30 giây)

### iPhone:

1. **Mở Expo Go app**
2. **Tab "Projects"** → Click **"Scan QR Code"**
3. **Scan QR code** từ terminal
4. **Wait ~10 seconds** → App will load!

**Alternative:**
- Mở **Camera app** (default camera)
- Point at QR code
- Tap notification → Opens in Expo Go

### Android:

1. **Mở Expo Go app**
2. **Tap "Scan QR Code"** button
3. **Scan QR code** từ terminal
4. **Wait ~10 seconds** → App will load!

---

## ✅ Bước 10: Check Result!

### Success Screen:

App should show:

```
🎾 PickleBall Dating
Test App

✅ Connected!

📍 Courts (4)

┌─────────────────────────────────┐
│ Sân Pickleball Landmark 81      │
│ Vinhomes Central Park, Q.Bình Thạnh │
│ ₫150000/giờ                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Sân Pickleball Diamond          │
│ Pearl Plaza, Quận Bình Thạnh   │
│ ₫120000/giờ                     │
└─────────────────────────────────┘

(2 more courts...)

👨‍🏫 Coaches (3)

┌─────────────────────────────────┐
│ Trần Văn An                     │
│ ⭐ 4.8 - 5 years                │
│ ₫300000/giờ                     │
└─────────────────────────────────┘

(2 more coaches...)

🚀 Ready to code!
```

### 🎉 SUCCESS!

**Nếu anh thấy screen như trên** → Perfect! App đang:
- ✅ Connect được với Supabase
- ✅ Fetch được data từ database
- ✅ Hiển thị 4 courts từ seed data
- ✅ Hiển thị 3 coaches từ seed data
- ✅ **SẴN SÀNG ĐỂ IMPLEMENT REAL SCREENS!**

---

## 🚨 Troubleshooting

### Issue: QR code không scan được

**Fix:**
- Phone và laptop phải **cùng WiFi**
- Restart Expo: `Ctrl+C` → `npx expo start`
- Try alternative scan method (Camera app cho iOS)

### Issue: "Network request failed"

**Fix:**
```bash
# Check internet connection
# Verify Supabase project is running
# Restart Expo:
npx expo start --clear
```

### Issue: Red screen "Something went wrong"

**Fix:**
```bash
# Check terminal for error details
# Usually missing dependency, run:
npm install
npx expo start --clear
```

### Issue: Blank white screen

**Fix:**
- Wait 10-20 seconds (first load takes time)
- Shake phone → Reload
- Check terminal console for errors
- Try: Shake phone → "Reload"

### Issue: "Unable to resolve module"

**Fix:**
```bash
# Clear everything and reinstall:
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 🎯 Next Steps

### App đang chạy thành công? Great!

**Now you can:**

1. **Edit code live:**
   - Change `App.tsx`
   - Save file
   - App auto-reloads on phone!

2. **Implement real screens:**
   - Follow `design/screens/` for UI specs
   - Use `src/components/` for components
   - Reference `FRONTEND_SPEC.md` for architecture

3. **Test features:**
   - Try authentication
   - Create profiles
   - Test navigation

---

## 🔥 Hot Reload Demo

Try this:

1. **Open `App.tsx`**
2. **Find line:** `<Text style={styles.title}>🎾 PickleBall Dating</Text>`
3. **Change to:** `<Text style={styles.title}>🎾 My Awesome App</Text>`
4. **Save file**
5. **Watch phone** → App auto-reloads with new text!

**Magic!** ✨

---

## 💡 Pro Tips

- **Debug Menu**: Shake phone → Shows debug options
- **Reload**: Shake → "Reload" to refresh app
- **Console Logs**: Check terminal for `console.log()` output
- **Element Inspector**: Shake → "Toggle Element Inspector"
- **Performance Monitor**: Shake → "Show Performance Monitor"

---

## 📚 Resources

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native**: https://reactnative.dev
- **Project Docs**: `FRONTEND_SPEC.md`, `DEVELOPMENT_SETUP.md`

---

## ✅ Checklist

- [x] Downloaded Expo Go on phone
- [x] Installed Node.js & Expo CLI
- [x] Initialized Expo project
- [x] Installed dependencies
- [x] Ran Supabase migrations
- [x] Created test App.tsx
- [x] Started Expo server
- [x] Scanned QR code
- [x] **APP RUNNING ON PHONE!** 🎉

---

**Congratulations! App đã chạy thành công trên phone!** 🚀

Ready to build the real app? Let's go! 💪
