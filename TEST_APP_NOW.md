# 🚀 Test App Ngay Bây Giờ
## Hướng dẫn nhanh để test PickleBall Dating App

**Thời gian**: ~15-20 phút

---

## 📋 Bước 1: Check Prerequisites (2 phút)

### Kiểm tra Node.js

```bash
# Check Node.js version (cần v18+)
node --version

# Check npm version
npm --version
```

**Nếu chưa có Node.js:**

**macOS:**
```bash
# Install Homebrew nếu chưa có
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18
```

**Windows:**
- Download từ: https://nodejs.org (chọn LTS version 18.x)
- Chạy installer
- Restart Command Prompt

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 🔧 Bước 2: Install Expo CLI (1 phút)

```bash
# Install Expo CLI global
npm install -g expo-cli eas-cli

# Verify installation
expo --version
```

---

## 📱 Bước 3: Chọn Cách Test

Anh có 3 options để test app:

### Option A: Test trên Physical Device (RECOMMENDED - Nhanh nhất)

**Ưu điểm:**
- ✅ Nhanh nhất, không cần cài thêm gì
- ✅ Test trên device thật, UX chính xác
- ✅ Không tốn RAM máy

**Yêu cầu:**
- iPhone hoặc Android phone
- Internet WiFi (cùng mạng với laptop)

**Cách làm:**
1. Download **Expo Go** app:
   - iOS: App Store → tìm "Expo Go"
   - Android: Play Store → tìm "Expo Go"
2. Cài đặt và mở app
3. Chờ đến Bước 6 để scan QR code

---

### Option B: Test trên iOS Simulator (chỉ macOS)

**Ưu điểu:**
- Test trên iOS simulator
- Không cần device thật

**Yêu cầu:**
- macOS only
- Xcode (13GB download)

**Cách làm:**
```bash
# Install Xcode từ App Store (mất ~2 giờ)
# Sau khi cài xong:
xcode-select --install

# Mở Xcode lần đầu để agree terms
open -a Xcode

# Test simulator
open -a Simulator
```

---

### Option C: Test trên Android Emulator

**Yêu cầu:**
- Android Studio (700MB download)

**Cách làm:**
1. Download Android Studio: https://developer.android.com/studio
2. Cài đặt với default settings
3. Open Android Studio
4. More Actions → SDK Manager → Install Android SDK 33
5. Tools → Device Manager → Create Device
6. Chọn Pixel 5, download system image
7. Start emulator

---

## 📦 Bước 4: Setup Project (5 phút)

```bash
# Anh đang ở đâu? Navigate to project
cd /Users/ht/Desktop/pickle-ball-starter

# Initialize Expo project
npx create-expo-app@latest . --template expo-template-blank-typescript

# Khi hỏi "Directory not empty", chọn YES để continue
# Expo sẽ tạo app.json, package.json, App.tsx
```

---

## 📚 Bước 5: Install Dependencies (3 phút)

```bash
# Install tất cả dependencies
npm install @supabase/supabase-js \
  @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs \
  zustand @tanstack/react-query \
  react-hook-form zod @hookform/resolvers \
  react-native-paper date-fns

# Install Expo packages
npx expo install \
  react-native-screens \
  react-native-safe-area-context \
  react-native-reanimated \
  react-native-gesture-handler \
  expo-image \
  expo-image-picker \
  expo-secure-store \
  @react-native-async-storage/async-storage \
  @expo/vector-icons \
  expo-constants

# Install dev dependencies
npm install --save-dev @types/react @types/react-native typescript
```

**LƯU Ý:** Nếu gặp lỗi, chạy:
```bash
npm install --legacy-peer-deps
```

---

## ⚙️ Bước 6: Configure Project (2 phút)

### A. Update app.json

Mở `app.json` và thay thế toàn bộ nội dung bằng:

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

Tạo file `babel.config.js` với nội dung:

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

## 🗄️ Bước 7: Setup Supabase Backend (5 phút)

### A. Run Database Migrations

1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project: `pickleball-dating`
3. Sidebar → **SQL Editor**
4. Click **New query**

**Chạy từng file theo thứ tự:**

**Migration 1: Initial Schema**
- Copy nội dung từ `supabase/migrations/001_initial_schema.sql`
- Paste vào SQL Editor
- Click **Run**
- Đợi ~10 giây
- Check: Should see "Success. No rows returned"

**Migration 2: RLS Policies**
- Copy nội dung từ `supabase/migrations/002_rls_policies.sql`
- Paste và Run
- Check: Success

**Migration 3: Functions**
- Copy nội dung từ `supabase/migrations/003_functions.sql`
- Paste và Run
- Check: Success

**Migration 4: Seed Data**
- Copy nội dung từ `supabase/migrations/004_seed_data.sql`
- Paste và Run
- Check: Success

### B. Verify Tables Created

1. Sidebar → **Table Editor**
2. Should see 14 tables:
   - ✅ users
   - ✅ swipes
   - ✅ matches
   - ✅ conversations
   - ✅ messages
   - ✅ courts (có 4 rows từ seed data)
   - ✅ court_time_slots
   - ✅ bookings
   - ✅ booking_slots
   - ✅ coaches (có 3 rows từ seed data)
   - ✅ reviews
   - ✅ notifications
   - ✅ user_blocks
   - ✅ user_reports

### C. Setup Storage Buckets

1. Sidebar → **Storage**
2. Click **New bucket**

**Run SQL để tạo buckets:**
- Copy nội dung từ `supabase/storage/buckets.sql`
- Paste vào SQL Editor và Run

**Setup policies:**
- Copy nội dung từ `supabase/storage/policies.sql`
- Paste vào SQL Editor và Run

---

## 🎨 Bước 8: Create Test App.tsx (2 phút)

Mở file `App.tsx` và thay thế toàn bộ bằng code test này:

```typescript
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase client
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
      // Test 1: Fetch courts
      const { data: courtsData, error: courtsError } = await supabase
        .from('courts')
        .select('*');

      if (courtsError) throw courtsError;

      // Test 2: Fetch coaches
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('*');

      if (coachesError) throw coachesError;

      setCourts(courtsData || []);
      setCoaches(coachesData || []);
      setConnected(true);
    } catch (err: any) {
      console.error('Supabase error:', err);
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
        <Text style={styles.loadingText}>Testing Supabase Connection...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>🎾 PickleBall Dating</Text>
        <Text style={styles.subtitle}>Test App</Text>

        {connected ? (
          <>
            <View style={styles.successBox}>
              <Text style={styles.successText}>✅ Supabase Connected!</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Courts ({courts.length})</Text>
              {courts.map((court, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{court.name}</Text>
                  <Text style={styles.itemText}>{court.address}</Text>
                  <Text style={styles.itemText}>₫{court.price_per_hour}/giờ</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👨‍🏫 Coaches ({coaches.length})</Text>
              {coaches.map((coach, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{coach.name}</Text>
                  <Text style={styles.itemText}>⭐ {coach.rating} - {coach.experience_years} years</Text>
                  <Text style={styles.itemText}>₫{coach.price_per_hour}/giờ</Text>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>🚀 Database Ready!</Text>
              <Text style={styles.footerText}>Bắt đầu implement screens nào! 💪</Text>
            </View>
          </>
        ) : (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ Connection Failed</Text>
            <Text style={styles.errorDetail}>{error}</Text>
            <Text style={styles.errorHint}>
              Check:{'\n'}
              1. Đã chạy migrations chưa?{'\n'}
              2. Internet connection?{'\n'}
              3. Supabase project running?
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2D2D2D',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B6B6B',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B6B6B',
  },
  successBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorDetail: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2D2D2D',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D2D2D',
  },
  itemText: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 2,
  },
  footer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD23F',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2D2D2D',
    marginBottom: 8,
  },
});
```

---

## 🚀 Bước 9: Start App! (1 phút)

```bash
# Start Expo development server
npx expo start

# Hoặc clear cache nếu có lỗi
npx expo start --clear
```

Anh sẽ thấy:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

---

## 📱 Bước 10: Run App

### Option A: Physical Device (RECOMMENDED)

1. Mở **Expo Go** app trên phone
2. **iOS**: Mở Camera app → scan QR code
3. **Android**: Trong Expo Go app → scan QR code
4. App sẽ load lên device (~10 giây)

### Option B: iOS Simulator (macOS)

```bash
# Press 'i' trong terminal
# Hoặc:
npx expo start --ios
```

### Option C: Android Emulator

```bash
# Start emulator trước (từ Android Studio)
# Hoặc press 'a' trong terminal
npx expo start --android
```

---

## ✅ Expected Result

Khi app chạy thành công, anh sẽ thấy:

```
🎾 PickleBall Dating
Test App

✅ Supabase Connected!

📍 Courts (4)
- Sân Pickleball Landmark 81
  Vinhomes Central Park, Quận Bình Thạnh
  ₫150000/giờ

- Sân Pickleball Diamond
  Pearl Plaza, Quận Bình Thạnh
  ₫120000/giờ

- Sân Pickleball Crescent
  Phú Mỹ Hưng, Quận 7
  ₫100000/giờ

- Sân Pickleball Sunrise
  Thảo Điền, Quận 2
  ₫130000/giờ

👨‍🏫 Coaches (3)
- Trần Văn An
  ⭐ 4.8 - 5 years
  ₫300000/giờ

- Nguyễn Thị Bình
  ⭐ 4.9 - 8 years
  ₫400000/giờ

- Lê Hoàng Cường
  ⭐ 4.7 - 3 years
  ₫250000/giờ

🚀 Database Ready!
Bắt đầu implement screens nào! 💪
```

---

## 🚨 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
npx expo start --clear
```

### Issue: "Network request failed"

1. Check internet connection
2. Check Supabase project đang running
3. Verify `.env` có đúng credentials
4. Try restart Expo: `Ctrl+C` rồi `npx expo start`

### Issue: "Unable to resolve module"

```bash
# Clear cache
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Red screen - "Something went wrong"

1. Check terminal console for error details
2. Usually syntax error or missing dependency
3. Check `App.tsx` code đã copy đúng chưa

### Issue: Blank screen

1. Wait 10-20 seconds (first load takes time)
2. Shake device → Reload
3. Check terminal for errors

---

## 🎯 Next Steps After Testing

Khi test thành công:

1. **Implement Real Screens:**
   - Tham khảo `design/screens/` cho design specs
   - Use `src/components/` cho reusable components
   - Follow `src/theme/tokens.ts` cho design system

2. **Replace Test Code:**
   - Update `App.tsx` với real navigation
   - Setup React Navigation
   - Implement authentication flow

3. **Add More Features:**
   - Profile creation
   - Swipe matching
   - Chat realtime
   - Court booking

---

## 📚 Documentation References

- **Setup Guide**: `DEVELOPMENT_SETUP.md`
- **Quick Start**: `QUICK_START.md`
- **Frontend Spec**: `FRONTEND_SPEC.md`
- **Backend Integration**: `docs/BACKEND_INTEGRATION.md`
- **Supabase Setup**: `docs/SUPABASE_SETUP.md`

---

## 💡 Tips

- **Hot Reload**: Save file → app auto-reload
- **Debug Menu**: Shake device hoặc `Cmd+D` (iOS) / `Cmd+M` (Android)
- **Logs**: Check terminal console cho errors
- **Inspector**: Enable in debug menu để inspect elements

---

**Chúc anh test thành công!** 🚀

Nếu gặp vấn đề, ping tôi ngay! 😊
